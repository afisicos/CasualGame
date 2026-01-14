import { logEvent } from 'firebase/analytics';
import { analytics } from '../config/firebase';

// Eventos de Analytics
export const logGameEvent = (eventName: string, params?: Record<string, any>) => {
  try {
    if (analytics) {
      logEvent(analytics, eventName, params);
    } else {
      console.log(`[Analytics] ${eventName}`, params);
    }
  } catch (error) {
    console.warn(`[Analytics] Error logging event ${eventName}:`, error);
  }
};

// Eventos específicos del juego
export const logLevelStart = (levelId: number, gameMode: 'CAMPAIGN' | 'ARCADE') => {
  logGameEvent('level_start', {
    level_id: levelId,
    game_mode: gameMode,
  });
};

export const logLevelComplete = (levelId: number, gameMode: 'CAMPAIGN' | 'ARCADE', score: number) => {
  logGameEvent('level_complete', {
    level_id: levelId,
    game_mode: gameMode,
    score: score,
  });
};

export const logLevelFail = (levelId: number, gameMode: 'CAMPAIGN' | 'ARCADE') => {
  logGameEvent('level_fail', {
    level_id: levelId,
    game_mode: gameMode,
  });
};

export const logRecipeDiscovered = (recipeId: string) => {
  logGameEvent('recipe_discovered', {
    recipe_id: recipeId,
  });
};

export const logShopPurchase = (item: string, price: number) => {
  logGameEvent('shop_purchase', {
    item: item,
    price: price,
  });
};

export const logScreenView = (screenName: string) => {
  logGameEvent('screen_view', {
    screen_name: screenName,
  });
};

