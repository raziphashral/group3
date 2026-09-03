export interface IngredientItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  amount: number;
  unit: string;
  iconType: 'meat' | 'veg' | 'oil' | 'dairy' | 'grain' | 'fruit';
}

export interface MealItem {
  id: string;
  mealType: 'Breakfast' | 'Lunch' | 'Snack' | 'Dinner';
  time: string;
  title: string;
  subtitle: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  image: string;
  ingredients?: IngredientItem[];
}

export interface DailyMacroTarget {
  current: number;
  target: number;
}

export interface DayStats {
  dateStr: string;
  statusText: string;
  totalCaloriesTarget: number;
  eatenCalories: number;
  burnedCalories: number;
  waterIntakeLiters: number;
  waterTargetLiters: number;
  protein: DailyMacroTarget;
  carbs: DailyMacroTarget;
  fats: DailyMacroTarget;
}

export interface RecommendationMeal {
  id: string;
  type: 'cook' | 'delivery';
  badge1: string;
  badge2: string;
  badge1Icon?: string;
  badge2Icon?: string;
  image: string;
  tag: string;
  calories: number;
  title: string;
  subtitle: string;
  protein: number;
  carbs: number;
  fats: number;
  ingredientSummary?: string;
  deliveryPartner?: string;
  prepTime?: string;
  deliveryTime?: string;
  price?: string;
  recipe?: {
    prepTime: string;
    cookTime: string;
    difficulty: string;
    servings: number;
    ingredients: string[];
    steps: string[];
  };
}

export interface ScorecardItem {
  id: string;
  day: string;
  highlight: string;
  highlightIcon: string;
  caloriesConsumed: number;
  status: 'hit' | 'high_protein' | 'under_budget';
  breakdown: {
    protein: number;
    carbs: number;
    fat: number;
  };
  details: string;
}

export interface WeeklyAdherenceDay {
  day: string;
  calories: number;
  isToday?: boolean;
  status: 'within' | 'surplus';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  timestamp: string;
  quickReplies?: string[];
}
