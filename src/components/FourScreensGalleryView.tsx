import React from 'react';
import { ExternalLink, CheckCircle } from 'lucide-react';
import { TodayView } from './TodayView';
import { CoachView } from './CoachView';
import { AnalyticsView } from './AnalyticsView';
import { LogMealModal } from './LogMealModal';
import { DayStats, MealItem, RecommendationMeal } from '../types';

interface FourScreensGalleryViewProps {
  dayStats: DayStats;
  meals: MealItem[];
  onOpenLogMeal: (slot?: 'Breakfast' | 'Lunch' | 'Snack' | 'Dinner') => void;
  onNavigateToCoach: () => void;
  onLogCookMeal: (meal: RecommendationMeal) => void;
  onPreLogDelivery: (meal: RecommendationMeal) => void;
  onConfirmLog: (meal: Omit<MealItem, 'id' | 'time'>) => void;
  onFocusScreen: (screenId: 'today' | 'coach' | 'analytics' | 'log') => void;
}

export const FourScreensGalleryView: React.FC<FourScreensGalleryViewProps> = ({
  dayStats,
  meals,
  onOpenLogMeal,
  onNavigateToCoach,
  onLogCookMeal,
  onPreLogDelivery,
  onConfirmLog,
  onFocusScreen,
}) => {
  const screens = [
    {
      id: 'today' as const,
      title: 'Screen 1: Today Dashboard',
      subtitle: 'Macro rings, remaining targets, logged meals & slots',
      component: (
        <TodayView
          dayStats={dayStats}
          meals={meals}
          onOpenLogMeal={onOpenLogMeal}
          onNavigateToCoach={onNavigateToCoach}
        />
      ),
    },
    {
      id: 'coach' as const,
      title: 'Screen 2: Coach AI & Recommendations',
      subtitle: 'Live target engine, dinner cook/delivery options, chat',
      component: (
        <CoachView
          dayStats={dayStats}
          onLogCookMeal={onLogCookMeal}
          onPreLogDelivery={onPreLogDelivery}
        />
      ),
    },
    {
      id: 'analytics' as const,
      title: 'Screen 3: Analytics & Trends',
      subtitle: 'Metabolic adherence chart, macro ratio, vitals & scorecards',
      component: <AnalyticsView />,
    },
    {
      id: 'log' as const,
      title: 'Screen 4: Log Meal (Multimodal Vision)',
      subtitle: 'Live food scanner, ingredient breakdown & tweaks',
      component: (
        <LogMealModal
          onClose={() => onFocusScreen('today')}
          onConfirmLog={onConfirmLog}
          onNavigateToCoach={onNavigateToCoach}
        />
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      {/* Intro banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Exact Design Match Showcase</span>
          </div>
          <h2 className="font-serif-display text-2xl font-bold text-slate-900">
            All 4 Screens Recreated in High Fidelity
          </h2>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Each screen is fully interactive with live state recalculations, dynamic ingredient counters, macro target tracking, and AI nutritionist dialogue.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onFocusScreen('today')}
            className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs"
          >
            Launch Interactive Mobile App
          </button>
        </div>
      </div>

      {/* 4 Screens Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
        {screens.map((screen) => (
          <div
            key={screen.id}
            className="bg-slate-100/60 p-3.5 rounded-3xl border border-slate-200 shadow-sm flex flex-col"
          >
            <div className="flex items-center justify-between px-2 pb-3 mb-2 border-b border-slate-200/80">
              <div>
                <h3 className="font-serif-display text-base font-bold text-slate-900">
                  {screen.title}
                </h3>
                <p className="text-[11px] text-slate-500 line-clamp-1">{screen.subtitle}</p>
              </div>
              <button
                onClick={() => onFocusScreen(screen.id)}
                className="p-1.5 rounded-lg bg-white hover:bg-slate-200 text-slate-700 transition-colors shadow-2xs"
                title="Focus on this screen"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mobile screen frame container */}
            <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200/90 shadow-inner max-h-[800px] overflow-y-auto">
              {screen.component}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
