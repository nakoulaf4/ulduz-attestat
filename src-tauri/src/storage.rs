//! Crash-safe atomic file-backed progress storage and backup export for Ulduz.
//!
//! Persists JSON progress inside the OS app data directory (`ulduz_progress.json`)
//! using write-to-temp -> fsync -> atomic rename so abrupt kills on Android/iOS
//! can never leave a half-written or corrupted state file.

use serde::{Deserialize, Serialize};
use std::fs::{self, File};
use std::io::Write;
use std::path::{Path, PathBuf};
use tauri::Manager;

/// Primary progress file name inside `app_data_dir()`.
pub const PROGRESS_FILE_NAME: &str = "ulduz_progress.json";

/// Upper bound (10 MiB) on persisted progress payloads to guard against corrupt blobs.
pub const MAX_PROGRESS_BYTES: usize = 10 * 1024 * 1024;

/// Maximum length of a sanitized export file name.
const MAX_EXPORT_FILENAME_LEN: usize = 96;

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct AppInfo {
    pub version: String,
    pub platform: String,
    pub engine: String,
}

/// Validate that `data` is non-empty, within size limits, and parses as a JSON object.
pub fn validate_progress_json(data: &str) -> Result<(), String> {
    if data.trim().is_empty() {
        return Err("Progress JSON payload is empty".to_string());
    }
    if data.len() > MAX_PROGRESS_BYTES {
        return Err(format!(
            "Progress JSON payload exceeds maximum size of {MAX_PROGRESS_BYTES} bytes"
        ));
    }
    let parsed: serde_json::Value =
        serde_json::from_str(data).map_err(|e| format!("Invalid progress JSON: {e}"))?;
    if !parsed.is_object() {
        return Err("Progress JSON root must be a JSON object".to_string());
    }
    Ok(())
}

/// Write `bytes` to `target` atomically via a sibling `.tmp` file + `sync_all` + `rename`.
pub fn atomic_write_bytes(target: &Path, bytes: &[u8]) -> Result<(), String> {
    let parent = target
        .parent()
        .ok_or_else(|| "Target path has no parent directory".to_string())?;
    fs::create_dir_all(parent)
        .map_err(|e| format!("Failed to create storage directory {}: {e}", parent.display()))?;

    let file_name = target
        .file_name()
        .and_then(|n| n.to_str())
        .ok_or_else(|| "Target path has no valid file name".to_string())?;
    let tmp_path = parent.join(format!("{file_name}.tmp"));

    let write_result = (|| -> Result<(), String> {
        let mut file = File::create(&tmp_path)
            .map_err(|e| format!("Failed to create temp file {}: {e}", tmp_path.display()))?;
        file.write_all(bytes)
            .map_err(|e| format!("Failed to write temp file {}: {e}", tmp_path.display()))?;
        file.sync_all()
            .map_err(|e| format!("Failed to sync temp file {}: {e}", tmp_path.display()))?;
        Ok(())
    })();

    if let Err(err) = write_result {
        let _ = fs::remove_file(&tmp_path);
        return Err(err);
    }

    if let Err(rename_err) = fs::rename(&tmp_path, target) {
        let _ = fs::remove_file(&tmp_path);
        return Err(format!(
            "Failed to atomically replace {}: {rename_err}",
            target.display()
        ));
    }

    Ok(())
}

/// Load persisted progress JSON from `dir/ulduz_progress.json`, returning `Ok(None)` if absent.
pub fn read_progress_from_dir(dir: &Path) -> Result<Option<String>, String> {
    let path = dir.join(PROGRESS_FILE_NAME);
    match fs::read_to_string(&path) {
        Ok(contents) => {
            validate_progress_json(&contents)?;
            Ok(Some(contents))
        }
        Err(err) if err.kind() == std::io::ErrorKind::NotFound => Ok(None),
        Err(err) => Err(format!("Failed to read {}: {err}", path.display())),
    }
}

/// Validate and atomically save progress JSON into `dir/ulduz_progress.json`.
pub fn write_progress_to_dir(dir: &Path, data: &str) -> Result<(), String> {
    validate_progress_json(data)?;
    let path = dir.join(PROGRESS_FILE_NAME);
    atomic_write_bytes(&path, data.as_bytes())
}

/// Sanitize an arbitrary export filename into a safe basename ending with `.json`.
///
/// Prevents directory traversal (`..`, `/`, `\`), control characters, hidden dot-files,
/// and overly long names.
pub fn sanitize_export_filename(raw: &str) -> String {
    // Take only the final path segment across both POSIX and Windows separators.
    let tail = raw
        .rsplit(['/', '\\'])
        .next()
        .unwrap_or("")
        .trim();

    // Strip any traversal patterns and map unsafe chars to '_'.
    let mut cleaned = String::with_capacity(tail.len().min(MAX_EXPORT_FILENAME_LEN));
    let mut prev_underscore = false;

    for ch in tail.chars() {
        let safe = ch.is_ascii_alphanumeric() || matches!(ch, '-' | '_' | '.');
        if safe {
            cleaned.push(ch);
            prev_underscore = ch == '_';
        } else if !prev_underscore && !cleaned.is_empty() {
            cleaned.push('_');
            prev_underscore = true;
        }
    }

    // Collapse consecutive dots ("..") and trim leading/trailing dots or underscores.
    while cleaned.contains("..") {
        cleaned = cleaned.replace("..", ".");
    }
    let trimmed = cleaned.trim_matches(['.', '_', '-']);

    if trimmed.is_empty() {
        return "ulduz-progress.json".to_string();
    }

    // Separate base from optional ".json" suffix (case-insensitive) to enforce canonical ".json".
    let stem = if trimmed.len() > 5 && trimmed[trimmed.len() - 5..].eq_ignore_ascii_case(".json") {
        &trimmed[..trimmed.len() - 5]
    } else {
        trimmed
    };
    let stem = stem.trim_matches(['.', '_', '-']);
    if stem.is_empty() {
        return "ulduz-progress.json".to_string();
    }

    let max_stem = MAX_EXPORT_FILENAME_LEN - 5;
    let truncated_stem: String = stem.chars().take(max_stem).collect();
    let final_stem = truncated_stem.trim_matches(['.', '_', '-']);
    if final_stem.is_empty() {
        return "ulduz-progress.json".to_string();
    }

    format!("{final_stem}.json")
}

/// Validate JSON, sanitize `filename`, and atomically write backup into `dir`.
pub fn export_progress_to_dir(dir: &Path, filename: &str, data: &str) -> Result<PathBuf, String> {
    validate_progress_json(data)?;
    let safe_name = sanitize_export_filename(filename);
    let target = dir.join(safe_name);
    atomic_write_bytes(&target, data.as_bytes())?;
    Ok(target)
}

/// Load the saved Ulduz progress JSON from the app data directory (`None` on first launch).
#[tauri::command]
pub fn load_progress(app: tauri::AppHandle) -> Result<Option<String>, String> {
    let dir = app
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to resolve app data directory: {e}"))?;
    read_progress_from_dir(&dir)
}

/// Validate and atomically save the Ulduz progress JSON into the app data directory.
#[tauri::command]
pub fn save_progress(app: tauri::AppHandle, data: String) -> Result<(), String> {
    let dir = app
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to resolve app data directory: {e}"))?;
    write_progress_to_dir(&dir, &data)
}

/// Export a validated progress JSON backup into the app's documents or cache directory,
/// returning the absolute file path where the backup was saved.
#[tauri::command]
pub fn export_progress_file(
    app: tauri::AppHandle,
    filename: String,
    data: String,
) -> Result<String, String> {
    validate_progress_json(&data)?;

    let mut candidate_dirs: Vec<PathBuf> = Vec::new();
    if let Ok(doc_dir) = app.path().document_dir() {
        candidate_dirs.push(doc_dir.join("Ulduz"));
    }
    if let Ok(cache_dir) = app.path().app_cache_dir() {
        candidate_dirs.push(cache_dir.join("exports"));
    }
    if let Ok(data_dir) = app.path().app_data_dir() {
        candidate_dirs.push(data_dir.join("exports"));
    }

    let mut last_err = "No writable export directory available".to_string();
    for dir in candidate_dirs {
        match export_progress_to_dir(&dir, &filename, &data) {
            Ok(saved_path) => return Ok(saved_path.to_string_lossy().into_owned()),
            Err(err) => last_err = err,
        }
    }

    Err(last_err)
}

/// Return static metadata about the native Rust/Tauri runtime.
#[tauri::command]
pub fn app_info() -> AppInfo {
    AppInfo {
        version: env!("CARGO_PKG_VERSION").to_string(),
        platform: std::env::consts::OS.to_string(),
        engine: "rust-tauri-v2".to_string(),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::sync::atomic::{AtomicU64, Ordering};

    static TEST_COUNTER: AtomicU64 = AtomicU64::new(0);

    fn fresh_temp_dir(label: &str) -> PathBuf {
        let id = TEST_COUNTER.fetch_add(1, Ordering::Relaxed);
        let pid = std::process::id();
        let dir = std::env::temp_dir().join(format!("ulduz_test_{label}_{pid}_{id}"));
        let _ = fs::remove_dir_all(&dir);
        fs::create_dir_all(&dir).unwrap();
        dir
    }

    #[test]
    fn load_returns_none_when_file_missing() {
        let dir = fresh_temp_dir("missing");
        let loaded = read_progress_from_dir(&dir).unwrap();
        assert_eq!(loaded, None);
        let _ = fs::remove_dir_all(&dir);
    }

    #[test]
    fn atomic_save_and_overwrite_roundtrip() {
        let dir = fresh_temp_dir("roundtrip");
        let v1 = r#"{"version":1,"lang":"ru","stats":{"totalAttempted":3}}"#;
        let v2 = r#"{"version":1,"lang":"az","stats":{"totalAttempted":12}}"#;

        write_progress_to_dir(&dir, v1).unwrap();
        assert_eq!(read_progress_from_dir(&dir).unwrap().as_deref(), Some(v1));
        assert!(!dir.join("ulduz_progress.json.tmp").exists());

        // Atomic overwrite must succeed cleanly and leave no leftover .tmp file.
        write_progress_to_dir(&dir, v2).unwrap();
        assert_eq!(read_progress_from_dir(&dir).unwrap().as_deref(), Some(v2));
        assert!(!dir.join("ulduz_progress.json.tmp").exists());

        let _ = fs::remove_dir_all(&dir);
    }

    #[test]
    fn rejects_invalid_or_non_object_json() {
        let dir = fresh_temp_dir("invalid_json");
        assert!(write_progress_to_dir(&dir, "").is_err());
        assert!(write_progress_to_dir(&dir, "   ").is_err());
        assert!(write_progress_to_dir(&dir, "{not-valid-json").is_err());
        assert!(write_progress_to_dir(&dir, "[1, 2, 3]").is_err());
        assert!(write_progress_to_dir(&dir, "\"just a string\"").is_err());
        assert!(!dir.join(PROGRESS_FILE_NAME).exists());
        let _ = fs::remove_dir_all(&dir);
    }

    #[test]
    fn sanitizes_traversal_and_unsafe_filenames() {
        assert_eq!(
            sanitize_export_filename("../../etc/passwd"),
            "passwd.json"
        );
        assert_eq!(
            sanitize_export_filename(r"C:\Windows\System32\evil.exe"),
            "evil.exe.json"
        );
        assert_eq!(
            sanitize_export_filename("...///..."),
            "ulduz-progress.json"
        );
        assert_eq!(
            sanitize_export_filename("ulduz backup 2026-03-15.JSON"),
            "ulduz_backup_2026-03-15.json"
        );
        assert_eq!(
            sanitize_export_filename("my..progress"),
            "my.progress.json"
        );
        assert_eq!(
            sanitize_export_filename(".hidden"),
            "hidden.json"
        );

        let long_name = "a".repeat(200);
        let sanitized = sanitize_export_filename(&long_name);
        assert!(sanitized.ends_with(".json"));
        assert!(sanitized.len() <= MAX_EXPORT_FILENAME_LEN);
    }

    #[test]
    fn export_writes_sanitized_backup_file() {
        let dir = fresh_temp_dir("export");
        let payload = r#"{"version":1,"exams":[]}"#;

        let saved = export_progress_to_dir(&dir, "../backup 2026.json", payload).unwrap();
        assert_eq!(saved.parent(), Some(dir.as_path()));
        assert_eq!(
            saved.file_name().and_then(|n| n.to_str()),
            Some("backup_2026.json")
        );
        assert_eq!(fs::read_to_string(&saved).unwrap(), payload);

        let _ = fs::remove_dir_all(&dir);
    }

    #[test]
    fn app_info_reports_version_and_engine() {
        let info = app_info();
        assert_eq!(info.version, env!("CARGO_PKG_VERSION"));
        assert_eq!(info.engine, "rust-tauri-v2");
        assert!(!info.platform.is_empty());
    }
}
