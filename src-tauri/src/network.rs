//! Native HTTPS networking for Ulduz:
//! 1. GitHub Releases auto-update checker & streaming Android APK downloader.
//! 2. CORS-free OpenAI-compatible AI gateway bridge (OpenCode Zen, Kilo Gateway, Custom).

use futures_util::StreamExt;
use serde::{Deserialize, Serialize};
use std::fs::{self, File};
use std::io::Write;
use std::time::Duration;
use tauri::{Emitter, Manager};

pub const GITHUB_LATEST_RELEASE_URL: &str =
    "https://api.github.com/repos/nakoulaf4/ulduz-attestat/releases/latest";

const MAX_APK_BYTES: u64 = 150 * 1024 * 1024;
const MAX_AI_BODY_BYTES: usize = 512 * 1024;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UpdateCheckResult {
    pub current_version: String,
    pub latest_version: String,
    pub has_update: bool,
    pub title: String,
    pub notes: String,
    pub release_url: String,
    pub published_at: String,
    pub apk_url: Option<String>,
    pub apk_name: Option<String>,
    pub apk_size: Option<u64>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UpdateProgressEvent {
    pub downloaded: u64,
    pub total: u64,
    pub pct: u8,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HttpJsonResponse {
    pub status: u16,
    pub body: String,
}

#[derive(Debug, Deserialize)]
struct GithubReleaseApi {
    tag_name: Option<String>,
    name: Option<String>,
    body: Option<String>,
    html_url: Option<String>,
    published_at: Option<String>,
    #[serde(default)]
    assets: Vec<GithubAssetApi>,
}

#[derive(Debug, Deserialize)]
struct GithubAssetApi {
    name: String,
    browser_download_url: String,
    size: Option<u64>,
}

/// Parse a `vX.Y.Z` or `X.Y.Z` version tag into `(major, minor, patch)`.
pub fn parse_semver_tuple(raw: &str) -> Option<(u64, u64, u64)> {
    let cleaned = raw.trim().trim_start_matches(['v', 'V']);
    let core = cleaned.split(['-', '+']).next().unwrap_or("");
    let mut parts = core.split('.');
    let major = parts.next()?.parse::<u64>().ok()?;
    let minor = parts.next().unwrap_or("0").parse::<u64>().ok()?;
    let patch = parts.next().unwrap_or("0").parse::<u64>().ok()?;
    Some((major, minor, patch))
}

/// Returns `true` strictly when `latest` is a higher semantic version than `current`.
pub fn is_newer_version(current: &str, latest: &str) -> bool {
    match (parse_semver_tuple(current), parse_semver_tuple(latest)) {
        (Some(cur), Some(lat)) => lat > cur,
        _ => false,
    }
}

/// Validate AI gateway endpoint URL (HTTPS required, except loopback HTTP for local models).
pub fn validate_ai_endpoint_url(raw: &str) -> Result<String, String> {
    let trimmed = raw.trim();
    if trimmed.is_empty() || trimmed.len() > 512 {
        return Err("Invalid endpoint URL length".to_string());
    }
    let lower = trimmed.to_ascii_lowercase();
    let is_https = lower.starts_with("https://");
    let is_local_http = lower.starts_with("http://127.0.0.1")
        || lower.starts_with("http://localhost");
    if !is_https && !is_local_http {
        return Err("Only https:// (or localhost) AI gateway URLs are permitted".to_string());
    }
    Ok(trimmed.to_string())
}

/// Restrict APK update downloads strictly to GitHub Release HTTPS hosts.
pub fn validate_github_apk_url(raw: &str) -> Result<String, String> {
    let trimmed = raw.trim();
    let lower = trimmed.to_ascii_lowercase();
    let allowed = lower.starts_with("https://github.com/nakoulaf4/ulduz-attestat/releases/download/")
        || lower.starts_with("https://objects.githubusercontent.com/")
        || lower.starts_with("https://release-assets.githubusercontent.com/");
    if !allowed {
        return Err("APK update URL must originate from official Ulduz GitHub Releases".to_string());
    }
    Ok(trimmed.to_string())
}

/// Sanitize APK filename for safe storage inside `app_cache_dir()/updates/`.
pub fn sanitize_apk_filename(raw: &str) -> String {
    let tail = raw.rsplit(['/', '\\']).next().unwrap_or("").trim();
    let cleaned: String = tail
        .chars()
        .filter(|c| c.is_ascii_alphanumeric() || matches!(c, '-' | '_' | '.'))
        .take(80)
        .collect();
    let trimmed = cleaned.trim_matches(['.', '-', '_']);
    if trimmed.is_empty() {
        return "Ulduz-update.apk".to_string();
    }
    if trimmed.to_ascii_lowercase().ends_with(".apk") {
        trimmed.to_string()
    } else {
        format!("{trimmed}.apk")
    }
}

fn build_http_client(timeout_secs: u64) -> Result<reqwest::Client, String> {
    reqwest::Client::builder()
        .user_agent(format!("Ulduz/{}", env!("CARGO_PKG_VERSION")))
        .timeout(Duration::from_secs(timeout_secs))
        .build()
        .map_err(|e| format!("Failed to initialize HTTP client: {e}"))
}

/// Check GitHub Releases for a newer version of Ulduz and locate the Android ARM64 APK asset.
#[tauri::command]
pub async fn check_github_update(
    current_version: Option<String>,
) -> Result<UpdateCheckResult, String> {
    let cur = current_version
        .filter(|s| !s.trim().is_empty())
        .unwrap_or_else(|| env!("CARGO_PKG_VERSION").to_string());

    let client = build_http_client(18)?;
    let resp = client
        .get(GITHUB_LATEST_RELEASE_URL)
        .header("Accept", "application/vnd.github+json")
        .send()
        .await
        .map_err(|e| format!("Update check request failed: {e}"))?;

    if !resp.status().is_success() {
        return Err(format!("GitHub API returned HTTP {}", resp.status().as_u16()));
    }

    let release: GithubReleaseApi = resp
        .json()
        .await
        .map_err(|e| format!("Failed to parse GitHub release JSON: {e}"))?;

    let tag = release.tag_name.unwrap_or_else(|| cur.clone());
    let latest_clean = tag.trim().trim_start_matches(['v', 'V']).to_string();
    let has_update = is_newer_version(&cur, &latest_clean);

    // Prefer ARM64 APK, otherwise fall back to any .apk release asset.
    let apk_asset = release
        .assets
        .iter()
        .find(|a| {
            let n = a.name.to_ascii_lowercase();
            n.ends_with(".apk") && n.contains("arm64")
        })
        .or_else(|| {
            release
                .assets
                .iter()
                .find(|a| a.name.to_ascii_lowercase().ends_with(".apk"))
        });

    Ok(UpdateCheckResult {
        current_version: cur,
        latest_version: latest_clean,
        has_update,
        title: release.name.unwrap_or(tag),
        notes: release.body.unwrap_or_default(),
        release_url: release.html_url.unwrap_or_else(|| {
            "https://github.com/nakoulaf4/ulduz-attestat/releases/latest".to_string()
        }),
        published_at: release.published_at.unwrap_or_default(),
        apk_url: apk_asset.map(|a| a.browser_download_url.clone()),
        apk_name: apk_asset.map(|a| a.name.clone()),
        apk_size: apk_asset.and_then(|a| a.size),
    })
}

/// Stream-download an official Ulduz Android APK into `app_cache_dir()/updates/` with live progress events.
#[tauri::command]
pub async fn download_update_apk(
    app: tauri::AppHandle,
    url: String,
    filename: String,
) -> Result<String, String> {
    let valid_url = validate_github_apk_url(&url)?;
    let safe_name = sanitize_apk_filename(&filename);

    let updates_dir = app
        .path()
        .app_cache_dir()
        .map_err(|e| format!("Failed to resolve app cache dir: {e}"))?
        .join("updates");
    fs::create_dir_all(&updates_dir)
        .map_err(|e| format!("Failed to create updates directory: {e}"))?;

    let target_path = updates_dir.join(&safe_name);
    let part_path = updates_dir.join(format!("{safe_name}.part"));

    let client = build_http_client(180)?;
    let resp = client
        .get(&valid_url)
        .send()
        .await
        .map_err(|e| format!("APK download failed: {e}"))?;

    if !resp.status().is_success() {
        return Err(format!("APK server returned HTTP {}", resp.status().as_u16()));
    }

    let total = resp.content_length().unwrap_or(0);
    if total > MAX_APK_BYTES {
        return Err("APK file exceeds maximum allowed size".to_string());
    }

    let mut file = File::create(&part_path)
        .map_err(|e| format!("Failed to create temp APK file: {e}"))?;
    let mut downloaded: u64 = 0;
    let mut last_emitted_pct: u8 = 255;

    let mut stream = resp.bytes_stream();
    while let Some(chunk_res) = stream.next().await {
        let chunk = match chunk_res {
            Ok(c) => c,
            Err(e) => {
                let _ = fs::remove_file(&part_path);
                return Err(format!("Download interrupted: {e}"));
            }
        };
        downloaded = downloaded.saturating_add(chunk.len() as u64);
        if downloaded > MAX_APK_BYTES {
            let _ = fs::remove_file(&part_path);
            return Err("APK stream exceeded maximum allowed size".to_string());
        }
        if let Err(e) = file.write_all(&chunk) {
            let _ = fs::remove_file(&part_path);
            return Err(format!("Failed writing APK bytes: {e}"));
        }

        let pct: u8 = downloaded
            .saturating_mul(100)
            .checked_div(total)
            .map(|v| v.min(100) as u8)
            .unwrap_or(0);
        if pct != last_emitted_pct && (pct == 100 || pct.saturating_sub(last_emitted_pct) >= 2 || last_emitted_pct == 255) {
            last_emitted_pct = pct;
            let _ = app.emit(
                "ulduz://update-progress",
                UpdateProgressEvent {
                    downloaded,
                    total,
                    pct,
                },
            );
        }
    }

    if let Err(e) = file.sync_all() {
        let _ = fs::remove_file(&part_path);
        return Err(format!("Failed flushing APK file: {e}"));
    }
    drop(file);

    if let Err(e) = fs::rename(&part_path, &target_path) {
        let _ = fs::remove_file(&part_path);
        return Err(format!("Failed finalizing APK file: {e}"));
    }

    let _ = app.emit(
        "ulduz://update-progress",
        UpdateProgressEvent {
            downloaded,
            total: total.max(downloaded),
            pct: 100,
        },
    );

    Ok(target_path.to_string_lossy().into_owned())
}

/// Forward an OpenAI-compatible chat completion JSON POST request without WebView CORS limits.
#[tauri::command]
pub async fn ai_chat_completion(
    url: String,
    api_key: Option<String>,
    body: String,
) -> Result<HttpJsonResponse, String> {
    let valid_url = validate_ai_endpoint_url(&url)?;
    if body.len() > MAX_AI_BODY_BYTES {
        return Err("AI request payload too large".to_string());
    }

    let client = build_http_client(45)?;
    let mut req = client
        .post(&valid_url)
        .header("Content-Type", "application/json")
        .header("Accept", "application/json")
        .body(body);

    if let Some(key) = api_key.map(|k| k.trim().to_string()).filter(|k| !k.is_empty()) {
        req = req.bearer_auth(key);
    }

    let resp = req
        .send()
        .await
        .map_err(|e| format!("AI gateway connection failed: {e}"))?;

    let status = resp.status().as_u16();
    let text = resp
        .text()
        .await
        .map_err(|e| format!("Failed reading AI response body: {e}"))?;

    Ok(HttpJsonResponse { status, body: text })
}

/// Fetch an OpenAI-compatible `/models` catalog JSON without WebView CORS limits.
#[tauri::command]
pub async fn ai_list_models(
    url: String,
    api_key: Option<String>,
) -> Result<HttpJsonResponse, String> {
    let valid_url = validate_ai_endpoint_url(&url)?;
    let client = build_http_client(20)?;
    let mut req = client.get(&valid_url).header("Accept", "application/json");

    if let Some(key) = api_key.map(|k| k.trim().to_string()).filter(|k| !k.is_empty()) {
        req = req.bearer_auth(key);
    }

    let resp = req
        .send()
        .await
        .map_err(|e| format!("Model catalog fetch failed: {e}"))?;

    let status = resp.status().as_u16();
    let text = resp
        .text()
        .await
        .map_err(|e| format!("Failed reading models catalog: {e}"))?;

    Ok(HttpJsonResponse { status, body: text })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn semver_parsing_and_comparison_work() {
        assert_eq!(parse_semver_tuple("v3.1.0"), Some((3, 1, 0)));
        assert_eq!(parse_semver_tuple("3.0.0-rc.1"), Some((3, 0, 0)));
        assert_eq!(parse_semver_tuple("invalid"), None);

        assert!(is_newer_version("3.0.0", "3.1.0"));
        assert!(is_newer_version("v3.0.0", "v4.0.0"));
        assert!(is_newer_version("3.0.9", "3.0.10"));
        assert!(!is_newer_version("3.1.0", "3.1.0"));
        assert!(!is_newer_version("3.2.0", "3.1.9"));
    }

    #[test]
    fn validates_ai_and_apk_urls_strictly() {
        assert!(validate_ai_endpoint_url("https://opencode.ai/zen/v1/chat/completions").is_ok());
        assert!(validate_ai_endpoint_url("https://api.kilo.ai/api/gateway/chat/completions").is_ok());
        assert!(validate_ai_endpoint_url("http://127.0.0.1:11434/v1/chat/completions").is_ok());
        assert!(validate_ai_endpoint_url("http://evil.example.com/v1").is_err());
        assert!(validate_ai_endpoint_url("file:///etc/passwd").is_err());

        assert!(validate_github_apk_url(
            "https://github.com/nakoulaf4/ulduz-attestat/releases/download/v3.1.0/Ulduz-v3.1.0-android-arm64.apk"
        )
        .is_ok());
        assert!(validate_github_apk_url("https://evil.example.com/app.apk").is_err());
    }

    #[test]
    fn sanitizes_apk_filenames() {
        assert_eq!(
            sanitize_apk_filename("../../evil/Ulduz-v3.1.0.apk"),
            "Ulduz-v3.1.0.apk"
        );
        assert_eq!(sanitize_apk_filename("..."), "Ulduz-update.apk");
        assert_eq!(sanitize_apk_filename("Ulduz-3.1"), "Ulduz-3.1.apk");
    }
}
