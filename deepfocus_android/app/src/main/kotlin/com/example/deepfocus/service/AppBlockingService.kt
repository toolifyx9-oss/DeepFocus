package com.example.deepfocus.service

import android.accessibilityservice.AccessibilityService
import android.content.Context
import android.content.Intent
import android.view.accessibility.AccessibilityEvent
import com.example.deepfocus.data.AppDatabase
import com.example.deepfocus.ui.BlockingActivity
import kotlinx.coroutines.*

class AppBlockingService : AccessibilityService() {

    private val serviceScope = CoroutineScope(Dispatchers.IO + SupervisorJob())
    private var blockedApps = setOf<String>()
    private var lastBlockedPackage = ""
    private var lastBlockTime = 0L

    override fun onServiceConnected() {
        super.onServiceConnected()
        
        // Load blocked apps with a more robust flow
        serviceScope.launch {
            val db = AppDatabase.getDatabase(this@AppBlockingService)
            db.appDao().getAllBlockedApps().collect { apps ->
                blockedApps = apps.map { it.packageName }.toSet()
            }
        }
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent) {
        // Instant check from SharedPreferences on every event that might indicate an app change
        val prefs = getSharedPreferences("deepfocus_prefs", Context.MODE_PRIVATE)
        val isFocusActive = prefs.getBoolean("is_running", false)
        
        if (!isFocusActive) return

        // We check on window changes AND content changes for maximum reliability
        if (event.eventType == AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED || 
            event.eventType == AccessibilityEvent.TYPE_WINDOWS_CHANGED) {
            
            val packageName = event.packageName?.toString() ?: return
            
            // Skip if it's our own app or the blocking activity
            if (packageName == "com.example.deepfocus") return

            if (blockedApps.contains(packageName)) {
                // Determine remaining time
                val startTime = prefs.getLong("start_time", 0L)
                val totalDuration = prefs.getLong("total_duration", 0L)
                val elapsed = System.currentTimeMillis() - startTime
                val remaining = (totalDuration - elapsed).coerceAtLeast(0)

                if (remaining <= 0) return

                // Debounce blocking to prevent multiple intents for the same app opening too fast
                val currentTime = System.currentTimeMillis()
                if (packageName == lastBlockedPackage && currentTime - lastBlockTime < 500) {
                    return
                }

                lastBlockedPackage = packageName
                lastBlockTime = currentTime

                // Execute block - extreme priority
                val intent = Intent(this, BlockingActivity::class.java).apply {
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                    addFlags(Intent.FLAG_ACTIVITY_REORDER_TO_FRONT)
                    addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)
                    addFlags(Intent.FLAG_ACTIVITY_NO_ANIMATION)
                    putExtra("REMAINING_TIME", remaining)
                }
                startActivity(intent)
            }
        }
    }

    override fun onInterrupt() {}

    override fun onDestroy() {
        super.onDestroy()
        serviceScope.cancel()
    }
}
