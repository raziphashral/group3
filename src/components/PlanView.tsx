import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  ShoppingCart,
  Plus,
  Clock,
  Sparkles,
  Utensils,
  ChevronRight,
  Flame,
} from 'lucide-react';

export const PlanView: React.FC = () => {
  const [groceries, setGroceries] = useState([
    { id: 'g1', name: 'Atlantic Salmon Fillets (2x 180g)', category: 'Protein', checked: false },
    { id: 'g2', name: 'Tender Green Asparagus bundle', category: 'Produce', checked: true },
    { id: 'g3', name: 'Tri-color Quinoa (organic)', category: 'Pantry', checked: false },
    { id: 'g4', name: 'Cold Pressed Extra Virgin Olive Oil', category: 'Pantry', checked: true },
    { id: 'g5', name: 'Fresh Lemons & Garlic bulbs', category: 'Produce', checked: false },
    { id: 'g6', name: 'Greek Yogurt (Plain 2%)', category: 'Dairy', checked: true },
  ]);

  const toggleGrocery = (id: string) => {
    setGroceries((prev) =>
      prev.map((g) => (g.id === id ? { ...g, checked: !g.checked } : g))
    );
  };

  const planDays = [
    { day: 'Thursday (Today)', status: 'Active', target: '2,100 kcal', dinner: 'Pan-Seared Salmon & Quinoa' },
    { day: 'Friday', status: 'Planned', target: '2,100 kcal', dinner: 'Lemon Herb Roasted Chicken' },
    { day: 'Saturday', status: 'Planned', target: '2,200 kcal', dinner: 'Sweetgreen Warm Protein Bowl' },
    { day: 'Sunday', status: 'Prep Day', target: '2,050 kcal', dinner: 'Slow-Cooked Beef & Lentil Stew' },
  ];

  return (
    <div className="space-y-4 pb-24 max-w-lg mx-auto px-4 pt-2">
      {/* Title */}
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[11px] font-bold tracking-widest text-emerald-800 uppercase">
            MEAL ARCHITECTURE
          </span>
          <h1 className="font-serif-display text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
            Weekly Plan &amp; Prep
          </h1>
        </div>

        <div className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
          Target: 2,100 kcal
        </div>
      </div>

      {/* Days Schedule */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-serif-display text-base font-bold text-slate-900">
            Upcoming Dinners
          </h2>
          <span className="text-xs text-slate-400 font-medium">Auto-balanced by AI</span>
        </div>

        <div className="space-y-2.5">
          {planDays.map((item, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                idx === 0
                  ? 'bg-emerald-50/60 border-emerald-200'
                  : 'bg-slate-50/60 border-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                    idx === 0 ? 'bg-emerald-800 text-white' : 'bg-white text-slate-700 shadow-2xs'
                  }`}
                >
                  <Utensils className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">{item.day}</div>
                  <div className="text-xs text-emerald-900 font-medium">{item.dinner}</div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-bold text-slate-700">{item.target}</span>
                <div className="text-[10px] text-slate-400 font-medium">{item.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Smart Grocery Checklist Auto-Synced with Coach AI */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-emerald-800" />
            <h2 className="font-serif-display text-base font-bold text-slate-900">
              Smart Grocery List
            </h2>
          </div>
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
            {groceries.filter((g) => g.checked).length}/{groceries.length} Checked
          </span>
        </div>

        <p className="text-xs text-slate-500">
          Ingredients synced automatically from your dinner recipes to avoid food waste and hit exact macro counts.
        </p>

        <div className="space-y-2">
          {groceries.map((item) => (
            <button
              key={item.id}
              onClick={() => toggleGrocery(item.id)}
              className="w-full p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 flex items-center justify-between text-left transition-all"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                    item.checked
                      ? 'bg-emerald-800 border-emerald-800 text-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {item.checked && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
                <span
                  className={`text-xs ${
                    item.checked ? 'line-through text-slate-400' : 'font-medium text-slate-800'
                  }`}
                >
                  {item.name}
                </span>
              </div>

              <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                {item.category}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
