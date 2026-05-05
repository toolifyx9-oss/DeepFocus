import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, Pause, RotateCcw, SkipForward, StopCircle, 
  Home, BarChart2, Settings as SettingsIcon, 
  Flame, Zap, Coffee, BookOpen, Quote,
  Volume2, VolumeX, Smartphone, SmartphoneNfc,
  CheckCircle2, Lock, X, Shield, ShieldOff, Camera, PlayCircle, MessageCircle, Facebook, MessageSquare, Tv, Music, Layout, AlertCircle, ExternalLink, Settings2,
  Share2, FileText, Globe, Info, ChevronRight, ArrowRight,
  Crown, Star, Moon, Monitor, Search, ArrowDownAz, TrendingUp, Phone
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import confetti from 'canvas-confetti';
import { format } from 'date-fns';
import { useStudyStats } from './hooks/useStudyStats';
import { AppSettings, DEFAULT_SETTINGS, MOTIVATIONAL_QUOTES, StudySession, MOCK_APPS } from './types';

// --- Components ---

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 900); // Super fast splash
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 blur-[120px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 blur-[120px] rounded-full animate-pulse delay-700"></div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 100,
          damping: 20,
          duration: 0.8 
        }}
        className="relative"
      >
        <div className="absolute inset-0 rounded-full border border-primary/30 scale-150 blur-md animate-ping"></div>
        <div className="relative w-40 h-40 rounded-full border-2 border-primary/40 flex items-center justify-center shadow-glow-xl bg-black/40 backdrop-blur-sm">
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            <motion.circle 
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.9, ease: "easeInOut" }}
              className="text-primary" 
              cx="50" cy="50" fill="none" r="48" 
              stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            />
          </svg>
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Zap className="w-16 h-16 text-primary timer-glow" />
          </motion.div>
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mt-16 text-center"
      >
        <h1 className="font-headline text-6xl font-bold tracking-tighter text-white">
          Deep<span className="text-primary">Focus</span>
        </h1>
        <p className="font-body text-primary/60 text-sm tracking-[0.4em] font-light uppercase mt-4">
          Stay Locked • Stay Productive
        </p>
      </motion.div>

      <div className="absolute bottom-24 w-24 h-[1px] bg-white/10 rounded-full overflow-hidden">
        <motion.div 
          animate={{ x: [-96, 96] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="h-full w-1/2 bg-primary"
        />
      </div>
    </motion.div>
  );
};

const OnboardingSlides = ({ settings, setSettings, onComplete }: { settings: AppSettings, setSettings: React.Dispatch<React.SetStateAction<AppSettings>>, onComplete: () => void }) => {
  const [slide, setSlide] = useState(0);

  const nextSlide = () => {
    if (slide === 3) {
      onComplete();
    } else {
      setSlide(s => s + 1);
    }
  };

  const renderSlideContent = () => {
    switch(slide) {
      case 0:
        return (
          <div className="flex flex-col items-center text-center space-y-8 h-full justify-center">
            <div className="relative w-48 h-48 rounded-full border border-outline-variant/30 flex items-center justify-center bg-surface-container-high/50 backdrop-blur-sm shadow-xl">
              <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse"></div>
              <Zap className="w-20 h-20 text-primary timer-glow" />
            </div>
            <div className="space-y-4">
              <h2 className="font-headline text-4xl font-bold text-white tracking-tight">Master Your Time</h2>
              <p className="text-on-surface-variant text-lg leading-relaxed px-4">DeepFocus helps you overcome distractions and achieve your goals with proven techniques.</p>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="flex flex-col items-center text-center space-y-8 h-full justify-center mt-[-40px]">
            <div className="space-y-4">
              <h2 className="font-headline text-3xl font-bold text-white tracking-tight">Set Focus Goal</h2>
              <p className="text-on-surface-variant text-base leading-relaxed px-4">Choose how long you want to focus. We recommend starting with 25 minutes.</p>
            </div>
            
            <div className="relative w-64 h-64 rounded-full border border-outline-variant/30 flex items-center justify-center bg-surface-container-high/50 backdrop-blur-sm shadow-xl mt-8">
              <motion.svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
                <motion.circle 
                  cx="50" cy="50" r="48" fill="none" 
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                  className="text-primary drop-shadow-[0_0_8px_currentColor]"
                  strokeDasharray="301.59"
                  strokeDashoffset={301.59 - (settings.focusDuration / 120) * 301.59}
                  transition={{ type: "spring", stiffness: 50 }}
                />
              </motion.svg>
              <div className="text-center">
                <div className="font-headline text-5xl font-bold tracking-tighter text-white">
                  {settings.focusDuration}
                </div>
                <div className="text-sm font-bold text-primary uppercase tracking-[0.2em] mt-1">Minutes</div>
              </div>
            </div>
            
            <div className="w-full max-w-xs mt-8">
              <input 
                type="range" 
                min="5" 
                max="120" 
                step="5"
                value={settings.focusDuration}
                onChange={(e) => setSettings({...settings, focusDuration: parseInt(e.target.value)})}
                className="w-full h-2 bg-surface-variant rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-on-surface-variant/50 font-bold uppercase mt-2">
                <span>5m</span>
                <span>120m</span>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col items-center text-center space-y-6 h-full justify-center">
            <div className="space-y-4">
              <h2 className="font-headline text-3xl font-bold text-white tracking-tight">Block Distractions</h2>
              <p className="text-on-surface-variant text-base leading-relaxed px-4">Select the apps that distract you the most. They will be inaccessible during focus time.</p>
            </div>
            
            <div className="w-full space-y-3 mt-8">
              {MOCK_APPS.slice(0, 4).map(app => (
                <div 
                  key={app.id}
                  onClick={() => {
                    const newBlocked = settings.blockedApps.includes(app.id) 
                      ? settings.blockedApps.filter(id => id !== app.id)
                      : [...settings.blockedApps, app.id];
                    setSettings({...settings, blockedApps: newBlocked});
                  }}
                  className={`p-4 rounded-2xl flex items-center justify-between cursor-pointer transition-all border ${
                    settings.blockedApps.includes(app.id) 
                      ? 'bg-primary/10 border-primary/30 shadow-glow-sm' 
                      : 'bg-surface-container border-outline-variant/10 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${settings.blockedApps.includes(app.id) ? 'bg-primary/20 text-primary' : 'bg-surface-variant text-on-surface-variant'}`}>
                      {app.icon === 'camera' && <Camera className="w-5 h-5" />}
                      {app.icon === 'play_circle' && <PlayCircle className="w-5 h-5" />}
                      {app.icon === 'message_circle' && <MessageCircle className="w-5 h-5" />}
                      {app.icon === 'facebook' && <Facebook className="w-5 h-5" />}
                    </div>
                    <span className={`font-bold text-base ${settings.blockedApps.includes(app.id) ? 'text-primary' : 'text-on-surface'}`}>{app.name}</span>
                  </div>
                  <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                    settings.blockedApps.includes(app.id) ? 'bg-primary border-primary' : 'border-outline-variant/30'
                  }`}>
                    {settings.blockedApps.includes(app.id) && <CheckCircle2 className="w-4 h-4 text-on-primary" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col items-center text-center space-y-8 h-full justify-center">
            <div className="relative w-48 h-48 rounded-full border border-outline-variant/30 flex items-center justify-center bg-surface-container-high/50 backdrop-blur-sm shadow-xl">
              <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse"></div>
              <CheckCircle2 className="w-20 h-20 text-primary timer-glow" />
            </div>
            <div className="space-y-4">
              <h2 className="font-headline text-4xl font-bold text-white tracking-tight">You're All Set!</h2>
              <p className="text-on-surface-variant text-lg leading-relaxed px-4">Your personalized distraction-free environment is ready. Start your session now.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden px-6 pb-20 pt-10"
    >
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full animate-pulse delay-700"></div>
      
      <div className="relative flex-1 flex flex-col items-center justify-center w-full max-w-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full flex flex-col"
          >
            {renderSlideContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="w-full max-w-sm space-y-8 mt-auto relative">
        <div className="flex justify-center gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-300 ${i === slide ? 'w-8 bg-primary shadow-glow-sm' : 'w-2 bg-white/20'}`}
            />
          ))}
        </div>
        
        <button
          onClick={nextSlide}
          className="w-full py-4 rounded-2xl bg-primary text-surface font-bold text-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-glow-md"
        >
          {slide === 3 ? 'Start Deep Focus' : 'Continue'}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};

const MotivationModal = ({ quote, onRestart, onDismiss }: { quote: typeof MOTIVATIONAL_QUOTES[0], onRestart: () => void, onDismiss: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-surface-container-lowest/80 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="glass-panel max-w-lg w-full rounded-xl overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.6)] relative p-10 md:p-14 flex flex-col items-center text-center space-y-10"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
        
        <div className="relative">
          <div className="absolute inset-0 bg-primary blur-3xl opacity-20 scale-150"></div>
          <div className="w-20 h-20 rounded-full bg-surface-container-high border border-outline-variant/30 flex items-center justify-center relative">
            <Quote className="w-10 h-10 text-primary fill-primary" />
          </div>
        </div>

        <div className="space-y-6">
          <blockquote className="font-headline text-2xl md:text-3xl font-bold leading-tight tracking-tight">
            "{quote.text}"
          </blockquote>
          <p className="text-on-surface-variant font-label text-sm uppercase tracking-widest">— {quote.author}</p>
        </div>

        <div className="w-full pt-4 space-y-4">
          <button 
            onClick={onRestart}
            className="w-full bg-gradient-to-br from-primary to-primary-dim text-on-primary font-headline font-bold text-lg py-5 px-8 rounded-full shadow-glow-md hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-3"
          >
            Start Again
            <SkipForward className="w-5 h-5 fill-current" />
          </button>
          <button 
            onClick={onDismiss}
            className="text-on-surface-variant hover:text-primary font-medium text-sm transition-colors tracking-wide"
          >
            Remind me later
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const FocusCalendar = ({ history }: { history: { [date: string]: number } }) => {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  
  const daysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = [];
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= totalDays; i++) days.push(new Date(year, month, i));
    
    return days;
  };

  const monthLabel = format(currentMonth, 'MMMM yyyy');
  const days = daysInMonth(currentMonth);

  return (
    <div className="bg-surface-container-high rounded-3xl p-6 border border-outline-variant/10 shadow-xl overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-headline font-bold text-white tracking-tight">{monthLabel}</h3>
        <div className="flex gap-2">
          <button 
            onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1))}
            className="p-2 hover:bg-white/5 rounded-full transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-white/40 rotate-90" />
          </button>
          <button 
            onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1))}
            className="p-2 hover:bg-white/5 rounded-full transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-white/40 -rotate-90" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={`header-${d}-${i}`} className="text-[10px] font-bold text-on-surface-variant/40 text-center uppercase tracking-widest mb-1">{d}</div>
        ))}
        {days.map((date, i) => {
          if (!date) return <div key={`empty-${i}`} />;
          const dateStr = format(date, 'yyyy-MM-dd');
          const focusTime = history[dateStr] || 0;
          const intensity = Math.min(focusTime / 3600 / 4, 1); // 4 hours = full intensity
          
          return (
            <div key={dateStr} className="aspect-square flex flex-col items-center justify-center relative">
              <div 
                className={`w-full h-full rounded-lg transition-all duration-500 border border-white/5 ${focusTime > 0 ? 'scale-90' : 'scale-75 opacity-20'}`}
                style={{ 
                  backgroundColor: focusTime > 0 ? `color-mix(in srgb, var(--color-primary) ${(0.1 + intensity * 0.9) * 100}%, transparent)` : 'rgba(255, 255, 255, 0.05)',
                  boxShadow: focusTime > 0 ? `0 0 ${intensity * 15}px color-mix(in srgb, var(--color-primary) ${intensity * 0.4 * 100}%, transparent)` : 'none'
                }}
              />
              <span className={`absolute text-[8px] font-bold ${focusTime > 0 ? 'text-white' : 'text-white/20'}`}>
                {date.getDate()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const BlockAppsModal = ({ selectedApps, onToggle, onDismiss, permissionsGranted }: { selectedApps: string[], onToggle: (id: string) => void, onDismiss: () => void, permissionsGranted: boolean }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sortBy, setSortBy] = React.useState<'alpha' | 'usage'>('alpha');
  const [filterType, setFilterType] = React.useState<'all' | 'social' | 'entertainment' | 'system'>('all');

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'camera': return <Camera className="w-5 h-5" />;
      case 'play_circle': return <PlayCircle className="w-5 h-5" />;
      case 'message_circle': return <MessageCircle className="w-5 h-5" />;
      case 'facebook': return <Facebook className="w-5 h-5" />;
      case 'message_square': return <MessageSquare className="w-5 h-5" />;
      case 'tv': return <Tv className="w-5 h-5" />;
      case 'music': return <Music className="w-5 h-5" />;
      case 'layout': return <Layout className="w-5 h-5" />;
      case 'phone': return <Phone className="w-5 h-5" />;
      default: return <Shield className="w-5 h-5" />;
    }
  };

  const filteredApps = React.useMemo(() => {
    let result = MOCK_APPS.filter(app => 
      app.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filterType !== 'all') {
      result = result.filter(app => app.category === filterType);
    }

    if (sortBy === 'alpha') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // Mock usage sort - selected apps first as a proxy for "importance/usage"
      result.sort((a, b) => {
        const aSelected = selectedApps.includes(a.id) ? 1 : 0;
        const bSelected = selectedApps.includes(b.id) ? 1 : 0;
        return bSelected - aSelected;
      });
    }

    return result;
  }, [searchQuery, sortBy, filterType, selectedApps]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-surface-container-lowest/90 backdrop-blur-lg"
    >
      <motion.div 
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="glass-panel max-w-md w-full rounded-2xl overflow-hidden shadow-2xl border border-outline-variant/20 flex flex-col max-h-[85vh]"
      >
        <div className="p-6 border-b border-outline-variant/10">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-primary" />
              <h3 className="font-headline text-xl font-bold">Block Apps</h3>
            </div>
            <button onClick={onDismiss} className="p-2 hover:bg-surface-variant rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/40" />
              <input 
                type="text" 
                placeholder="Search apps..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant/10 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all font-medium"
              />
            </div>

            {/* Filter Chips & Sort */}
            <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar pb-1">
              <div className="flex gap-2">
                {(['all', 'social', 'entertainment', 'system'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                      filterType === type 
                        ? 'bg-primary text-on-primary' 
                        : 'bg-surface-container-high text-on-surface-variant/60 hover:text-white'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setSortBy(prev => prev === 'alpha' ? 'usage' : 'alpha')}
                className="shrink-0 p-2 bg-surface-container-high rounded-full hover:bg-surface-variant transition-colors group"
                title="Toggle Sort"
              >
                {sortBy === 'alpha' ? <ArrowDownAz className="w-4 h-4 text-primary" /> : <TrendingUp className="w-4 h-4 text-primary" />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 pt-2 space-y-4 no-scrollbar">
          {!permissionsGranted && (
            <div className="bg-error/10 border border-error/20 p-4 rounded-xl flex items-start gap-3 mb-4">
              <AlertCircle className="w-5 h-5 text-error shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-error font-bold text-sm">Permissions Required</p>
                <p className="text-on-surface-variant text-xs leading-relaxed">App blocking will not function until you grant the necessary permissions in Settings.</p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {filteredApps.length > 0 ? filteredApps.map(app => (
              <div 
                key={app.id}
                onClick={() => onToggle(app.id)}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedApps.includes(app.id) 
                    ? 'bg-primary/10 border-primary/40' 
                    : 'bg-surface-container border-outline-variant/10 hover:border-outline-variant/30'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${selectedApps.includes(app.id) ? 'bg-primary/20 text-primary' : 'bg-surface-variant text-on-surface-variant'}`}>
                    {getIcon(app.icon)}
                  </div>
                  <div className="flex flex-col">
                    <span className={`font-bold text-sm ${selectedApps.includes(app.id) ? 'text-primary' : 'text-on-surface'}`}>{app.name}</span>
                    <span className="text-[10px] text-on-surface-variant/40 font-bold uppercase tracking-widest">{app.category}</span>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                  selectedApps.includes(app.id) ? 'bg-primary border-primary' : 'border-outline-variant/30'
                }`}>
                  {selectedApps.includes(app.id) && <CheckCircle2 className="w-4 h-4 text-on-primary" />}
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center py-12 text-center opacity-40">
                <Shield className="w-12 h-12 mb-4" />
                <p className="text-sm font-bold uppercase tracking-widest">No apps found</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 bg-surface-container-low border-t border-outline-variant/10">
          <button 
            onClick={onDismiss}
            className="w-full bg-primary text-on-primary font-headline font-bold py-4 rounded-xl shadow-lg hover:opacity-90 active:scale-95 transition-all"
          >
            Done
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};const StatsContent = React.memo(({ stats, getWeeklyData }: { stats: any, getWeeklyData: () => any[] }) => {
  const weeklyData = React.useMemo(() => getWeeklyData(), [stats.dailyHistory]);
  const totalFocusTime = React.useMemo(() => 
    (Object.values(stats.dailyHistory) as number[]).reduce((a: number, b: number) => a + b, 0)
  , [stats.dailyHistory]);

  const activeDaysThisMonth = React.useMemo(() => {
    const today = new Date();
    const startOfMo = new Date(today.getFullYear(), today.getMonth(), 1);
    return Object.keys(stats.dailyHistory).filter(dateStr => {
      const d = new Date(dateStr);
      return d >= startOfMo && stats.dailyHistory[dateStr] > 0;
    }).length;
  }, [stats.dailyHistory]);

  return (
    <motion.div 
      key="stats"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="max-w-4xl mx-auto space-y-12"
    >
      <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
        <div className="md:col-span-12 space-y-4">
          <p className="text-primary font-medium tracking-[0.3em] uppercase text-[10px]">Performance Summary</p>
          <h2 className="font-headline text-5xl md:text-7xl font-bold tracking-tighter text-white">
            {Math.floor(totalFocusTime / 3600)}<span className="text-primary">h</span> {Math.floor((totalFocusTime % 3600) / 60)}<span className="text-primary/60">m</span> Focused
          </h2>
        </div>
      </section>

      {/* Streak and Summary Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div className="glass-panel p-8 rounded-3xl neon-glow relative overflow-hidden group">
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="flex justify-between items-start mb-6">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Flame className="w-5 h-5 text-primary fill-primary" />
            </div>
          </div>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Active Streak</p>
          <div className="flex items-baseline gap-2 mt-2">
            <p className="font-headline text-4xl font-bold text-white">{stats.streak || 0}</p>
            <span className="text-on-surface-variant text-sm font-medium">Days</span>
          </div>
        </div>

        <div className="glass-panel p-8 rounded-3xl relative overflow-hidden group">
          <div className="flex justify-between items-start mb-6">
            <div className="w-10 h-10 rounded-2xl bg-secondary/10 flex items-center justify-center">
              <Zap className="w-5 h-5 text-secondary fill-secondary" />
            </div>
          </div>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Efficiency</p>
          <div className="flex items-baseline gap-2 mt-2">
            <p className="font-headline text-4xl font-bold text-white">94</p>
            <span className="text-on-surface-variant text-sm font-medium">%</span>
          </div>
        </div>

        <div className="glass-panel p-8 rounded-3xl relative overflow-hidden group sm:col-span-2 md:col-span-1">
          <div className="flex justify-between items-start mb-6">
            <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-white/40" />
            </div>
          </div>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Active Days (Mo)</p>
          <div className="flex items-baseline gap-2 mt-2">
            <p className="font-headline text-4xl font-bold text-white">{activeDaysThisMonth}</p>
            <span className="text-on-surface-variant text-sm font-medium">Days</span>
          </div>
        </div>
      </section>

      {/* Focus Trends Chart */}
      <section className="space-y-8">
        <div className="flex justify-between items-end px-2">
          <h3 className="font-headline text-2xl font-bold text-white tracking-tight">Focus Trends</h3>
          <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-4 py-1.5 glass-panel rounded-full">Last 7 Days</span>
        </div>
        <div className="glass-panel p-10 rounded-3xl h-[300px] w-full relative overflow-hidden">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 700 }} />
              <Tooltip cursor={{ fill: 'color-mix(in srgb, var(--color-primary) 5%, transparent)' }} contentStyle={{ backgroundColor: 'rgba(10, 0, 0, 0.9)', border: '1px solid color-mix(in srgb, var(--color-primary) 20%, transparent)', borderRadius: '16px' }} />
              <Bar dataKey="hours" radius={[8, 8, 8, 8]}>
                {weeklyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 6 ? 'var(--color-primary)' : 'rgba(255,255,255,0.05)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Global Calendar */}
      <section className="space-y-8">
        <div className="flex justify-between items-end px-2">
          <h3 className="font-headline text-2xl font-bold text-white tracking-tight">Focus Calendar</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-primary/20"></div>
              <span className="text-[9px] font-bold text-on-surface-variant uppercase">Low</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-primary"></div>
              <span className="text-[9px] font-bold text-on-surface-variant uppercase">High</span>
            </div>
          </div>
        </div>
        <FocusCalendar history={stats.dailyHistory} />
      </section>
    </motion.div>
  );
});

const PermissionModal = ({ permissions, onToggle, onDismiss }: { permissions: AppSettings['permissions'], onToggle: (key: keyof AppSettings['permissions']) => void, onDismiss: () => void }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const permissionList = [
    {
      id: 'usageAccess' as const,
      title: 'Usage Access',
      description: 'Allows DeepFocus to detect which app is currently in the foreground. This is essential for blocking distractions.',
      icon: <BarChart2 className="w-8 h-8" />,
      granted: permissions.usageAccess,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      id: 'accessibility' as const,
      title: 'Accessibility Service',
      description: 'Enables real-time monitoring of app launches to prevent distractions before they happen.',
      icon: <SmartphoneNfc className="w-8 h-8" />,
      granted: permissions.accessibility,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10'
    },
    {
      id: 'overlay' as const,
      title: 'Display Over Other Apps',
      description: 'Required to show the focus shield when you attempt to open a blocked app.',
      icon: <Tv className="w-8 h-8" />,
      granted: permissions.overlay,
      color: 'text-tertiary',
      bgColor: 'bg-tertiary/10'
    },
    {
      id: 'notification' as const,
      title: 'Notifications',
      description: 'Used to alert you when your focus session is complete or when it is time for a break.',
      icon: <Smartphone className="w-8 h-8" />,
      granted: permissions.notification,
      color: 'text-primary',
      bgColor: 'bg-primary/5'
    },
    {
      id: 'battery' as const,
      title: 'Battery Optimization',
      description: 'Ensures the focus engine stays running reliably in the background without being closed by the system.',
      icon: <Shield className="w-8 h-8" />,
      granted: permissions.battery,
      color: 'text-secondary',
      bgColor: 'bg-secondary/5'
    }
  ];

  const currentPermission = permissionList[currentIndex];
  const isLast = currentIndex === permissionList.length - 1;

  const handleNext = () => {
    if (isLast) {
      onDismiss();
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-6 bg-surface-container-lowest/90 backdrop-blur-xl">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="glass-panel max-w-sm w-full rounded-3xl overflow-hidden shadow-2xl border border-outline-variant/20 flex flex-col"
      >
        <div className="p-8 text-center space-y-8">
          <div className="flex justify-center gap-2">
            {permissionList.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentIndex ? 'w-8 bg-primary' : 'w-2 bg-surface-variant'}`}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentPermission.id}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className={`w-20 h-20 rounded-2xl ${currentPermission.bgColor} ${currentPermission.color} flex items-center justify-center mx-auto shadow-lg`}>
                {currentPermission.icon}
              </div>
              
              <div className="space-y-2">
                <h3 className="font-headline text-2xl font-bold tracking-tight">{currentPermission.title}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  {currentPermission.description}
                </p>
              </div>

              <div className="pt-4">
                <button 
                  onClick={() => onToggle(currentPermission.id)}
                  className={`w-full py-4 rounded-2xl font-headline font-bold transition-all flex items-center justify-center gap-2 ${
                    currentPermission.granted 
                      ? 'bg-primary/10 text-primary border border-primary/20' 
                      : 'bg-primary text-on-primary shadow-xl hover:scale-[1.02] active:scale-95'
                  }`}
                >
                  {currentPermission.granted ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Permission Granted
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-5 h-5" />
                      Grant Access
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="p-6 bg-surface-container-low border-t border-outline-variant/10 flex gap-3">
          {currentIndex > 0 && (
            <button 
              onClick={() => setCurrentIndex(prev => prev - 1)}
              className="flex-1 py-4 text-on-surface-variant font-bold text-xs uppercase tracking-widest hover:text-primary transition-colors"
            >
              Back
            </button>
          )}
          <button 
            onClick={handleNext}
            disabled={!currentPermission.granted && !isLast}
            className={`flex-[2] py-4 rounded-xl font-headline font-bold transition-all ${
              currentPermission.granted || isLast
                ? 'bg-surface-container-high text-on-surface hover:bg-surface-variant'
                : 'bg-surface-container text-on-surface-variant cursor-not-allowed opacity-50'
            }`}
          >
            {isLast ? 'Finish' : 'Next Step'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const FocusLockActivationModal = ({ onGrant, onDismiss }: { onGrant: () => void, onDismiss: () => void }) => {
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-surface-container-lowest/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel max-w-sm w-full rounded-3xl overflow-hidden shadow-2xl border border-primary/20 p-8 text-center space-y-6 animate-zoom-in">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto rotate-12">
          <Shield className="w-10 h-10 text-primary" />
        </div>
        <div className="space-y-3">
          <h3 className="font-headline text-2xl font-bold tracking-tight">Activate Focus Lock?</h3>
          <p className="text-on-surface-variant text-sm leading-relaxed px-2">
            Focus Lock will monitor your device and <span className="text-primary font-bold">automatically block</span> all distracting apps to keep you in the zone.
          </p>
        </div>
        
        <div className="bg-surface-container/50 p-4 rounded-2xl border border-outline-variant/10 text-left space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">1</div>
            <p className="text-[11px] font-medium">Blocks social media & games</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">2</div>
            <p className="text-[11px] font-medium">Prevents notification distractions</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">3</div>
            <p className="text-[11px] font-medium">Requires System Permissions</p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <button 
            onClick={onGrant}
            className="w-full bg-primary text-on-primary font-headline font-bold py-4 rounded-2xl shadow-lg hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4 fill-current" />
            Enable & Grant Access
          </button>
          <button 
            onClick={onDismiss}
            className="w-full text-on-surface-variant font-bold text-xs uppercase tracking-widest hover:text-primary transition-colors py-2"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};

const BlockedOverlay = ({ appName, onDismiss }: { appName: string, onDismiss: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center p-8 text-center overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 blur-[150px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 blur-[150px] rounded-full animate-pulse delay-700"></div>
      </div>

      <motion.div
        initial={{ scale: 0.9, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="relative z-10 space-y-10 max-w-sm"
      >
        <div className="relative w-32 h-32 mx-auto">
          <div className="absolute inset-0 bg-primary/20 rounded-[2.5rem] blur-2xl animate-pulse"></div>
          <div className="relative w-full h-full rounded-[2.5rem] glass-panel border border-primary/40 flex items-center justify-center shadow-glow-xl">
            <Shield className="w-16 h-16 text-primary timer-glow" />
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="font-headline text-5xl font-bold tracking-tighter text-white">
            Stay Locked.
          </h2>
          <p className="text-white/60 text-lg leading-relaxed font-light">
            <span className="text-primary font-bold">{appName}</span> is currently restricted. Your focus is your most valuable asset.
          </p>
        </div>

        <div className="pt-10">
          <motion.button 
            whileHover={{ scale: 1.02, shadow: "0 0 30px rgba(255,255,255,0.2)" }}
            whileTap={{ scale: 0.98 }}
            onClick={onDismiss}
            className="w-full bg-white text-black font-headline font-bold py-6 rounded-[2rem] shadow-2xl transition-all tracking-widest uppercase text-xs"
          >
            Return to Focus
          </motion.button>
        </div>

        <div className="flex items-center justify-center gap-3">
          <div className="h-[1px] w-8 bg-white/10"></div>
          <p className="text-[10px] text-white/30 uppercase tracking-[0.4em] font-bold">
            DeepFocus Shield
          </p>
          <div className="h-[1px] w-8 bg-white/10"></div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const PrivacyPolicyModal = ({ onDismiss }: { onDismiss: () => void }) => {
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-surface-container-lowest/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel max-w-2xl w-full max-h-[80vh] rounded-3xl overflow-hidden shadow-2xl border border-outline-variant/20 flex flex-col animate-zoom-in">
        <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-low">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-primary" />
            <h3 className="font-headline text-xl font-bold">Privacy Policy</h3>
          </div>
          <button onClick={onDismiss} className="p-2 hover:bg-surface-variant rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-8 overflow-y-auto space-y-6 text-sm leading-relaxed text-on-surface-variant">
          <section className="space-y-2">
            <h4 className="text-on-surface font-bold text-base">1. Information We Collect</h4>
            <p>DeepFocus is designed with privacy in mind. We do not collect any personal identification information (PII) on our servers. All your study statistics, settings, and blocked app lists are stored locally on your device using localStorage.</p>
          </section>
          <section className="space-y-2">
            <h4 className="text-on-surface font-bold text-base">2. Permissions Usage</h4>
            <p>To provide the core functionality of app blocking, DeepFocus requires certain system permissions:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Usage Access:</strong> Used solely to detect which app is currently in the foreground.</li>
              <li><strong>Accessibility Service:</strong> Used to monitor app launches and prevent distractions in real-time.</li>
              <li><strong>Overlay Permission:</strong> Used to display the focus shield over blocked applications.</li>
            </ul>
            <p>None of the data processed by these permissions is transmitted outside of your device.</p>
          </section>
          <section className="space-y-2">
            <h4 className="text-on-surface font-bold text-base">3. Third-Party Services</h4>
            <p>We use standard web technologies. We do not use third-party tracking cookies or analytics that identify you personally.</p>
          </section>
          <section className="space-y-2">
            <h4 className="text-on-surface font-bold text-base">4. Data Retention</h4>
            <p>Since all data is stored locally, you have full control. Clearing your browser data or uninstalling the app will remove all stored statistics and settings.</p>
          </section>
          <section className="space-y-2">
            <h4 className="text-on-surface font-bold text-base">5. Contact Us</h4>
            <p>If you have any questions about this Privacy Policy, please contact us at support@deepfocus.app</p>
          </section>
        </div>
        <div className="p-6 bg-surface-container-low border-t border-outline-variant/10">
          <button 
            onClick={onDismiss}
            className="w-full bg-primary text-on-primary font-headline font-bold py-4 rounded-xl shadow-lg hover:opacity-90 active:scale-95 transition-all"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

// --- Native Bridge Support ---
declare global {
  interface Window {
    DeepFocusNative?: {
      getPermissionStatus: () => string;
      requestUsageAccess: () => void;
      requestAccessibility: () => void;
      requestOverlay: () => void;
      requestNotification: () => void;
      requestBatteryOptimization: () => void;
      startFocus: (minutes: number) => void;
      stopFocus: () => void;
    };
  }
}

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(() => localStorage.getItem('deepfocus_onboarded') !== 'true');
  const [activeTab, setActiveTab] = useState<'home' | 'stats' | 'settings'>('home');
  const [isDeepFocus, setIsDeepFocus] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('deepfocus_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_SETTINGS, ...parsed };
      } catch (e) {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });

  // Sync with Native Bridge
  useEffect(() => {
    if (window.DeepFocusNative) {
      const updatePermissions = () => {
        try {
          const statusJson = window.DeepFocusNative!.getPermissionStatus();
          const status = JSON.parse(statusJson);
          setSettings(prev => ({
            ...prev,
            permissions: {
              ...prev.permissions,
              usageAccess: status.usageAccess,
              accessibility: status.accessibility,
              overlay: status.overlay,
              notification: status.notification,
              battery: status.battery
            }
          }));
        } catch (e) {
          console.error("Failed to sync permissions with native app", e);
        }
      };

      // Poll periodically when app is visible
      const interval = setInterval(updatePermissions, 2000);
      updatePermissions();
      return () => clearInterval(interval);
    }
  }, []);
  
  const { stats, addSession, getWeeklyData } = useStudyStats();
  
  // Timer State
  const [timerType, setTimerType] = useState<'focus' | 'break'>('focus');
  const [timerStartTime, setTimerStartTime] = useState<number | null>(() => {
    const saved = localStorage.getItem('deepfocus_timer_start');
    return saved ? parseInt(saved) : null;
  });
  const [timerTotalDuration, setTimerTotalDuration] = useState<number>(() => {
    const saved = localStorage.getItem('deepfocus_timer_duration');
    return saved ? parseInt(saved) : settings.focusDuration * 60;
  });
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    const isRunning = localStorage.getItem('deepfocus_timer_active') === 'true';
    const start = localStorage.getItem('deepfocus_timer_start');
    const duration = localStorage.getItem('deepfocus_timer_duration');
    if (isRunning && start && duration) {
      const elapsed = Math.floor((Date.now() - parseInt(start)) / 1000);
      return Math.max(0, parseInt(duration) - elapsed);
    }
    return settings.focusDuration * 60;
  });
  const [isActive, setIsActive] = useState(() => localStorage.getItem('deepfocus_timer_active') === 'true');
  const [sessionCount, setSessionCount] = useState(1);
  const [showMotivation, setShowMotivation] = useState(false);
  const [showBlockApps, setShowBlockApps] = useState(false);
  const [showPermissions, setShowPermissions] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showPermissionWarning, setShowPermissionWarning] = useState(false);
  const [manualFocusLock, setManualFocusLock] = useState(false);
  const [blockedAppAttempt, setBlockedAppAttempt] = useState<string | null>(null);
  const [currentQuote, setCurrentQuote] = useState(MOTIVATIONAL_QUOTES[0]);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [hasCheckedPermissions, setHasCheckedPermissions] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  
  useEffect(() => {
    const root = window.document.documentElement;
    const applyTheme = (isDark: boolean) => {
      if (isDark) {
        root.classList.remove('light');
        root.classList.add('dark');
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
      }
    };

    if (settings.appearanceMode === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(systemTheme.matches);

      const listener = (e: MediaQueryListEvent) => applyTheme(e.matches);
      systemTheme.addEventListener('change', listener);
      return () => systemTheme.removeEventListener('change', listener);
    } else {
      applyTheme(settings.appearanceMode === 'dark');
    }
  }, [settings.appearanceMode]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };
  
  useEffect(() => {
    if (isLoaded && !hasCheckedPermissions) {
      const allGranted = settings.permissions.usageAccess && settings.permissions.accessibility && settings.permissions.overlay;
      if (!allGranted) {
        setShowPermissions(true);
      }
      setHasCheckedPermissions(true);
    }
  }, [isLoaded, hasCheckedPermissions, settings.permissions]);

  useEffect(() => {
    localStorage.setItem('deepfocus_settings', JSON.stringify(settings));
  }, [settings]);

  const handleTimerComplete = useCallback(() => {
    setIsActive(false);
    setTimerStartTime(null);
    localStorage.removeItem('deepfocus_timer_start');
    localStorage.setItem('deepfocus_timer_active', 'false');
    if (timerRef.current) clearInterval(timerRef.current);

    if (settings.soundEnabled) {
      // Local signal or silent fallback as we are strictly offline
      console.log("Timer Finished - Playing Signal");
    }
    
    if (settings.hapticEnabled && 'vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }

    if (timerType === 'focus') {
      const session: StudySession = {
        id: Math.random().toString(36).substr(2, 9),
        startTime: Date.now() - (settings.focusDuration * 60 * 1000),
        duration: settings.focusDuration * 60,
        type: 'focus',
        taskName: settings.currentTask || 'Deep Work Session'
      };
      addSession(session);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#69daff', '#929bfa', '#00cffc']
      });
      
      setCurrentQuote(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);
      setShowMotivation(true);
      
      const nextType = 'break';
      const nextDuration = settings.breakDuration * 60;
      setTimerType(nextType);
      setTimeLeft(nextDuration);
      setTimerTotalDuration(nextDuration);
      localStorage.setItem('deepfocus_timer_duration', nextDuration.toString());
    } else {
      const nextType = 'focus';
      const nextDuration = settings.focusDuration * 60;
      setTimerType(nextType);
      setTimeLeft(nextDuration);
      setTimerTotalDuration(nextDuration);
      localStorage.setItem('deepfocus_timer_duration', nextDuration.toString());
      setSessionCount(prev => prev + 1);
    }
  }, [timerType, settings, addSession]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isActive && timerStartTime) {
        const elapsed = Math.floor((Date.now() - timerStartTime) / 1000);
        const remaining = Math.max(0, timerTotalDuration - elapsed);
        setTimeLeft(remaining);
        if (remaining === 0) {
          handleTimerComplete();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isActive, timerStartTime, timerTotalDuration, handleTimerComplete]);

  useEffect(() => {
    if (isActive && timeLeft > 0 && timerStartTime) {
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - timerStartTime) / 1000);
        const remaining = Math.max(0, timerTotalDuration - elapsed);
        setTimeLeft(remaining);
        if (remaining === 0) {
          handleTimerComplete();
        }
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handleTimerComplete();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, timerStartTime, timerTotalDuration, handleTimerComplete]);

  const toggleTimer = () => {
    if (!isActive && timerType === 'focus' && settings.blockedApps.length > 0) {
      const allGranted = settings.permissions.usageAccess && settings.permissions.accessibility && settings.permissions.overlay;
      if (!allGranted) {
        setShowPermissionWarning(true);
        return;
      }
    }
    
    const nextActive = !isActive;
    setIsActive(nextActive);
    localStorage.setItem('deepfocus_timer_active', nextActive.toString());

    if (nextActive) {
      if (window.DeepFocusNative && timerType === 'focus') {
        window.DeepFocusNative.startFocus(settings.focusDuration);
      }
      const now = Date.now();
      const duration = timeLeft;
      setTimerStartTime(now);
      setTimerTotalDuration(duration);
      localStorage.setItem('deepfocus_timer_start', now.toString());
      localStorage.setItem('deepfocus_timer_duration', duration.toString());
    } else {
      if (window.DeepFocusNative) {
        window.DeepFocusNative.stopFocus();
      }
      setTimerStartTime(null);
      localStorage.removeItem('deepfocus_timer_start');
    }
  };
  
  const resetTimer = () => {
    setIsActive(false);
    setTimerStartTime(null);
    localStorage.setItem('deepfocus_timer_active', 'false');
    localStorage.removeItem('deepfocus_timer_start');
    const duration = timerType === 'focus' ? settings.focusDuration * 60 : settings.breakDuration * 60;
    setTimeLeft(duration);
    setTimerTotalDuration(duration);
    localStorage.setItem('deepfocus_timer_duration', duration.toString());
  };

  const skipSession = () => {
    handleTimerComplete();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = timeLeft / (timerType === 'focus' ? settings.focusDuration * 60 : settings.breakDuration * 60);

  if (!isLoaded) return <SplashScreen onComplete={() => setIsLoaded(true)} />;
  if (showOnboarding) return <OnboardingSlides settings={settings} setSettings={setSettings} onComplete={() => { setShowOnboarding(false); localStorage.setItem('deepfocus_onboarded', 'true'); }} />;

  const isBlockingActive = (manualFocusLock || (isActive && timerType === 'focus')) && settings.permissions.usageAccess && settings.permissions.accessibility && settings.permissions.overlay;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'camera': return <Camera className="w-5 h-5" />;
      case 'play_circle': return <PlayCircle className="w-5 h-5" />;
      case 'message_circle': return <MessageCircle className="w-5 h-5" />;
      case 'facebook': return <Facebook className="w-5 h-5" />;
      case 'message_square': return <MessageSquare className="w-5 h-5" />;
      case 'tv': return <Tv className="w-5 h-5" />;
      case 'music': return <Music className="w-5 h-5" />;
      case 'layout': return <Layout className="w-5 h-5" />;
      default: return <Shield className="w-5 h-5" />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-1000 theme-${settings.theme} bg-black relative overflow-hidden`}>
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-20%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full animate-pulse delay-1000"></div>
      </div>

      <AnimatePresence>
        {showPrivacyPolicy && (
          <PrivacyPolicyModal onDismiss={() => setShowPrivacyPolicy(false)} />
        )}
        {showMotivation && (
          <MotivationModal 
            quote={currentQuote} 
            onRestart={() => { setShowMotivation(false); setIsActive(true); }} 
            onDismiss={() => setShowMotivation(false)} 
          />
        )}
        {showBlockApps && (
          <BlockAppsModal 
            selectedApps={settings.blockedApps}
            permissionsGranted={settings.permissions.usageAccess && settings.permissions.accessibility && settings.permissions.overlay}
            onToggle={(id) => {
              const newBlocked = settings.blockedApps.includes(id)
                ? settings.blockedApps.filter(a => a !== id)
                : [...settings.blockedApps, id];
              setSettings({ ...settings, blockedApps: newBlocked });
            }}
            onDismiss={() => setShowBlockApps(false)}
          />
        )}
        {showPermissions && (
          <PermissionModal 
            permissions={settings.permissions}
            onToggle={(key) => {
              if (window.DeepFocusNative) {
                if (key === 'usageAccess') window.DeepFocusNative.requestUsageAccess();
                if (key === 'accessibility') window.DeepFocusNative.requestAccessibility();
                if (key === 'overlay') window.DeepFocusNative.requestOverlay();
                if (key === 'notification') window.DeepFocusNative.requestNotification();
                if (key === 'battery') window.DeepFocusNative.requestBatteryOptimization();
              } else {
                setSettings({
                  ...settings,
                  permissions: {
                    ...settings.permissions,
                    [key]: !settings.permissions[key]
                  }
                });
              }
            }}
            onDismiss={() => setShowPermissions(false)}
          />
        )}
        {showPermissionWarning && (
          <FocusLockActivationModal 
            onGrant={() => {
              setShowPermissionWarning(false);
              setShowPermissions(true);
            }}
            onDismiss={() => {
              setShowPermissionWarning(false);
            }}
          />
        )}
        {blockedAppAttempt && (
          <BlockedOverlay 
            appName={MOCK_APPS.find(a => a.id === blockedAppAttempt)?.name || 'App'} 
            onDismiss={() => setBlockedAppAttempt(null)} 
          />
        )}
      </AnimatePresence>

      {/* Header */}
      {!isDeepFocus && (
        <header className="sticky top-0 z-50 glass-panel px-6 py-5 pt-[calc(1.25rem+var(--safe-top))] flex justify-between items-center border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <Zap className="w-4 h-4 text-primary fill-primary" />
            </div>
            <h1 className="font-headline font-bold text-xl text-white tracking-tighter">Deep<span className="text-primary">Focus</span></h1>
          </div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl glass-panel border border-white/10 shadow-lg"
          >
            <Flame className="w-4 h-4 text-primary fill-primary timer-glow" />
            <span className="text-xs font-bold font-headline tracking-widest text-white uppercase">{stats.streak} day streak</span>
          </motion.div>
        </header>
      )}

      {/* Main Content */}
      <main className={`flex-1 overflow-y-auto no-scrollbar ${isDeepFocus ? 'p-0' : 'px-6 pt-8 pb-32'}`}>
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="max-w-lg mx-auto space-y-12"
            >
              {/* Timer Section */}
              <section className="flex flex-col items-center">
              <div className="relative w-80 h-80 md:w-96 md:h-96 flex items-center justify-center">
                <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
                <svg className="absolute inset-0 w-full h-full -rotate-90 timer-glow">
                  <circle 
                    className="text-white/5" 
                    cx="50%" cy="50%" r="46%" fill="transparent" stroke="currentColor" strokeWidth="8" 
                  />
                  <motion.circle 
                    initial={{ strokeDashoffset: 1200 * (1 - progress) }}
                    animate={{ strokeDashoffset: 1200 * (1 - progress) }}
                    transition={{ duration: 1, ease: "linear" }}
                    className="text-primary" 
                    cx="50%" cy="50%" r="46%" fill="transparent" stroke="currentColor" 
                    strokeWidth="8" strokeDasharray="1200" strokeLinecap="round"
                  />
                </svg>
                <div className="text-center z-10">
                  <motion.div
                    key={timeLeft}
                    initial={{ scale: 0.95, opacity: 0.9 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center"
                  >
                    <span className="block text-7xl md:text-8xl font-bold font-headline tracking-tighter text-white drop-shadow-2xl">
                      {formatTime(timeLeft)}
                    </span>
                    <span className="text-primary/60 font-medium tracking-[0.3em] uppercase text-[10px] mt-4 block">
                      {timerType === 'focus' ? 'Focus Session' : 'Break Time'}
                    </span>
                  </motion.div>
                  
                  <div className="mt-8 flex flex-col items-center gap-2">
                    {isBlockingActive ? (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/20 text-primary rounded-full text-[10px] uppercase tracking-widest border border-primary/30 shadow-glow-sm"
                      >
                        <Shield className="w-3 h-3 animate-pulse" />
                        Blocking Active
                      </motion.div>
                    ) : (
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 rounded-full border border-white/10 backdrop-blur-md">
                        <Zap className="w-3 h-3 text-primary fill-primary" />
                        <span className="text-white/80 font-label text-[10px] font-bold tracking-wider">Session {sessionCount} of 4</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-16 flex items-center justify-center gap-10 w-full">
                <motion.button 
                  whileHover={{ scale: 1.1, rotate: -15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={resetTimer}
                  className="w-16 h-16 rounded-2xl glass-panel text-white/60 flex items-center justify-center hover:text-white transition-all"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-6 h-6" />
                </motion.button>
                
                <motion.button 
                  whileHover={{ scale: 1.05, shadow: "0 0 40px rgba(255,77,77,0.5)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleTimer}
                  className="w-24 h-24 rounded-[2.5rem] bg-primary text-white flex items-center justify-center shadow-glow-lg transition-all"
                  title={isActive ? 'Pause' : 'Start'}
                >
                  {isActive ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current ml-1" />}
                </motion.button>
                
                <motion.button 
                  whileHover={{ scale: 1.1, x: 5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={skipSession}
                  className="w-16 h-16 rounded-2xl glass-panel text-white/60 flex items-center justify-center hover:text-white transition-all"
                  title="Skip Session"
                >
                  <SkipForward className="w-6 h-6" />
                </motion.button>
              </div>
              
              <div className="mt-12 flex flex-col items-center gap-8 w-full max-w-sm">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsDeepFocus(!isDeepFocus)}
                  className={`w-full py-4 rounded-2xl font-headline font-bold text-[10px] uppercase tracking-[0.3em] transition-all border ${
                    isDeepFocus 
                      ? 'bg-white/10 text-white border-white/20' 
                      : 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20'
                  }`}
                >
                  {isDeepFocus ? 'Exit Deep Focus' : 'Enter Deep Focus'}
                </motion.button>

                {/* Focus Control Center */}
                <section className="w-full">
                  <div className={`relative glass-panel rounded-[2rem] border ${manualFocusLock ? 'border-primary/40 shadow-glow-lg' : 'border-white/5'} overflow-hidden transition-all duration-500`}>
                    <div 
                      onClick={() => {
                        if (!manualFocusLock) {
                          const allGranted = settings.permissions.usageAccess && settings.permissions.accessibility && settings.permissions.overlay;
                          if (!allGranted) {
                            setShowPermissionWarning(true);
                            return;
                          }
                        }
                        const nextLock = !manualFocusLock;
                        if (window.DeepFocusNative) {
                          if (nextLock) window.DeepFocusNative.startFocus(60 * 24); // Lock for a day or until manually stopped
                          else window.DeepFocusNative.stopFocus();
                        }
                        setManualFocusLock(nextLock);
                      }}
                      className={`p-6 flex items-center justify-between cursor-pointer transition-all ${manualFocusLock ? 'bg-primary/5' : 'hover:bg-white/5'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${manualFocusLock ? 'bg-primary text-white shadow-glow-md' : 'bg-white/5 text-white/40'}`}>
                          {manualFocusLock ? <Shield className="w-6 h-6 animate-pulse" /> : <ShieldOff className="w-6 h-6" />}
                        </div>
                        <div>
                          <p className="font-headline font-bold text-white tracking-tight">Focus Lock</p>
                          <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-0.5">
                            {manualFocusLock ? 'Active Protection' : 'Manual Override'}
                          </p>
                        </div>
                      </div>
                      <div className={`w-12 h-6 rounded-full relative p-1 transition-colors duration-500 ${manualFocusLock ? 'bg-primary' : 'bg-white/10'}`}>
                        <motion.div 
                          animate={{ x: manualFocusLock ? 24 : 0 }}
                          className="w-4 h-4 bg-white rounded-full shadow-lg" 
                        />
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="h-[1px] w-full bg-white/5"></div>

                    {/* Task & Break Inputs */}
                    <div className="p-6 space-y-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-primary">
                          <BookOpen className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Current Task</span>
                        </div>
                        <div className="relative group">
                          <input 
                            type="text"
                            value={settings.currentTask}
                            onChange={(e) => setSettings({ ...settings, currentTask: e.target.value })}
                            placeholder="Quantum Mechanics Review"
                            className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-sm font-medium text-white focus:border-primary/40 focus:bg-white/10 transition-all outline-none placeholder:text-white/20"
                          />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary shadow-glow-sm"></div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-primary/60">
                          <Coffee className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Next Break</span>
                        </div>
                        <div className="relative group">
                          <input 
                            type="text"
                            value={settings.nextBreakAction}
                            onChange={(e) => setSettings({ ...settings, nextBreakAction: e.target.value })}
                            placeholder="5 Min Quick Stretch"
                            className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-sm font-medium text-white focus:border-primary/40 focus:bg-white/10 transition-all outline-none placeholder:text-white/20"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Status Bar */}
                    {manualFocusLock && (
                      <div className="bg-primary/10 px-6 py-3 flex items-center justify-center gap-3 border-t border-primary/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></div>
                        <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] text-center">System Locked • Distractions Blocked</span>
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </section>

            {/* Stats Grid */}
            {!isDeepFocus && (
              <section className="grid grid-cols-2 gap-6">
                <div className="col-span-2 glass-panel p-8 rounded-[2rem] border border-white/5 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-2">Total Focus Today</p>
                      <h3 className="text-4xl font-bold font-headline text-white tracking-tighter">
                        {Math.floor(stats.totalFocusTime / 3600)}<span className="text-primary">h</span> {Math.floor((stats.totalFocusTime % 3600) / 60)}<span className="text-primary/60">m</span>
                      </h3>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                      <BarChart2 className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (stats.totalFocusTime / (4 * 3600)) * 100)}%` }}
                      className="bg-primary h-full rounded-full shadow-glow-sm"
                    />
                  </div>
                  <p className="text-white/40 text-[10px] mt-4 font-bold uppercase tracking-widest">
                    {Math.round((stats.totalFocusTime / (4 * 3600)) * 100)}% of daily goal
                  </p>
                </div>

                <div className="glass-panel p-6 rounded-[2rem] border border-white/5 group hover:border-primary/30 transition-all duration-500">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 border border-primary/20">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Sessions</p>
                  <p className="text-2xl font-bold text-white font-headline">{stats.sessionsCompleted}</p>
                </div>

                <div className="glass-panel p-6 rounded-[2rem] border border-white/5 group hover:border-primary/30 transition-all duration-500">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 border border-primary/20">
                    <Zap className="w-5 h-5" />
                  </div>
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Efficiency</p>
                  <p className="text-2xl font-bold text-white font-headline">94%</p>
                </div>
              </section>
            )}
          </motion.div>
        )}

        {activeTab === 'stats' && (
          <StatsContent stats={stats} getWeeklyData={getWeeklyData} />
        )}


        {activeTab === 'settings' && (
          <motion.div 
            key="settings"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="max-w-2xl mx-auto space-y-12"
          >
            <header className="mb-10">
              <h2 className="font-headline text-3xl font-bold tracking-tight mb-2">Settings</h2>
              <p className="text-on-surface-variant text-sm tracking-wide font-medium uppercase">Personalize your sanctuary</p>
            </header>

            {/* Pro Features Section */}
            <section className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h3 className="font-headline text-lg font-semibold text-primary tracking-wide">Elite Focus Mode</h3>
                <span className="text-on-surface-variant text-xs font-bold uppercase tracking-widest">Active</span>
              </div>
              <div className="bg-gradient-to-br from-primary/20 to-secondary/20 p-8 rounded-3xl border border-outline-variant/10 relative overflow-hidden group shadow-xl">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                  <Crown className="w-32 h-32 text-primary" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Star className="w-5 h-5 text-primary fill-primary" />
                    </div>
                    <h4 className="text-2xl font-headline font-bold">Premium Features Unlocked</h4>
                  </div>
                  <p className="text-on-surface-variant text-sm max-w-md mb-8">
                    Since you are running strictly offline, all premium themes and productivity insights are fully enabled for your use.
                  </p>
                </div>
              </div>
            </section>

            {/* Timer Settings */}
            <section className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h3 className="font-headline text-lg font-semibold text-primary tracking-wide">Timer Settings</h3>
                <span className="text-on-surface-variant text-xs font-bold uppercase tracking-widest">Configuration</span>
              </div>
              
              <div className="space-y-4">
                {/* Focus Duration */}
                <div className="bg-surface-container rounded-2xl p-6 border border-white/5 shadow-lg relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-all duration-500"></div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                    <div className="space-y-1">
                      <label className="text-xl font-headline font-medium">Focus Duration</label>
                      <p className="text-on-surface-variant text-sm">Set your ideal work interval</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center">
                        <input 
                          type="number" 
                          min="0" max="12"
                          value={Math.floor(settings.focusDuration / 60)}
                          onChange={(e) => {
                            const hrs = parseInt(e.target.value) || 0;
                            const mins = settings.focusDuration % 60;
                            setSettings({ ...settings, focusDuration: (hrs * 60) + mins });
                          }}
                          className="w-16 bg-surface-container-high border border-outline-variant/20 rounded-lg p-2 text-center text-2xl font-headline font-bold text-primary focus:outline-none focus:border-primary"
                        />
                        <span className="text-[10px] font-bold uppercase text-on-surface-variant mt-1">Hrs</span>
                      </div>
                      <span className="text-2xl font-bold text-on-surface-variant">:</span>
                      <div className="flex flex-col items-center">
                        <input 
                          type="number" 
                          min="0" max="59"
                          value={settings.focusDuration % 60}
                          onChange={(e) => {
                            const mins = parseInt(e.target.value) || 0;
                            const hrs = Math.floor(settings.focusDuration / 60);
                            setSettings({ ...settings, focusDuration: (hrs * 60) + mins });
                          }}
                          className="w-16 bg-surface-container-high border border-outline-variant/20 rounded-lg p-2 text-center text-2xl font-headline font-bold text-primary focus:outline-none focus:border-primary"
                        />
                        <span className="text-[10px] font-bold uppercase text-on-surface-variant mt-1">Min</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 relative z-10">
                    <input 
                      type="range" 
                      min="1" max="480" step="1"
                      value={settings.focusDuration}
                      onChange={(e) => setSettings({ ...settings, focusDuration: parseInt(e.target.value) })}
                      className="w-full h-1.5 bg-surface-variant rounded-full appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between mt-4 text-[10px] text-on-surface-variant font-bold uppercase tracking-tighter">
                      <span>1m</span>
                      <span>2h</span>
                      <span>4h</span>
                      <span>8h</span>
                    </div>
                  </div>
                </div>

                {/* Break Duration */}
                <div className="bg-surface-container rounded-2xl p-6 border border-white/5 shadow-lg relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-secondary/10 transition-all duration-500"></div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                    <div className="space-y-1">
                      <label className="text-xl font-headline font-medium">Break Duration</label>
                      <p className="text-on-surface-variant text-sm">Time to recharge your energy</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center">
                        <input 
                          type="number" 
                          min="0" max="59"
                          value={settings.breakDuration}
                          onChange={(e) => setSettings({ ...settings, breakDuration: parseInt(e.target.value) || 0 })}
                          className="w-16 bg-surface-container-high border border-outline-variant/20 rounded-lg p-2 text-center text-2xl font-headline font-bold text-secondary focus:outline-none focus:border-secondary"
                        />
                        <span className="text-[10px] font-bold uppercase text-on-surface-variant mt-1">Min</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 relative z-10">
                    <input 
                      type="range" 
                      min="1" max="60" step="1"
                      value={settings.breakDuration}
                      onChange={(e) => setSettings({ ...settings, breakDuration: parseInt(e.target.value) })}
                      className="w-full h-1.5 bg-surface-variant rounded-full appearance-none cursor-pointer accent-secondary"
                    />
                    <div className="flex justify-between mt-4 text-[10px] text-on-surface-variant font-bold uppercase tracking-tighter">
                      <span>1m</span>
                      <span>15m</span>
                      <span>30m</span>
                      <span>60m</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Environment */}
            <section className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h3 className="font-headline text-lg font-semibold text-primary tracking-wide">Environment</h3>
                <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Immersion</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass-panel rounded-3xl p-6 flex items-center justify-between border border-white/5 hover:border-primary/30 transition-all duration-500 group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors">
                      {settings.soundEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
                    </div>
                    <div>
                      <p className="font-headline font-semibold text-white">Sound</p>
                      <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Session alerts</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSettings({ ...settings, soundEnabled: !settings.soundEnabled })}
                    className={`w-12 h-6 rounded-full relative p-1 transition-colors ${settings.soundEnabled ? 'bg-primary' : 'bg-white/10'}`}
                  >
                    <motion.div 
                      animate={{ x: settings.soundEnabled ? 24 : 0 }}
                      className="w-4 h-4 bg-white rounded-full shadow-lg" 
                    />
                  </button>
                </div>

                <div className="glass-panel rounded-3xl p-6 flex items-center justify-between border border-white/5 hover:border-primary/30 transition-all duration-500 group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors">
                      {settings.hapticEnabled ? <SmartphoneNfc className="w-6 h-6" /> : <Smartphone className="w-6 h-6" />}
                    </div>
                    <div>
                      <p className="font-headline font-semibold text-white">Haptic</p>
                      <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Focus feedback</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSettings({ ...settings, hapticEnabled: !settings.hapticEnabled })}
                    className={`w-12 h-6 rounded-full relative p-1 transition-colors ${settings.hapticEnabled ? 'bg-primary' : 'bg-white/10'}`}
                  >
                    <motion.div 
                      animate={{ x: settings.hapticEnabled ? 24 : 0 }}
                      className="w-4 h-4 bg-white rounded-full shadow-lg" 
                    />
                  </button>
                </div>
              </div>
            </section>

            {/* Security & Access */}
            <section className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h3 className="font-headline text-lg font-semibold text-primary tracking-wide">Security & Access</h3>
                <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Protection</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass-panel rounded-3xl p-6 flex items-center justify-between border border-white/5 hover:border-primary/30 transition-all duration-500 group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors">
                      <Shield className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-headline font-semibold text-white">App Blocker</p>
                      <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider">{settings.blockedApps.length} apps selected</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowBlockApps(true)}
                    className="px-5 py-2.5 bg-primary/10 text-primary font-bold text-[10px] uppercase tracking-widest rounded-xl border border-primary/20 hover:bg-primary/20 transition-all"
                  >
                    Manage
                  </button>
                </div>

                <div className="glass-panel rounded-3xl p-6 flex items-center justify-between border border-white/5 hover:border-primary/30 transition-all duration-500 group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors">
                      <Settings2 className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-headline font-semibold text-white">Permissions</p>
                      <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider">System access</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowPermissions(true)}
                    className={`px-5 py-2.5 font-bold text-[10px] uppercase tracking-widest rounded-xl border transition-all ${
                      Object.values(settings.permissions).every(Boolean)
                        ? 'bg-primary/10 text-primary border-primary/20'
                        : 'bg-primary text-white shadow-glow-md'
                    }`}
                  >
                    {Object.values(settings.permissions).every(Boolean) ? 'Review' : 'Grant'}
                  </button>
                </div>
              </div>
            </section>

            {/* Appearance */}
            <section className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h3 className="font-headline text-lg font-semibold text-primary tracking-wide">Appearance</h3>
                <span className="text-on-surface-variant text-xs font-bold uppercase tracking-widest">Interface</span>
              </div>
              
              <div className="bg-surface-container rounded-2xl p-1.5 flex border border-white/5 shadow-inner">
                {(['dark', 'system'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setSettings({ ...settings, appearanceMode: mode })}
                    className={`flex-1 py-3 rounded-xl font-headline text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative flex items-center justify-center gap-2 ${
                      settings.appearanceMode === mode 
                        ? 'text-primary' 
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {settings.appearanceMode === mode && (
                      <motion.div 
                        layoutId="appearance-active"
                        className="absolute inset-0 bg-surface-container-high rounded-xl -z-10 shadow-sm border border-white/5"
                        transition={{ type: "spring", bounce: 0.1, duration: 0.5 }}
                      />
                    )}
                    {mode === 'dark' && <Moon className="w-3 h-3" />}
                    {mode === 'system' && <Monitor className="w-3 h-3" />}
                    {mode}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {['obsidian', 'midnight', 'nebula', 'solar', 'crimson'].map((theme) => (
                  <div key={theme} className="flex flex-col gap-3 group">
                    <div 
                      onClick={() => setSettings({ ...settings, theme: theme as any })}
                      className={`aspect-square rounded-2xl border-2 flex items-center justify-center relative transition-all cursor-pointer overflow-hidden ${
                        settings.theme === theme ? 'border-primary shadow-glow-sm' : 'border-transparent bg-surface-container-high hover:border-white/10'
                      }`}
                    >
                      {theme === 'obsidian' && <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"></div>}
                      {theme === 'midnight' && <div className="absolute inset-0 bg-slate-800/40"></div>}
                      {theme === 'nebula' && <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-transparent"></div>}
                      {theme === 'solar' && <div className="absolute inset-0 bg-gradient-to-br from-error/20 to-transparent"></div>}
                      {theme === 'crimson' && <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-transparent"></div>}
                      
                      {settings.theme === theme && (
                        <CheckCircle2 className="w-6 h-6 text-primary" />
                      )}
                    </div>
                    <p className={`text-[10px] font-bold text-center uppercase tracking-[0.2em] ${settings.theme === theme ? 'text-primary' : 'text-on-surface-variant'}`}>
                      {theme}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Legal & Support */}
            <section className="space-y-6 pb-12">
              <div className="flex items-center justify-between px-2">
                <h3 className="font-headline text-lg font-semibold text-primary tracking-wide">Legal & Support</h3>
                <span className="text-on-surface-variant text-xs font-bold uppercase tracking-widest">App Info</span>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <button 
                  onClick={() => setShowPrivacyPolicy(true)}
                  className="bg-surface-container rounded-2xl p-6 flex items-center justify-between border border-white/5 hover:border-primary/30 transition-all duration-300 text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center text-primary-dim">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-headline font-semibold">Privacy Policy</p>
                      <p className="text-xs text-on-surface-variant">How we handle your data</p>
                    </div>
                  </div>
                  <ExternalLink className="w-5 h-5 text-on-surface-variant/40" />
                </button>

                <button 
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: 'DeepFocus – Study Tracker',
                        text: 'Check out this amazing study app for deep work!',
                        url: window.location.href,
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      showToast('Link copied to clipboard!', 'success');
                    }
                  }}
                  className="bg-surface-container rounded-2xl p-6 flex items-center justify-between border border-white/5 hover:border-primary/30 transition-all duration-300 text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center text-primary-dim">
                      <Share2 className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-headline font-semibold">Share App</p>
                      <p className="text-xs text-on-surface-variant">Invite friends to focus</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-on-surface-variant/40" />
                </button>

                <div className="bg-surface-container rounded-2xl p-6 flex items-center justify-between border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center text-primary-dim">
                      <Info className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-headline font-semibold">Version</p>
                      <p className="text-xs text-on-surface-variant">v1.0.0 (Stable Build)</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded">LATEST</span>
                </div>
              </div>
            </section>
          </motion.div>
        )}
        </AnimatePresence>
      </main>

      {/* Navigation */}
      {!isDeepFocus && (
        <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[85%] max-w-[320px] flex justify-around items-center px-3 py-2 glass-panel rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/10 z-[90]">
          {(['home', 'stats', 'settings'] as const).map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative flex flex-col items-center justify-center p-2.5 transition-all duration-500 ${activeTab === tab ? 'text-primary' : 'text-white/40 hover:text-white/60'}`}
            >
              {activeTab === tab && (
                <motion.div 
                  layoutId="nav-active"
                  className="absolute inset-0 bg-primary/10 rounded-2xl -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {tab === 'home' && <Home className="w-5 h-5" />}
              {tab === 'stats' && <BarChart2 className="w-5 h-5" />}
              {tab === 'settings' && <SettingsIcon className="w-5 h-5" />}
              <span className="font-headline text-[9px] font-bold uppercase tracking-[0.2em] mt-1.5">{tab}</span>
            </button>
          ))}
        </nav>
      )}

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-2xl glass-panel flex items-center gap-3 shadow-2xl"
          >
            <div className={`w-2 h-2 rounded-full ${toast.type === 'success' ? 'bg-green-400' : toast.type === 'error' ? 'bg-red-400' : 'bg-primary'}`} />
            <span className="text-sm font-medium text-on-surface">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
