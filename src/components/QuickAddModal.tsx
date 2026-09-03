import React, { useState } from 'react';
import { X, Zap, Plus, Minus, Coffee, Dumbbell, Apple, Cookie, Milk, Check } from 'lucide-react';
import { MealItem } from '../types';
import { sounds } from '../utils/audio';

interface QuickAddModalProps {
  onClose: () => void;
  onLogMeal: (meal: Omit<MealItem, 'id' | 'time'>) => void;
  defaultSlot?: 'Breakfast' | 'Lunch' | 'Snack' | 'Dinner';
}

const QUICK_PRESETS = [
  {
    title: 'Whey Protein Shake',
    subtitle: 'Isolate • Post-workout',
    calories: 140,
    protein: 28,
    carbs: 3,
    fat: 1.5,
    icon: Dumbbell,
    slot: 'Snack' as const,
    image: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'Oat Milk Flat White',
    subtitle: 'Double shot espresso',
    calories: 85,
    protein: 3,
    carbs: 11,
    fat: 3.5,
    icon: Coffee,
    slot: 'Breakfast' as const,
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'Greek Yogurt & Berries',
    subtitle: 'High casein protein',
    calories: 130,
    protein: 18,
    carbs: 10,
    fat: 1,
    icon: Milk,
    slot: 'Snack' as const,
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'Apple & Raw Almonds',
    subtitle: 'Clean fiber & healthy fats',
    calories: 180,
    protein: 5,
    carbs: 22,
    fat: 10,
    icon: Apple,
    slot: 'Snack' as const,
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'Dark Chocolate & Nuts',
    subtitle: '85% Cocoa antioxidant bite',
    calories: 150,
    protein: 3,
    carbs: 12,
    fat: 11,
    icon: Cookie,
    slot: 'Snack' as const,
    image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=400&q=80',
  },
];

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  onClose,
  onLogMeal,
  defaultSlot = 'Snack',
}) => {
  const [selectedSlot, setSelectedSlot] = useState<'Breakfast' | 'Lunch' | 'Snack' | 'Dinner'>(defaultSlot);
  const [customTitle, setCustomTitle] = useState('Quick Snack');
  const [calories, setCalories] = useState(200);
  const [protein, setProtein] = useState(15);
  const [carbs, setCarbs] = useState(20);
  const [fat, setFat] = useState(6);

  const handleAdjustCalories = (delta: number) => {
    sounds.playClick();
    setCalories((prev) => Math.max(10, prev + delta));
  };

  const handleLogCustom = () => {
    sounds.playSuccess();
    onLogMeal({
      mealType: selectedSlot,
      title: customTitle || 'Quick Log',
      subtitle: 'Fast Track Log • Custom Entry',
      calories,
      protein,
      carbs,
      fat,
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=400&q=80',
    });
    onClose();
  };

  const handleSelectPreset = (preset: typeof QUICK_PRESETS[0]) => {
    sounds.playSuccess();
    onLogMeal({
      mealType: preset.slot,
      title: preset.title,
      subtitle: preset.subtitle,
      calories: preset.calories,
      protein: preset.protein,
      carbs: preset.carbs,
      fat: preset.fat,
      image: preset.image,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-3xl p-5 space-y-4 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif-display font-bold text-base text-slate-900 leading-tight">
                Quick Add &amp; Presets
              </h3>
              <span className="text-[11px] text-slate-400">1-Tap Fast Logging</span>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Meal Slot Selector */}
        <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100/90 rounded-2xl text-xs font-semibold">
          {(['Breakfast', 'Lunch', 'Snack', 'Dinner'] as const).map((slot) => (
            <button
              key={slot}
              onClick={() => {
                sounds.playClick();
                setSelectedSlot(slot);
              }}
              className={`py-1.5 rounded-xl transition-all ${
                selectedSlot === slot
                  ? 'bg-white text-emerald-900 font-bold shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {slot}
            </button>
          ))}
        </div>

        {/* Quick 1-Tap Presets */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            POPULAR FAST LOGS
          </span>
          <div className="grid grid-cols-1 gap-2">
            {QUICK_PRESETS.map((preset, idx) => {
              const Icon = preset.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectPreset(preset)}
                  className="w-full p-2.5 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-emerald-50/50 hover:border-emerald-200 flex items-center justify-between transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center text-emerald-800 shadow-2xs group-hover:scale-105 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-950">
                        {preset.title}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {preset.protein}g P • {preset.carbs}g C • {preset.fat}g F
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 bg-white px-2 py-1 rounded-lg border border-slate-200/60 shadow-2xs">
                      +{preset.calories} kcal
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Quick Calorie Dial */}
        <div className="pt-2 border-t border-slate-100 space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            CUSTOM CALORIE QUICK-DIAL
          </span>

          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="Item name..."
                className="text-xs font-semibold bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-800 w-44 focus:outline-hidden focus:ring-1 focus:ring-emerald-700"
              />

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleAdjustCalories(-50)}
                  className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-100 active:scale-95 shadow-2xs"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <div className="text-center min-w-16">
                  <span className="text-base font-bold font-serif-display text-slate-900">
                    {calories}
                  </span>
                  <span className="text-[10px] text-slate-400 block -mt-1 font-medium">kcal</span>
                </div>
                <button
                  onClick={() => handleAdjustCalories(50)}
                  className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-100 active:scale-95 shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick Macro Sliders */}
            <div className="grid grid-cols-3 gap-2 pt-1 text-xs">
              <div className="bg-white rounded-xl p-2 border border-slate-100 text-center">
                <span className="text-[10px] font-semibold text-rose-600 block">Protein (g)</span>
                <input
                  type="number"
                  value={protein}
                  onChange={(e) => setProtein(Number(e.target.value))}
                  className="w-full text-center font-bold text-slate-900 font-serif-display focus:outline-hidden"
                />
              </div>
              <div className="bg-white rounded-xl p-2 border border-slate-100 text-center">
                <span className="text-[10px] font-semibold text-amber-600 block">Carbs (g)</span>
                <input
                  type="number"
                  value={carbs}
                  onChange={(e) => setCarbs(Number(e.target.value))}
                  className="w-full text-center font-bold text-slate-900 font-serif-display focus:outline-hidden"
                />
              </div>
              <div className="bg-white rounded-xl p-2 border border-slate-100 text-center">
                <span className="text-[10px] font-semibold text-emerald-700 block">Fats (g)</span>
                <input
                  type="number"
                  value={fat}
                  onChange={(e) => setFat(Number(e.target.value))}
                  className="w-full text-center font-bold text-slate-900 font-serif-display focus:outline-hidden"
                />
              </div>
            </div>

            <button
              onClick={handleLogCustom}
              className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 active:scale-[0.99] text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Log {customTitle} (+{calories} kcal) to {selectedSlot}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
