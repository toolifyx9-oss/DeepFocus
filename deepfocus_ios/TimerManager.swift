import Foundation
import UserNotifications
import Combine

class TimerManager: ObservableObject {
    @Published var timeLeft: TimeInterval = 0
    @Published var isRunning = false
    
    private var startTime: Date?
    private var totalDuration: TimeInterval = 0
    private var timer: AnyCancellable?
    
    private let userDefaults = UserDefaults.standard
    private let startTimeKey = "timer_start_time"
    private let durationKey = "timer_total_duration"
    private let isRunningKey = "timer_is_running"
    
    init() {
        restoreState()
    }
    
    func startTimer(duration: TimeInterval) {
        let now = Date()
        startTime = now
        totalDuration = duration
        isRunning = true
        timeLeft = duration
        
        saveState()
        scheduleNotification(at: now.addingTimeInterval(duration))
        startLoop()
    }
    
    func stopTimer() {
        isRunning = false
        startTime = nil
        timer?.cancel()
        cancelNotification()
        saveState()
    }
    
    private func startLoop() {
        timer?.cancel()
        timer = Timer.publish(every: 1, on: .main, in: .common)
            .autoconnect()
            .sink { [weak self] _ in
                self?.updateTime()
            }
    }
    
    func updateTime() {
        guard let start = startTime, isRunning else { return }
        let elapsed = Date().timeIntervalSince(start)
        let remaining = totalDuration - elapsed
        
        if remaining <= 0 {
            timeLeft = 0
            stopTimer()
        } else {
            timeLeft = remaining
        }
    }
    
    private func saveState() {
        userDefaults.set(startTime, forKey: startTimeKey)
        userDefaults.set(totalDuration, forKey: durationKey)
        userDefaults.set(isRunning, forKey: isRunningKey)
    }
    
    private func restoreState() {
        isRunning = userDefaults.bool(forKey: isRunningKey)
        if isRunning {
            startTime = userDefaults.object(forKey: startTimeKey) as? Date
            totalDuration = userDefaults.double(forKey: durationKey)
            updateTime()
            if timeLeft > 0 {
                startLoop()
            } else {
                stopTimer()
            }
        }
    }
    
    private func scheduleNotification(at date: Date) {
        let content = UNMutableNotificationContent()
        content.title = "Focus Session Completed! 🎉"
        content.body = "Great job staying focused. Take a break!"
        content.sound = .default
        
        let components = Calendar.current.dateComponents([.year, .month, .day, .hour, .minute, .second], from: date)
        let trigger = UNCalendarNotificationTrigger(dateMatching: components, repeats: false)
        
        let request = UNNotificationRequest(identifier: "timer_finished", content: content, trigger: trigger)
        UNUserNotificationCenter.current().add(request)
    }
    
    private func cancelNotification() {
        UNUserNotificationCenter.current().removePendingNotificationRequests(withIdentifiers: ["timer_finished"])
    }
    
    func formatTime(_ seconds: TimeInterval) -> String {
        let formatter = DateComponentsFormatter()
        formatter.allowedUnits = seconds >= 3600 ? [.hour, .minute, .second] : [.minute, .second]
        formatter.unitsStyle = .positional
        formatter.zeroFormattingBehavior = .pad
        return formatter.string(from: seconds) ?? "00:00"
    }
}
