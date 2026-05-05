import { useState, useEffect, useCallback } from 'react';
import { UserStats, StudySession } from '../types';
import { format, isSameDay, subDays, parseISO } from 'date-fns';

const STORAGE_KEY = 'deepfocus_stats';

const INITIAL_STATS: UserStats = {
  totalFocusTime: 0,
  streak: 0,
  lastStudyDate: null,
  dailyHistory: {},
  sessions: [],
};

export function useStudyStats() {
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Reset daily focus time if it's a new day
      const today = format(new Date(), 'yyyy-MM-dd');
      if (parsed.lastStudyDate !== today) {
        parsed.totalFocusTime = 0;
      }
      return parsed;
    }
    return INITIAL_STATS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  }, [stats]);

  const addSession = useCallback((session: StudySession) => {
    setStats(prev => {
      const today = format(new Date(), 'yyyy-MM-dd');
      const isNewDay = prev.lastStudyDate !== today;
      
      let newStreak = prev.streak;
      if (isNewDay) {
        const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
        if (prev.lastStudyDate === yesterday) {
          newStreak += 1;
        } else if (prev.lastStudyDate === null || prev.lastStudyDate !== today) {
          newStreak = 1;
        }
      }

      const newHistory = { ...prev.dailyHistory };
      newHistory[today] = (newHistory[today] || 0) + (session.type === 'focus' ? session.duration : 0);

      return {
        ...prev,
        totalFocusTime: isNewDay ? (session.type === 'focus' ? session.duration : 0) : prev.totalFocusTime + (session.type === 'focus' ? session.duration : 0),
        streak: newStreak,
        lastStudyDate: today,
        dailyHistory: newHistory,
        sessions: [session, ...prev.sessions].slice(0, 50), // Keep last 50 sessions
      };
    });
  }, []);

  const getWeeklyData = useCallback(() => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateStr = format(date, 'yyyy-MM-dd');
      data.push({
        day: format(date, 'EEE'),
        fullDate: dateStr,
        seconds: stats.dailyHistory[dateStr] || 0,
        hours: (stats.dailyHistory[dateStr] || 0) / 3600,
      });
    }
    return data;
  }, [stats.dailyHistory]);

  return { stats, addSession, getWeeklyData };
}
