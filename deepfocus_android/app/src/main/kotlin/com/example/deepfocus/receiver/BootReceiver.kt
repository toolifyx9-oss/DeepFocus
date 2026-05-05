package com.example.deepfocus.receiver

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import com.example.deepfocus.service.FocusService

class BootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == Intent.ACTION_BOOT_COMPLETED) {
            val prefs = context.getSharedPreferences("deepfocus_prefs", Context.MODE_PRIVATE)
            val isRunning = prefs.getBoolean("is_running", false)
            val startTime = prefs.getLong("start_time", 0L)
            val totalDuration = prefs.getLong("total_duration", 0L)
            
            if (isRunning && startTime > 0 && totalDuration > 0) {
                val elapsed = System.currentTimeMillis() - startTime
                if (elapsed < totalDuration) {
                    // Still have time left, restart service
                    val serviceIntent = Intent(context, FocusService::class.java)
                    context.startForegroundService(serviceIntent)
                } else {
                    // Time already passed, clear state
                    prefs.edit().putBoolean("is_running", false).apply()
                }
            }
        }
    }
}
