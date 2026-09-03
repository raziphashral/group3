import React, { useState } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { TodayView } from './components/TodayView';
import { CoachView } from './components/CoachView';
import { AnalyticsView } from './components/AnalyticsView';
import { PlanView } from './components/PlanView';
import { LogMealModal } from './components/LogMealModal';
import { QuickAddModal } from './components/QuickAddModal';
import { UserProfileModal } from './components/UserProfileModal';
import { FourScreensGalleryView } from './components/FourScreensGalleryView';
import { INITIAL_DAY_STATS, INITIAL_MEALS } from './data/mockData';
import { DayStats, MealItem, RecommendationMeal } from './types';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'today' | 'coach' | 'analytics' | 'plan'>('today');
  const [isLoggingMeal, setIsLoggingMeal] = useState(false);
  const [isQuickAdding, setIsQuickAdding] = useState(false);
  const [mealSlotToLog, setMealSlotToLog] = useState<'Breakfast' | 'Lunch' | 'Snack' | 'Dinner'>('Lunch');
  const [viewMode, setViewMode] = useState<'mobile' | 'gallery'>('mobile');
  const [dayStats, setDayStats] = useState<DayStats>(INITIAL_DAY_STATS);
  const [meals, setMeals] = useState<MealItem[]>(INITIAL_MEALS);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenLogMeal = (slot: 'Breakfast' | 'Lunch' | 'Snack' | 'Dinner' = 'Lunch') => {
    setMealSlotToLog(slot);
    setIsLoggingMeal(true);
  };

  const handleOpenQuickAdd = (slot: 'Breakfast' | 'Lunch' | 'Snack' | 'Dinner' = 'Snack') => {
    setMealSlotToLog(slot);
    setIsQuickAdding(true);
  };

  const handleConfirmLogMeal = (newMealData: Omit<MealItem, 'id' | 'time'>) => {
    const newMeal: MealItem = {
      ...newMealData,
      id: `meal-${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMeals((prev) => [...prev, newMeal]);

    // Recalculate day stats
    setDayStats((prev) => ({
      ...prev,
      eatenCalories: prev.eatenCalories + newMeal.calories,
      protein: {
        ...prev.protein,
        current: prev.protein.current + newMeal.protein,
      },
      carbs: {
        ...prev.carbs,
        current: prev.carbs.current + newMeal.carbs,
      },
      fats: {
        ...prev.fats,
        current: prev.fats.current + newMeal.fat,
      },
    }));

    setIsLoggingMeal(false);
    setActiveTab('today');
    showToast(`Logged "${newMeal.title}" (+${newMeal.calories} kcal) to ${newMeal.mealType}!`);
  };

  const handleDeleteMeal = (id: string) => {
    const mealToDelete = meals.find((m) => m.id === id);
    if (!mealToDelete) return;

    setMeals((prev) => prev.filter((m) => m.id !== id));
    setDayStats((prev) => ({
      ...prev,
      eatenCalories: Math.max(0, prev.eatenCalories - mealToDelete.calories),
      protein: {
        ...prev.protein,
        current: Math.max(0, prev.protein.current - mealToDelete.protein),
      },
      carbs: {
        ...prev.carbs,
        current: Math.max(0, prev.carbs.current - mealToDelete.carbs),
      },
      fats: {
        ...prev.fats,
        current: Math.max(0, prev.fats.current - mealToDelete.fat),
      },
    }));
    showToast(`Deleted ${mealToDelete.title}`);
  };

  const handleLogCookMeal = (recipeMeal: RecommendationMeal) => {
    handleConfirmLogMeal({
      mealType: 'Dinner',
      title: recipeMeal.title,
      subtitle: recipeMeal.subtitle,
      calories: recipeMeal.calories,
      protein: recipeMeal.protein,
      carbs: recipeMeal.carbs,
      fat: recipeMeal.fats,
      image: recipeMeal.image,
    });
  };

  const handlePreLogDelivery = (deliveryMeal: RecommendationMeal) => {
    handleConfirmLogMeal({
      mealType: 'Dinner',
      title: deliveryMeal.title,
      subtitle: `${deliveryMeal.deliveryPartner} • Pre-logged`,
      calories: deliveryMeal.calories,
      protein: deliveryMeal.protein,
      carbs: deliveryMeal.carbs,
      fat: deliveryMeal.fats,
      image: deliveryMeal.image,
    });
  };

  const handleUpdateWater = (amount: number) => {
    setDayStats((prev) => ({
      ...prev,
      waterIntakeLiters: Math.round((prev.waterIntakeLiters + amount) * 10) / 10,
    }));
    showToast(`Logged +${amount * 1000}ml water!`);
  };

  const handleUpdateCalorieTarget = (newTarget: number) => {
    setDayStats((prev) => ({
      ...prev,
      totalCaloriesTarget: newTarget,
    }));
    showToast(`Updated calorie target to ${newTarget} kcal`);
  };

  const handleScreenSelector = (screenId: string) => {
    if (screenId === 'today') {
      setIsLoggingMeal(false);
      setActiveTab('today');
    } else if (screenId === 'coach') {
      setIsLoggingMeal(false);
      setActiveTab('coach');
    } else if (screenId === 'analytics') {
      setIsLoggingMeal(false);
      setActiveTab('analytics');
    } else if (screenId === 'log') {
      setMealSlotToLog('Lunch');
      setIsLoggingMeal(true);
    }
  };

  const currentScreenId = isLoggingMeal ? 'log' : activeTab;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-emerald-800 text-white px-4 py-2.5 rounded-2xl shadow-lg border border-emerald-700/80 flex items-center gap-2 text-xs font-semibold animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Header */}
      <Header
        onAvatarClick={() => setShowProfileModal(true)}
        viewMode={viewMode}
        setViewMode={setViewMode}
        activeScreen={currentScreenId}
        onSelectScreen={handleScreenSelector}
      />

      {/* Main View Area */}
      <main className="flex-1 w-full">
        {viewMode === 'gallery' ? (
          /* Multi-screen comparison showcase */
          <FourScreensGalleryView
            dayStats={dayStats}
            meals={meals}
            onOpenLogMeal={handleOpenLogMeal}
            onNavigateToCoach={() => {
              setViewMode('mobile');
              setActiveTab('coach');
              setIsLoggingMeal(false);
            }}
            onLogCookMeal={handleLogCookMeal}
            onPreLogDelivery={handlePreLogDelivery}
            onConfirmLog={handleConfirmLogMeal}
            onFocusScreen={(screenId) => {
              setViewMode('mobile');
              handleScreenSelector(screenId);
            }}
          />
        ) : (
          /* Mobile App View */
          <div className="w-full max-w-lg mx-auto min-h-screen bg-slate-50 pb-8 sm:border-x sm:border-slate-200/70 sm:shadow-xs">
            {isLoggingMeal ? (
              <LogMealModal
                defaultSlot={mealSlotToLog}
                onClose={() => setIsLoggingMeal(false)}
                onConfirmLog={handleConfirmLogMeal}
                onNavigateToCoach={() => {
                  setIsLoggingMeal(false);
                  setActiveTab('coach');
                }}
              />
            ) : (
              <>
                {activeTab === 'today' && (
                  <TodayView
                    dayStats={dayStats}
                    meals={meals}
                    onOpenLogMeal={handleOpenLogMeal}
                    onOpenQuickAdd={handleOpenQuickAdd}
                    onNavigateToCoach={() => setActiveTab('coach')}
                    onDeleteMeal={handleDeleteMeal}
                    onUpdateWater={handleUpdateWater}
                  />
                )}

                {activeTab === 'coach' && (
                  <CoachView
                    dayStats={dayStats}
                    onLogCookMeal={handleLogCookMeal}
                    onPreLogDelivery={handlePreLogDelivery}
                  />
                )}

                {activeTab === 'analytics' && <AnalyticsView />}

                {activeTab === 'plan' && <PlanView />}
              </>
            )}
          </div>
        )}
      </main>

      {/* Persistent Bottom Navigation (visible in Mobile view when not logging meal) */}
      {viewMode === 'mobile' && !isLoggingMeal && (
        <BottomNav
          activeTab={activeTab}
          onTabChange={(tab) => {
            setIsLoggingMeal(false);
            setActiveTab(tab);
          }}
        />
      )}

      {/* Quick Add Fast Logging Modal */}
      {isQuickAdding && (
        <QuickAddModal
          defaultSlot={mealSlotToLog}
          onClose={() => setIsQuickAdding(false)}
          onLogMeal={handleConfirmLogMeal}
        />
      )}

      {/* User Profile / Health Settings Modal */}
      {showProfileModal && (
        <UserProfileModal
          calorieTarget={dayStats.totalCaloriesTarget}
          onClose={() => setShowProfileModal(false)}
          onUpdateTarget={handleUpdateCalorieTarget}
        />
      )}
    </div>
  );
}
