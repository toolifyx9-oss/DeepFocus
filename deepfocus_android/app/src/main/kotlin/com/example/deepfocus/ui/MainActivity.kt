package com.example.deepfocus.ui

import android.app.AlertDialog
import android.app.AppOpsManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.provider.Settings
import android.text.TextUtils
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.example.deepfocus.R
import com.example.deepfocus.service.AppBlockingService
import com.example.deepfocus.service.FocusService
import kotlinx.coroutines.*

import android.webkit.JavascriptInterface
import android.webkit.WebView
import android.webkit.WebViewClient
import com.example.deepfocus.util.PermissionManager
import org.json.JSONObject

class MainActivity : AppCompatActivity() {

    private val viewModel: MainViewModel by viewModels()
    private lateinit var prefs: SharedPreferences
    private val activityScope = CoroutineScope(Dispatchers.Main + SupervisorJob())
    private lateinit var webView: WebView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        prefs = getSharedPreferences("deepfocus_prefs", Context.MODE_PRIVATE)
        
        setupWebView()
        requestNotificationPermission()
        checkPermissions()
        requestIgnoreBatteryOptimizations()
        setupUI()
        startUIUpdateLoop()
    }

    private fun setupWebView() {
        webView = findViewById(R.id.webview)
        webView.settings.javaScriptEnabled = true
        webView.settings.domStorageEnabled = true
        webView.webViewClient = WebViewClient()
        webView.addJavascriptInterface(DeepFocusBridge(), "DeepFocusNative")
        
        // In a real app, this would be the deployed URL or a local asset
        // For development, we can try to point to the dev server if it's reachable,
        // but for now we'll just prepare the bridge.
        webView.visibility = android.view.View.VISIBLE
        webView.loadUrl("https://ais-dev-rl4jpkofeohvahur57mfm2-17769890707.asia-southeast1.run.app")
    }

    inner class DeepFocusBridge {
        @JavascriptInterface
        fun getPermissionStatus(): String {
            val status = JSONObject().apply {
                put("usageAccess", PermissionManager.hasUsageStatsPermission(this@MainActivity))
                put("accessibility", PermissionManager.isAccessibilityServiceEnabled(this@MainActivity))
                put("overlay", PermissionManager.hasOverlayPermission(this@MainActivity))
                put("notification", PermissionManager.hasNotificationPermission(this@MainActivity))
                put("battery", PermissionManager.isIgnoringBatteryOptimizations(this@MainActivity))
            }
            return status.toString()
        }

        @JavascriptInterface
        fun requestUsageAccess() {
            PermissionManager.requestUsageStats(this@MainActivity)
        }

        @JavascriptInterface
        fun requestAccessibility() {
            PermissionManager.requestAccessibilityService(this@MainActivity)
        }

        @JavascriptInterface
        fun requestOverlay() {
            PermissionManager.requestOverlayPermission(this@MainActivity)
        }

        @JavascriptInterface
        fun requestBatteryOptimization() {
            PermissionManager.requestIgnoreBatteryOptimizations(this@MainActivity)
        }

        @JavascriptInterface
        fun requestNotification() {
            activityScope.launch {
                requestNotificationPermission()
            }
        }

        @JavascriptInterface
        fun startFocus(durationMinutes: Int) {
            activityScope.launch {
                startFocusSession(durationMinutes * 60 * 1000L)
            }
        }

        @JavascriptInterface
        fun stopFocus() {
            activityScope.launch {
                stopFocusSession()
            }
        }
    }

    private fun requestNotificationPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(this, android.Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                // Show explanation first
                AlertDialog.Builder(this)
                    .setTitle("Notifications Required")
                    .setMessage("DeepFocus needs notification permission to show the timer and alert you when your session is finished.")
                    .setPositiveButton("Grant") { _, _ ->
                        ActivityCompat.requestPermissions(this, arrayOf(android.Manifest.permission.POST_NOTIFICATIONS), 102)
                    }
                    .setNegativeButton("Later", null)
                    .show()
            }
        }
    }

    private fun checkPermissions() {
        if (!hasUsageStatsPermission()) {
            Toast.makeText(this, "Please enable Usage Access", Toast.LENGTH_LONG).show()
            startActivity(Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS))
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(this)) {
            Toast.makeText(this, "Please enable Overlay Permission", Toast.LENGTH_LONG).show()
            val intent = Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, Uri.parse("package:$packageName"))
            startActivity(intent)
        }

        if (!isAccessibilityServiceEnabled()) {
            AlertDialog.Builder(this)
                .setTitle("Accessibility Service Required")
                .setMessage("DeepFocus needs the Accessibility Service to reliably block distracting apps. Please enable 'DeepFocus Blocker' in the settings.")
                .setPositiveButton("Enable") { _, _ ->
                    startActivity(Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS))
                }
                .setNegativeButton("Later", null)
                .show()
        }
    }

    private fun requestIgnoreBatteryOptimizations() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            val pm = getSystemService(Context.POWER_SERVICE) as android.os.PowerManager
            if (!pm.isIgnoringBatteryOptimizations(packageName)) {
                AlertDialog.Builder(this)
                    .setTitle("Background Reliability")
                    .setMessage("To ensure the timer runs accurately in the background, please exclude DeepFocus from battery optimizations.")
                    .setPositiveButton("Configure") { _, _ ->
                        val intent = Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS).apply {
                            data = Uri.parse("package:$packageName")
                        }
                        startActivity(intent)
                    }
                    .setNegativeButton("Ignore", null)
                    .show()
            }
        }
    }

    private fun isAccessibilityServiceEnabled(): Boolean {
        val expectedComponentName = ComponentName(this, AppBlockingService::class.java)
        val enabledServices = Settings.Secure.getString(contentResolver, Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES) ?: return false
        val colonSplitter = TextUtils.SimpleStringSplitter(':')
        colonSplitter.setString(enabledServices)
        while (colonSplitter.hasNext()) {
            val componentNameString = colonSplitter.next()
            val enabledService = ComponentName.unflattenFromString(componentNameString)
            if (enabledService != null && enabledService == expectedComponentName) return true
        }
        return false
    }

    private fun hasUsageStatsPermission(): Boolean {
        val appOps = getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager
        val mode = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            appOps.unsafeCheckOpNoThrow(AppOpsManager.OPSTR_GET_USAGE_STATS, android.os.Process.myUid(), packageName)
        } else {
            appOps.checkOpNoThrow(AppOpsManager.OPSTR_GET_USAGE_STATS, android.os.Process.myUid(), packageName)
        }
        return mode == AppOpsManager.MODE_ALLOWED
    }

    private fun setupUI() {
        val btnStartFocus = findViewById<Button>(R.id.btn_start_focus)
        btnStartFocus.setOnClickListener {
            if (hasUsageStatsPermission() && (Build.VERSION.SDK_INT < Build.VERSION_CODES.M || Settings.canDrawOverlays(this))) {
                startFocusSession(25 * 60 * 1000L) // 25 minutes
            } else {
                checkPermissions()
            }
        }

        val btnStopFocus = findViewById<Button>(R.id.btn_stop_focus)
        btnStopFocus.setOnClickListener {
            stopFocusSession()
        }
    }

    private fun startUIUpdateLoop() {
        activityScope.launch {
            while (isActive) {
                val isRunning = prefs.getBoolean("is_running", false)
                if (isRunning) {
                    val startTime = prefs.getLong("start_time", 0L)
                    val totalDuration = prefs.getLong("total_duration", 0L)
                    val elapsed = System.currentTimeMillis() - startTime
                    val remaining = (totalDuration - elapsed).coerceAtLeast(0)
                    
                    findViewById<TextView>(R.id.tv_main_timer).text = formatTime(remaining)
                    
                    if (remaining <= 0) {
                        prefs.edit().putBoolean("is_running", false).apply()
                    }
                } else {
                    findViewById<TextView>(R.id.tv_main_timer).text = "25:00"
                }
                delay(1000)
            }
        }
    }

    private fun startFocusSession(durationMillis: Long) {
        val intent = Intent(this, FocusService::class.java).apply {
            putExtra("DURATION", durationMillis)
        }
        startForegroundService(intent)
        Toast.makeText(this, "Focus Mode Started! 🔒", Toast.LENGTH_SHORT).show()
    }

    private fun stopFocusSession() {
        val intent = Intent(this, FocusService::class.java).apply {
            action = "STOP_SERVICE"
        }
        startService(intent)
        Toast.makeText(this, "Focus Mode Stopped", Toast.LENGTH_SHORT).show()
    }

    private fun formatTime(millis: Long): String {
        val seconds = (millis / 1000) % 60
        val minutes = (millis / (1000 * 60)) % 60
        val hours = (millis / (1000 * 60 * 60))
        return if (hours > 0) {
            String.format("%02d:%02d:%02d", hours, minutes, seconds)
        } else {
            String.format("%02d:%02d", minutes, seconds)
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        activityScope.cancel()
    }
}
