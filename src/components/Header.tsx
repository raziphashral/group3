import React, { useState } from 'react';
import { Flame, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { USER_PROFILE } from '../data/mockData';
import { sounds } from '../utils/audio';

interface HeaderProps {
  onAvatarClick?: () => void;
  viewMode?: 'mobile' | 'gallery';
  setViewMode?: (mode: 'mobile' | 'gallery') => void;
  activeScreen?: string;
  onSelectScreen?: (screen: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onAvatarClick,
  viewMode = 'mobile',
  setViewMode,
  activeScreen,
  onSelectScreen,
}) => {
  const [audioEnabled, setAudioEnabled] = useState(true);

  const toggleSound = () => {
    sounds.enabled = !audioEnabled;
    setAudioEnabled(!audioEnabled);
    if (!audioEnabled) {
      sounds.playSuccess();
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-2.5 shadow-2xs">
      <div className="flex items-center justify-between max-w-lg mx-auto">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-800 to-teal-700 flex items-center justify-center shadow-xs">
            <svg
              className="w-4 h-4 text-emerald-300"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2C6.5 2 2 6.5 2 12c0 4.5 3 8.5 7.5 9.8" />
              <path d="M12 2c5.5 0 10 4.5 10 10 0 5-3.5 9-8.5 9.9" />
              <path d="M12 6c3 0 5 2.5 5 5.5 0 2.5-1.8 4.5-4.5 4.5-2.5 0-4.5-2-4.5-4.5C8 8.5 10 6 12 6z" />
            </svg>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-serif-display text-xl font-bold tracking-tight text-slate-900">
              NutriCoach
            </span>
            <span className="px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[9px] tracking-wider uppercase">
              PRO
            </span>
          </div>
        </div>

        {/* Right side: Audio toggle + Streak pill + Avatar */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            className="w-7 h-7 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors"
            title={audioEnabled ? 'Sound feedback ON (Click to mute)' : 'Sound feedback MUTED (Click to unmute)'}
          >
            {audioEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          <div
            id="streak-badge"
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-xs font-semibold text-slate-800 shadow-2xs"
          >
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>{USER_PROFILE.streakDays}d Streak</span>
          </div>

          <button
            id="profile-avatar-btn"
            onClick={() => {
              sounds.playClick();
              onAvatarClick?.();
            }}
            className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-emerald-500/20 hover:ring-emerald-500/50 transition-all focus:outline-hidden"
            title={USER_PROFILE.name}
          >
            <img
              src={USER_PROFILE.avatarUrl}
              alt={USER_PROFILE.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </button>
        </div>
      </div>

      {/* Screen Selector Banner for quick inspection of all screens */}
      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 max-w-lg mx-auto">
        <div className="flex items-center gap-1 overflow-x-auto py-0.5 no-scrollbar">
          {[
            { id: 'today', label: '1. Today' },
            { id: 'coach', label: '2. Coach AI' },
            { id: 'analytics', label: '3. Analytics' },
            { id: 'log', label: '4. Log Meal (Vision)' },
          ].map((screen) => (
            <button
              key={screen.id}
              onClick={() => {
                sounds.playClick();
                onSelectScreen?.(screen.id);
              }}
              className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-all text-xs ${
                activeScreen === screen.id
                  ? 'bg-emerald-800 text-white font-bold shadow-xs'
                  : 'bg-slate-100/90 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {screen.label}
            </button>
          ))}
        </div>

        {setViewMode && (
          <button
            onClick={() => {
              sounds.playClick();
              setViewMode(viewMode === 'mobile' ? 'gallery' : 'mobile');
            }}
            className="ml-2 px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium hover:bg-slate-50 text-[11px] whitespace-nowrap shadow-2xs"
            title="Toggle between single mobile viewport and all 4 screens side-by-side"
          >
            {viewMode === 'mobile' ? 'Compare 4' : 'Mobile'}
          </button>
        )}
      </div>
    </header>
  );
};
