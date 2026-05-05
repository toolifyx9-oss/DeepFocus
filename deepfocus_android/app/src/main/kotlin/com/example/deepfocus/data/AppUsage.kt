package com.example.deepfocus.data

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "app_usage")
data class AppUsage(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val packageName: String,
    val date: String, // YYYY-MM-DD
    val usageTime: Long // in milliseconds
)
