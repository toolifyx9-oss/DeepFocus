package com.example.deepfocus.service

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import com.example.deepfocus.util.NotificationHelper

class TimerReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == "TIMER_FINISHED") {
            val notificationHelper = NotificationHelper(context)
            notificationHelper.sendCompletionNotification()
            
            // Stop the service if it's still running
            val serviceIntent = Intent(context, FocusService::class.java).apply {
                action = "STOP_SERVICE"
            }
            context.stopService(serviceIntent)
        }
    }
}
