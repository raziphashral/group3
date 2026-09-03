import React, { useState } from 'react';
import {
  TrendingUp,
  Share2,
  ChevronDown,
  ChevronUp,
  Flame,
  Footprints,
  Droplet,
  CheckCircle2,
  Dumbbell,
  FileText,
  Download,
  X,
  Printer,
  Check,
  Award,
  Sparkles,
  Info,
} from 'lucide-react';
import { SCORECARDS, WEEKLY_ADHERENCE } from '../data/mockData';
import { ScorecardItem } from '../types';
import { sounds } from '../utils/audio';

export const AnalyticsView: React.FC = () => {
  const [activeRange, setActiveRange] = useState<'Day' | 'Week' | 'Month'>('Week');
  const [expandedCardId, setExpandedCardId] = useState<string | null>('sc-1');
  const [showShareModal, setShowShareModal] = useState(false);
  const [hoveredDay, setHoveredDay] = useState<string | null>('Thu');
  const [copiedNotice, setCopiedNotice] = useState(false);

  const goalCalorie = 2100;
  const maxCalorieChart = 2400;

  const handleCopySummary = () => {
    sounds.playSuccess();
    setCopiedNotice(true);
    navigator.clipboard?.writeText(
      `NutriCoach Pro Report (Aug 28 - Sep 3)\nAverage Calories: 2,045 kcal/day (Target: 2,100 kcal)\nMacro Split: 30% Protein (134g avg) | 40% Carbs (198g avg) | 30% Fats (68g avg)\nAdherence Score: 97% (Optimal metabolic stability)`
    );
    setTimeout(() => setCopiedNotice(false), 3000);
  };

  return (
    <div className="space-y-4 pb-24 max-w-lg mx-auto px-4 pt-2 animate-fadeIn">
      {/* Title & Badge */}
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[11px] font-bold tracking-widest text-emerald-800 uppercase">
            METABOLIC PERFORMANCE
          </span>
          <h1 className="font-serif-display text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
            Analytics &amp; Trends
          </h1>
        </div>

        <div className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-900 shadow-2xs flex items-center gap-1">
          <Award className="w-3.5 h-3.5 text-emerald-700" />
          <span>97% Target Hit</span>
        </div>
      </div>

      {/* Time Tab Segmented Selector */}
      <div className="bg-slate-100/90 p-1 rounded-2xl flex items-center text-xs font-semibold text-slate-600">
        {(['Day', 'Week', 'Month'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              sounds.playClick();
              setActiveRange(tab);
            }}
            className={`flex-1 py-1.5 rounded-xl transition-all text-center ${
              activeRange === tab
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Weekly Adherence Chart Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              WEEKLY ADHERENCE
            </div>
            <div className="text-xl font-bold text-slate-900 font-serif-display mt-0.5">
              2,045 <span className="text-xs font-sans text-slate-500 font-medium">kcal/day avg</span>
            </div>
          </div>

          <div className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
            <span>Optimal</span>
          </div>
        </div>

        {/* Adherence Bar Chart Graphic */}
        <div className="relative pt-6 pb-2">
          {/* Dotted 2,100 Goal Line */}
          <div
            className="absolute inset-x-0 border-t border-dashed border-slate-300 z-0 flex items-center justify-end"
            style={{ top: `${100 - (goalCalorie / maxCalorieChart) * 100}%` }}
          >
            <div className="bg-white px-1.5 text-[10px] font-medium text-slate-400 -mt-2.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              <span>2,100 Goal</span>
            </div>
          </div>

          {/* Bars */}
          <div className="h-44 flex items-end justify-between gap-2 relative z-10 px-2">
            {WEEKLY_ADHERENCE.map((item) => {
              const heightPercent = Math.min(100, Math.round((item.calories / maxCalorieChart) * 100));
              const isSurplus = item.status === 'surplus';
              const isToday = item.isToday;
              const isSelected = hoveredDay === item.day;

              return (
                <div
                  key={item.day}
                  onMouseEnter={() => setHoveredDay(item.day)}
                  onClick={() => {
                    sounds.playClick();
                    setHoveredDay(item.day);
                  }}
                  className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
                >
                  {/* Tooltip on hover/click */}
                  <div
                    className={`text-[10px] font-bold transition-opacity whitespace-nowrap ${
                      isSelected ? 'opacity-100 text-slate-900 scale-105' : 'opacity-0'
                    }`}
                  >
                    {item.calories}
                  </div>

                  {/* Bar */}
                  <div className="w-full max-w-[28px] h-full flex items-end">
                    <div
                      className={`w-full rounded-t-lg transition-all duration-500 ease-out group-hover:opacity-90 ${
                        isSurplus
                          ? 'bg-amber-500'
                          : isToday
                          ? 'bg-emerald-800'
                          : isSelected
                          ? 'bg-emerald-700 ring-2 ring-emerald-300'
                          : 'bg-emerald-500'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>

                  <span
                    className={`text-[11px] font-medium transition-colors ${
                      isToday ? 'text-emerald-900 font-bold' : isSelected ? 'text-slate-900 font-bold' : 'text-slate-500'
                    }`}
                  >
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Chart Legend */}
          <div className="flex items-center justify-center gap-5 pt-3 border-t border-slate-100 text-[11px] font-medium text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Within Target</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Slight Surplus (&lt;5%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Macro Ratio Breakdown Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-3.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
            7-DAY MACRONUTRIENT DISTRIBUTION
          </span>
          <span className="text-xs text-slate-400 font-medium">Zone Diet Adherence</span>
        </div>

        {/* Stacked Macro Distribution Bar */}
        <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-100">
          <div className="h-full bg-rose-500" style={{ width: '30%' }} title="Protein 30%" />
          <div className="h-full bg-amber-500" style={{ width: '40%' }} title="Carbs 40%" />
          <div className="h-full bg-emerald-700" style={{ width: '30%' }} title="Fats 30%" />
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-rose-50/70 rounded-xl p-2 border border-rose-100">
            <div className="font-semibold text-rose-700">Protein</div>
            <div className="text-sm font-bold font-serif-display text-slate-900">30%</div>
            <div className="text-[10px] text-slate-500">134g / day avg</div>
          </div>
          <div className="bg-amber-50/70 rounded-xl p-2 border border-amber-100">
            <div className="font-semibold text-amber-700">Carbs</div>
            <div className="text-sm font-bold font-serif-display text-slate-900">40%</div>
            <div className="text-[10px] text-slate-500">198g / day avg</div>
          </div>
          <div className="bg-emerald-50/70 rounded-xl p-2 border border-emerald-100">
            <div className="font-semibold text-emerald-800">Fats</div>
            <div className="text-sm font-bold font-serif-display text-slate-900">30%</div>
            <div className="text-[10px] text-slate-500">68g / day avg</div>
          </div>
        </div>
      </div>

      {/* Micronutrients & Hydration Index */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">
          MICRONUTRIENT &amp; VITALITY BENCHMARKS
        </span>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Droplet className="w-4 h-4 text-teal-600" />
              <div>
                <span className="font-bold text-slate-900 block">2.4L / day</span>
                <span className="text-[10px] text-slate-500">Avg Hydration</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/70 px-1.5 py-0.5 rounded">
              96%
            </span>
          </div>

          <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Footprints className="w-4 h-4 text-amber-600" />
              <div>
                <span className="font-bold text-slate-900 block">10,240</span>
                <span className="text-[10px] text-slate-500">Daily Steps</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/70 px-1.5 py-0.5 rounded">
              102%
            </span>
          </div>

          <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-500" />
              <div>
                <span className="font-bold text-slate-900 block">34g / day</span>
                <span className="text-[10px] text-slate-500">Dietary Fiber</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/70 px-1.5 py-0.5 rounded">
              Optimal
            </span>
          </div>

          <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-indigo-600" />
              <div>
                <span className="font-bold text-slate-900 block">4 sessions</span>
                <span className="text-[10px] text-slate-500">Resistance Training</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/70 px-1.5 py-0.5 rounded">
              Goal Met
            </span>
          </div>
        </div>
      </div>

      {/* DAILY SCORECARDS Section */}
      <div className="space-y-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">
          DAILY SCORECARDS
        </span>

        <div className="space-y-2">
          {SCORECARDS.map((card) => {
            const isExpanded = expandedCardId === card.id;

            return (
              <div
                key={card.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition-all"
              >
                <button
                  onClick={() => {
                    sounds.playClick();
                    setExpandedCardId(isExpanded ? null : card.id);
                  }}
                  className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50/70 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-xs border border-emerald-100">
                      {card.day.slice(0, 3)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{card.highlight}</div>
                      <div className="text-[11px] text-slate-400">
                        {card.caloriesConsumed.toLocaleString()} kcal consumed
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-emerald-800">
                      On Target
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-3.5 pt-1 border-t border-slate-100 text-xs text-slate-600 space-y-2 bg-slate-50/50 animate-fadeIn">
                    <p className="leading-relaxed">{card.details}</p>
                    <div className="flex items-center gap-4 text-[11px] text-slate-500 font-medium">
                      <span>Protein: <strong className="text-slate-800">{card.breakdown.protein}g</strong></span>
                      <span>•</span>
                      <span>Carbs: <strong className="text-slate-800">{card.breakdown.carbs}g</strong></span>
                      <span>•</span>
                      <span>Fats: <strong className="text-slate-800">{card.breakdown.fat}g</strong></span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Share / Export Report Button */}
      <button
        onClick={() => {
          sounds.playClick();
          setShowShareModal(true);
        }}
        className="w-full py-3.5 px-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 text-slate-800 font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
      >
        <Share2 className="w-4 h-4 text-emerald-800" />
        <span>Export Clinical Report for Dietitian or Coach</span>
      </button>

      {/* Share / Report Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-3xl p-5 space-y-4 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-800" />
                <h3 className="font-serif-display font-bold text-base text-slate-900">
                  Certified Nutrition Summary
                </h3>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs space-y-2 text-slate-700 font-mono">
              <div className="flex justify-between font-bold text-slate-900 border-b border-slate-200 pb-1 font-sans">
                <span>Sarah Chen (ID: NC-8841)</span>
                <span>HPB Grade: A</span>
              </div>
              <div className="flex justify-between">
                <span>Avg Daily Intake:</span>
                <span className="font-bold">2,045 kcal (97% Adherence)</span>
              </div>
              <div className="flex justify-between">
                <span>Protein Compliance:</span>
                <span className="font-bold">134g / day (Target: 130g)</span>
              </div>
              <div className="flex justify-between">
                <span>Saturated Fat &lt;7%:</span>
                <span className="font-bold text-emerald-700">Pass</span>
              </div>
              <div className="flex justify-between">
                <span>Hydration Index:</span>
                <span className="font-bold">2.4L / day (Optimal)</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={handleCopySummary}
                className="py-2.5 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
              >
                {copiedNotice ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                <span>{copiedNotice ? 'Copied Summary!' : 'Copy Summary'}</span>
              </button>

              <button
                onClick={() => {
                  sounds.playSuccess();
                  window.print();
                }}
                className="py-2.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
