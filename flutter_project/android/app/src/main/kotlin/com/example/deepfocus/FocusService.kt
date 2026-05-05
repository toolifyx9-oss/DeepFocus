package com.example.deepfocus

import android.app.*
import android.app.usage.UsageStatsManager
import android.content.*
import android.os.*
import androidx.core.app.NotificationCompat

class FocusService : Service() {
    private val handler = Handler(Looper.getMainLooper())
    private val blockedPackages = listOf("com.instagram.android", "com.facebook.katana", "com.twitter.android", "com.tiktok.android")
    
    private val checkRunnable = object : Runnable {
        override fun run() {
            checkTopApp()
            handler.postDelayed(this, 1500) // 1.5 second interval
        }
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        createNotificationChannel()
        val notification = NotificationCompat.Builder(this, "focus_channel")
            .setContentTitle("DeepFocus Active")
            .setContentText("Protecting your focus sessions...")
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .build()
        
        startForeground(1, notification)
        handler.post(checkRunnable)
        return START_STICKY
    }

    private fun checkTopApp() {
        val usm = getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
        val time = System.currentTimeMillis()
        val stats = usm.queryUsageStats(UsageStatsManager.INTERVAL_DAILY, time - 1000 * 10, time)
        
        if (stats != null && stats.isNotEmpty()) {
            val topApp = stats.maxByOrNull { it.lastTimeUsed }?.packageName
            if (blockedPackages.contains(topApp)) {
                val intent = Intent(this, BlockingActivity::class.java)
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                startActivity(intent)
            }
        }
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel("focus_channel", "Focus Service", NotificationManager.IMPORTANCE_LOW)
            val manager = getSystemService(NotificationManager::class.java)
            manager?.createNotificationChannel(channel)
        }
    }

    override fun onBind(intent: Intent?) = null
}
