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
} from 'lucide-react';
import { SCORECARDS, WEEKLY_ADHERENCE } from '../data/mockData';
import { ScorecardItem } from '../types';

export const AnalyticsView: React.FC = () => {
  const [activeRange, setActiveRange] = useState<'Day' | 'Week' | 'Month'>('Week');
  const [expandedCardId, setExpandedCardId] = useState<string | null>('sc-1');
  const [showShareModal, setShowShareModal] = useState(false);
  const [hoveredDay, setHoveredDay] = useState<string | null>(null);

  const goalCalorie = 2100;
  const maxCalorieChart = 2400;

  return (
    <div className="space-y-4 pb-24 max-w-lg mx-auto px-4 pt-2">
      {/* Title & Badge */}
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[11px] font-bold tracking-widest text-emerald-800 uppercase">
            METABOLIC PERFORMANCE
          </span>
          <h1 className="font-serif-display text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
            Analytics & Trends
          </h1>
        </div>

        <div className="px-3 py-1 rounded-full bg-indigo-50/90 border border-indigo-100 text-xs font-semibold text-indigo-900 shadow-2xs">
          97% Target Hit
        </div>
      </div>

      {/* Time Tab Segmented Selector */}
      <div className="bg-slate-100/90 p-1 rounded-2xl flex items-center text-xs font-semibold text-slate-600">
        {(['Day', 'Week', 'Month'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveRange(tab)}
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
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
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

              return (
                <div
                  key={item.day}
                  onMouseEnter={() => setHoveredDay(item.day)}
                  onMouseLeave={() => setHoveredDay(null)}
                  className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
                >
                  {/* Tooltip on hover */}
                  <div
                    className={`text-[10px] font-bold transition-opacity whitespace-nowrap ${
                      hoveredDay === item.day ? 'opacity-100 text-slate-900' : 'opacity-0'
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
                          : 'bg-emerald-500'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>

                  <span
                    className={`text-[11px] font-medium transition-colors ${
                      isToday ? 'text-emerald-900 font-bold' : 'text-slate-500'
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

      {/* Macro Ratio Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-3.5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif-display text-base font-bold text-slate-900">
              Macro Ratio
            </h3>
            <div className="text-xs text-slate-400">7-day average nutrient balance</div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
            Zone Diet
          </span>
        </div>

        {/* Segmented Triple Progress Bar */}
        <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex shadow-inner">
          <div className="h-full bg-rose-500" style={{ width: '28%' }} title="Protein 28%" />
          <div className="h-full bg-emerald-500" style={{ width: '46%' }} title="Carbs 46%" />
          <div className="h-full bg-amber-500" style={{ width: '26%' }} title="Fats 26%" />
        </div>

        {/* Breakdown Stats */}
        <div className="grid grid-cols-3 gap-2 pt-1 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-100">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Protein</span>
            </div>
            <div className="text-base font-bold text-slate-900 font-serif-display mt-0.5">
              28%
            </div>
            <div className="text-[11px] text-slate-400 font-medium">143g/day</div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-100">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Carbs</span>
            </div>
            <div className="text-base font-bold text-slate-900 font-serif-display mt-0.5">
              46%
            </div>
            <div className="text-[11px] text-slate-400 font-medium">235g/day</div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-100">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Fats</span>
            </div>
            <div className="text-base font-bold text-slate-900 font-serif-display mt-0.5">
              26%
            </div>
            <div className="text-[11px] text-slate-400 font-medium">59g/day</div>
          </div>
        </div>
      </div>

      {/* Vitals Synced Card */}
      <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif-display text-base font-bold text-slate-900">
              Vitals Synced
            </h3>
            <div className="text-xs text-slate-400">Apple Health & Garmin Connect</div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live</span>
          </div>
        </div>

        {/* 3 Metrics */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2.5 rounded-2xl bg-rose-50/50 border border-rose-100/70 flex flex-col items-center">
            <Flame className="w-4 h-4 text-rose-500 mb-1" />
            <span className="text-base font-bold text-slate-900 font-serif-display leading-tight">
              540
            </span>
            <span className="text-[10px] font-medium text-slate-500 mt-0.5">Active kcal</span>
          </div>

          <div className="p-2.5 rounded-2xl bg-teal-50/50 border border-teal-100/70 flex flex-col items-center">
            <Footprints className="w-4 h-4 text-teal-600 mb-1" />
            <span className="text-base font-bold text-slate-900 font-serif-display leading-tight">
              9,420
            </span>
            <span className="text-[10px] font-medium text-slate-500 mt-0.5">Steps/day</span>
          </div>

          <div className="p-2.5 rounded-2xl bg-amber-50/50 border border-amber-100/70 flex flex-col items-center">
            <Droplet className="w-4 h-4 text-amber-500 mb-1" />
            <span className="text-base font-bold text-slate-900 font-serif-display leading-tight">
              2.4 L
            </span>
            <span className="text-[10px] font-medium text-slate-500 mt-0.5">Hydration</span>
          </div>
        </div>
      </div>

      {/* End of Day Scorecards Accordion */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="font-serif-display text-base font-bold text-slate-900">
            End of Day Scorecards
          </h3>
          <button className="text-xs font-semibold text-emerald-800 hover:text-emerald-900">
            View History
          </button>
        </div>

        <div className="space-y-2">
          {SCORECARDS.map((card) => {
            const isExpanded = expandedCardId === card.id;
            return (
              <div
                key={card.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-2xs overflow-hidden transition-all"
              >
                <button
                  onClick={() => setExpandedCardId(isExpanded ? null : card.id)}
                  className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        card.status === 'hit'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : card.status === 'high_protein'
                          ? 'bg-rose-50 text-rose-600 border border-rose-200'
                          : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      }`}
                    >
                      {card.status === 'hit' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      {card.status === 'high_protein' && <Dumbbell className="w-4 h-4 text-rose-500" />}
                      {card.status === 'under_budget' && <FileText className="w-4 h-4 text-indigo-600" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                        <span>{card.day}</span>
                        <span className="text-[11px] font-semibold text-slate-600">
                          {card.highlightIcon} {card.highlight}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {card.caloriesConsumed.toLocaleString()} kcal consumed
                      </div>
                    </div>
                  </div>

                  <div className="text-slate-400">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-3.5 pb-3.5 pt-1 text-xs text-slate-600 border-t border-slate-100 space-y-2 bg-slate-50/40">
                    <p className="leading-relaxed text-slate-600">{card.details}</p>
                    <div className="flex items-center gap-3 pt-1 text-[11px] font-medium text-slate-500">
                      <span>Protein: <strong className="text-slate-800">{card.breakdown.protein}g</strong></span>
                      <span>•</span>
                      <span>Carbs: <strong className="text-slate-800">{card.breakdown.carbs}g</strong></span>
                      <span>•</span>
                      <span>Fat: <strong className="text-slate-800">{card.breakdown.fat}g</strong></span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Share with HPB or Dietitian CTA Button */}
      <div className="pt-2 space-y-1.5 text-center">
        <button
          id="btn-share-dietitian"
          onClick={() => setShowShareModal(true)}
          className="w-full py-3.5 px-5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 active:scale-[0.99] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <Share2 className="w-4 h-4 text-emerald-300" />
          <span>Share with HPB or Dietitian</span>
        </button>
        <p className="text-[11px] text-slate-400">
          Exports certified PDF formatted for Health Promotion Board guidelines.
        </p>
      </div>

      {/* Share / Certified Report Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-3xl p-5 space-y-4 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                  HPB
                </div>
                <h3 className="font-serif-display font-bold text-base text-slate-900">
                  Export Dietitian Certified Report
                </h3>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-700" />
                <span>Health Promotion Board (HPB) Verified</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Includes 7-day caloric average (2,045 kcal), micronutrient balances, step counts, and macro split (40C/30P/30F Zone profile).
              </p>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Patient / User:</span>
                <strong className="text-slate-900">Sarah Chen</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Reporting Window:</span>
                <strong className="text-slate-900">Oct 18 - Oct 24 (7 Days)</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Adherence Score:</span>
                <strong className="text-emerald-800 font-bold">97% Target Hit (Optimal)</strong>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => {
                  alert('Certified PDF report downloaded successfully!');
                  setShowShareModal(false);
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>

              <button
                onClick={() => {
                  window.print();
                }}
                className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs"
                title="Print Report"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
