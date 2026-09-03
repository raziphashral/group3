import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Lightbulb,
  SlidersHorizontal,
  Clock,
  ShieldCheck,
  Bookmark,
  Navigation,
  BookOpen,
  RotateCw,
  Bike,
  Send,
  Check,
  CheckCircle2,
  X,
  ChefHat,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Filter,
  Flame,
  Award,
} from 'lucide-react';
import { RecommendationMeal, DayStats } from '../types';
import { RECOMMENDATIONS } from '../data/mockData';
import { sounds } from '../utils/audio';

interface CoachViewProps {
  dayStats: DayStats;
  onLogCookMeal: (meal: RecommendationMeal) => void;
  onPreLogDelivery: (meal: RecommendationMeal) => void;
}

export const CoachView: React.FC<CoachViewProps> = ({
  dayStats,
  onLogCookMeal,
  onPreLogDelivery,
}) => {
  const [recommendations, setRecommendations] = useState<RecommendationMeal[]>(RECOMMENDATIONS);
  const [selectedRecipe, setSelectedRecipe] = useState<RecommendationMeal | null>(null);
  const [savedRecipes, setSavedRecipes] = useState<Record<string, boolean>>({});
  const [chatInput, setChatInput] = useState('');
  const [isOrderingDelivery, setIsOrderingDelivery] = useState(false);
  const [deliveryOrderedSuccess, setDeliveryOrderedSuccess] = useState(false);
  const [servingsScale, setServingsScale] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [filterType, setFilterType] = useState<'all' | 'protein' | 'quick' | 'budget'>('all');

  // Cooking Timer State
  const [timerSeconds, setTimerSeconds] = useState(12 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      sounds.playSuccess();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds]);

  // Dynamic chat state
  const [chatMessages, setChatMessages] = useState<
    Array<{ id: string; sender: 'coach' | 'user'; text: string; time: string }>
  >([
    {
      id: 'msg-welcome',
      sender: 'coach',
      text: "Hi Sarah! I've calibrated your dinner based on your 1,420 kcal logged so far. You have 680 kcal and 36g of protein remaining. Want an easy recipe or high-protein takeout?",
      time: '6:30 PM',
    },
  ]);

  const remainingKcal = Math.max(0, dayStats.totalCaloriesTarget - dayStats.eatenCalories);
  const remainingProtein = Math.max(0, dayStats.protein.target - dayStats.protein.current);

  const toggleBookmark = (id: string) => {
    sounds.playClick();
    setSavedRecipes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleRerollCookRecommendation = () => {
    sounds.playClick();
    const alternateMeal: RecommendationMeal = {
      id: 'rec-chicken-traybake',
      type: 'cook',
      badge1: '20-min oven',
      badge1Icon: 'timer',
      badge2: 'HPB Healthier Choice',
      badge2Icon: 'shield-check',
      image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80',
      tag: 'Cook At Home',
      calories: 620,
      title: 'Lemon Herb Chicken & Roasted Sweet Potato',
      subtitle: 'High Lean Protein • Beta-carotene rich',
      protein: 44,
      carbs: 40,
      fats: 16,
      ingredientSummary: 'Free-range chicken breast, Sweet potato, Broccoli florets... 5 items',
      prepTime: '20 mins',
      recipe: {
        prepTime: '8 mins',
        cookTime: '20 mins',
        difficulty: 'Easy',
        servings: 1,
        ingredients: [
          '200g Chicken breast fillet',
          '150g Diced sweet potato',
          '1 cup Fresh broccoli florets',
          '1 tbsp Olive oil & dried rosemary',
          'Lemon zest and pink sea salt',
        ],
        steps: [
          'Preheat oven to 200°C (400°F). Toss diced sweet potatoes in olive oil and roast for 10 minutes.',
          'Season chicken breast with rosemary, sea salt, and lemon zest.',
          'Add chicken and broccoli florets to the baking tray alongside sweet potatoes.',
          'Bake for an additional 12-14 minutes until chicken reaches 74°C internal temperature.',
        ],
      },
    };

    setRecommendations((prev) => [alternateMeal, prev[1]]);
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || chatInput.trim();
    if (!text) return;

    sounds.playClick();
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user' as const,
      text,
      time: 'Just now',
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');

    setTimeout(() => {
      sounds.playSuccess();
      let reply = "Here's a smart fit for your remaining 680 kcal and 36g protein:";
      const lower = text.toLowerCase();

      if (lower.includes('thai')) {
        reply = "For Thai tonight, order **Tom Yum Soup with Prawns** or **Larb Gai (Spicy Minced Chicken)** with steamed jasmine rice on the side. Avoid Pad Thai or coconut curry to stay under your remaining 22g fats allowance!";
      } else if (lower.includes('veg') || lower.includes('vegetarian')) {
        reply = "Great swap! A **Warm Edamame & Marinated Tofu Bowl** with quinoa and sesame drizzle hits 35g plant protein, 45g complex carbs, and 18g fats (~580 kcal). Perfectly hits your macro goal!";
      } else if (lower.includes('subway')) {
        reply = "At Subway: Order a **6-inch Rotisserie-Style Chicken on Multigrain** with baby spinach, tomatoes, cucumbers, and honey mustard (skip mayo & double cheese). Total: 380 kcal, 31g protein, 42g carbs, 8g fat!";
      } else if (lower.includes('quick') || lower.includes('snack')) {
        reply = "Quick 180 kcal power bite: 150g low-fat cottage cheese or Greek yogurt with a scoop of hemp hearts and berries. Delivers 24g rapid-absorbing protein with zero cooking!";
      } else {
        reply = `Tailored to your ${remainingKcal} kcal limit: prioritize lean proteins (chicken breast, white fish, tofu) with fibrous carbs. Staying around 35-40g protein tonight will keep your 7-day streak at 97% adherence!`;
      }

      setChatMessages((prev) => [
        ...prev,
        {
          id: `coach-${Date.now()}`,
          sender: 'coach' as const,
          text: reply,
          time: 'Just now',
        },
      ]);
    }, 600);
  };

  const handleOrderSweetgreen = (meal: RecommendationMeal) => {
    sounds.playClick();
    setIsOrderingDelivery(true);
    setTimeout(() => {
      sounds.playSuccess();
      setIsOrderingDelivery(false);
      setDeliveryOrderedSuccess(true);
      setTimeout(() => setDeliveryOrderedSuccess(false), 4000);
    }, 1200);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredRecommendations = recommendations.filter((m) => {
    if (filterType === 'protein') return m.protein >= 40;
    if (filterType === 'quick') return m.type === 'cook';
    return true;
  });

  return (
    <div className="space-y-4 pb-24 max-w-lg mx-auto px-4 pt-2 animate-fadeIn">
      {/* AI Nutrition Coach Header Card */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-800 text-emerald-200 flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-serif-display font-bold text-slate-900 text-base">
              AI Nutrition Coach
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-[11px] font-semibold text-teal-800 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-pulse" />
            <span>Live Target Engine</span>
          </div>
        </div>

        {/* Remaining Target Highlight */}
        <div className="bg-gradient-to-r from-emerald-50/80 via-teal-50/50 to-white rounded-2xl p-3.5 border border-emerald-200/90 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-500">Remaining for Target</div>
            <div className="text-lg font-bold text-slate-900 mt-0.5 font-serif-display">
              <span className="text-emerald-800">{remainingKcal}</span> kcal •{' '}
              <span className="text-rose-600">{remainingProtein}g</span> protein
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
              Optimal Deficit
            </span>
            <div className="text-[11px] text-slate-500 font-medium mt-1">
              Balanced for lean gain
            </div>
          </div>
        </div>

        {/* Weekly Habit Pattern Insight */}
        <div className="flex items-start gap-2.5 pt-1 text-xs text-slate-600">
          <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Weekly Habit Pattern:</strong> You tend to eat 15% more carbs on Thursdays after your evening strength session. These meals are calibrated with complex, low-GI grains to restore glycogen.
          </p>
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {[
          { id: 'all', label: 'All Picks' },
          { id: 'protein', label: 'High Protein (>40g)' },
          { id: 'quick', label: 'Cook At Home' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => {
              sounds.playClick();
              setFilterType(f.id as any);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filterType === f.id
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Recommended Dinners Section */}
      <div className="space-y-4">
        {filteredRecommendations.map((meal) => (
          <div
            key={meal.id}
            className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:border-slate-300 transition-all group"
          >
            {/* Food Image with Overlays */}
            <div className="relative h-48 w-full overflow-hidden bg-slate-100">
              <img
                src={meal.image}
                alt={meal.title}
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />

              {/* Top Badges */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold flex items-center gap-1.5 border border-white/10">
                    <Clock className="w-3 h-3 text-emerald-300" />
                    <span>{meal.badge1}</span>
                  </div>

                  <div className="px-2.5 py-1 rounded-full bg-emerald-800/80 backdrop-blur-md text-white text-[11px] font-semibold flex items-center gap-1.5 border border-white/10">
                    <ShieldCheck className="w-3 h-3 text-emerald-300" />
                    <span>{meal.badge2}</span>
                  </div>
                </div>

                <button
                  onClick={() => toggleBookmark(meal.id)}
                  className={`w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
                    savedRecipes[meal.id]
                      ? 'bg-emerald-800 text-white'
                      : 'bg-black/40 text-white hover:bg-black/60'
                  }`}
                  title="Bookmark Recipe"
                >
                  <Bookmark
                    className={`w-4 h-4 ${savedRecipes[meal.id] ? 'fill-white' : ''}`}
                  />
                </button>
              </div>

              {/* Bottom tag & calorie pill */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-slate-800 font-bold text-xs shadow-md">
                  {meal.tag}
                </span>

                <span className="px-3 py-1 rounded-full bg-slate-900/85 backdrop-blur-md text-white font-bold text-xs shadow-md font-serif-display">
                  {meal.calories} kcal
                </span>
              </div>
            </div>

            {/* Meal Details & Macros */}
            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-serif-display text-lg font-bold text-slate-900 leading-tight">
                  {meal.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">{meal.subtitle}</p>
              </div>

              {/* 3 Macro Pills */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-rose-50/70 border border-rose-100 rounded-xl p-2 text-center">
                  <div className="text-[10px] text-slate-500 font-medium">Protein</div>
                  <div className="text-sm font-bold text-slate-900 font-serif-display">
                    {meal.protein}g
                  </div>
                  <span className="text-[9px] font-bold text-rose-600 block">High</span>
                </div>

                <div className="bg-amber-50/70 border border-amber-100 rounded-xl p-2 text-center">
                  <div className="text-[10px] text-slate-500 font-medium">Carbs</div>
                  <div className="text-sm font-bold text-slate-900 font-serif-display">
                    {meal.carbs}g
                  </div>
                  <span className="text-[9px] font-bold text-amber-700 block">Low GI</span>
                </div>

                <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-2 text-center">
                  <div className="text-[10px] text-slate-500 font-medium">Fats</div>
                  <div className="text-sm font-bold text-slate-900 font-serif-display">
                    {meal.fats}g
                  </div>
                  <span className="text-[9px] font-bold text-emerald-800 block">Omega-3</span>
                </div>
              </div>

              {/* Ingredient Summary or Partner details */}
              {meal.ingredientSummary && (
                <div className="text-xs text-slate-600 flex items-center justify-between pt-1 border-t border-slate-100">
                  <span className="truncate pr-2">{meal.ingredientSummary}</span>
                  <button
                    onClick={handleRerollCookRecommendation}
                    className="text-[11px] font-semibold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 shrink-0"
                    title="Generate alternative recipe"
                  >
                    <RotateCw className="w-3 h-3" />
                    <span>Reroll</span>
                  </button>
                </div>
              )}

              {/* Buttons for Cook at home */}
              {meal.type === 'cook' && (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setSelectedRecipe(meal);
                    }}
                    className="py-2.5 px-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>View Recipe &amp; Steps</span>
                  </button>

                  <button
                    onClick={() => {
                      sounds.playSuccess();
                      onLogCookMeal(meal);
                    }}
                    className="py-2.5 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 active:scale-[0.99] text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>I Cooked This</span>
                  </button>
                </div>
              )}

              {/* Buttons for Order Delivery */}
              {meal.type === 'delivery' && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>{meal.deliveryPartner} • ETA {meal.deliveryTime}</span>
                    <span className="font-bold text-slate-900">{meal.price}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleOrderSweetgreen(meal)}
                      disabled={isOrderingDelivery}
                      className="py-2.5 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 active:scale-[0.99] text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all"
                    >
                      <Bike className="w-3.5 h-3.5" />
                      <span>{isOrderingDelivery ? 'Connecting...' : 'Order Sweetgreen'}</span>
                    </button>

                    <button
                      onClick={() => {
                        sounds.playSuccess();
                        onPreLogDelivery(meal);
                      }}
                      className="py-2.5 px-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Pre-log to Dinner</span>
                    </button>
                  </div>

                  {deliveryOrderedSuccess && (
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-fadeIn">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>Order dispatched to GrabFood/Deliveroo! Pre-logged to your dinner slot.</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Interactive AI Chat Assistant */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChefHat className="w-4 h-4 text-emerald-800" />
            <h3 className="font-serif-display font-bold text-slate-900 text-base">
              Ask Coach AI Anything
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Personalized to 680 kcal</span>
        </div>

        {/* Chat message bubbles */}
        <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-emerald-800 text-white rounded-br-xs shadow-xs'
                    : 'bg-slate-50 text-slate-800 border border-slate-200/70 rounded-bl-xs'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>
            </div>
          ))}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {[
            'Craving Thai food tonight',
            'Make it vegetarian swap',
            'Subway high-protein order',
            'Quick 200 kcal snack',
          ].map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSendMessage(prompt)}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-[11px] font-medium text-slate-700 whitespace-nowrap transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Message Input Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask about restaurant menus, ingredient swaps, cravings..."
            className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-emerald-700"
          />
          <button
            type="submit"
            className="absolute right-1.5 p-1.5 rounded-lg bg-emerald-800 text-white hover:bg-emerald-900 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Step-by-Step Cooking Modal with Timer & Servings Scaler */}
      {selectedRecipe && selectedRecipe.recipe && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-3xl p-5 space-y-4 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                  GUIDED COOKING MODE
                </span>
                <h3 className="font-serif-display font-bold text-lg text-slate-900 leading-tight">
                  {selectedRecipe.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRecipe(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Live Cooking Countdown Timer Bar */}
            <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-800 text-emerald-200 flex items-center justify-center">
                  <Timer className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Pan-Sear Timer</div>
                  <div className="text-lg font-bold font-serif-display text-slate-900">
                    {formatTimer(timerSeconds)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    sounds.playClick();
                    setIsTimerRunning(!isTimerRunning);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 shadow-2xs transition-colors ${
                    isTimerRunning
                      ? 'bg-amber-500 text-white'
                      : 'bg-emerald-800 text-white hover:bg-emerald-900'
                  }`}
                >
                  {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isTimerRunning ? 'Pause' : 'Start'}</span>
                </button>

                <button
                  onClick={() => {
                    sounds.playClick();
                    setIsTimerRunning(false);
                    setTimerSeconds(12 * 60);
                  }}
                  className="p-1.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-800"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Servings Scaler */}
            <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs">
              <span className="font-semibold text-slate-700">Recipe Scale:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 4].map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      sounds.playClick();
                      setServingsScale(s);
                    }}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                      servingsScale === s
                        ? 'bg-emerald-800 text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    {s}x {s === 1 ? 'serving' : 'servings'}
                  </button>
                ))}
              </div>
            </div>

            {/* Ingredients Checklist */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                Ingredients ({selectedRecipe.recipe.ingredients.length} items)
              </span>
              <div className="space-y-1.5">
                {selectedRecipe.recipe.ingredients.map((ing, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2 rounded-xl bg-slate-50/70 border border-slate-100 text-xs text-slate-800"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-700" />
                    <span>
                      {servingsScale > 1 ? `${servingsScale}x of: ` : ''}{ing}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step by step checklist */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                Cooking Steps ({selectedRecipe.recipe.steps.length} steps)
              </span>
              <div className="space-y-2.5">
                {selectedRecipe.recipe.steps.map((step, idx) => {
                  const isDone = !!completedSteps[idx];
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        sounds.playClick();
                        setCompletedSteps((prev) => ({ ...prev, [idx]: !prev[idx] }));
                      }}
                      className={`w-full p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                        isDone
                          ? 'bg-emerald-50/70 border-emerald-200 text-slate-500'
                          : 'bg-slate-50/70 border-slate-100 text-slate-800'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                          isDone
                            ? 'bg-emerald-800 border-emerald-800 text-white'
                            : 'bg-white border-slate-300'
                        }`}
                      >
                        {isDone && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <span className={`text-xs leading-relaxed ${isDone ? 'line-through' : ''}`}>
                        <strong>Step {idx + 1}:</strong> {step}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Log confirmation */}
            <div className="pt-2">
              <button
                onClick={() => {
                  sounds.playSuccess();
                  onLogCookMeal(selectedRecipe);
                  setSelectedRecipe(null);
                }}
                className="w-full py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Finished Cooking! Log to Dinner (+{selectedRecipe.calories * servingsScale} kcal)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
