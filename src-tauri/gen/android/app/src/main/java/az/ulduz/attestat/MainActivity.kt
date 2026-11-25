package az.ulduz.attestat

import android.content.Intent
import android.graphics.Color
import android.net.Uri
import android.os.Bundle
import android.view.View
import android.webkit.JavascriptInterface
import android.webkit.WebView
import androidx.activity.OnBackPressedCallback
import androidx.activity.SystemBarStyle
import androidx.activity.enableEdgeToEdge
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

class MainActivity : TauriActivity() {
  private var appWebView: WebView? = null

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
  }

  override fun onCreate(savedInstanceState: Bundle?) {
    enableEdgeToEdge(
      statusBarStyle = SystemBarStyle.dark(Color.TRANSPARENT),
      navigationBarStyle = SystemBarStyle.dark(Color.TRANSPARENT),
    )
    super.onCreate(savedInstanceState)

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
  }
}
