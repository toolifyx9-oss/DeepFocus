import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:intl/intl.dart';
import 'package:permission_handler/permission_handler.dart';

void main() {
  runApp(
    ChangeNotifierProvider(
      create: (_) => AppState(),
      child: DeepFocusApp(),
    ),
  );
}

// --- Theme & State Management ---
class AppState extends ChangeNotifier {
  int focusTime = 25 * 60;
  int breakTime = 5 * 60;
  int currentTime = 25 * 60;
  bool isRunning = false;
  bool isBreak = false;
  int streak = 5;
  String currentTask = "Design System";
  
  // Themes
  Color primaryColor = Color(0xFF69DAFF);
  Color surfaceColor = Color(0xFF080E1C);
  
  void toggleTimer() {
    isRunning = !isRunning;
    notifyListeners();
  }

  void resetTimer() {
    isRunning = false;
    currentTime = isBreak ? breakTime : focusTime;
    notifyListeners();
  }

  void tick() {
    if (currentTime > 0) {
      currentTime--;
      notifyListeners();
    } else {
      isRunning = false;
      isBreak = !isBreak;
      currentTime = isBreak ? breakTime : focusTime;
      notifyListeners();
    }
  }
}

// --- Main App Entry ---
class DeepFocusApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final state = Provider.of<AppState>(context);
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData.dark().copyWith(
        scaffoldBackgroundColor: state.surfaceColor,
        textTheme: GoogleFonts.spaceGroteskTextTheme(ThemeData.dark().textTheme),
      ),
      home: MainNavigation(),
    );
  }
}

class MainNavigation extends StatefulWidget {
  @override
  _MainNavigationState createState() => _MainNavigationState();
}

class _MainNavigationState extends State<MainNavigation> {
  int _selectedIndex = 0;
  final List<Widget> _pages = [HomePage(), StatsPage(), SettingsPage()];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(index: _selectedIndex, children: _pages),
      bottomNavigationBar: Container(
        margin: EdgeInsets.only(bottom: 24, left: 40, right: 40),
        padding: EdgeInsets.symmetric(vertical: 10),
        decoration: BoxDecoration(
          color: Color(0xFF12192A).withOpacity(0.9),
          borderRadius: BorderRadius.circular(40),
          border: Border.all(color: Colors.white.withOpacity(0.05)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.5),
              blurRadius: 20,
              offset: Offset(0, 10),
            ),
          ],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            _navItem(Icons.home_filled, "Home", 0),
            _navItem(Icons.bar_chart_rounded, "Stats", 1),
            _navItem(Icons.settings_rounded, "Settings", 2),
          ],
        ),
      ),
    );
  }

  Widget _navItem(IconData icon, String label, int index) {
    bool isActive = _selectedIndex == index;
    return GestureDetector(
      onTap: () => setState(() => _selectedIndex = index),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: isActive ? Color(0xFF69DAFF) : Colors.white38, size: 20),
          Text(label, style: TextStyle(fontSize: 8, color: isActive ? Color(0xFF69DAFF) : Colors.white38, letterSpacing: 1)),
        ],
      ),
    );
  }
}

// --- Home Page (Timer) ---
class HomePage extends StatefulWidget {
  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  Timer? _timer;

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  void _startTimer() {
    final state = Provider.of<AppState>(context, listen: false);
    _timer = Timer.periodic(Duration(seconds: 1), (timer) {
      if (state.isRunning) {
        state.tick();
      }
    });
  }

  @override
  void initState() {
    super.initState();
    _startTimer();
  }

  @override
  Widget build(BuildContext context) {
    final state = Provider.of<AppState>(context);
    String timeStr = "${(state.currentTime ~/ 60).toString().padLeft(2, '0')}:${(state.currentTime % 60).toString().padLeft(2, '0')}";

    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: Text("DeepFocus", style: TextStyle(fontWeight: FontWeight.bold)),
        actions: [
          Padding(
            padding: EdgeInsets.only(right: 20),
            child: Chip(
              backgroundColor: Colors.orange.withOpacity(0.2),
              label: Text("${state.streak} days", style: TextStyle(color: Colors.orange, fontWeight: FontWeight.bold)),
              avatar: Icon(Icons.local_fire_department, color: Colors.orange, size: 16),
            ),
          )
        ],
      ),
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Center(
            child: Stack(
              alignment: Alignment.center,
              children: [
                SizedBox(
                  width: 280,
                  height: 280,
                  child: CircularProgressIndicator(
                    value: state.currentTime / (state.isBreak ? state.breakTime : state.focusTime),
                    strokeWidth: 8,
                    color: Color(0xFF69DAFF),
                    backgroundColor: Colors.white10,
                  ),
                ),
                Column(
                  children: [
                    Text(timeStr, style: TextStyle(fontSize: 64, fontWeight: FontWeight.bold, letterSpacing: -2)),
                    Text(state.isBreak ? "BREAK TIME" : "FOCUS MODE", style: TextStyle(letterSpacing: 4, color: Colors.white38, fontSize: 12)),
                  ],
                ),
              ],
            ),
          ),
          SizedBox(height: 60),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              IconButton(icon: Icon(Icons.refresh), onPressed: state.resetTimer, iconSize: 32),
              SizedBox(width: 32),
              FloatingActionButton.large(
                backgroundColor: Color(0xFF69DAFF),
                onPressed: state.toggleTimer,
                child: Icon(state.isRunning ? Icons.pause : Icons.play_arrow, color: Colors.black, size: 40),
              ),
              SizedBox(width: 32),
              IconButton(icon: Icon(Icons.skip_next), onPressed: () {}, iconSize: 32),
            ],
          ),
        ],
      ),
    );
  }
}

// --- Stats Page ---
class StatsPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text("Performance", style: TextStyle(color: Colors.white38, letterSpacing: 2)),
              Text("3h 45m", style: TextStyle(fontSize: 48, fontWeight: FontWeight.bold)),
              SizedBox(height: 40),
              Expanded(
                child: BarChart(
                  BarChartData(
                    gridData: FlGridData(show: false),
                    borderData: FlBorderData(show: false),
                    titlesData: FlTitlesData(show: false),
                    barGroups: [
                      BarChartGroupData(x: 0, barRods: [BarChartRodData(toY: 8, color: Colors.white10)]),
                      BarChartGroupData(x: 1, barRods: [BarChartRodData(toY: 12, color: Colors.white10)]),
                      BarChartGroupData(x: 2, barRods: [BarChartRodData(toY: 15, color: Color(0xFF69DAFF))]),
                      BarChartGroupData(x: 3, barRods: [BarChartRodData(toY: 10, color: Colors.white10)]),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// --- Settings Page ---
class SettingsPage extends StatefulWidget {
  @override
  _SettingsPageState createState() => _SettingsPageState();
}

class _SettingsPageState extends State<SettingsPage> {
  static const platform = MethodChannel('com.example.deepfocus/service');

  Future<void> _requestUsageAccess() async {
    try {
      await platform.invokeMethod('openUsageSettings');
    } on PlatformException catch (e) {
      debugPrint("Failed to open usage settings: '${e.message}'.");
    }
  }

  Future<void> _requestOverlayPermission() async {
    try {
      await platform.invokeMethod('openOverlaySettings');
    } on PlatformException catch (e) {
      debugPrint("Failed to open overlay settings: '${e.message}'.");
    }
  }

  Future<void> _startFocusMode() async {
    if (await Permission.notification.request().isGranted) {
      try {
        await platform.invokeMethod('startService');
      } on PlatformException catch (e) {
        debugPrint("Failed to start focus service: '${e.message}'.");
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final state = Provider.of<AppState>(context);
    return Scaffold(
      backgroundColor: Color(0xFF0F1115),
      appBar: AppBar(
        title: Text("Settings", style: TextStyle(fontWeight: FontWeight.bold, letterSpacing: 1.2)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
      ),
      body: ListView(
        padding: EdgeInsets.all(20),
        children: [
          // Focus Session Section
          _buildSectionHeader("Focus Session", "Efficiency"),
          Card(
            color: Color(0xFF1A1D23),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            child: Column(
              children: [
                ListTile(
                  leading: Icon(Icons.task_alt, color: Color(0xFF69DAFF)),
                  title: Text("Current Task", style: TextStyle(fontWeight: FontWeight.w600)),
                  subtitle: Text(state.currentTask, style: TextStyle(color: Colors.white60)),
                  trailing: Icon(Icons.edit, size: 18, color: Colors.white38),
                  onTap: () {},
                ),
                Divider(height: 1, color: Colors.white10, indent: 56),
                SwitchListTile(
                  secondary: Icon(Icons.bolt, color: Color(0xFF69DAFF)),
                  title: Text("Deep Work Mode", style: TextStyle(fontWeight: FontWeight.w600)),
                  subtitle: Text("Block all notifications", style: TextStyle(color: Colors.white60)),
                  value: true,
                  onChanged: (v) {},
                  activeColor: Color(0xFF69DAFF),
                ),
              ],
            ),
          ),
          SizedBox(height: 24),

          // Android Permissions Section
          _buildSectionHeader("Android Permissions", "System Access"),
          Card(
            color: Color(0xFF1A1D23),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            child: Column(
              children: [
                ListTile(
                  leading: Icon(Icons.analytics_outlined, color: Color(0xFF69DAFF)),
                  title: Text("Usage Access", style: TextStyle(fontWeight: FontWeight.w600)),
                  subtitle: Text("Required to track apps", style: TextStyle(color: Colors.white60)),
                  onTap: _requestUsageAccess,
                  trailing: Icon(Icons.chevron_right, color: Colors.white38),
                ),
                Divider(height: 1, color: Colors.white10, indent: 56),
                ListTile(
                  leading: Icon(Icons.layers_outlined, color: Color(0xFF69DAFF)),
                  title: Text("Overlay Permission", style: TextStyle(fontWeight: FontWeight.w600)),
                  subtitle: Text("Required to block apps", style: TextStyle(color: Colors.white60)),
                  onTap: _requestOverlayPermission,
                  trailing: Icon(Icons.chevron_right, color: Colors.white38),
                ),
              ],
            ),
          ),
          SizedBox(height: 24),

          // Service Control Section
          _buildSectionHeader("Service Control", "Background Task"),
          Container(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: _startFocusMode,
              icon: Icon(Icons.play_arrow_rounded),
              label: Text("ACTIVATE FOCUS SERVICE", style: TextStyle(fontWeight: FontWeight.bold, letterSpacing: 1.1)),
              style: ElevatedButton.styleFrom(
                backgroundColor: Color(0xFF69DAFF),
                foregroundColor: Colors.black,
                padding: EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                elevation: 4,
                shadowColor: Color(0xFF69DAFF).withOpacity(0.3),
              ),
            ),
          ),
          SizedBox(height: 40),
          
          Center(
            child: Text(
              "v1.0.0 (Stable Build)",
              style: TextStyle(color: Colors.white24, fontSize: 12, fontWeight: FontWeight.w500),
            ),
          ),
          SizedBox(height: 20),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title, String subtitle) {
    return Padding(
      padding: EdgeInsets.only(left: 4, bottom: 12, right: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.between,
        children: [
          Text(
            title,
            style: TextStyle(
              color: Color(0xFF69DAFF),
              fontWeight: FontWeight.bold,
              fontSize: 16,
              letterSpacing: 0.5,
            ),
          ),
          Text(
            subtitle.toUpperCase(),
            style: TextStyle(
              color: Colors.white24,
              fontWeight: FontWeight.bold,
              fontSize: 10,
              letterSpacing: 1.5,
            ),
          ),
        ],
      ),
    );
  }
}
