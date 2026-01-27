import { TRANSLATIONS, ACHIEVEMENT_POOL } from '../constants/gameData';
import { PieceType, IngredientProbability, Level, LevelStars, DailyAchievement, DailyAchievementsState } from '../types';
import { Cell, Piece, GameMode } from '../types';
import { logGameEvent } from './analytics';

export const refreshDailyAchievements = (currentState: DailyAchievementsState | null): DailyAchievementsState => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

  if (currentState && currentState.lastRefreshDate === today) {
    return currentState;
  }

  // Seleccionar 3 logros aleatorios del pool
  const shuffled = [...ACHIEVEMENT_POOL].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 3).map((template, index) => ({
    ...template,
    id: `daily_${index}_${today}`,
    current: 0,
    claimed: false,
  }));

  return {
    lastRefreshDate: today,
    achievements: selected,
  };
};

export const getGridSize = (levelId: number, mode: GameMode) => {
  return 7; // Siempre 7x7 por petición del usuario
};

export const createPiece = (ingredientProbabilities: IngredientProbability[]): Piece => {
  // Seleccionar un ingrediente basado en las probabilidades
  const random = Math.random();
  let cumulativeProbability = 0;

  for (const ingredient of ingredientProbabilities) {
    cumulativeProbability += ingredient.probability;
    if (random <= cumulativeProbability) {
      return { id: Math.random().toString(36).substr(2, 9), type: ingredient.type, isNew: true };
    }
  }

  // Fallback por si las probabilidades no suman exactamente 1
  const fallbackType = ingredientProbabilities[ingredientProbabilities.length - 1]?.type || 'BREAD';
  return { id: Math.random().toString(36).substr(2, 9), type: fallbackType, isNew: true };
};

export const findChain = (idx: number, currentChain: PieceType[], results: PieceType[][], visited: Set<number>, gridRef: Cell[], gridSize: number) => {
  if (currentChain.length >= 3 && currentChain[currentChain.length - 1] === 'BREAD') {
    const breadCount = currentChain.filter(t => t === 'BREAD').length;
    const meatCount = currentChain.filter(t => t === 'MEAT').length;
    if (breadCount === 2 && meatCount >= 1) {
      results.push([...currentChain]);
      if (results.length > 50) return;
    }
    return;
  }
  if (currentChain.length >= 6) return;

  const cell = gridRef[idx];
  const neighbors = [
    { r: cell.row - 1, c: cell.col }, { r: cell.row + 1, c: cell.col },
    { r: cell.row, c: cell.col - 1 }, { r: cell.row, c: cell.col + 1 }
  ];

  for (const n of neighbors) {
    if (n.r >= 0 && n.r < gridSize && n.c >= 0 && n.c < gridSize) {
      const nextIdx = n.r * gridSize + n.c;
      if (!visited.has(nextIdx)) {
        const nextPiece = gridRef[nextIdx].piece;
        if (nextPiece) {
          if (nextPiece.type === 'BREAD') {
            if (currentChain.length >= 2 && currentChain[currentChain.length - 1] !== 'BREAD') {
              findChain(nextIdx, [...currentChain, 'BREAD'], results, new Set(visited).add(nextIdx), gridRef, gridSize);
            }
          } else {
            if (nextPiece.type === 'MEAT') {
              const meatCount = currentChain.filter(t => t === 'MEAT').length;
              if (meatCount >= 2) continue;
            }
            findChain(nextIdx, [...currentChain, nextPiece.type], results, new Set(visited).add(nextIdx), gridRef, gridSize);
          }
        }
      }
    }
  }
};

export const getBurgerName = (order: PieceType[], lang: 'es' | 'en') => {
  const t = TRANSLATIONS[lang];
  const ingredients = order.filter((t): t is Exclude<PieceType, 'BREAD'> => t !== 'BREAD');
  const has = (type: Exclude<PieceType, 'BREAD'>) => ingredients.includes(type);
  const count = ingredients.length;
  const hasCheese = has('CHEESE');
  const hasBacon = has('BACON');
  const hasAllVeggies = has('LETTUCE') && has('TOMATO') && has('PICKLE') && has('ONION');

  if (count >= 6) return t.r_monster;
  if (hasAllVeggies && hasCheese && hasBacon) return t.r_gourmet;
  if (hasAllVeggies) return t.r_veggie_full;
  if (hasCheese && hasBacon && has('ONION')) return t.r_viking;
  if (hasCheese && has('PICKLE') && has('KETCHUP')) return t.r_classic_usa;
  if (hasBacon && has('KETCHUP') && has('ONION')) return t.r_bacon_bbq;
  if (hasCheese && has('TOMATO') && has('LETTUCE')) return t.r_cheese_fresh;
  if (has('PICKLE') && has('ONION') && has('TOMATO')) return t.r_pickled;
  if (hasCheese && has('BACON')) return t.r_bacon_cheese;
  if (hasCheese && has('ONION')) return t.r_cheese_onion;
  if (hasBacon && has('PICKLE')) return t.r_crunchy_bacon;
  if (hasCheese && has('PICKLE')) return t.r_double_texture;
  if (has('LETTUCE') && has('TOMATO')) return t.r_garden;
  if (hasCheese) return t.r_cheese;
  if (hasBacon) return t.r_bacon_burger;
  if (has('PICKLE') && has('ONION')) return t.r_duo_pickled;
  if (has('TOMATO') && has('PICKLE')) return t.r_fresh_pickle;
  if (has('LETTUCE')) return t.r_lettuce_fresh;
  if (has('TOMATO')) return t.r_tomato_special;
  if (has('ONION')) return t.r_onion_grill;
  if (has('PICKLE')) return t.r_pickle_bomb;
  return t.r_pure;
};

export const isRecipeMatch = (selection: PieceType[], recipe: PieceType[]) => {
  if (selection.length !== recipe.length) return false;
  // Debe empezar y acabar con pan
  if (selection[0] !== 'BREAD' || selection[selection.length - 1] !== 'BREAD') return false;
  if (recipe[0] !== 'BREAD' || recipe[recipe.length - 1] !== 'BREAD') return false;

  // El orden de los ingredientes interiores no importa
  const middleSelection = [...selection.slice(1, -1)].sort();
  const middleRecipe = [...recipe.slice(1, -1)].sort();

  return middleSelection.every((t, i) => t === middleRecipe[i]);
};

export const calculatePrice = (order: PieceType[]) => {
  const nonBread = order.filter(t => t !== 'BREAD');
  const meatCount = nonBread.filter(t => t === 'MEAT').length;
  const extras = nonBread.filter(t => t !== 'MEAT');
  const extrasCount = extras.length;
  const uniqueExtrasCount = new Set(extras).size;

  let price = 0;

  // Lógica base según carnes y extras
  if (meatCount === 1) {
    if (extrasCount === 0) price = 5;
    else if (extrasCount === 1) price = 7;
    else if (extrasCount === 2) price = 10;
    else if (extrasCount === 3) {
      price = (uniqueExtrasCount < extrasCount) ? 13 : 15;
    }
    else price = 15 + (extrasCount - 3) * 2;
  } else if (meatCount === 2) {
    if (extrasCount === 0) price = 7;
    else if (extrasCount === 1) price = 9;
    else if (extrasCount === 2) price = 12;
    else if (extrasCount === 3) price = 17;
    else price = 17 + (extrasCount - 3) * 2;
  } else {
    price = 5 + (meatCount * 2) + (extrasCount * 2);
  }

  if (meatCount === 2) {
    const meatIndices = [];
    for (let i = 0; i < order.length; i++) {
      if (order[i] === 'MEAT') meatIndices.push(i);
    }
    if (meatIndices.length === 2 && Math.abs(meatIndices[0] - meatIndices[1]) > 1) {
      price += 2;
    }
  }

  let hasIdenticalExtrasTogether = false;
  for (let i = 0; i < order.length - 1; i++) {
    if (order[i] !== 'BREAD' && order[i] !== 'MEAT' && order[i] === order[i+1]) {
      hasIdenticalExtrasTogether = true;
      break;
    }
  }
  if (hasIdenticalExtrasTogether) {
    price -= 2;
  }

  return Math.max(5, price);
};

export const calculateStars = (level: Level, timeRemaining: number, destructionsUsed: number): LevelStars => {
  const timeLimit = level.timeLimit || 60; // Valor por defecto si no está definido
  const destructionLimit = level.destructionLimit || 25; // Valor por defecto si no está definido

  // Calcular tiempo transcurrido (tiempo total - tiempo restante)
  const timeElapsed = timeLimit - timeRemaining;

  logGameEvent('timeElapsed', {
    timeElapsed: timeElapsed,
    timeLimit: timeLimit,
  });

  // Verificar si se completaron los bonus
  const timeBonus = timeElapsed <= timeLimit; // true si completó dentro del tiempo límite
  const destructionBonus = destructionsUsed <= destructionLimit; // true si usó menos eliminaciones que el límite

  // Calcular estrellas según las reglas:
  // 3 estrellas: ambos bonus completados (menos tiempo Y menos eliminaciones)
  // 2 estrellas: al menos uno de los bonus completados (tiempo sobrepasado O eliminaciones sobrepasadas)
  // 1 estrella: ninguno de los bonus completados (tiempo sobrepasado Y eliminaciones sobrepasadas)
  let stars: number;
  if (timeBonus && destructionBonus) {
    stars = 3; // Mención de honor
  } else if (timeBonus || destructionBonus) {
    stars = 2; // Logro especial
  } else {
    stars = 1; // Logro básico
  }

  return {
    stars,
    timeBonus,
    destructionBonus
  };
};
