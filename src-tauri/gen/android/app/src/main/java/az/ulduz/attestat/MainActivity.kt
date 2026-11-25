package az.ulduz.attestat

import android.content.Intent
import android.graphics.Bitmap
import android.graphics.Color
import android.net.Uri
import android.net.http.SslError
import android.os.Build
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.View
import android.webkit.JavascriptInterface
import android.webkit.RenderProcessGoneDetail
import android.webkit.SslErrorHandler
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.OnBackPressedCallback
import androidx.activity.SystemBarStyle
import androidx.activity.enableEdgeToEdge
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.webkit.WebViewCompat
import androidx.webkit.WebViewFeature
import org.json.JSONObject
import java.io.File
import java.io.FileInputStream
import java.util.Locale

class MainActivity : TauriActivity() {
  private var appWebView: WebView? = null

  @Volatile
  private var activeOtaDir: File? = null

  @Volatile
  private var activeOtaVersion: String = ""

  private fun otaRootDir(): File = File(dataDir, "ota")

  private fun parseSemver(raw: String): LongArray? {
    val clean = raw.trim().trimStart('v', 'V').substringBefore('-').substringBefore('+')
    val parts = clean.split('.')
    if (parts.isEmpty()) return null
    val major = parts[0].toLongOrNull() ?: return null
    val minor = parts.getOrNull(1)?.toLongOrNull() ?: 0L
    val patch = parts.getOrNull(2)?.toLongOrNull() ?: 0L
    return longArrayOf(major, minor, patch)
  }

  private fun isNewerSemver(current: String, candidate: String): Boolean {
    val c = parseSemver(current) ?: return false
    val n = parseSemver(candidate) ?: return false
    for (i in 0..2) {
      if (n[i] != c[i]) return n[i] > c[i]
    }
    return false
  }

  private fun writeJsonAtomically(target: File, json: JSONObject) {
    try {
      target.parentFile?.mkdirs()
      val tmp = File(target.parentFile, "${target.name}.tmp")
      tmp.writeText(json.toString(2), Charsets.UTF_8)
      if (!tmp.renameTo(target)) {
        target.writeText(json.toString(2), Charsets.UTF_8)
        tmp.delete()
      }
    } catch (_: Exception) {
      // ignore non-fatal state write error
    }
  }

  /**
   * Resolve active OTA web bundle directory with crash-loop rollback protection.
   * Only serves OTA when DOCUMENT_START_SCRIPT is supported so Tauri IPC stays 100% intact.
   */
  private fun refreshActiveOta(countBootAttempt: Boolean) {
    if (!WebViewFeature.isFeatureSupported(WebViewFeature.DOCUMENT_START_SCRIPT)) {
      activeOtaDir = null
      activeOtaVersion = ""
      return
    }

    val root = otaRootDir()
    val stateFile = File(root, "state.json")
    val active = File(root, "active")

    if (!stateFile.isFile || !File(active, "index.html").isFile || !File(active, "js/app/main.js").isFile) {
      activeOtaDir = null
      activeOtaVersion = ""
      return
    }

    try {
      val st = JSONObject(stateFile.readText(Charsets.UTF_8))
      val otaVer = st.optString("version", "").trim()
      val confirmed = st.optBoolean("confirmed", false)
      val attempts = st.optInt("bootAttempts", 0)

      // If a newer native APK was installed, retire the older OTA bundle automatically
      if (!isNewerSemver(BuildConfig.VERSION_NAME, otaVer)) {
        active.deleteRecursively()
        stateFile.delete()
        activeOtaDir = null
        activeOtaVersion = ""
        return
      }

      // Crash-loop watchdog: if unconfirmed OTA failed to finish JS boot twice, roll back automatically
      if (!confirmed && attempts >= 2) {
        active.deleteRecursively()
        stateFile.delete()
        activeOtaDir = null
        activeOtaVersion = ""
        return
      }

      if (countBootAttempt && !confirmed) {
        st.put("bootAttempts", attempts + 1)
        writeJsonAtomically(stateFile, st)
      }

      activeOtaDir = active.canonicalFile
      activeOtaVersion = otaVer
    } catch (_: Exception) {
      activeOtaDir = null
      activeOtaVersion = ""
    }
  }

  private fun markOtaBootConfirmed(): Boolean {
    val stateFile = File(otaRootDir(), "state.json")
    if (!stateFile.isFile) return false
    return try {
      val st = JSONObject(stateFile.readText(Charsets.UTF_8))
      st.put("confirmed", true)
      st.put("bootAttempts", 0)
      writeJsonAtomically(stateFile, st)
      true
    } catch (_: Exception) {
      false
    }
  }

  private fun mimeForPath(path: String): Pair<String, String?> {
    val ext = path.substringAfterLast('.', "").lowercase(Locale.ROOT)
    return when (ext) {
      "html", "htm" -> "text/html" to "utf-8"
      "js", "mjs" -> "text/javascript" to "utf-8"
      "css" -> "text/css" to "utf-8"
      "json" -> "application/json" to "utf-8"
      "svg" -> "image/svg+xml" to "utf-8"
      "png" -> "image/png" to null
      "jpg", "jpeg" -> "image/jpeg" to null
      "webp" -> "image/webp" to null
      "woff2" -> "font/woff2" to null
      "woff" -> "font/woff" to null
      "ttf" -> "font/ttf" to null
      "txt" -> "text/plain" to "utf-8"
      else -> "application/octet-stream" to null
    }
  }

  private inner class OtaWebViewClient(private val delegate: WebViewClient) : WebViewClient() {
    override fun shouldInterceptRequest(
      view: WebView,
      request: WebResourceRequest
    ): WebResourceResponse? {
      val url = request.url
      val otaBase = activeOtaDir
      if (
        otaBase != null &&
        request.method.equals("GET", ignoreCase = true) &&
        url.host.equals("tauri.localhost", ignoreCase = true)
      ) {
        try {
          val rawPath = url.path ?: "/"
          val rel = rawPath.trimStart('/').ifEmpty { "index.html" }
          if (!rel.contains("..") && !rel.contains('\\')) {
            val candidate = File(otaBase, rel).canonicalFile
            val basePrefix = otaBase.path + File.separator
            if (candidate.path.startsWith(basePrefix) && candidate.isFile) {
              val (mime, encoding) = mimeForPath(rel)
              val headers = mapOf(
                "Cache-Control" to "no-store",
                "Access-Control-Allow-Origin" to "*",
              )
              return WebResourceResponse(
                mime,
                encoding,
                200,
                "OK",
                headers,
                FileInputStream(candidate),
              )
            }
          }
        } catch (_: Exception) {
          // Fall through cleanly to bundled Tauri assets
        }
      }
      return delegate.shouldInterceptRequest(view, request)
    }

    override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean =
      delegate.shouldOverrideUrlLoading(view, request)

    override fun onPageStarted(view: WebView, url: String, favicon: Bitmap?) {
      delegate.onPageStarted(view, url, favicon)
    }

    override fun onPageFinished(view: WebView, url: String) {
      delegate.onPageFinished(view, url)
    }

    override fun doUpdateVisitedHistory(view: WebView, url: String, isReload: Boolean) {
      delegate.doUpdateVisitedHistory(view, url, isReload)
    }

    override fun onReceivedError(view: WebView, request: WebResourceRequest, error: WebResourceError) {
      delegate.onReceivedError(view, request, error)
    }

    override fun onReceivedHttpError(
      view: WebView,
      request: WebResourceRequest,
      errorResponse: WebResourceResponse
    ) {
      delegate.onReceivedHttpError(view, request, errorResponse)
    }

    override fun onReceivedSslError(view: WebView, handler: SslErrorHandler, error: SslError) {
      delegate.onReceivedSslError(view, handler, error)
    }

    override fun onRenderProcessGone(view: WebView, detail: RenderProcessGoneDetail): Boolean {
      return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        delegate.onRenderProcessGone(view, detail)
      } else {
        super.onRenderProcessGone(view, detail)
      }
    }
  }

  private fun installOtaClientIfNeeded(webView: WebView) {
    try {
      val current = WebViewCompat.getWebViewClient(webView)
      if (current is OtaWebViewClient) return
      val hadUrl = !webView.url.isNullOrEmpty()
      webView.webViewClient = OtaWebViewClient(current)
      // If an OTA bundle is active and initial page load started before our wrapper attached, reload once cleanly
      if (hadUrl && activeOtaDir != null) {
        webView.reload()
      }
    } catch (_: Exception) {
      // Keep default Tauri client if WebViewCompat lookup fails
    }
  }

  private inner class UlduzAndroidBridge {
    @JavascriptInterface
    fun openUrl(url: String): Boolean {
      return try {
        val clean = url.trim()
        if (!clean.startsWith("https://") && !clean.startsWith("http://")) return false
        runOnUiThread {
          val intent = Intent(Intent.ACTION_VIEW, Uri.parse(clean))
            .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
          startActivity(intent)
        }
        true
      } catch (_: Exception) {
        false
      }
    }

    @JavascriptInterface
    fun getActiveOtaVersion(): String = activeOtaVersion

    @JavascriptInterface
    fun confirmOtaBoot(): Boolean = markOtaBootConfirmed()

    @JavascriptInterface
    fun reloadApp(): Boolean {
      return try {
        refreshActiveOta(countBootAttempt = true)
        runOnUiThread {
          val wv = appWebView
          if (wv != null) {
            installOtaClientIfNeeded(wv)
            wv.clearCache(true)
            val cur = wv.url
            if (!cur.isNullOrEmpty() && cur.contains("tauri.localhost", ignoreCase = true)) {
              wv.reload()
            } else {
              wv.loadUrl("http://tauri.localhost/")
            }
          }
        }
        true
      } catch (_: Exception) {
        false
      }
    }
  }

  override fun onCreate(savedInstanceState: Bundle?) {
    enableEdgeToEdge(
      statusBarStyle = SystemBarStyle.dark(Color.TRANSPARENT),
      navigationBarStyle = SystemBarStyle.dark(Color.TRANSPARENT),
    )
    super.onCreate(savedInstanceState)

    refreshActiveOta(countBootAttempt = true)

    // Reserve exact native padding for status bar, camera notch/cutout (portrait & landscape)
    // and system gesture navigation bar — fixes Xiaomi MIUI / HyperOS & Android 15+ overlap.
    val contentView = findViewById<View>(android.R.id.content)
    contentView.setBackgroundColor(Color.parseColor("#0C0C0E"))
    ViewCompat.setOnApplyWindowInsetsListener(contentView) { v, insets ->
      val bars = insets.getInsets(
        WindowInsetsCompat.Type.systemBars() or WindowInsetsCompat.Type.displayCutout()
      )
      v.setPadding(bars.left, bars.top, bars.right, bars.bottom)
      WindowInsetsCompat.CONSUMED
    }
    ViewCompat.requestApplyInsets(contentView)

    val backCallback = object : OnBackPressedCallback(true) {
      override fun handleOnBackPressed() {
        val webView = appWebView
        if (webView == null) {
          isEnabled = false
          onBackPressedDispatcher.onBackPressed()
          isEnabled = true
          return
        }

        webView.evaluateJavascript(
          "(Boolean(window.__ULDUZ_HANDLE_BACK__ && window.__ULDUZ_HANDLE_BACK__()))"
        ) { result ->
          val handled = result?.trim()?.removeSurrounding("\"") == "true"
          if (!handled) {
            isEnabled = false
            onBackPressedDispatcher.onBackPressed()
            isEnabled = true
          }
        }
      }
    }

    onBackPressedDispatcher.addCallback(this, backCallback)
  }

  override fun onWebViewCreate(webView: WebView) {
    super.onWebViewCreate(webView)
    webView.setBackgroundColor(Color.parseColor("#0C0C0E"))
    webView.settings.mediaPlaybackRequiresUserGesture = false
    webView.settings.domStorageEnabled = true
    webView.addJavascriptInterface(UlduzAndroidBridge(), "UlduzAndroid")
    appWebView = webView

    // wry attaches RustWebViewClient synchronously right after setWebView/onWebViewCreate;
    // postAtFrontOfQueue wraps it cleanly right before queued loadUrl runs.
    Handler(Looper.getMainLooper()).postAtFrontOfQueue {
      installOtaClientIfNeeded(webView)
    }
  }
}
