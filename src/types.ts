import { format, subDays, isSameDay, startOfDay } from 'date-fns';

export interface StudySession {
  id: string;
  startTime: number;
  duration: number; // in seconds
  type: 'focus' | 'break';
  taskName?: string;
}

export interface UserStats {
  totalFocusTime: number; // total seconds today
  streak: number;
  lastStudyDate: string | null; // YYYY-MM-DD
  dailyHistory: { [date: string]: number }; // date string -> total seconds
  sessions: StudySession[];
}

export interface AppSettings {
  focusDuration: number; // in minutes
  breakDuration: number; // in minutes
  soundEnabled: boolean;
  hapticEnabled: boolean;
  theme: 'obsidian' | 'midnight' | 'nebula' | 'solar' | 'crimson';
  appearanceMode: 'dark' | 'system';
  blockedApps: string[];
  currentTask: string;
  nextBreakAction: string;
  isPremium: boolean;
  permissions: {
    usageAccess: boolean;
    accessibility: boolean;
    overlay: boolean;
    notification: boolean;
    battery: boolean;
  };
}

export const DEFAULT_SETTINGS: AppSettings = {
  focusDuration: 25,
  breakDuration: 5,
  soundEnabled: true,
  hapticEnabled: true,
  theme: 'obsidian',
  appearanceMode: 'system',
  blockedApps: [],
  currentTask: '',
  nextBreakAction: '',
  isPremium: true,
  permissions: {
    usageAccess: false,
    accessibility: false,
    overlay: false,
    notification: false,
    battery: false,
  },
};

export const MOCK_APPS: { id: string; name: string; icon: string; category: string }[] = [
  { id: 'com.instagram.android', name: 'Instagram', icon: 'camera', category: 'social' },
  { id: 'com.zhiliaoapp.musically', name: 'TikTok', icon: 'play_circle', category: 'social' },
  { id: 'com.whatsapp', name: 'WhatsApp', icon: 'message_circle', category: 'social' },
  { id: 'com.facebook.katana', name: 'Facebook', icon: 'facebook', category: 'social' },
  { id: 'com.twitter.android', name: 'Twitter', icon: 'message_square', category: 'social' },
  { id: 'com.google.android.youtube', name: 'YouTube', icon: 'tv', category: 'entertainment' },
  { id: 'com.spotify.music', name: 'Spotify', icon: 'music', category: 'entertainment' },
  { id: 'com.netflix.mediaclient', name: 'Netflix', icon: 'tv', category: 'entertainment' },
  { id: 'com.android.vending', name: 'Play Store', icon: 'shield', category: 'system' },
  { id: 'com.google.android.dialer', name: 'Phone', icon: 'phone', category: 'system' },
];

export const MOTIVATIONAL_QUOTES = [
  { text: "Your focus determines your reality. The work you do in silence echoes in your results.", author: "Marcus Aurelius" },
  { text: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "Don't stop when you're tired. Stop when you're done.", author: "Unknown" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
];
