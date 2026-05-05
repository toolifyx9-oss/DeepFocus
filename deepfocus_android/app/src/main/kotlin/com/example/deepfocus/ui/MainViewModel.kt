package com.example.deepfocus.ui

import android.app.Application
import androidx.lifecycle.*
import com.example.deepfocus.data.AppDatabase
import com.example.deepfocus.data.BlockedApp
import kotlinx.coroutines.launch

class MainViewModel(application: Application) : AndroidViewModel(application) {

    private val db = AppDatabase.getDatabase(application)
    private val dao = db.appDao()

    val blockedApps: LiveData<List<BlockedApp>> = dao.getAllBlockedApps().asLiveData()

    fun addBlockedApp(packageName: String, appName: String) {
        viewModelScope.launch {
            dao.insertBlockedApp(BlockedApp(packageName, appName))
        }
    }

    fun removeBlockedApp(packageName: String) {
        viewModelScope.launch {
            dao.deleteBlockedApp(BlockedApp(packageName, "", false))
        }
    }
}
