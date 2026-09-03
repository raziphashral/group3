import React from 'react';
import { Activity, Bot, TrendingUp, UtensilsCrossed, MessageSquare } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'today' | 'coach' | 'analytics' | 'plan' | 'talk';
  onTabChange: (tab: 'today' | 'coach' | 'analytics' | 'plan' | 'talk') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'today' as const, label: 'Today', icon: Activity },
    { id: 'coach' as const, label: 'Coach AI', icon: Bot },
    { id: 'analytics' as const, label: 'Analytics', icon: TrendingUp },
    { id: 'plan' as const, label: 'Plan', icon: UtensilsCrossed },
    { id: 'talk' as const, label: 'Talk to Us', icon: MessageSquare },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-100 py-2 px-2">
      <div className="max-w-lg mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-1 py-1 px-1.5 transition-colors ${
                isActive ? 'text-emerald-800 font-semibold' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                {isActive && (
                  <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                )}
              </div>
              <span className="text-[10.5px] sm:text-[11px] tracking-tight whitespace-nowrap">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
