import React from 'react';
import { Flame } from 'lucide-react';
import { USER_PROFILE } from '../data/mockData';

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
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-3">
      <div className="flex items-center justify-between max-w-lg mx-auto">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-800 to-teal-700 flex items-center justify-center shadow-sm">
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
          <span className="font-serif-display text-xl font-bold tracking-tight text-slate-900">
            NutriCoach
          </span>
        </div>

        {/* Right side: Streak pill + Avatar */}
        <div className="flex items-center gap-2.5">
          <div
            id="streak-badge"
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50/80 border border-amber-200/70 text-xs font-semibold text-slate-800 shadow-xs"
          >
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>{USER_PROFILE.streakDays} Day Streak</span>
          </div>

          <button
            id="profile-avatar-btn"
            onClick={onAvatarClick}
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

      {/* Screen Selector Banner for quick inspection of all 4 designs */}
      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 max-w-lg mx-auto">
        <div className="flex items-center gap-1 overflow-x-auto py-0.5 no-scrollbar">
          <span className="font-medium text-slate-400 mr-1 hidden sm:inline">Screen:</span>
          {[
            { id: 'today', label: '1. Today' },
            { id: 'coach', label: '2. Coach AI' },
            { id: 'analytics', label: '3. Analytics' },
            { id: 'log', label: '4. Log Meal (Vision)' },
          ].map((screen) => (
            <button
              key={screen.id}
              onClick={() => onSelectScreen?.(screen.id)}
              className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-all ${
                activeScreen === screen.id
                  ? 'bg-emerald-800 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {screen.label}
            </button>
          ))}
        </div>

        {setViewMode && (
          <button
            onClick={() => setViewMode(viewMode === 'mobile' ? 'gallery' : 'mobile')}
            className="ml-2 px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium hover:bg-slate-50 text-[11px] whitespace-nowrap"
            title="Toggle between single mobile viewport and all 4 screens side-by-side"
          >
            {viewMode === 'mobile' ? 'Compare 4 Screens' : 'Mobile View'}
          </button>
        )}
      </div>
    </header>
  );
};
