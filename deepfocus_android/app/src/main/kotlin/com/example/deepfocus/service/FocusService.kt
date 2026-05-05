package com.example.deepfocus.service

import android.app.*
import android.app.usage.UsageStatsManager
import android.content.*
import android.os.*
import androidx.core.app.NotificationCompat
import com.example.deepfocus.R
import com.example.deepfocus.data.AppDatabase
import com.example.deepfocus.ui.BlockingActivity
import kotlinx.coroutines.*
import java.util.*

class FocusService : Service() {

    private val serviceScope = CoroutineScope(Dispatchers.IO + SupervisorJob())
    private var isRunning = false
    private var startTimeMillis = 0L
    private var totalDurationMillis = 0L
    private var blockedApps = setOf<String>()
    private lateinit var notificationHelper: NotificationHelper
    private lateinit var prefs: SharedPreferences

    override fun onCreate() {
        super.onCreate()
        notificationHelper = NotificationHelper(this)
        prefs = getSharedPreferences("deepfocus_prefs", Context.MODE_PRIVATE)
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val action = intent?.action
        if (action == "STOP_SERVICE") {
            stopFocusSession()
            return START_NOT_STICKY
        }

        val duration = intent?.getLongExtra("DURATION", 0L) ?: 0L
        
        if (!isRunning) {
            if (duration > 0) {
                startFocusSession(duration)
            } else {
                // Try to restore from prefs (e.g. after reboot)
                val savedStartTime = prefs.getLong("start_time", 0L)
                val savedDuration = prefs.getLong("total_duration", 0L)
                val wasRunning = prefs.getBoolean("is_running", false)
                
                if (wasRunning && savedStartTime > 0 && savedDuration > 0) {
                    val elapsed = System.currentTimeMillis() - savedStartTime
                    if (elapsed < savedDuration) {
                        startTimeMillis = savedStartTime
                        totalDurationMillis = savedDuration
                        isRunning = true
                        
                        startForeground(NotificationHelper.NOTIFICATION_ID, notificationHelper.createForegroundNotification(formatTime(totalDurationMillis - elapsed)))
                        startMonitoring()
                        startTimerLoop()
                        // No need to reschedule alarm if it's already set (AlarmManager persists through reboots if handled correctly, 
                        // but actually we should reschedule it to be safe)
                        scheduleCompletionAlarm(startTimeMillis + totalDurationMillis)
                    } else {
                        stopFocusSession()
                    }
                } else {
                    stopSelf()
                }
            }
        } else if (isRunning) {
            // Service already running, just update notification
            updateForegroundNotification()
        }

        return START_STICKY
    }

    private fun startFocusSession(duration: Long) {
        isRunning = true
        startTimeMillis = System.currentTimeMillis()
        totalDurationMillis = duration

        // Persist state
        prefs.edit().apply {
            putLong("start_time", startTimeMillis)
            putLong("total_duration", totalDurationMillis)
            putBoolean("is_running", true)
            apply()
        }

        startForeground(NotificationHelper.NOTIFICATION_ID, notificationHelper.createForegroundNotification(formatTime(totalDurationMillis)))
        startMonitoring()
        startTimerLoop()
        scheduleCompletionAlarm(startTimeMillis + totalDurationMillis)
    }

    private fun stopFocusSession() {
        isRunning = false
        prefs.edit().putBoolean("is_running", false).apply()
        cancelCompletionAlarm()
        stopForeground(true)
        stopSelf()
    }

    private fun startMonitoring() {
        // We no longer need to poll UsageStatsManager here because 
        // AppBlockingService (AccessibilityService) provides instant and robust blocking.
        // We just need to load blocked apps into memory if needed, 
        // but FocusService mostly just manages the session state.
        
        serviceScope.launch {
            val db = AppDatabase.getDatabase(this@FocusService)
            db.appDao().getAllBlockedApps().collect { apps ->
                blockedApps = apps.map { it.packageName }.toSet()
            }
        }
    }

    private fun startTimerLoop() {
        serviceScope.launch {
            while (isRunning) {
                val currentTime = System.currentTimeMillis()
                val elapsed = currentTime - startTimeMillis
                val remaining = totalDurationMillis - elapsed
                
                if (remaining <= 0) {
                    withContext(Dispatchers.Main) {
                        onTimerFinished()
                    }
                    break
                }
                
                // Update SharedPreferences periodically to ensure sync with other components
                if (elapsed % 5000 < 1000) {
                    prefs.edit().putLong("last_update", currentTime).apply()
                }

                updateForegroundNotification(formatTime(remaining))
                delay(1000)
            }
        }
    }

    private fun onTimerFinished() {
        isRunning = false
        prefs.edit().putBoolean("is_running", false).apply()
        notificationHelper.sendCompletionNotification()
        stopForeground(false)
        stopSelf()
    }

    private fun updateForegroundNotification(content: String? = null) {
        val elapsed = System.currentTimeMillis() - startTimeMillis
        val remaining = (totalDurationMillis - elapsed).coerceAtLeast(0)
        val text = content ?: formatTime(remaining)
        
        val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        notificationManager.notify(NotificationHelper.NOTIFICATION_ID, notificationHelper.createForegroundNotification(text))
    }

    private fun scheduleCompletionAlarm(triggerAtMillis: Long) {
        val alarmManager = getSystemService(Context.ALARM_SERVICE) as AlarmManager
        val intent = Intent(this, TimerReceiver::class.java).apply {
            action = "TIMER_FINISHED"
        }
        val pendingIntent = PendingIntent.getBroadcast(this, 0, intent, PendingIntent.FLAG_IMMUTABLE)
        
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerAtMillis, pendingIntent)
        } else {
            alarmManager.setExact(AlarmManager.RTC_WAKEUP, triggerAtMillis, pendingIntent)
        }
    }

    private fun cancelCompletionAlarm() {
        val alarmManager = getSystemService(Context.ALARM_SERVICE) as AlarmManager
        val intent = Intent(this, TimerReceiver::class.java).apply {
            action = "TIMER_FINISHED"
        }
        val pendingIntent = PendingIntent.getBroadcast(this, 0, intent, PendingIntent.FLAG_IMMUTABLE)
        alarmManager.cancel(pendingIntent)
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
        isRunning = false
        serviceScope.cancel()
    }

    override fun onBind(intent: Intent?) = null
}
