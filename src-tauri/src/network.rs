//! Native HTTPS networking for Ulduz:
//! 1. GitHub Releases update checker (opens official GitHub Release page in browser).
//! 2. CORS-free OpenAI-compatible AI gateway bridge (OpenCode Zen, Kilo Gateway, Custom).

use serde::{Deserialize, Serialize};
use std::time::Duration;

pub const GITHUB_LATEST_RELEASE_URL: &str =
    "https://api.github.com/repos/nakoulaf4/ulduz-attestat/releases/latest";

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
    let is_local_http =
        lower.starts_with("http://127.0.0.1") || lower.starts_with("http://localhost");
    if !is_https && !is_local_http {
        return Err("Only https:// (or localhost) AI gateway URLs are permitted".to_string());
    }
    Ok(trimmed.to_string())
}

fn build_http_client(timeout_secs: u64) -> Result<reqwest::Client, String> {
    reqwest::Client::builder()
        .user_agent(format!("Ulduz/{}", env!("CARGO_PKG_VERSION")))
        .timeout(Duration::from_secs(timeout_secs))
        .build()
        .map_err(|e| format!("Failed to initialize HTTP client: {e}"))
}

/// Check GitHub Releases for a newer version of Ulduz and return official release metadata.
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

    if let Some(key) = api_key
        .map(|k| k.trim().to_string())
        .filter(|k| !k.is_empty())
    {
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

    if let Some(key) = api_key
        .map(|k| k.trim().to_string())
        .filter(|k| !k.is_empty())
    {
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
        assert_eq!(parse_semver_tuple("v3.2.0"), Some((3, 2, 0)));
        assert_eq!(parse_semver_tuple("3.1.0-rc.1"), Some((3, 1, 0)));
        assert_eq!(parse_semver_tuple("invalid"), None);

        assert!(is_newer_version("3.1.0", "3.2.0"));
        assert!(is_newer_version("v3.0.0", "v4.0.0"));
        assert!(is_newer_version("3.0.9", "3.0.10"));
        assert!(!is_newer_version("3.2.0", "3.2.0"));
        assert!(!is_newer_version("3.2.0", "3.1.9"));
    }

    #[test]
    fn validates_ai_urls_strictly() {
        assert!(validate_ai_endpoint_url("https://opencode.ai/zen/v1/chat/completions").is_ok());
        assert!(
            validate_ai_endpoint_url("https://api.kilo.ai/api/gateway/chat/completions").is_ok()
        );
        assert!(validate_ai_endpoint_url("http://127.0.0.1:11434/v1/chat/completions").is_ok());
        assert!(validate_ai_endpoint_url("http://evil.example.com/v1").is_err());
        assert!(validate_ai_endpoint_url("file:///etc/passwd").is_err());
    }
}
