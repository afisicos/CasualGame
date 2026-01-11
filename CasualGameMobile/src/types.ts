export type PieceType = 'BREAD' | 'MEAT' | 'CHEESE' | 'LETTUCE' | 'TOMATO' | 'BACON' | 'KETCHUP' | 'PICKLE' | 'ONION';
export interface Recipe {
  id: string;
  name: string;
  ingredients: PieceType[];
  price: number;
  isSecret: boolean;
  discovered?: boolean;
}

export type Screen = 'SPLASH' | 'MENU' | 'INTRO' | 'GAME' | 'RESULT' | 'OPTIONS';
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
  newIngredient: PieceType;
  showNewIngredient?: boolean; // Nueva propiedad
  newRecipe?: string;
  description: string;
}

