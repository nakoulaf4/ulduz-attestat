//! Automatic, SHA-256 verified Over-The-Air (OTA) web bundle updater for Ulduz.
//!
//! Downloads official `Ulduz-vX.Y.Z-web-ota.zip` + `.sha256` assets from GitHub Releases,
//! verifies cryptographic SHA-256 integrity, enforces Zip-Slip and zip-bomb defenses,
//! validates required entrypoints (`index.html` and `js/app/main.js`), and atomically
//! activates the new bundle under `<app_data_dir>/ota/active` so the app automatically
//! updates itself on launch without needing `REQUEST_INSTALL_PACKAGES` or manual APK installs.

use crate::network::{is_newer_version, parse_semver_tuple};
use crate::storage::atomic_write_bytes;
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::fs::{self, File};
use std::io::{self, Cursor, Read};
use std::path::{Component, Path, PathBuf};
use std::time::{Duration, SystemTime, UNIX_EPOCH};
use tauri::Manager;
use zip::ZipArchive;

const MAX_OTA_ZIP_BYTES: usize = 25 * 1024 * 1024; // 25 MiB compressed
const MAX_OTA_EXTRACTED_BYTES: u64 = 50 * 1024 * 1024; // 50 MiB uncompressed
const MAX_OTA_FILES: usize = 2000;
const MAX_SHA256_TEXT_BYTES: usize = 4096;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OtaState {
    pub version: String,
    pub sha256: String,
    pub installed_at: u64,
    pub confirmed: bool,
    pub boot_attempts: u32,
    pub bundled_version: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OtaStatus {
    pub bundled_version: String,
    pub ota_version: Option<String>,
    pub effective_version: String,
    pub confirmed: bool,
    pub active: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OtaInstallResult {
    pub version: String,
    pub sha256: String,
    pub files_extracted: usize,
    pub status: String,
}

pub fn ota_root_in(app_data_dir: &Path) -> PathBuf {
    app_data_dir.join("ota")
}

pub fn ota_state_path(ota_root: &Path) -> PathBuf {
    ota_root.join("state.json")
}

pub fn ota_active_dir(ota_root: &Path) -> PathBuf {
    ota_root.join("active")
}

/// Strictly permit OTA downloads ONLY from official Ulduz GitHub release hosts.
pub fn validate_ota_download_url(raw: &str, allow_local_test: bool) -> Result<String, String> {
    let trimmed = raw.trim();
    if trimmed.is_empty() || trimmed.len() > 1024 {
        return Err("Invalid OTA download URL length".to_string());
    }
    let lower = trimmed.to_ascii_lowercase();
    let allowed = lower.starts_with("https://github.com/nakoulaf4/ulduz-attestat/releases/download/")
        || lower.starts_with("https://objects.githubusercontent.com/")
        || lower.starts_with("https://release-assets.githubusercontent.com/")
        || (allow_local_test && lower.starts_with("http://127.0.0.1:"));
    if !allowed {
        return Err("OTA download URL must originate from official Ulduz GitHub Releases".to_string());
    }
    Ok(trimmed.to_string())
}

/// Parse a lowercase 64-character hex SHA-256 digest from a `.sha256` checksum file.
pub fn parse_sha256_hex(raw: &str) -> Result<String, String> {
    let token = raw
        .split_whitespace()
        .next()
        .unwrap_or("")
        .trim()
        .to_ascii_lowercase();
    if token.len() != 64 || !token.bytes().all(|b| b.is_ascii_hexdigit()) {
        return Err("Invalid SHA-256 checksum format".to_string());
    }
    Ok(token)
}

/// Compute lowercase hex SHA-256 digest of `bytes`.
pub fn compute_sha256_hex(bytes: &[u8]) -> String {
    let mut hasher = Sha256::new();
    hasher.update(bytes);
    let digest = hasher.finalize();
    let mut out = String::with_capacity(64);
    for b in digest {
        out.push_str(&format!("{b:02x}"));
    }
    out
}

/// Sanitize a ZIP entry path to prevent Zip-Slip traversal or absolute writes.
pub fn sanitize_zip_rel_path(raw_name: &str) -> Result<Option<PathBuf>, String> {
    if raw_name.is_empty() || raw_name.contains('\0') || raw_name.contains('\\') {
        return Err(format!("Unsafe ZIP entry path: {raw_name}"));
    }
    let trimmed = raw_name.trim_start_matches("./");
    if trimmed.is_empty() {
        return Ok(None);
    }
    let mut clean = PathBuf::new();
    for comp in Path::new(trimmed).components() {
        match comp {
            Component::Normal(seg) => clean.push(seg),
            Component::CurDir => {}
            Component::ParentDir | Component::RootDir | Component::Prefix(_) => {
                return Err(format!("Path traversal rejected in ZIP entry: {raw_name}"));
            }
        }
    }
    if clean.as_os_str().is_empty() {
        return Ok(None);
    }
    Ok(Some(clean))
}

/// Read persisted OTA state from `<ota_root>/state.json`, ignoring missing or corrupt files.
pub fn read_ota_state(ota_root: &Path) -> Option<OtaState> {
    let raw = fs::read_to_string(ota_state_path(ota_root)).ok()?;
    serde_json::from_str::<OtaState>(&raw).ok()
}

/// Compute effective OTA status relative to `bundled_version`.
pub fn compute_ota_status(ota_root: &Path, bundled_version: &str) -> OtaStatus {
    let active_dir = ota_active_dir(ota_root);
    let has_index = active_dir.join("index.html").is_file()
        && active_dir.join("js").join("app").join("main.js").is_file();

    if has_index {
        if let Some(st) = read_ota_state(ota_root) {
            if is_newer_version(bundled_version, &st.version)
                && (st.confirmed || st.boot_attempts < 2)
            {
                return OtaStatus {
                    bundled_version: bundled_version.to_string(),
                    ota_version: Some(st.version.clone()),
                    effective_version: st.version,
                    confirmed: st.confirmed,
                    active: true,
                };
            }
        }
    }

    OtaStatus {
        bundled_version: bundled_version.to_string(),
        ota_version: None,
        effective_version: bundled_version.to_string(),
        confirmed: true,
        active: false,
    }
}

/// Extract verified ZIP bytes into a clean staging dir, validate entrypoints, and atomically activate.
pub fn extract_and_activate_zip(
    ota_root: &Path,
    version: &str,
    bundled_version: &str,
    zip_bytes: &[u8],
    expected_sha256: &str,
) -> Result<OtaInstallResult, String> {
    if parse_semver_tuple(version).is_none() {
        return Err(format!("Invalid semantic version: {version}"));
    }
    let clean_ver = version.trim().trim_start_matches(['v', 'V']).to_string();
    if !is_newer_version(bundled_version, &clean_ver) {
        return Err(format!(
            "OTA version {clean_ver} is not newer than bundled version {bundled_version}"
        ));
    }

    if zip_bytes.is_empty() || zip_bytes.len() > MAX_OTA_ZIP_BYTES {
        return Err("OTA archive size out of allowed bounds".to_string());
    }

    let actual_sha256 = compute_sha256_hex(zip_bytes);
    let want_sha256 = parse_sha256_hex(expected_sha256)?;
    if actual_sha256 != want_sha256 {
        return Err(format!(
            "SHA-256 mismatch: expected {want_sha256}, got {actual_sha256}"
        ));
    }

    fs::create_dir_all(ota_root)
        .map_err(|e| format!("Failed creating OTA root {}: {e}", ota_root.display()))?;

    let staging_dir = ota_root.join(format!("staging-{clean_ver}"));
    if staging_dir.exists() {
        let _ = fs::remove_dir_all(&staging_dir);
    }
    fs::create_dir_all(&staging_dir)
        .map_err(|e| format!("Failed creating OTA staging dir: {e}"))?;

    let result = (|| -> Result<usize, String> {
        let mut archive = ZipArchive::new(Cursor::new(zip_bytes))
            .map_err(|e| format!("Invalid OTA ZIP archive: {e}"))?;

        if archive.is_empty() || archive.len() > MAX_OTA_FILES {
            return Err(format!("Unexpected file count in OTA archive: {}", archive.len()));
        }

        let mut total_uncompressed: u64 = 0;
        let mut files_extracted: usize = 0;

        for i in 0..archive.len() {
            let mut entry = archive
                .by_index(i)
                .map_err(|e| format!("Failed reading ZIP entry #{i}: {e}"))?;

            let Some(rel_path) = sanitize_zip_rel_path(entry.name())? else {
                continue;
            };
            let dest_path = staging_dir.join(&rel_path);

            if entry.is_dir() {
                fs::create_dir_all(&dest_path)
                    .map_err(|e| format!("Failed creating dir {}: {e}", rel_path.display()))?;
                continue;
            }

            if let Some(parent) = dest_path.parent() {
                fs::create_dir_all(parent)
                    .map_err(|e| format!("Failed creating parent dir: {e}"))?;
            }

            let mut out_file = File::create(&dest_path)
                .map_err(|e| format!("Failed creating file {}: {e}", rel_path.display()))?;
            let mut limited = (&mut entry).take(MAX_OTA_EXTRACTED_BYTES - total_uncompressed + 1);
            let written = io::copy(&mut limited, &mut out_file)
                .map_err(|e| format!("Failed extracting {}: {e}", rel_path.display()))?;
            total_uncompressed = total_uncompressed.saturating_add(written);
            if total_uncompressed > MAX_OTA_EXTRACTED_BYTES {
                return Err("OTA archive exceeded uncompressed safety cap".to_string());
            }
            files_extracted += 1;
        }

        // Verify mandatory Ulduz entrypoints exist before flipping active directory
        if !staging_dir.join("index.html").is_file()
            || !staging_dir.join("js").join("app").join("main.js").is_file()
        {
            return Err("OTA archive is missing required index.html or js/app/main.js".to_string());
        }

        Ok(files_extracted)
    })();

    let files_extracted = match result {
        Ok(n) => n,
        Err(e) => {
            let _ = fs::remove_dir_all(&staging_dir);
            return Err(e);
        }
    };

    // Atomic directory swap: active -> prev, staging -> active, write state.json atomically
    let active_dir = ota_active_dir(ota_root);
    let prev_dir = ota_root.join("prev");
    if prev_dir.exists() {
        let _ = fs::remove_dir_all(&prev_dir);
    }
    if active_dir.exists() {
        fs::rename(&active_dir, &prev_dir)
            .map_err(|e| format!("Failed backing up previous OTA bundle: {e}"))?;
    }
    if let Err(e) = fs::rename(&staging_dir, &active_dir) {
        // Restore previous bundle if rename failed
        if prev_dir.exists() {
            let _ = fs::rename(&prev_dir, &active_dir);
        }
        let _ = fs::remove_dir_all(&staging_dir);
        return Err(format!("Failed activating OTA bundle: {e}"));
    }
    let _ = fs::remove_dir_all(&prev_dir);

    let now_secs = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_secs())
        .unwrap_or(0);

    let state = OtaState {
        version: clean_ver.clone(),
        sha256: actual_sha256.clone(),
        installed_at: now_secs,
        confirmed: false,
        boot_attempts: 0,
        bundled_version: bundled_version.to_string(),
    };
    let state_bytes = serde_json::to_vec_pretty(&state)
        .map_err(|e| format!("Failed serializing OTA state: {e}"))?;
    atomic_write_bytes(&ota_state_path(ota_root), &state_bytes)?;

    Ok(OtaInstallResult {
        version: clean_ver,
        sha256: actual_sha256,
        files_extracted,
        status: "installed".to_string(),
    })
}

/// Core async helper shared by Tauri command and unit tests.
pub async fn download_and_install_ota_into(
    ota_root: &Path,
    version: &str,
    bundled_version: &str,
    zip_url: &str,
    sha256_url: &str,
    allow_local_test: bool,
) -> Result<OtaInstallResult, String> {
    let valid_zip_url = validate_ota_download_url(zip_url, allow_local_test)?;
    let valid_sha_url = validate_ota_download_url(sha256_url, allow_local_test)?;

    let client = reqwest::Client::builder()
        .user_agent(format!("Ulduz/{bundled_version}"))
        .timeout(Duration::from_secs(60))
        .build()
        .map_err(|e| format!("Failed creating OTA HTTP client: {e}"))?;

    // 1. Fetch official SHA-256 digest first
    let sha_resp = client
        .get(&valid_sha_url)
        .send()
        .await
        .map_err(|e| format!("Failed downloading OTA checksum: {e}"))?;
    if !sha_resp.status().is_success() {
        return Err(format!(
            "OTA checksum download failed with HTTP {}",
            sha_resp.status().as_u16()
        ));
    }
    let sha_bytes = sha_resp
        .bytes()
        .await
        .map_err(|e| format!("Failed reading OTA checksum body: {e}"))?;
    if sha_bytes.len() > MAX_SHA256_TEXT_BYTES {
        return Err("OTA checksum file too large".to_string());
    }
    let sha_text = String::from_utf8_lossy(&sha_bytes);
    let expected_sha256 = parse_sha256_hex(&sha_text)?;

    // 2. Download OTA web bundle archive
    let zip_resp = client
        .get(&valid_zip_url)
        .send()
        .await
        .map_err(|e| format!("Failed downloading OTA bundle: {e}"))?;
    if !zip_resp.status().is_success() {
        return Err(format!(
            "OTA bundle download failed with HTTP {}",
            zip_resp.status().as_u16()
        ));
    }
    if let Some(len) = zip_resp.content_length() {
        if len as usize > MAX_OTA_ZIP_BYTES {
            return Err("OTA bundle exceeds maximum allowed size".to_string());
        }
    }
    let zip_bytes = zip_resp
        .bytes()
        .await
        .map_err(|e| format!("Failed reading OTA bundle bytes: {e}"))?;

    extract_and_activate_zip(ota_root, version, bundled_version, &zip_bytes, &expected_sha256)
}

pub fn confirm_ota_boot_in(ota_root: &Path) -> Result<bool, String> {
    let Some(mut st) = read_ota_state(ota_root) else {
        return Ok(false);
    };
    if st.confirmed && st.boot_attempts == 0 {
        return Ok(true);
    }
    st.confirmed = true;
    st.boot_attempts = 0;
    let bytes = serde_json::to_vec_pretty(&st)
        .map_err(|e| format!("Failed serializing OTA state: {e}"))?;
    atomic_write_bytes(&ota_state_path(ota_root), &bytes)?;
    Ok(true)
}

pub fn clear_ota_in(ota_root: &Path) -> Result<(), String> {
    if ota_root.exists() {
        fs::remove_dir_all(ota_root)
            .map_err(|e| format!("Failed clearing OTA directory: {e}"))?;
    }
    Ok(())
}

#[tauri::command]
pub fn get_ota_status(app: tauri::AppHandle) -> Result<OtaStatus, String> {
    let data_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| format!("Cannot resolve app data dir: {e}"))?;
    let root = ota_root_in(&data_dir);
    Ok(compute_ota_status(&root, env!("CARGO_PKG_VERSION")))
}

#[tauri::command]
pub async fn install_ota_update(
    app: tauri::AppHandle,
    version: String,
    zip_url: String,
    sha256_url: String,
) -> Result<OtaInstallResult, String> {
    let data_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| format!("Cannot resolve app data dir: {e}"))?;
    let root = ota_root_in(&data_dir);
    download_and_install_ota_into(
        &root,
        &version,
        env!("CARGO_PKG_VERSION"),
        &zip_url,
        &sha256_url,
        false,
    )
    .await
}

#[tauri::command]
pub fn confirm_ota_boot(app: tauri::AppHandle) -> Result<bool, String> {
    let data_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| format!("Cannot resolve app data dir: {e}"))?;
    let root = ota_root_in(&data_dir);
    confirm_ota_boot_in(&root)
}

#[tauri::command]
pub fn clear_ota_update(app: tauri::AppHandle) -> Result<(), String> {
    let data_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| format!("Cannot resolve app data dir: {e}"))?;
    let root = ota_root_in(&data_dir);
    clear_ota_in(&root)
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::io::Write;
    use std::net::TcpListener;
    use std::thread;
    use zip::write::SimpleFileOptions;
    use zip::ZipWriter;

    fn make_temp_root(tag: &str) -> PathBuf {
        let p = std::env::temp_dir().join(format!(
            "ulduz_ota_test_{tag}_{}",
            SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .unwrap()
                .as_nanos()
        ));
        let _ = fs::remove_dir_all(&p);
        fs::create_dir_all(&p).unwrap();
        p
    }

    fn build_zip(files: &[(&str, &str)]) -> Vec<u8> {
        let mut buf = Cursor::new(Vec::new());
        {
            let mut zw = ZipWriter::new(&mut buf);
            let opts = SimpleFileOptions::default();
            for (name, content) in files {
                zw.start_file(*name, opts).unwrap();
                zw.write_all(content.as_bytes()).unwrap();
            }
            zw.finish().unwrap();
        }
        buf.into_inner()
    }

    #[test]
    fn validates_official_github_ota_urls_only() {
        assert!(validate_ota_download_url(
            "https://github.com/nakoulaf4/ulduz-attestat/releases/download/v3.4.0/Ulduz-v3.4.0-web-ota.zip",
            false
        )
        .is_ok());
        assert!(validate_ota_download_url(
            "https://objects.githubusercontent.com/some/asset.zip",
            false
        )
        .is_ok());
        assert!(validate_ota_download_url(
            "https://evil.example.com/Ulduz-v3.4.0-web-ota.zip",
            false
        )
        .is_err());
        assert!(validate_ota_download_url(
            "https://github.com/otheruser/repo/releases/download/v1/a.zip",
            false
        )
        .is_err());
    }

    #[test]
    fn rejects_sha256_mismatch_and_zip_slip_and_missing_entrypoints() {
        let root = make_temp_root("security");

        let valid_zip = build_zip(&[
            ("index.html", "<!doctype html><html></html>"),
            ("js/app/main.js", "console.log('ok');"),
        ]);

        // Bad SHA-256 rejected
        let bad_hash = "0".repeat(64);
        let err = extract_and_activate_zip(&root, "3.4.0", "3.3.0", &valid_zip, &bad_hash)
            .unwrap_err();
        assert!(err.contains("SHA-256 mismatch"), "unexpected err: {err}");
        assert!(!ota_active_dir(&root).exists());

        // Zip-Slip rejected
        let evil_zip = build_zip(&[
            ("index.html", "<!doctype html>"),
            ("js/app/main.js", "ok"),
            ("../../pwned.txt", "evil"),
        ]);
        let evil_sha = compute_sha256_hex(&evil_zip);
        let err2 = extract_and_activate_zip(&root, "3.4.0", "3.3.0", &evil_zip, &evil_sha)
            .unwrap_err();
        assert!(err2.contains("Path traversal"), "unexpected err: {err2}");

        // Missing main.js rejected
        let broken_zip = build_zip(&[("index.html", "<!doctype html>")]);
        let broken_sha = compute_sha256_hex(&broken_zip);
        let err3 = extract_and_activate_zip(&root, "3.4.0", "3.3.0", &broken_zip, &broken_sha)
            .unwrap_err();
        assert!(err3.contains("missing required"), "unexpected err: {err3}");

        let _ = fs::remove_dir_all(&root);
    }

    #[test]
    fn full_http_download_verify_activate_and_confirm_roundtrip() {
        let root = make_temp_root("e2e_http");
        let zip_bytes = build_zip(&[
            ("index.html", "<!doctype html><title>Ulduz 3.4.0</title>"),
            ("js/app/main.js", "export const ver = '3.4.0';"),
            ("css/styles.css", "body { color: #eaeae6; }"),
        ]);
        let sha_hex = compute_sha256_hex(&zip_bytes);
        let sha_body = format!("{sha_hex}  Ulduz-v3.4.0-web-ota.zip\n");

        // Spin up real loopback HTTP server serving /bundle.sha256 and /bundle.zip
        let listener = TcpListener::bind("127.0.0.1:0").unwrap();
        let addr = listener.local_addr().unwrap();
        let zc = zip_bytes.clone();
        let sc = sha_body.clone();
        let server = thread::spawn(move || {
            for _ in 0..2 {
                let (mut stream, _) = listener.accept().unwrap();
                let mut req_buf = [0u8; 1024];
                let n = stream.read(&mut req_buf).unwrap_or(0);
                let req_str = String::from_utf8_lossy(&req_buf[..n]);
                let (ct, payload): (&str, &[u8]) = if req_str.contains("/bundle.sha256") {
                    ("text/plain", sc.as_bytes())
                } else {
                    ("application/zip", &zc)
                };
                let header = format!(
                    "HTTP/1.1 200 OK\r\nContent-Type: {ct}\r\nContent-Length: {}\r\nConnection: close\r\n\r\n",
                    payload.len()
                );
                stream.write_all(header.as_bytes()).unwrap();
                stream.write_all(payload).unwrap();
                stream.flush().unwrap();
            }
        });

        let rt = tokio::runtime::Builder::new_current_thread()
            .enable_all()
            .build()
            .unwrap();
        let zip_url = format!("http://{addr}/bundle.zip");
        let sha_url = format!("http://{addr}/bundle.sha256");

        let res = rt
            .block_on(download_and_install_ota_into(
                &root, "v3.4.0", "3.3.0", &zip_url, &sha_url, true,
            ))
            .expect("OTA download+install should succeed");

        server.join().unwrap();

        assert_eq!(res.version, "3.4.0");
        assert_eq!(res.sha256, sha_hex);
        assert_eq!(res.files_extracted, 3);

        let st = compute_ota_status(&root, "3.3.0");
        assert!(st.active);
        assert_eq!(st.effective_version, "3.4.0");
        assert!(!st.confirmed);

        assert!(confirm_ota_boot_in(&root).unwrap());
        let st2 = compute_ota_status(&root, "3.3.0");
        assert!(st2.active);
        assert!(st2.confirmed);

        // If user later upgrades native APK to 3.5.0, old 3.4.0 OTA becomes inactive automatically
        let st3 = compute_ota_status(&root, "3.5.0");
        assert!(!st3.active);
        assert_eq!(st3.effective_version, "3.5.0");

        let _ = fs::remove_dir_all(&root);
    }
}
