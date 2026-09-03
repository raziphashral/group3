import React, { useState } from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Utensils,
  Flame,
  Droplet,
  Camera,
  Mic,
  Plus,
  Sparkles,
  MoreVertical,
  Bell,
  Check,
  Trash2,
  ExternalLink,
  Zap,
  Info,
  Layers,
  Award,
} from 'lucide-react';
import { DayStats, MealItem } from '../types';
import { sounds } from '../utils/audio';

interface TodayViewProps {
  dayStats: DayStats;
  meals: MealItem[];
  onOpenLogMeal: (mealSlot?: 'Breakfast' | 'Lunch' | 'Snack' | 'Dinner') => void;
  onOpenQuickAdd?: (mealSlot?: 'Breakfast' | 'Lunch' | 'Snack' | 'Dinner') => void;
  onNavigateToCoach: () => void;
  onDeleteMeal?: (id: string) => void;
  onUpdateWater?: (amount: number) => void;
}

const WEEK_DAYS = [
  { day: 'Mon', date: 'Aug 31', status: 'done', adherence: '100%' },
  { day: 'Tue', date: 'Sep 1', status: 'done', adherence: '98%' },
  { day: 'Wed', date: 'Sep 2', status: 'done', adherence: '96%' },
  { day: 'Thu', date: 'Sep 3', status: 'today', adherence: 'Live' },
  { day: 'Fri', date: 'Sep 4', status: 'upcoming', adherence: 'Planned' },
  { day: 'Sat', date: 'Sep 5', status: 'upcoming', adherence: 'Planned' },
  { day: 'Sun', date: 'Sep 6', status: 'upcoming', adherence: 'Prep' },
];

export const TodayView: React.FC<TodayViewProps> = ({
  dayStats,
  meals,
  onOpenLogMeal,
  onOpenQuickAdd,
  onNavigateToCoach,
  onDeleteMeal,
  onUpdateWater,
}) => {
  const [showCoachBanner, setShowCoachBanner] = useState(true);
  const [notificationsActive, setNotificationsActive] = useState(true);
  const [activeMenuMealId, setActiveMenuMealId] = useState<string | null>(null);
  const [activeMacroDetail, setActiveMacroDetail] = useState<'protein' | 'carbs' | 'fats' | null>(null);
  const [selectedDayIdx, setSelectedDayIdx] = useState(3); // Thursday (Today)

  const remainingKcal = Math.max(0, dayStats.totalCaloriesTarget - dayStats.eatenCalories);
  const proteinPercent = Math.min(100, Math.round((dayStats.protein.current / dayStats.protein.target) * 100));
  const carbsPercent = Math.min(100, Math.round((dayStats.carbs.current / dayStats.carbs.target) * 100));
  const fatsPercent = Math.min(100, Math.round((dayStats.fats.current / dayStats.fats.target) * 100));
  const remainingProtein = Math.max(0, dayStats.protein.target - dayStats.protein.current);

  const handleWaterClick = (amount: number) => {
    sounds.playWaterDrop();
    onUpdateWater?.(amount);
  };

  return (
    <div className="space-y-4 pb-24 max-w-lg mx-auto px-4 pt-2 animate-fadeIn">
      {/* 7-Day Mini Calendar Strip */}
      <div className="bg-white rounded-2xl p-2.5 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
          {WEEK_DAYS.map((w, idx) => {
            const isSelected = selectedDayIdx === idx;
            const isToday = w.status === 'today';
            return (
              <button
                key={w.day}
                onClick={() => {
                  sounds.playClick();
                  setSelectedDayIdx(idx);
                }}
                className={`flex-1 py-1.5 px-1 rounded-xl flex flex-col items-center transition-all min-w-[42px] ${
                  isSelected
                    ? 'bg-emerald-800 text-white shadow-xs scale-102'
                    : isToday
                    ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200'
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                <span className="text-[10px] uppercase font-semibold">{w.day}</span>
                <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                  {w.date.split(' ')[1]}
                </span>
                <span
                  className={`w-1.5 h-1.5 rounded-full mt-1 ${
                    isSelected
                      ? 'bg-emerald-300'
                      : w.status === 'done'
                      ? 'bg-emerald-500'
                      : isToday
                      ? 'bg-amber-500 animate-pulse'
                      : 'bg-slate-300'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Date Navigator & Status Pill */}
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-2 bg-white border border-slate-200/80 rounded-full px-3.5 py-1.5 shadow-2xs text-sm font-medium text-slate-700">
          <button
            onClick={() => {
              sounds.playClick();
              setSelectedDayIdx((prev) => Math.max(0, prev - 1));
            }}
            className="text-slate-400 hover:text-slate-600 transition-colors"
            title="Previous Day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5 font-semibold text-slate-800">
            <Calendar className="w-3.5 h-3.5 text-emerald-700" />
            <span>{WEEK_DAYS[selectedDayIdx].day}, {WEEK_DAYS[selectedDayIdx].date}</span>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              setSelectedDayIdx((prev) => Math.min(WEEK_DAYS.length - 1, prev + 1));
            }}
            className="text-slate-400 hover:text-slate-600 transition-colors"
            title="Next Day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
          <span>{selectedDayIdx === 3 ? dayStats.statusText : WEEK_DAYS[selectedDayIdx].adherence}</span>
        </div>
      </div>

      {/* Main Calorie Ring & Macro Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm relative overflow-hidden">
        <div className="grid grid-cols-12 gap-4 items-center">
          {/* Circular Rings Graphic */}
          <div className="col-span-5 relative flex items-center justify-center">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                {/* Background tracks */}
                <circle cx="60" cy="60" r="50" fill="none" stroke="#f1f5f9" strokeWidth="6" />
                <circle cx="60" cy="60" r="42" fill="none" stroke="#f1f5f9" strokeWidth="6" />
                <circle cx="60" cy="60" r="34" fill="none" stroke="#f1f5f9" strokeWidth="6" />

                {/* Outer ring: Protein (Rose) */}
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth="6"
                  strokeDasharray={`${(proteinPercent / 100) * 314} 314`}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />

                {/* Middle ring: Carbs (Amber) */}
                <circle
                  cx="60"
                  cy="60"
                  r="42"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="6"
                  strokeDasharray={`${(carbsPercent / 100) * 264} 264`}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />

                {/* Inner ring: Fats (Emerald) */}
                <circle
                  cx="60"
                  cy="60"
                  r="34"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="6"
                  strokeDasharray={`${(fatsPercent / 100) * 213} 213`}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />
              </svg>

              {/* Center Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
                <span className="text-3xl font-bold tracking-tight text-slate-900 font-serif-display leading-none">
                  {remainingKcal}
                </span>
                <span className="text-[11px] font-medium text-slate-500 mt-0.5">kcal left</span>
              </div>
            </div>
          </div>

          {/* Right Metrics breakdown */}
          <div className="col-span-7 space-y-3 pl-2">
            <div>
              <div className="flex items-center justify-between text-xs font-bold tracking-wider text-slate-700 uppercase">
                <div className="flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5 text-emerald-800" />
                  <span>Eaten</span>
                </div>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                  {Math.round((dayStats.eatenCalories / dayStats.totalCaloriesTarget) * 100)}%
                </span>
              </div>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-bold text-slate-900 font-serif-display">
                  {dayStats.eatenCalories.toLocaleString()}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  / {dayStats.totalCaloriesTarget.toLocaleString()} kcal
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
              <div>
                <div className="text-[11px] text-slate-400 font-medium">Active Burn</div>
                <div className="text-sm font-semibold text-slate-800 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>{dayStats.burnedCalories} kcal</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">Hydration</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleWaterClick(0.25)}
                      className="text-[10px] text-emerald-700 hover:text-emerald-900 font-bold px-1.5 py-0.2 rounded bg-emerald-50 hover:bg-emerald-100 transition-colors shadow-2xs"
                      title="Drink +250ml glass"
                    >
                      +250ml
                    </button>
                  </div>
                </div>
                <div className="text-sm font-semibold text-emerald-800 flex items-center gap-1 mt-0.5">
                  <Droplet className="w-3.5 h-3.5 text-teal-600 fill-teal-600" />
                  <span>{dayStats.waterIntakeLiters.toFixed(1)} / {dayStats.waterTargetLiters}L</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Macro Cards at bottom with Interactive Info */}
        <div className="grid grid-cols-3 gap-2.5 mt-5 pt-4 border-t border-slate-100">
          {/* Protein */}
          <button
            onClick={() => {
              sounds.playClick();
              setActiveMacroDetail(activeMacroDetail === 'protein' ? null : 'protein');
            }}
            className={`rounded-xl p-2.5 border text-left transition-all ${
              activeMacroDetail === 'protein'
                ? 'bg-rose-50/80 border-rose-300 ring-2 ring-rose-200'
                : 'bg-slate-50/80 border-slate-100 hover:border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="flex items-center gap-1 font-semibold text-slate-800">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Protein
              </span>
              <span className="font-bold text-rose-600">{proteinPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mb-1">
              <div
                className="h-full bg-rose-500 rounded-full transition-all duration-500"
                style={{ width: `${proteinPercent}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              {dayStats.protein.current}/{dayStats.protein.target}g
            </div>
          </button>

          {/* Carbs */}
          <button
            onClick={() => {
              sounds.playClick();
              setActiveMacroDetail(activeMacroDetail === 'carbs' ? null : 'carbs');
            }}
            className={`rounded-xl p-2.5 border text-left transition-all ${
              activeMacroDetail === 'carbs'
                ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-200'
                : 'bg-slate-50/80 border-slate-100 hover:border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="flex items-center gap-1 font-semibold text-slate-800">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Carbs
              </span>
              <span className="font-bold text-amber-600">{carbsPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mb-1">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${carbsPercent}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              {dayStats.carbs.current}/{dayStats.carbs.target}g
            </div>
          </button>

          {/* Fats */}
          <button
            onClick={() => {
              sounds.playClick();
              setActiveMacroDetail(activeMacroDetail === 'fats' ? null : 'fats');
            }}
            className={`rounded-xl p-2.5 border text-left transition-all ${
              activeMacroDetail === 'fats'
                ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-200'
                : 'bg-slate-50/80 border-slate-100 hover:border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="flex items-center gap-1 font-semibold text-slate-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Fats
              </span>
              <span className="font-bold text-emerald-700">{fatsPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mb-1">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${fatsPercent}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              {dayStats.fats.current}/{dayStats.fats.target}g
            </div>
          </button>
        </div>

        {/* Expandable Macro Insight Sheet */}
        {activeMacroDetail && (
          <div className="mt-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-2 animate-fadeIn">
            <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-slate-900 capitalize">
                {activeMacroDetail} Target Deep-Dive:
              </span>
              {activeMacroDetail === 'protein' && (
                <p>
                  You have <strong className="text-rose-600">{remainingProtein}g</strong> remaining to hit your 130g target (30% Zone split). Recommended: Pan-seared salmon, Greek yogurt 0%, or grilled chicken tenderloins.
                </p>
              )}
              {activeMacroDetail === 'carbs' && (
                <p>
                  You have <strong className="text-amber-600">{dayStats.carbs.target - dayStats.carbs.current}g</strong> carbs left today. Prioritize complex, low-GI sources like tri-color quinoa, rolled oats, and fresh berries.
                </p>
              )}
              {activeMacroDetail === 'fats' && (
                <p>
                  You have <strong className="text-emerald-700">{dayStats.fats.target - dayStats.fats.current}g</strong> fats left. Ideal mono-unsaturated sources: Extra virgin olive oil, Hass avocado, or raw walnuts.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Dual CTA Buttons: Main Vision Log + Quick Add Preset */}
      <div className="flex items-center gap-2">
        <button
          id="btn-log-meal-main"
          onClick={() => {
            sounds.playClick();
            onOpenLogMeal();
          }}
          className="flex-1 py-3.5 px-4 rounded-2xl bg-emerald-800 hover:bg-emerald-900 active:scale-[0.99] text-white flex items-center justify-between shadow-sm transition-all group font-medium"
        >
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Plus className="w-5 h-5 text-emerald-300" />
            <span>Log Meal (Photo / Voice / Text)</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-200">
            <Camera className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <Mic className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </div>
        </button>

        {onOpenQuickAdd && (
          <button
            id="btn-quick-add"
            onClick={() => {
              sounds.playClick();
              onOpenQuickAdd();
            }}
            className="w-12 h-12 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200/80 text-amber-800 flex items-center justify-center shadow-xs active:scale-95 transition-all"
            title="Quick Add Calorie Preset"
          >
            <Zap className="w-5 h-5 text-amber-600 fill-amber-500" />
          </button>
        )}
      </div>

      {/* AI Nutrition Coach Alert Banner */}
      {showCoachBanner && (
        <div className="rounded-2xl p-4 bg-gradient-to-br from-emerald-50/90 via-teal-50/50 to-white border border-emerald-200 shadow-2xs relative animate-fadeIn">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-800 text-emerald-200 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[11px] tracking-wider text-emerald-800 uppercase">
                  AI NUTRITION COACH
                </span>
                <span className="text-[11px] text-slate-400">Calibrated</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-normal">
                You're <strong className="text-rose-600 font-semibold">{remainingProtein}g short</strong> of your protein goal today. A wild salmon fillet with roasted asparagus will perfectly hit your macro balance!
              </p>
              <div className="flex items-center gap-3 pt-1">
                <button
                  id="btn-see-suggested-meal"
                  onClick={() => {
                    sounds.playClick();
                    onNavigateToCoach();
                  }}
                  className="text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 px-3.5 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1 shadow-2xs active:scale-95"
                >
                  <span>See Suggested Meal</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setShowCoachBanner(false)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-700 px-2 py-1.5 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Today's Meals Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-serif-display text-lg font-bold text-slate-900">
              Today's Meals
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[11px] font-semibold text-slate-600">
              {meals.length} logged
            </span>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            Target ~{dayStats.totalCaloriesTarget.toLocaleString()} kcal
          </span>
        </div>

        {/* List of meals */}
        <div className="space-y-2.5">
          {meals.map((meal) => (
            <div
              key={meal.id}
              className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all relative group"
            >
              <div className="flex items-center gap-3.5">
                <img
                  src={meal.image}
                  alt={meal.title}
                  className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-100 shadow-2xs group-hover:scale-102 transition-transform"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-xs mb-0.5">
                    <span className="text-[11px] text-slate-500 font-medium">
                      {meal.mealType} • {meal.time}
                    </span>
                    <span className="font-bold text-slate-900 text-xs">
                      {meal.calories} kcal
                    </span>
                  </div>
                  <h3 className="font-serif-display text-sm font-bold text-slate-900 truncate">
                    {meal.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 truncate mb-1">
                    {meal.subtitle}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] font-medium text-slate-500">
                    <span>P: <strong className="text-slate-700">{meal.protein}g</strong></span>
                    <span>•</span>
                    <span>C: <strong className="text-slate-700">{meal.carbs}g</strong></span>
                    <span>•</span>
                    <span>F: <strong className="text-slate-700">{meal.fat}g</strong></span>
                  </div>
                </div>

                <div className="relative">
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setActiveMenuMealId(activeMenuMealId === meal.id ? null : meal.id);
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {activeMenuMealId === meal.id && (
                    <div className="absolute right-0 top-6 w-32 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-20 text-xs animate-fadeIn">
                      {onDeleteMeal && (
                        <button
                          onClick={() => {
                            sounds.playClick();
                            onDeleteMeal(meal.id);
                            setActiveMenuMealId(null);
                          }}
                          className="w-full px-3 py-1.5 text-left text-rose-600 hover:bg-rose-50 flex items-center gap-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Upcoming Dinner Slot */}
          <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-200/90 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white text-emerald-800 flex flex-col items-center justify-center shadow-2xs border border-emerald-100">
                <Utensils className="w-4 h-4 text-emerald-700" />
                <span className="text-[9px] font-bold mt-0.5">Dinner</span>
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium">Upcoming Slot</div>
                <div className="font-serif-display font-bold text-slate-900 text-sm">
                  Target: ~{remainingKcal} kcal
                </div>
                <div className="text-[11px] text-emerald-800 font-medium">
                  Aim for ~{remainingProtein}g protein to hit 100%
                </div>
              </div>
            </div>

            <button
              id="btn-add-dinner"
              onClick={() => {
                sounds.playClick();
                onOpenLogMeal('Dinner');
              }}
              className="w-9 h-9 rounded-full bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white flex items-center justify-center shadow-xs transition-transform"
              title="Log Dinner"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Meal Notifications Active Toggle Card */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center shrink-0">
            <Bell className="w-4 h-4 text-teal-700" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">
              Meal Notifications Active
            </div>
            <div className="text-[11px] text-slate-400">
              Before/after meal check-in prompts configured
            </div>
          </div>
        </div>

        {/* Toggle Switch */}
        <button
          onClick={() => {
            sounds.playClick();
            setNotificationsActive(!notificationsActive);
          }}
          className={`w-12 h-6.5 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out ${
            notificationsActive ? 'bg-emerald-600' : 'bg-slate-300'
          }`}
        >
          <div
            className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
              notificationsActive ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    </div>
  );
};
