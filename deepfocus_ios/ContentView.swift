import SwiftUI

struct ContentView: View {
    @StateObject private var timerManager = TimerManager()
    @State private var showPermissionAlert = false
    
    var body: some View {
        ZStack {
            Color.black.ignoresSafeArea()
            
            VStack(spacing: 40) {
                Text("DeepFocus")
                    .font(.system(size: 40, weight: .bold, design: .rounded))
                    .foregroundColor(.red)
                
                ZStack {
                    Circle()
                        .stroke(Color.red.opacity(0.2), lineWidth: 10)
                    
                    Circle()
                        .trim(from: 0, to: CGFloat(timerManager.timeLeft / (25 * 60)))
                        .stroke(Color.red, style: StrokeStyle(lineWidth: 10, lineCap: .round))
                        .rotationEffect(.degrees(-90))
                        .animation(.linear, value: timerManager.timeLeft)
                    
                    Text(timerManager.formatTime(timerManager.timeLeft > 0 ? timerManager.timeLeft : 25 * 60))
                        .font(.system(size: 60, weight: .thin, design: .monospaced))
                        .foregroundColor(.white)
                }
                .frame(width: 280, height: 280)
                
                HStack(spacing: 30) {
                    Button(action: {
                        timerManager.stopTimer()
                    }) {
                        Image(systemName: "arrow.clockwise")
                            .font(.title)
                            .foregroundColor(.white.opacity(0.5))
                            .frame(width: 60, height: 60)
                            .background(Circle().fill(Color.white.opacity(0.1)))
                    }
                    
                    Button(action: {
                        if timerManager.isRunning {
                            timerManager.stopTimer()
                        } else {
                            checkPermissionsAndStart()
                        }
                    }) {
                        Image(systemName: timerManager.isRunning ? "pause.fill" : "play.fill")
                            .font(.largeTitle)
                            .foregroundColor(.white)
                            .frame(width: 90, height: 90)
                            .background(Circle().fill(Color.red))
                            .shadow(color: .red.opacity(0.4), radius: 10)
                    }
                }
            }
            .padding()
        }
        .onReceive(NotificationCenter.default.publisher(for: UIApplication.willEnterForegroundNotification)) { _ in
            timerManager.updateTime()
        }
    }
    
    private func checkPermissionsAndStart() {
        UNUserNotificationCenter.current().getNotificationSettings { settings in
            DispatchQueue.main.async {
                if settings.authorizationStatus == .authorized {
                    timerManager.startTimer(duration: 25 * 60)
                } else if settings.authorizationStatus == .notDetermined {
                    requestPermissions()
                } else {
                    showPermissionAlert = true
                }
            }
        }
    }
    
    private func requestPermissions() {
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound, .badge]) { granted, _ in
            if granted {
                DispatchQueue.main.async {
                    timerManager.startTimer(duration: 25 * 60)
                }
            }
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
