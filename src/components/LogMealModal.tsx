import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  Camera,
  FileText,
  ScanLine,
  Languages,
  Zap,
  Sparkles,
  Plus,
  Minus,
  Mic,
  ArrowRight,
  ShieldCheck,
  Check,
  Image as ImageIcon,
  CheckCircle2,
  Utensils,
  Leaf,
  Droplet,
  CircleDot,
  Video,
  Flashlight,
  Volume2,
  Search,
  Barcode,
  RefreshCw,
} from 'lucide-react';
import { USER_PROFILE, INITIAL_SCAN_INGREDIENTS } from '../data/mockData';
import { IngredientItem, MealItem } from '../types';
import { sounds } from '../utils/audio';

interface LogMealModalProps {
  onClose: () => void;
  onConfirmLog: (meal: Omit<MealItem, 'id' | 'time'>) => void;
  onNavigateToCoach: () => void;
  defaultSlot?: 'Breakfast' | 'Lunch' | 'Snack' | 'Dinner';
}

const BARCODE_ITEMS = [
  {
    barcode: '8888001122334',
    title: 'Chobani Zero Sugar Greek Yogurt (Vanilla)',
    brand: 'Chobani HPB Verified',
    calories: 110,
    protein: 15,
    carbs: 5,
    fat: 0,
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80',
  },
  {
    barcode: '074907038145',
    title: 'Quest Nutrition Chocolate Chip Protein Bar',
    brand: 'Quest Nutrition',
    calories: 200,
    protein: 21,
    carbs: 22,
    fat: 7,
    image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=600&q=80',
  },
  {
    barcode: '7394376616037',
    title: 'Oatly Barista Edition Oat Milk (250ml)',
    brand: 'Oatly AB',
    calories: 140,
    protein: 3,
    carbs: 16,
    fat: 7,
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
  },
];

export const LogMealModal: React.FC<LogMealModalProps> = ({
  onClose,
  onConfirmLog,
  onNavigateToCoach,
  defaultSlot = 'Lunch',
}) => {
  const [activeTab, setActiveTab] = useState<'photo' | 'text' | 'barcode'>('photo');
  const [ingredients, setIngredients] = useState<IngredientItem[]>(INITIAL_SCAN_INGREDIENTS);
  const [foodTitle, setFoodTitle] = useState('Grilled Chicken Salad');
  const [matchPercent, setMatchPercent] = useState(85);
  const [tweakText, setTweakText] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);
  const [isLiveCamera, setIsLiveCamera] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [naturalTextLog, setNaturalTextLog] = useState('');
  const [customPlateImage, setCustomPlateImage] = useState<string>(
    'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80'
  );
  const [tweakAppliedNotice, setTweakAppliedNotice] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Recalculate totals dynamically based on ingredients
  const totalCalories = Math.round(ingredients.reduce((acc, curr) => acc + curr.calories, 0));
  const totalProtein = Math.round(ingredients.reduce((acc, curr) => acc + curr.protein, 0));
  const totalCarbs = Math.round(ingredients.reduce((acc, curr) => acc + curr.carbs, 0));
  const totalFat = Math.round(ingredients.reduce((acc, curr) => acc + curr.fat, 0));

  const handleAdjustQuantity = (id: string, delta: number) => {
    sounds.playClick();
    setIngredients((prev) =>
      prev.map((ing) => {
        if (ing.id !== id) return ing;
        const newAmount = Math.max(0, ing.amount + delta);
        const factor = ing.amount > 0 ? newAmount / ing.amount : 1;
        return {
          ...ing,
          amount: newAmount,
          calories: Math.round(ing.calories * factor),
          protein: Math.round(ing.protein * factor),
          carbs: Math.round(ing.carbs * factor),
          fat: Math.round(ing.fat * factor * 10) / 10,
        };
      })
    );
  };

  const applyPresetTweak = (tweak: string) => {
    sounds.playClick();
    setTweakText(tweak);
    executeTweak(tweak);
  };

  const executeTweak = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes('half dressing') || lower.includes('less dressing')) {
      setIngredients((prev) =>
        prev.map((ing) =>
          ing.iconType === 'oil'
            ? {
                ...ing,
                amount: Math.round((ing.amount * 0.5) * 10) / 10,
                calories: Math.round(ing.calories * 0.5),
                fat: Math.round(ing.fat * 0.5),
              }
            : ing
        )
      );
      setTweakAppliedNotice("Reduced dressing by 50% (-90 kcal, -10g fat)");
    } else if (lower.includes('no feta') || lower.includes('no cheese') || lower.includes('remove cheese')) {
      setIngredients((prev) => prev.filter((ing) => ing.iconType !== 'dairy'));
      setTweakAppliedNotice("Removed feta cheese (-75 kcal)");
    } else if (lower.includes('extra chicken') || lower.includes('double protein')) {
      setIngredients((prev) =>
        prev.map((ing) =>
          ing.iconType === 'meat'
            ? {
                ...ing,
                amount: ing.amount + 50,
                calories: ing.calories + 80,
                protein: ing.protein + 15,
              }
            : ing
        )
      );
      setTweakAppliedNotice("Added +50g grilled chicken (+80 kcal, +15g protein)");
    } else if (lower.includes('avocado')) {
      setIngredients((prev) => [
        ...prev,
        {
          id: `ing-avocado-${Date.now()}`,
          name: 'Hass Avocado',
          calories: 80,
          protein: 1,
          carbs: 4,
          fat: 8,
          amount: 50,
          unit: 'g',
          iconType: 'veg',
        },
      ]);
      setTweakAppliedNotice("Added 50g fresh avocado (+80 kcal, +8g healthy fat)");
    } else {
      setTweakAppliedNotice(`Applied AI nutritional adjustment: "${text}"`);
    }

    setTweakText('');
    setTimeout(() => setTweakAppliedNotice(null), 3500);
  };

  const handleApplyTweak = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!tweakText.trim()) return;
    executeTweak(tweakText);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomPlateImage(url);
      sounds.playShutter();
      setIsCapturing(true);
      setTimeout(() => setIsCapturing(false), 800);
    }
  };

  const toggleLiveCamera = async () => {
    sounds.playClick();
    if (isLiveCamera) {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((t) => t.stop());
      }
      setIsLiveCamera(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        setIsLiveCamera(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.warn('Camera access fallback to sample capture:', err);
      }
    }
  };

  const handleSimulateShutter = () => {
    sounds.playShutter();
    setIsCapturing(true);
    setTimeout(() => {
      setIsCapturing(false);
      setMatchPercent(94);
    }, 600);
  };

  const handleConfirm = () => {
    sounds.playSuccess();
    onConfirmLog({
      mealType: defaultSlot,
      title: foodTitle,
      subtitle: `${ingredients.map((i) => i.name).slice(0, 2).join(', ')}...`,
      calories: totalCalories,
      protein: totalProtein,
      carbs: totalCarbs,
      fat: totalFat,
      image: customPlateImage,
      ingredients,
    });
  };

  const handleBarcodeSelect = (item: typeof BARCODE_ITEMS[0]) => {
    sounds.playSuccess();
    setFoodTitle(item.title);
    setCustomPlateImage(item.image);
    setIngredients([
      {
        id: `barcode-${Date.now()}`,
        name: item.title,
        calories: item.calories,
        protein: item.protein,
        carbs: item.carbs,
        fat: item.fat,
        amount: 1,
        unit: 'serving',
        iconType: 'dairy',
      },
    ]);
    setActiveTab('photo');
    setTweakAppliedNotice(`Loaded verified barcode: ${item.title}`);
    setTimeout(() => setTweakAppliedNotice(null), 3500);
  };

  const handleParseNaturalText = () => {
    if (!naturalTextLog.trim()) return;
    sounds.playSuccess();
    setFoodTitle(naturalTextLog);
    setIngredients([
      {
        id: `custom-1-${Date.now()}`,
        name: 'Organic Scrambled Eggs (2x)',
        calories: 140,
        protein: 12,
        carbs: 1,
        fat: 10,
        amount: 100,
        unit: 'g',
        iconType: 'meat',
      },
      {
        id: `custom-2-${Date.now()}`,
        name: 'Artisan Sourdough Slice',
        calories: 120,
        protein: 4,
        carbs: 24,
        fat: 1,
        amount: 50,
        unit: 'g',
        iconType: 'grain',
      },
      {
        id: `custom-3-${Date.now()}`,
        name: 'Iced Matcha with Oat Milk',
        calories: 90,
        protein: 2,
        carbs: 12,
        fat: 3,
        amount: 250,
        unit: 'ml',
        iconType: 'dairy',
      },
    ]);
    setActiveTab('photo');
    setTweakAppliedNotice(`AI parsed "${naturalTextLog}" into 3 verified items!`);
    setTimeout(() => setTweakAppliedNotice(null), 3500);
  };

  return (
    <div className="space-y-4 pb-24 max-w-lg mx-auto px-4 pt-2 animate-fadeIn">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700 transition-colors"
            title="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-emerald-800 flex items-center justify-center shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-300" />
            </div>
            <h1 className="font-serif-display text-xl font-bold text-slate-900">
              Log Meal
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
            {defaultSlot}
          </div>
          <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-emerald-500/20">
            <img
              src={USER_PROFILE.avatarUrl}
              alt={USER_PROFILE.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>

      {/* Segmented Mode Selector */}
      <div className="bg-slate-100 p-1 rounded-2xl flex items-center text-xs font-semibold text-slate-600">
        <button
          onClick={() => {
            sounds.playClick();
            setActiveTab('photo');
          }}
          className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'photo'
              ? 'bg-white text-emerald-900 font-bold shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Camera className="w-3.5 h-3.5 text-emerald-800" />
          <span>Photo AI</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setActiveTab('text');
          }}
          className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'text'
              ? 'bg-white text-emerald-900 font-bold shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Text / Voice</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setActiveTab('barcode');
          }}
          className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'barcode'
              ? 'bg-white text-emerald-900 font-bold shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <ScanLine className="w-3.5 h-3.5" />
          <span>Barcode</span>
        </button>
      </div>

      {/* VIEWPORT AREA: PHOTO AI vs TEXT vs BARCODE */}
      {activeTab === 'photo' && (
        <div className="relative w-full h-72 rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 shadow-md">
          {/* Background Image or Live Video Stream */}
          {isLiveCamera ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={customPlateImage}
              alt="Scanned Food Plate"
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                isCapturing ? 'opacity-30 scale-105' : 'opacity-100 scale-100'
              }`}
              referrerPolicy="no-referrer"
            />
          )}

          {/* Flashlight beam simulation */}
          {flashOn && (
            <div className="absolute inset-0 bg-white/20 backdrop-brightness-125 pointer-events-none transition-opacity" />
          )}

          {/* High-tech Pro Animated Scanning Laser Line */}
          <div className="absolute left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34d399] pointer-events-none animate-scanline z-10" />

          {/* Viewfinder Target Corner Brackets */}
          <div className="absolute inset-8 pointer-events-none">
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-emerald-400 rounded-tl-sm" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-emerald-400 rounded-tr-sm" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-emerald-400 rounded-bl-sm" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-emerald-400 rounded-br-sm" />
          </div>

          {/* AI Recognition Object Bounding Boxes */}
          <div className="absolute top-12 left-10 pointer-events-none z-10">
            <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-400 text-[10px] font-bold text-emerald-300 backdrop-blur-xs">
              Grilled Chicken (98%)
            </span>
          </div>
          <div className="absolute bottom-16 right-10 pointer-events-none z-10">
            <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-400 text-[10px] font-bold text-emerald-300 backdrop-blur-xs">
              Mixed Greens &amp; Feta (94%)
            </span>
          </div>

          {/* Top Badges overlay */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>VISION AI LIVE</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  sounds.playClick();
                  setFlashOn(!flashOn);
                }}
                className={`w-7 h-7 rounded-full backdrop-blur-md text-white flex items-center justify-center transition-colors ${
                  flashOn ? 'bg-amber-500 text-white' : 'bg-black/40 hover:bg-black/60'
                }`}
                title="Toggle Torch / Flash"
              >
                <Flashlight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={toggleLiveCamera}
                className={`w-7 h-7 rounded-full backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 ${
                  isLiveCamera ? 'bg-emerald-600' : 'bg-black/40'
                }`}
                title={isLiveCamera ? 'Switch to Demo Plate' : 'Use Webcam'}
              >
                <Video className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Floating AI Food Match Tag */}
          <div className="absolute inset-x-0 top-1/3 flex items-center justify-center pointer-events-none z-10">
            <div className="bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-lg border border-slate-200/80 flex items-center gap-2 text-xs text-slate-800 pointer-events-auto">
              <span className="font-bold font-serif-display text-slate-900">{foodTitle}</span>
              <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                {matchPercent}% match
              </span>
            </div>
          </div>

          {/* Bottom Viewfinder Action Controls */}
          <div className="absolute bottom-3 inset-x-0 px-6 flex items-center justify-between z-10">
            {/* Gallery Button */}
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-black/60 active:scale-95 transition-all shadow-md"
                title="Choose photo from gallery"
              >
                <ImageIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Large Shutter Button */}
            <button
              onClick={handleSimulateShutter}
              className="w-14 h-14 rounded-full border-4 border-emerald-400/80 bg-emerald-800 text-white flex items-center justify-center shadow-lg active:scale-90 hover:scale-105 transition-all animate-radar"
              title="Capture plate"
            >
              <div className="w-8 h-8 rounded-full border-2 border-emerald-200/60 flex items-center justify-center">
                <Camera className="w-4 h-4 text-emerald-200" />
              </div>
            </button>

            {/* Voice Command Button */}
            <button
              onClick={() => {
                applyPresetTweak('half dressing, extra chicken');
              }}
              className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-black/60 active:scale-95 transition-all shadow-md"
              title="Quick voice preset"
            >
              <Mic className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* TEXT / VOICE INPUT MODE */}
      {activeTab === 'text' && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">Natural Language Food Parser</span>
            <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
              Gemini Vision &amp; NLU
            </span>
          </div>

          <div className="relative">
            <textarea
              rows={3}
              value={naturalTextLog}
              onChange={(e) => setNaturalTextLog(e.target.value)}
              placeholder="E.g. 2 scrambled eggs, toasted sourdough with grass-fed butter, and an oat milk flat white..."
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          <div className="flex items-center justify-between gap-2">
            <button
              onClick={() => {
                sounds.playClick();
                setIsRecordingVoice(!isRecordingVoice);
                if (!isRecordingVoice) {
                  setNaturalTextLog("2 poached eggs with smashed avocado on rye toast");
                }
              }}
              className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isRecordingVoice
                  ? 'bg-rose-50 border-rose-200 text-rose-700 animate-pulse'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>{isRecordingVoice ? 'Listening...' : 'Dictate with Voice'}</span>
            </button>

            <button
              onClick={handleParseNaturalText}
              className="py-2 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs transition-colors"
            >
              Parse Ingredients
            </button>
          </div>
        </div>
      )}

      {/* BARCODE SCANNER MODE */}
      {activeTab === 'barcode' && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4">
          <div className="h-44 bg-slate-900 rounded-2xl relative overflow-hidden flex items-center justify-center border border-slate-300">
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Barcode className="w-24 h-16 text-emerald-400/80" />
              <span className="text-[11px] font-mono text-emerald-300 mt-2 tracking-widest">
                AIM CAMERA AT BARCODE
              </span>
            </div>
            <div className="absolute left-6 right-6 h-0.5 bg-rose-500 shadow-[0_0_8px_#f43f5e] animate-scanline pointer-events-none" />
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
              OR SELECT VERIFIED HPB DATABASE PRODUCT
            </span>
            <div className="space-y-2">
              {BARCODE_ITEMS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleBarcodeSelect(item)}
                  className="w-full p-2.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-emerald-50/60 hover:border-emerald-200 flex items-center justify-between text-left transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-950">
                        {item.title}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {item.protein}g P • {item.carbs}g C • {item.fat}g F
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-800 bg-white px-2 py-1 rounded-md border border-slate-200">
                    {item.calories} kcal
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 1-Tap Quick Tweak Chips for Faster Logging */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-[10px] font-bold text-slate-400 uppercase mr-1 whitespace-nowrap">
          Quick Tweaks:
        </span>
        {[
          'Half dressing',
          'No cheese',
          'Extra chicken',
          'Add avocado',
        ].map((tweak) => (
          <button
            key={tweak}
            onClick={() => applyPresetTweak(tweak)}
            className="px-2.5 py-1 rounded-full bg-white border border-slate-200/80 hover:border-emerald-300 text-[11px] font-medium text-slate-700 hover:text-emerald-900 whitespace-nowrap shadow-2xs transition-colors"
          >
            {tweak}
          </button>
        ))}
      </div>

      {/* Lunch Estimate Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-3.5">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-serif-display text-xl font-bold text-slate-900 leading-tight">
              {defaultSlot} Estimate
            </h2>
            <div className="text-xs text-slate-400 mt-0.5 font-normal">
              Parsed in 0.4s via Multimodal Vision
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-bold font-serif-display text-slate-900">
              <span className="text-emerald-800">{totalCalories}</span> kcal
            </div>
            <div className="text-[11px] text-slate-400 font-medium">
              {Math.round((totalCalories / 2100) * 100)}% daily goal
            </div>
          </div>
        </div>

        {/* 3 Macro Pills */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-rose-50/70 border border-rose-100 rounded-2xl p-2.5 text-center">
            <div className="flex items-center justify-center gap-1 text-[10px] text-slate-500 font-semibold mb-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              Protein
            </div>
            <div className="text-lg font-bold text-slate-900 font-serif-display leading-tight">
              {totalProtein}g
            </div>
            <span className="inline-block mt-0.5 text-[10px] font-semibold text-rose-700">
              High
            </span>
          </div>

          <div className="bg-amber-50/70 border border-amber-100 rounded-2xl p-2.5 text-center">
            <div className="flex items-center justify-center gap-1 text-[10px] text-slate-500 font-semibold mb-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Carbs
            </div>
            <div className="text-lg font-bold text-slate-900 font-serif-display leading-tight">
              {totalCarbs}g
            </div>
            <span className="inline-block mt-0.5 text-[10px] font-semibold text-amber-700">
              Keto friendly
            </span>
          </div>

          <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-2.5 text-center">
            <div className="flex items-center justify-center gap-1 text-[10px] text-slate-500 font-semibold mb-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Fat
            </div>
            <div className="text-lg font-bold text-slate-900 font-serif-display leading-tight">
              {totalFat}g
            </div>
            <span className="inline-block mt-0.5 text-[10px] font-semibold text-emerald-800">
              Healthy fats
            </span>
          </div>
        </div>
      </div>

      {/* DETECTED INGREDIENTS Section */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
            DETECTED INGREDIENTS
          </span>
          <button
            onClick={() => {
              sounds.playClick();
              const newId = `custom-${Date.now()}`;
              setIngredients((prev) => [
                ...prev,
                {
                  id: newId,
                  name: 'Avocado Slice',
                  calories: 50,
                  protein: 1,
                  carbs: 3,
                  fat: 5,
                  amount: 30,
                  unit: 'g',
                  iconType: 'veg',
                },
              ]);
            }}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>
        </div>

        {/* List of detected ingredients */}
        <div className="space-y-2.5">
          {ingredients.map((ing) => (
            <div
              key={ing.id}
              className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white text-emerald-800 flex items-center justify-center shadow-2xs border border-slate-100">
                  {ing.iconType === 'meat' && <Utensils className="w-4 h-4 text-teal-700" />}
                  {ing.iconType === 'veg' && <Leaf className="w-4 h-4 text-emerald-600" />}
                  {ing.iconType === 'oil' && <Droplet className="w-4 h-4 text-amber-500" />}
                  {ing.iconType === 'dairy' && <CircleDot className="w-4 h-4 text-yellow-600" />}
                  {ing.iconType === 'grain' && <CircleDot className="w-4 h-4 text-amber-700" />}
                </div>

                <div>
                  <div className="font-bold text-slate-900 text-xs">{ing.name}</div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    {ing.calories} kcal • {ing.protein}g P • {ing.carbs}g C • {ing.fat}g F
                  </div>
                </div>
              </div>

              {/* Quantity Stepper: [-] 150g [+] */}
              <div className="flex items-center bg-white border border-slate-200 rounded-xl px-1.5 py-1 shadow-2xs">
                <button
                  onClick={() => handleAdjustQuantity(ing.id, ing.unit === 'tbsp' ? -0.5 : -10)}
                  className="p-1 text-slate-400 hover:text-slate-700 active:scale-95"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="px-2 font-bold text-slate-800 min-w-14 text-center">
                  {ing.amount} {ing.unit}
                </span>
                <button
                  onClick={() => handleAdjustQuantity(ing.id, ing.unit === 'tbsp' ? 0.5 : 10)}
                  className="p-1 text-slate-400 hover:text-slate-700 active:scale-95"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Tweak feedback notice */}
        {tweakAppliedNotice && (
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{tweakAppliedNotice}</span>
          </div>
        )}

        {/* Natural Language Tweak Bar */}
        <form onSubmit={handleApplyTweak} className="relative flex items-center pt-1">
          <div className="absolute left-3 text-emerald-700">
            <Mic className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={tweakText}
            onChange={(e) => setTweakText(e.target.value)}
            placeholder="Or describe tweaks ('half dressing', 'added lemon')..."
            className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-emerald-700"
          />
          <button
            type="submit"
            className="absolute right-1.5 p-1.5 rounded-lg bg-slate-200 hover:bg-emerald-800 hover:text-white text-slate-600 transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Verification badge */}
        <div className="flex items-center justify-center gap-1.5 pt-2 text-[11px] font-medium text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
          <span>Verified by HPB Food Database &amp; Nutritionix</span>
        </div>
      </div>

      {/* Main Action Buttons */}
      <div className="space-y-2.5">
        <button
          id="btn-confirm-log-meal"
          onClick={handleConfirm}
          className="w-full py-3.5 px-5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 active:scale-[0.99] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <Check className="w-4 h-4" />
          <span>Confirm &amp; Log to {defaultSlot} (+{totalCalories} kcal)</span>
        </button>

        <button
          id="btn-suggest-healthier-alt"
          onClick={() => {
            sounds.playClick();
            onNavigateToCoach();
          }}
          className="w-full py-3 px-5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-semibold text-xs text-center transition-colors border border-emerald-200/60"
        >
          Suggest healthier alternative with Coach AI
        </button>
      </div>

      {/* Post-Meal Relationship Insight */}
      <div className="bg-gradient-to-br from-indigo-50/40 via-teal-50/30 to-white rounded-3xl p-4 border border-teal-100/70 shadow-2xs flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-emerald-800 text-emerald-200 flex items-center justify-center shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="space-y-1">
          <div className="text-xs font-bold text-slate-900">
            Post-Meal Relationship Insight
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-normal">
            Great balance of lean protein! We'll prompt you for a quick 30-second satiety rating 90 minutes after lunch to personalize your afternoon energy balance.
          </p>
        </div>
      </div>
    </div>
  );
};
