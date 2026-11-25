package az.ulduz.attestat

import android.content.Intent
import android.graphics.Color
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.provider.Settings
import android.webkit.JavascriptInterface
import android.webkit.WebView
import androidx.activity.OnBackPressedCallback
import androidx.activity.SystemBarStyle
import androidx.activity.enableEdgeToEdge
import androidx.core.content.FileProvider
import java.io.File

class MainActivity : TauriActivity() {
  private var appWebView: WebView? = null

  private inner class UlduzAndroidBridge {
    @JavascriptInterface
    fun installApk(filePath: String): String {
      return try {
        val target = File(filePath).canonicalFile
        val updatesRoot = File(cacheDir, "updates").canonicalFile
        if (!target.exists() || !target.path.startsWith(updatesRoot.path + File.separator)) {
          return "invalid_path"
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O && !packageManager.canRequestPackageInstalls()) {
          runOnUiThread {
            val permIntent = Intent(
              Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES,
              Uri.parse("package:$packageName")
            ).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            startActivity(permIntent)
          }
          return "permission_required"
        }

        val apkUri = FileProvider.getUriForFile(
          this@MainActivity,
          "$packageName.fileprovider",
          target
        )
        runOnUiThread {
          val installIntent = Intent(Intent.ACTION_VIEW).apply {
            setDataAndType(apkUri, "application/vnd.android.package-archive")
            addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
          }
          startActivity(installIntent)
        }
        "launched"
      } catch (e: Exception) {
        "error:${e.message ?: "install_failed"}"
      }
    }

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
    webView.addJavascriptInterface(UlduzAndroidBridge(), "UlduzAndroid")
    appWebView = webView
  }
}
