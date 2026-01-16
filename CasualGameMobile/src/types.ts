export type PieceType = 'BREAD' | 'MEAT' | 'CHEESE' | 'LETTUCE' | 'TOMATO' | 'BACON' | 'KETCHUP' | 'PICKLE' | 'ONION';
export interface Recipe {
  id: string;
  name: string;
  ingredients: PieceType[];
  price: number;
  isSecret: boolean;
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

export interface Level {
  id: number;
  name: string;
  targetMoney: number;
  ingredients: PieceType[];
  newIngredient?: PieceType; // Opcional: algunos niveles solo descubren recetas
  showNewIngredient?: boolean;
  newRecipe?: string;
  description: string;
}

