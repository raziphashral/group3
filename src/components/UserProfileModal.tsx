import React, { useState } from 'react';
import { X, Flame, Shield, Activity, Target, Smartphone, Check } from 'lucide-react';
import { USER_PROFILE } from '../data/mockData';

interface UserProfileModalProps {
  onClose: () => void;
  calorieTarget: number;
  onUpdateTarget: (target: number) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  onClose,
  calorieTarget,
  onUpdateTarget,
}) => {
  const [target, setTarget] = useState(calorieTarget);
  const [dietProtocol, setDietProtocol] = useState('Zone Diet (40/30/30)');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    onUpdateTarget(target);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-3xl p-5 space-y-4 shadow-2xl border border-slate-100">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <img
              src={USER_PROFILE.avatarUrl}
              alt={USER_PROFILE.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/30"
              referrerPolicy="no-referrer"
            />
            <div>
              <h3 className="font-serif-display font-bold text-base text-slate-900 leading-tight">
                {USER_PROFILE.name}
              </h3>
              <span className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                {USER_PROFILE.streakDays} Day Active Streak
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nutritional Protocol Settings */}
        <div className="space-y-3 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Daily Calorie Target (kcal)
            </label>
            <input
              type="number"
              value={target}
              step={50}
              onChange={(e) => setTarget(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Metabolic Protocol
            </label>
            <select
              value={dietProtocol}
              onChange={(e) => setDietProtocol(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
            >
              <option value="Zone Diet (40/30/30)">Zone Diet (40% C / 30% P / 30% F)</option>
              <option value="High Protein Lean Mass (40P/40C/20F)">High Protein Lean Mass (40P/40C/20F)</option>
              <option value="Low Glycemic Balanced (HPB Standard)">Low Glycemic Balanced (HPB Standard)</option>
              <option value="Keto Metabolic Reset">Keto Metabolic Reset</option>
            </select>
          </div>

          {/* Connected Health Providers */}
          <div className="pt-2 border-t border-slate-100">
            <span className="font-bold text-slate-700 block mb-2">
              Connected Health Ecosystem
            </span>
            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-rose-500" />
                  <span className="font-medium text-slate-800">Apple Health</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[10px]">
                  Connected
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-blue-500" />
                  <span className="font-medium text-slate-800">Garmin Connect</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[10px]">
                  Live Sync
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="pt-2">
          <button
            onClick={handleSave}
            className="w-full py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Saved Changes!</span>
              </>
            ) : (
              <span>Update Targets</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
