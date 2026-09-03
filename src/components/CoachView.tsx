import React, { useState } from 'react';
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
} from 'lucide-react';
import { RecommendationMeal, DayStats } from '../types';
import { RECOMMENDATIONS } from '../data/mockData';

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
    setSavedRecipes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleRerollCookRecommendation = () => {
    // Generate alternate recipe option
    const alternateSalmon: RecommendationMeal = {
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

    setRecommendations((prev) => [alternateSalmon, prev[1]]);
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || chatInput.trim();
    if (!text) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user' as const,
      text,
      time: 'Just now',
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');

    // Generate intelligent contextual response based on prompt
    setTimeout(() => {
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
    setIsOrderingDelivery(true);
    setTimeout(() => {
      setIsOrderingDelivery(false);
      setDeliveryOrderedSuccess(true);
      setTimeout(() => setDeliveryOrderedSuccess(false), 4000);
    }, 1200);
  };

  return (
    <div className="space-y-4 pb-24 max-w-lg mx-auto px-4 pt-2">
      {/* AI Nutrition Coach Header Card */}
      <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            </div>
            <span className="font-serif-display font-bold text-slate-900 text-base">
              AI Nutrition Coach
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 border border-teal-100 text-[11px] font-semibold text-teal-800">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-pulse" />
            <span>Live Target Engine</span>
          </div>
        </div>

        {/* Remaining Target Highlight */}
        <div className="bg-gradient-to-r from-emerald-50/70 via-teal-50/50 to-white rounded-2xl p-3.5 border border-emerald-100/70 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-medium text-slate-500">Remaining for Target</div>
            <div className="text-lg font-bold text-slate-900 mt-0.5 font-serif-display">
              <span className="text-emerald-800">{remainingKcal}</span> kcal •{' '}
              <span className="text-rose-600">{remainingProtein}g</span> Protein
            </div>
          </div>
          <div className="w-8 h-8 rounded-xl bg-white shadow-2xs border border-emerald-100 flex items-center justify-center text-emerald-700">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Weekly Habit Insight Card */}
      <div className="bg-gradient-to-br from-amber-50/60 via-amber-50/30 to-white rounded-3xl p-4 border border-amber-100/70 shadow-2xs space-y-2">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <Lightbulb className="w-4 h-4 fill-amber-500 text-amber-600" />
          </div>
          <span className="font-bold text-slate-900 text-xs">
            Weekly Habit Insight
          </span>
          <span className="px-2 py-0.5 rounded-full bg-amber-100/80 text-[10px] font-bold text-amber-800 uppercase tracking-wider">
            Smart Tip
          </span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed font-normal pl-9">
          You tend to hit 80% of your daily protein at dinner. Pre-logging your meal early stabilizes appetite and prevents post-8pm snack spikes.
        </p>
      </div>

      {/* Dinner Recommendation Header */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between">
          <h2 className="font-serif-display text-xl font-bold text-slate-900">
            Dinner Recommendation
          </h2>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <SlidersHorizontal className="w-3 h-3" />
            <span>2,100 kcal Goal</span>
          </div>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          To stay within your 2,100 kcal limit and lock in optimal muscle recovery, here are two personalized dinner solutions tailored to your fridge & local eateries.
        </p>
      </div>

      {/* Recommendation 1: Cook At Home */}
      {recommendations[0] && (
        <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm space-y-3 pb-4">
          {/* Card Hero Image */}
          <div className="relative h-48 w-full overflow-hidden">
            <img
              src={recommendations[0].image}
              alt={recommendations[0].title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Top Badges */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-semibold text-slate-800 flex items-center gap-1 shadow-2xs">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>{recommendations[0].badge1}</span>
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-800/90 backdrop-blur-md text-[11px] font-semibold text-white flex items-center gap-1 shadow-2xs">
                  <ShieldCheck className="w-3 h-3 text-emerald-300" />
                  <span>{recommendations[0].badge2}</span>
                </span>
              </div>

              <button
                onClick={() => toggleBookmark(recommendations[0].id)}
                className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-700 shadow-2xs hover:scale-105 transition-transform"
              >
                <Bookmark
                  className={`w-4 h-4 ${
                    savedRecipes[recommendations[0].id]
                      ? 'fill-emerald-800 text-emerald-800'
                      : 'text-slate-600'
                  }`}
                />
              </button>
            </div>

            {/* Bottom image gradient badge */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent p-3 flex items-center justify-between text-white">
              <span className="text-xs font-semibold bg-white/20 backdrop-blur-sm px-2.5 py-0.5 rounded-md">
                {recommendations[0].tag}
              </span>
              <span className="text-sm font-bold font-serif-display">
                {recommendations[0].calories} kcal
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="px-4 space-y-2.5">
            <div>
              <h3 className="font-serif-display text-base font-bold text-slate-900 leading-snug">
                {recommendations[0].title}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                {recommendations[0].subtitle}
              </p>
            </div>

            {/* Macro Pills */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-rose-50/70 border border-rose-100 rounded-xl p-2 text-center">
                <div className="text-[10px] text-slate-500 font-medium">Protein</div>
                <div className="text-sm font-bold text-rose-600 font-serif-display">
                  {recommendations[0].protein}g
                </div>
              </div>
              <div className="bg-amber-50/70 border border-amber-100 rounded-xl p-2 text-center">
                <div className="text-[10px] text-slate-500 font-medium">Carbs</div>
                <div className="text-sm font-bold text-amber-600 font-serif-display">
                  {recommendations[0].carbs}g
                </div>
              </div>
              <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-2 text-center">
                <div className="text-[10px] text-slate-500 font-medium">Fats</div>
                <div className="text-sm font-bold text-emerald-700 font-serif-display">
                  {recommendations[0].fats}g
                </div>
              </div>
            </div>

            {/* Ingredients preview */}
            <div className="bg-slate-50/80 rounded-xl p-2.5 border border-slate-100 text-xs text-slate-600 flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
              <span className="truncate">{recommendations[0].ingredientSummary}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                id="btn-log-view-recipe"
                onClick={() => setSelectedRecipe(recommendations[0])}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 active:scale-[0.99] text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-all"
              >
                <BookOpen className="w-4 h-4 text-emerald-300" />
                <span>Log & View Recipe</span>
              </button>

              <button
                onClick={handleRerollCookRecommendation}
                className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-600 transition-all"
                title="Shuffle recipe recommendation"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recommendation 2: Order Delivery */}
      {recommendations[1] && (
        <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm space-y-3 pb-4">
          <div className="relative h-48 w-full overflow-hidden">
            <img
              src={recommendations[1].image}
              alt={recommendations[1].title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Top Badges */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-semibold text-slate-800 flex items-center gap-1 shadow-2xs">
                  <Navigation className="w-3 h-3 text-emerald-700" />
                  <span>{recommendations[1].badge1}</span>
                </span>
                <span className="px-2.5 py-1 rounded-full bg-teal-800/90 backdrop-blur-md text-[11px] font-semibold text-white flex items-center gap-1 shadow-2xs">
                  <ShieldCheck className="w-3 h-3 text-teal-300" />
                  <span>{recommendations[1].badge2}</span>
                </span>
              </div>
            </div>

            {/* Bottom gradient */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent p-3 flex items-center justify-between text-white">
              <span className="text-xs font-semibold bg-white/20 backdrop-blur-sm px-2.5 py-0.5 rounded-md">
                {recommendations[1].tag}
              </span>
              <span className="text-sm font-bold font-serif-display">
                {recommendations[1].calories} kcal
              </span>
            </div>
          </div>

          <div className="px-4 space-y-2.5">
            <div>
              <h3 className="font-serif-display text-base font-bold text-slate-900 leading-snug">
                {recommendations[1].title}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                {recommendations[1].subtitle}
              </p>
            </div>

            {/* Macros */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-rose-50/70 border border-rose-100 rounded-xl p-2 text-center">
                <div className="text-[10px] text-slate-500 font-medium">Protein</div>
                <div className="text-sm font-bold text-rose-600 font-serif-display">
                  {recommendations[1].protein}g
                </div>
              </div>
              <div className="bg-amber-50/70 border border-amber-100 rounded-xl p-2 text-center">
                <div className="text-[10px] text-slate-500 font-medium">Carbs</div>
                <div className="text-sm font-bold text-amber-600 font-serif-display">
                  {recommendations[1].carbs}g
                </div>
              </div>
              <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-2 text-center">
                <div className="text-[10px] text-slate-500 font-medium">Fats</div>
                <div className="text-sm font-bold text-emerald-700 font-serif-display">
                  {recommendations[1].fats}g
                </div>
              </div>
            </div>

            {/* Delivery Action Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                id="btn-order-delivery"
                disabled={isOrderingDelivery}
                onClick={() => handleOrderSweetgreen(recommendations[1])}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 active:scale-[0.99] disabled:opacity-80 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-all"
              >
                <Bike className="w-4 h-4 text-emerald-300" />
                <span>
                  {isOrderingDelivery
                    ? 'Connecting to Sweetgreen...'
                    : `Order Delivery (${recommendations[1].price})`}
                </span>
              </button>

              <button
                id="btn-pre-log"
                onClick={() => onPreLogDelivery(recommendations[1])}
                className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-emerald-900 font-semibold text-xs transition-all"
              >
                Pre-log
              </button>
            </div>

            {deliveryOrderedSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Sweetgreen order dispatched! Arriving in approx 25 mins. Pre-logged to Dinner.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Ask Coach AI Anything Section */}
      <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
          </div>
          <h3 className="font-serif-display text-base font-bold text-slate-900">
            Ask Coach AI Anything
          </h3>
        </div>

        {/* Quick prompt chips */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar">
          {[
            { label: 'Craving Thai', icon: '🍲' },
            { label: 'Vegetarian swap', icon: '🥑' },
            { label: 'Quick under 300 kcal', icon: '⚡' },
          ].map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(chip.label)}
              className="px-3 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200/70 text-xs font-semibold text-slate-700 whitespace-nowrap flex items-center gap-1.5 transition-colors"
            >
              <span>{chip.icon}</span>
              <span>{chip.label}</span>
            </button>
          ))}
        </div>

        {/* Chat message history if user sent messages */}
        {chatMessages.length > 1 && (
          <div className="space-y-2 max-h-48 overflow-y-auto p-2 rounded-2xl bg-slate-50/70 border border-slate-100 text-xs">
            {chatMessages.slice(1).map((msg) => (
              <div
                key={msg.id}
                className={`p-2.5 rounded-xl leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-emerald-800 text-white ml-6'
                    : 'bg-white text-slate-700 border border-slate-100 mr-4'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
        )}

        {/* Chat Input Bar */}
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
            placeholder="e.g. What should I order at Subway under 600..."
            className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700 transition-all"
          />
          <button
            type="submit"
            disabled={!chatInput.trim()}
            className="absolute right-2 p-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 disabled:opacity-40 text-white transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Recipe Modal */}
      {selectedRecipe && selectedRecipe.recipe && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto p-5 space-y-4 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-emerald-800" />
                <span className="font-serif-display font-bold text-lg text-slate-900">
                  {selectedRecipe.title}
                </span>
              </div>
              <button
                onClick={() => setSelectedRecipe(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <img
              src={selectedRecipe.image}
              alt={selectedRecipe.title}
              className="w-full h-44 object-cover rounded-2xl"
              referrerPolicy="no-referrer"
            />

            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-slate-400 text-[10px]">Calories</div>
                <div className="font-bold text-slate-800 font-serif-display">{selectedRecipe.calories}</div>
              </div>
              <div className="p-2 rounded-xl bg-rose-50 border border-rose-100">
                <div className="text-slate-400 text-[10px]">Protein</div>
                <div className="font-bold text-rose-600 font-serif-display">{selectedRecipe.protein}g</div>
              </div>
              <div className="p-2 rounded-xl bg-amber-50 border border-amber-100">
                <div className="text-slate-400 text-[10px]">Carbs</div>
                <div className="font-bold text-amber-600 font-serif-display">{selectedRecipe.carbs}g</div>
              </div>
              <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-100">
                <div className="text-slate-400 text-[10px]">Fats</div>
                <div className="font-bold text-emerald-700 font-serif-display">{selectedRecipe.fats}g</div>
              </div>
            </div>

            {/* Ingredients */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Ingredients Needed ({selectedRecipe.recipe.servings} serving)
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {selectedRecipe.recipe.ingredients.map((ing, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>{ing}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Step-by-step instructions */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Preparation Instructions
              </h4>
              <ol className="space-y-2 text-xs text-slate-700 list-decimal list-inside leading-relaxed">
                {selectedRecipe.recipe.steps.map((step, idx) => (
                  <li key={idx} className="pl-1">
                    <span className="font-normal">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Modal CTAs */}
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => {
                  onLogCookMeal(selectedRecipe);
                  setSelectedRecipe(null);
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs shadow-xs"
              >
                Log to Dinner (+{selectedRecipe.calories} kcal)
              </button>
              <button
                onClick={() => setSelectedRecipe(null)}
                className="py-3 px-4 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
