package com.example.deepfocus

import android.app.Application
import android.app.NotificationChannel
import android.app.NotificationManager
import android.os.Build
import com.example.deepfocus.data.AppDatabase

class DeepFocusApp : Application() {

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
        AppDatabase.getDatabase(this)
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val name = "Focus Mode"
            val descriptionText = "Notifications for active focus sessions"
            val importance = NotificationManager.IMPORTANCE_LOW
            val channel = NotificationChannel("focus_channel", name, importance).apply {
                description = descriptionText
            }
            val notificationManager: NotificationManager =
                getSystemService(NotificationManager::class.java)
            notificationManager.createNotificationChannel(channel)
        }
    }
}
