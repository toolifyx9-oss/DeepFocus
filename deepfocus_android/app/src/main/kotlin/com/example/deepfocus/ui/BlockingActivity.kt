package com.example.deepfocus.ui

import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.os.Bundle
import android.view.WindowManager
import android.widget.Button
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.example.deepfocus.R
import com.example.deepfocus.service.FocusService
import kotlinx.coroutines.*

class BlockingActivity : AppCompatActivity() {

    private val activityScope = CoroutineScope(Dispatchers.Main + SupervisorJob())
    private lateinit var prefs: SharedPreferences

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Full screen and on top of everything
        window.addFlags(WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED)
        window.addFlags(WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD)
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
        window.addFlags(WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON)
        
        setContentView(R.layout.activity_blocking)

        prefs = getSharedPreferences("deepfocus_prefs", Context.MODE_PRIVATE)
        
        setupUI()
        startTimerUpdate()
    }

    private fun setupUI() {
        val btnReturn = findViewById<Button>(R.id.btn_back_to_app)
        btnReturn.setOnClickListener {
            val intent = Intent(this, MainActivity::class.java).apply {
                addFlags(Intent.FLAG_ACTIVITY_REORDER_TO_FRONT)
            }
            startActivity(intent)
            finish()
        }

        val btnExit = findViewById<Button>(R.id.btn_exit_focus)
        btnExit.setOnClickListener {
            // In a real app, show PIN dialog here
            stopFocusService()
            finish()
        }
    }

    private fun stopFocusService() {
        val intent = Intent(this, FocusService::class.java).apply {
            action = "STOP_SERVICE"
        }
        startService(intent)
    }

    private fun startTimerUpdate() {
        activityScope.launch {
            while (isActive) {
                val startTime = prefs.getLong("start_time", 0L)
                val totalDuration = prefs.getLong("total_duration", 0L)
                val isRunning = prefs.getBoolean("is_running", false)
                
                if (isRunning && startTime > 0) {
                    val elapsed = System.currentTimeMillis() - startTime
                    val remaining = (totalDuration - elapsed).coerceAtLeast(0)
                    
                    findViewById<TextView>(R.id.tv_blocking_timer).text = formatTime(remaining)
                    
                    if (remaining <= 0) {
                        finish()
                    }
                } else {
                    finish()
                }
                delay(1000)
            }
        }
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

    override fun onBackPressed() {
        // Disable back button to prevent easy bypass
    }

    override fun onDestroy() {
        super.onDestroy()
        activityScope.cancel()
    }
}
