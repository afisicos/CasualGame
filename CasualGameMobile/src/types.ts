export type PieceType = 'BREAD' | 'MEAT' | 'CHEESE' | 'LETTUCE' | 'TOMATO' | 'BACON' | 'KETCHUP' | 'PICKLE' | 'ONION' | 'EGG';
export interface Recipe {
  id: string;
  name: string;
  ingredients: PieceType[];
  price: number;
  discovered?: boolean;
}

export type Screen = 'SPLASH' | 'MENU' | 'INTRO' | 'ARCADE_INTRO' | 'GAME' | 'RESULT' | 'OPTIONS' | 'SHOP' | 'RECIPES_BOOK';
export type GameMode = 'CAMPAIGN' | 'ARCADE';

export interface Piece {
  id: string;
  type: PieceType;
  isNew?: boolean;
  isRemoving?: boolean;
}

export interface Cell {
  row: number;
  col: number;
  piece: Piece | null;
}

export interface IngredientProbability {
  type: PieceType;
  probability: number; // Valor entre 0 y 1 (ej: 0.3 = 30% de probabilidad)
}

export interface RecipeTarget {
  id: string; // ID de la receta
  count: number; // Número de hamburguesas de este tipo que hay que hacer
}

export interface LevelStars {
  stars: number; // 1, 2 o 3 estrellas
  timeBonus: boolean; // true si se completó dentro del tiempo límite
  destructionBonus: boolean; // true si se usaron menos eliminaciones que el límite
}

export interface Level {
  id: number;
  name: string;
  ingredients: IngredientProbability[];
  newIngredient?: PieceType; // Opcional: algunos niveles solo descubren recetas
  showNewIngredient?: boolean;
  targetRecipes?: RecipeTarget[]; // Múltiples objetivos de recetas
  newRecipe?: string; // Mantener compatibilidad con niveles antiguos
  targetBurgers?: number; // Mantener compatibilidad con niveles antiguos
  description: string;
  timeLimit?: number; // Tiempo límite para obtener estrella de tiempo (segundos)
  destructionLimit?: number; // Número de eliminaciones límite para obtener estrella de eliminaciones
}

