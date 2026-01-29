import { PieceType, Level, Recipe, IngredientProbability, RecipeTarget, DailyAchievement } from '../types';

export const ENERGY_RECOVERY_TIME = 300; // 5 minutos en segundos
export const MAX_ENERGY = 10;

export const ACHIEVEMENT_POOL: Omit<DailyAchievement, 'id' | 'current' | 'claimed'>[] = [
  { type: 'DELETE_INGREDIENT', description: 'achievement_delete_ingredient', target: 100, reward: 100, ingredient: 'LETTUCE' },
  { type: 'DELETE_INGREDIENT', description: 'achievement_delete_ingredient', target: 100, reward: 100, ingredient: 'TOMATO' },
  { type: 'DELETE_INGREDIENT', description: 'achievement_delete_ingredient', target: 100, reward: 100, ingredient: 'CHEESE' },
  { type: 'DELETE_INGREDIENT', description: 'achievement_delete_ingredient', target: 100, reward: 100, ingredient: 'BACON' },
  { type: 'DELETE_INGREDIENT', description: 'achievement_delete_ingredient', target: 50, reward: 100, ingredient: 'EGG' },
  { type: 'DELETE_INGREDIENT', description: 'achievement_delete_ingredient', target: 50, reward: 100, ingredient: 'ONION' },
  { type: 'CREATE_BURGER', description: 'achievement_create_burger', target: 50, reward: 100 },
  { type: 'CREATE_BURGER', description: 'achievement_create_burger', target: 30, reward: 100 },
  { type: 'DELETE_MULTIPLE_SAME_IN_ONE_GO', description: 'achievement_delete_multiple', target: 10, reward: 100, ingredient: 'CHEESE' },
  { type: 'DELETE_MULTIPLE_SAME_IN_ONE_GO', description: 'achievement_delete_multiple', target: 10, reward: 100, ingredient: 'LETTUCE' },
  { type: 'DELETE_MULTIPLE_SAME_IN_ONE_GO', description: 'achievement_delete_multiple', target: 10, reward: 100, ingredient: 'TOMATO' },
  { type: 'DELETE_MULTIPLE_SAME_IN_ONE_GO', description: 'achievement_delete_multiple', target: 8, reward: 100, ingredient: 'BACON' },
  { type: 'DELETE_MULTIPLE_SAME_IN_ONE_GO', description: 'achievement_delete_multiple', target: 5, reward: 100, ingredient: 'EGG' },
];

// Configuración de barreras
export interface Barrier {
  levelAfter: number; // Nivel después del cual aparece la barrera (ej: 5 = barrera aparece antes del nivel 6)
  requiredStars: number; // Número de estrellas necesarias para poder romper la barrera
}

export const BARRIERS: Barrier[] = [
  { levelAfter: 5, requiredStars: 5 }, // Barrera después del nivel 5, requiere 5 estrellas
  { levelAfter: 10, requiredStars: 12 }, // Barrera después del nivel 10, requiere 10 estrellas
  { levelAfter: 15, requiredStars: 20 }, // Barrera después del nivel 15, requiere 15 estrellas
  { levelAfter: 20, requiredStars: 30 },// Agregar más barreras según sea necesario
  { levelAfter: 25, requiredStars: 42 },
  { levelAfter: 30, requiredStars: 55 },
  { levelAfter: 35, requiredStars: 68 },
  { levelAfter: 40, requiredStars: 82 },
  { levelAfter: 45, requiredStars: 96 },
  // { levelAfter: 20, requiredStars: 20, requiredTaps: 4 }, // Ejemplo con toques personalizados
];

export const INGREDIENT_IMAGES: Record<PieceType, any> = {
  BREAD: require('../assets/Ingredientes/bread.png'),
  MEAT: require('../assets/Ingredientes/meat.png'),
  CHEESE: require('../assets/Ingredientes/cheese.png'),
  LETTUCE: require('../assets/Ingredientes/lettuce.png'),
  TOMATO: require('../assets/Ingredientes/tomato.png'),
  BACON: require('../assets/Ingredientes/bacon.png'),
  KETCHUP: require('../assets/Ingredientes/ketchup.png'),
  PICKLE: require('../assets/Ingredientes/pickle.png'),
  ONION: require('../assets/Ingredientes/onion.png'),
  EGG: require('../assets/Ingredientes/egg.png'),
  AVOCADO: require('../assets/Ingredientes/avocado.png'),
  JALAPENO: require('../assets/Ingredientes/jalapeno.png'),
  BEETROOT: require('../assets/Ingredientes/remolacha.png'),
};

export const BASE_RECIPES: Recipe[] = [
  { id: 'classic', name: 'r_pure', ingredients: ['BREAD', 'MEAT', 'BREAD'], price: 5 },
  { id: 'cheese', name: 'r_cheese', ingredients: ['BREAD', 'MEAT', 'CHEESE', 'BREAD'], price: 8 },
  { id: 'double_cheese', name: 'r_double_cheese', ingredients: ['BREAD', 'MEAT', 'CHEESE','CHEESE', 'BREAD'], price: 12 },
  { id: 'tomatomato', name: 'r_tomatomato', ingredients: ['BREAD', 'MEAT', 'TOMATO','TOMATO', 'TOMATO', 'BREAD'], price: 14},
  { id: 'tomato_burger', name: 'r_tomato_burger', ingredients: ['BREAD', 'MEAT', 'TOMATO', 'BREAD'], price: 8 },
  { id: 'cheese_tomato', name: 'r_cheese_tomato', ingredients: ['BREAD', 'MEAT', 'CHEESE', 'TOMATO', 'BREAD'], price: 12 },
  { id: 'veggie', name: 'r_garden', ingredients: ['BREAD', 'MEAT', 'TOMATO', 'LETTUCE', 'BREAD'], price: 12 },
  { id: 'lettuce_burger', name: 'r_lettuce_burger', ingredients: ['BREAD', 'MEAT', 'LETTUCE', 'BREAD'], price: 8 },
  { id: 'veggie_cheese', name: 'r_veggie_cheese', ingredients: ['BREAD', 'MEAT', 'CHEESE', 'TOMATO', 'LETTUCE', 'BREAD'], price: 23 },
  { id: 'bacon_cheese', name: 'r_bacon_cheese', ingredients: ['BREAD', 'MEAT', 'BACON', 'CHEESE', 'BREAD'], price: 14 },
  { id: 'super_bacon', name: 'r_super_bacon', ingredients: ['BREAD', 'MEAT', 'BACON', 'BACON', 'BREAD'], price: 12 },
  { id: 'not_green', name: 'r_not_green', ingredients: ['BREAD', 'MEAT', 'MEAT', 'CHEESE', 'BACON', 'BREAD'], price: 16 },
  { id: 'carnivore', name: 'r_carnivore', ingredients: ['BREAD', 'MEAT', 'MEAT', 'MEAT', 'BREAD'], price: 7 },
  { id: 'ketchup_lettuce', name: 'r_ketchup_lettuce', ingredients: ['BREAD', 'MEAT', 'LETTUCE', 'KETCHUP', 'BREAD'], price: 12 },
  { id: 'onioner', name: 'r_onioner', ingredients: ['BREAD', 'MEAT', 'ONION', 'ONION', 'BREAD'], price: 12 },
  { id: 'tonion_burger', name: 'r_tonion_burger', ingredients: ['BREAD', 'MEAT', 'BACON', 'CHEESE','TOMATO','ONION', 'BREAD'], price: 35 },
  { id: 'dirty_one', name: 'r_dirty_one', ingredients: ['BREAD', 'MEAT', 'CHEESE', 'KETCHUP', 'BREAD'], price: 11 },
  // --- Nuevas recetas (11+) ---
  { id: 'loaded_bbq', name: 'r_loaded_bbq', ingredients: ['BREAD', 'MEAT', 'BACON', 'KETCHUP', 'ONION', 'BREAD'], price: 20 },
  { id: 'cheese_onion_ketchup', name: 'r_cheese_onion_ketchup', ingredients: ['BREAD', 'MEAT', 'CHEESE', 'ONION', 'KETCHUP', 'BREAD'], price: 19 },
  { id: 'double_meat_bacon', name: 'r_double_meat_bacon', ingredients: ['BREAD', 'MEAT', 'MEAT', 'BACON', 'BREAD'], price: 16 },
  { id: 'veggie_ketchup', name: 'r_veggie_ketchup', ingredients: ['BREAD', 'MEAT', 'LETTUCE', 'TOMATO', 'KETCHUP', 'BREAD'], price: 18 },

  // Pepinillo (12+)
  { id: 'cheese_pickle', name: 'r_cheese_pickle', ingredients: ['BREAD', 'MEAT', 'CHEESE', 'PICKLE', 'BREAD'], price: 14 },
  { id: 'ketchup_pickle', name: 'r_ketchup_pickle', ingredients: ['BREAD', 'MEAT', 'KETCHUP', 'PICKLE', 'BREAD'], price: 13 },
  { id: 'pickle_onion', name: 'r_pickle_onion', ingredients: ['BREAD', 'MEAT', 'PICKLE', 'ONION', 'BREAD'], price: 14 },
  { id: 'bacon_pickle', name: 'r_bacon_pickle', ingredients: ['BREAD', 'MEAT', 'BACON', 'PICKLE', 'BREAD'], price: 15 },
  { id: 'green_pickle', name: 'r_green_pickle', ingredients: ['BREAD', 'MEAT', 'LETTUCE', 'TOMATO', 'PICKLE', 'BREAD'], price: 19 },
  { id: 'everything_pickle', name: 'r_everything_pickle', ingredients: ['BREAD', 'MEAT', 'BACON', 'CHEESE', 'ONION', 'PICKLE', 'KETCHUP', 'BREAD'], price: 28 },

  // --- Niveles con Huevo (16+) ---
  { id: 'ranchera', name: 'r_ranchera', ingredients: ['BREAD', 'MEAT', 'BACON', 'EGG', 'CHEESE', 'ONION', 'BREAD'], price: 30 },
  { id: 'egg_ketchup', name: 'r_egg_ketchup', ingredients: ['BREAD', 'MEAT', 'EGG', 'KETCHUP', 'BREAD'], price: 18 },
  { id: 'protein', name: 'r_protein', ingredients: ['BREAD', 'MEAT', 'MEAT', 'EGG', 'EGG', 'BREAD'], price: 25 },
  { id: 'huevolla', name: 'r_huevolla', ingredients: ['BREAD', 'MEAT', 'EGG', 'ONION', 'ONION', 'BREAD'], price: 22 },
  // --- Nuevas recetas con Aguacate (19+) ---
  { id: 'avocado_classic', name: 'r_avocado_classic', ingredients: ['BREAD', 'MEAT', 'AVOCADO', 'BREAD'], price: 15 },
  { id: 'avocado_bacon', name: 'r_avocado_bacon', ingredients: ['BREAD', 'MEAT', 'AVOCADO', 'BACON', 'CHEESE', 'BREAD'], price: 25 },
  { id: 'mexican_style', name: 'r_mexican_style', ingredients: ['BREAD', 'MEAT', 'AVOCADO', 'TOMATO', 'ONION', 'BREAD'], price: 22 },
  { id: 'green_power', name: 'r_green_power', ingredients: ['BREAD', 'MEAT', 'AVOCADO', 'LETTUCE', 'PICKLE', 'BREAD'], price: 20 },
  
  // --- Nuevas recetas con Jalapeño (24+) ---
  { id: 'spicy_kick', name: 'r_spicy_kick', ingredients: ['BREAD', 'MEAT', 'JALAPENO', 'CHEESE', 'BREAD'], price: 18 },
  { id: 'volcano', name: 'r_volcano', ingredients: ['BREAD', 'MEAT', 'JALAPENO', 'JALAPENO', 'BACON', 'KETCHUP', 'BREAD'], price: 28 },
  { id: 'spicy_mex', name: 'r_spicy_mex', ingredients: ['BREAD', 'MEAT', 'JALAPENO', 'AVOCADO', 'CHEESE', 'BREAD'], price: 26 },
  { id: 'fire_egg', name: 'r_fire_egg', ingredients: ['BREAD', 'MEAT', 'JALAPENO', 'EGG', 'ONION', 'BREAD'], price: 24 },

  // --- Nuevas recetas con Remolacha (30+) ---
  { id: 'beet_root', name: 'r_beet_root', ingredients: ['BREAD', 'MEAT', 'BEETROOT', 'BREAD'], price: 16 },
  { id: 'purple_rain', name: 'r_purple_rain', ingredients: ['BREAD', 'MEAT', 'BEETROOT', 'CHEESE', 'EGG', 'BREAD'], price: 26 },
  { id: 'earthy_veggie', name: 'r_earthy_veggie', ingredients: ['BREAD', 'MEAT', 'BEETROOT', 'LETTUCE', 'TOMATO', 'AVOCADO', 'BREAD'], price: 30 },
  { id: 'sweet_beet', name: 'r_sweet_beet', ingredients: ['BREAD', 'MEAT', 'BEETROOT', 'ONION', 'KETCHUP', 'BREAD'], price: 22 },

  // --- Recetas de alto nivel (40+) ---
  { id: 'ultimate_combo', name: 'r_ultimate_combo', ingredients: ['BREAD', 'MEAT', 'AVOCADO', 'JALAPENO', 'BEETROOT', 'BACON', 'CHEESE', 'BREAD'], price: 45 },
  { id: 'chef_special', name: 'r_chef_special', ingredients: ['BREAD', 'MEAT', 'MEAT', 'EGG', 'AVOCADO', 'JALAPENO', 'BREAD'], price: 40 },
];

export const LEVELS: Level[] = [
  {
    id: 1,
    name: "l1_name",
    ingredients: [
      { type: 'BREAD', probability: 0.4 },
      { type: 'MEAT', probability: 0.4 },
      { type: 'TOMATO', probability: 0.2 }
    ],
    newIngredient: 'TOMATO',
    showNewIngredient: true,
    newRecipe: 'tomato_burger',
    targetBurgers: 5,
    description: "l1_desc",
    timeLimit: 45, // 45 segundos para completar
    destructionLimit: 15 // 15 eliminaciones máximo para estrella
  },
  {
    id: 2,
    name: "l2_name",
    targetBurgers: 4,
    ingredients: [
      { type: 'BREAD', probability: 0.3 },
      { type: 'MEAT', probability: 0.3 },
      { type: 'CHEESE', probability: 0.2 },
      { type: 'TOMATO', probability: 0.2 }
    ],
    newIngredient: 'CHEESE',
    showNewIngredient: false,
    newRecipe: 'cheese_tomato',
    description: "l2_desc",
    timeLimit: 50,
    destructionLimit: 18
  },
  {
    id: 3,
    name: "l3_name",
    targetBurgers: 5,
    ingredients: [
      { type: 'BREAD', probability: 0.25 },
      { type: 'MEAT', probability: 0.25 },
      { type: 'CHEESE', probability: 0.2 },
      { type: 'TOMATO', probability: 0.15 },
      { type: 'LETTUCE', probability: 0.15 }
    ],
    newIngredient: 'LETTUCE',
    showNewIngredient: true,
    newRecipe: 'veggie',
    description: "l3_desc",
    timeLimit: 55,
    destructionLimit: 20
  },
  {
    id: 4,
    name: "l4_name",
    targetRecipes: [
      { id: 'veggie_cheese', count: 2 },
      { id: 'classic', count: 4 }
    ],
    ingredients: [
      { type: 'BREAD', probability: 0.25 },
      { type: 'MEAT', probability: 0.25 },
      { type: 'CHEESE', probability: 0.2 },
      { type: 'TOMATO', probability: 0.15 },
      { type: 'LETTUCE', probability: 0.15 }
    ],
    showNewIngredient: false,
    newRecipe: 'veggie_cheese',
    description: "l4_desc",
    timeLimit: 60,
    destructionLimit: 22
  },
  {
    id: 5,
    name: "l5_name",
    targetBurgers: 5,
    ingredients: [
      { type: 'BREAD', probability: 0.25 },
      { type: 'MEAT', probability: 0.25 },
      { type: 'BACON', probability: 0.2 },
      { type: 'CHEESE', probability: 0.2 },
      { type: 'TOMATO', probability: 0.1 }
    ],
    newIngredient: 'BACON',
    showNewIngredient: true,
    newRecipe: 'bacon_cheese',
    description: "l5_desc",
    timeLimit: 65,
    destructionLimit: 25
  },
  {
    id: 6,
    name: "l6_name",
    targetBurgers: 4,
    ingredients: [
      { type: 'BREAD', probability: 0.2 },
      { type: 'MEAT', probability: 0.2 },
      { type: 'BACON', probability: 0.1 },
      { type: 'CHEESE', probability: 0.1 },
      { type: 'TOMATO', probability: 0.3 },
      { type: 'LETTUCE', probability: 0.1 }
    ],
    showNewIngredient: false,
    newRecipe: 'tomatomato',
    description: "l6_desc",
    timeLimit: 70,
    destructionLimit: 28
  },
  {
    id: 7,
    name: "l7_name",
    targetBurgers: 6,
    ingredients: [
      { type: 'BREAD', probability: 0.2 },
      { type: 'MEAT', probability: 0.2 },
      { type: 'LETTUCE', probability: 0.2 },
      { type: 'CHEESE', probability: 0.1 },
      { type: 'TOMATO', probability: 0.1 },
      { type: 'KETCHUP', probability: 0.2 }
    ],
    newIngredient: 'KETCHUP',
    showNewIngredient: true,
    newRecipe: 'ketchup_lettuce',
    description: "l7_desc",
    timeLimit: 75,
    destructionLimit: 30
  },
  {
    id: 8,
    name: "l8_name",
    targetRecipes: [
      { id: 'not_green', count: 3 },
      { id: 'bacon_cheese', count: 2 }
    ],
    ingredients: [
      { type: 'BREAD', probability: 0.2 },
      { type: 'MEAT', probability: 0.2 },
      { type: 'BACON', probability: 0.15 },
      { type: 'CHEESE', probability: 0.15 },
      { type: 'TOMATO', probability: 0.15 },
      { type: 'KETCHUP', probability: 0.1 },
      { type: 'LETTUCE', probability: 0.05 }
    ],
    showNewIngredient: false,
    newRecipe: 'not_green',
    description: "l8_desc",
    timeLimit: 80,
    destructionLimit: 32
  },
  {
    id: 9,
    name: "l9_name",
    targetBurgers: 2,
    ingredients: [
      { type: 'BREAD', probability: 0.15 },
      { type: 'MEAT', probability: 0.15 },
      { type: 'BACON', probability: 0.15 },
      { type: 'CHEESE', probability: 0.15 },
      { type: 'TOMATO', probability: 0.15 },
      { type: 'KETCHUP', probability: 0.05 },
      { type: 'ONION', probability: 0.15 },
      { type: 'LETTUCE', probability: 0.05 }
    ],
    newIngredient: 'ONION',
    showNewIngredient: true,
    newRecipe: 'tonion_burger',
    description: "l9_desc",
    timeLimit: 85,
    destructionLimit: 35
  },
  {
    id: 10,
    name: "l10_name",
    targetBurgers: 7,
    ingredients: [
      { type: 'BREAD', probability: 0.25 },
      { type: 'MEAT', probability: 0.25 },
      { type: 'BACON', probability: 0.15 },
      { type: 'CHEESE', probability: 0.2 },
      { type: 'ONION', probability: 0.15 }
    ],
    showNewIngredient: false,
    newRecipe: 'onioner',
    description: "l10_desc"
  },
  {
    id: 11,
    name: "l11_name",
    targetBurgers: 5,
    ingredients: [
      { type: 'BREAD', probability: 0.20 },
      { type: 'MEAT', probability: 0.20 },
      { type: 'BACON', probability: 0.15 },
      { type: 'CHEESE', probability: 0.075 },
      { type: 'TOMATO', probability: 0.075 },
      { type: 'KETCHUP', probability: 0.15 },
      { type: 'ONION', probability: 0.15 }
    ],
    showNewIngredient: false,
    newRecipe: 'loaded_bbq',
    description: "l11_desc"
  },
  {
    id: 12,
    name: "l12_name",
    targetBurgers: 5,
    ingredients: [
      { type: 'BREAD', probability: 0.2 },
      { type: 'MEAT', probability: 0.2 },
      { type: 'CHEESE', probability: 0.2 },
      { type: 'KETCHUP', probability: 0.1 },
      { type: 'ONION', probability: 0.1 },
      { type: 'PICKLE', probability: 0.2 }
    ],
    newIngredient: 'PICKLE',
    showNewIngredient: true,
    newRecipe: 'cheese_pickle',
    description: "l12_desc"
  },
  {
    id: 13,
    name: "l13_name",
    targetBurgers: 5,
    ingredients: [
      { type: 'BREAD', probability: 0.3 },
      { type: 'MEAT', probability: 0.2 },
      { type: 'TOMATO', probability: 0.15 },
      { type: 'LETTUCE', probability: 0.15 },
      { type: 'KETCHUP', probability: 0.05 },
      { type: 'PICKLE', probability: 0.15 }
    ],
    showNewIngredient: false,
    newRecipe: 'green_pickle',
    description: "l13_desc"
  },
  {
    id: 14,
    name: "l14_name",
    targetRecipes: [
      { id: 'bacon_pickle', count: 3 },
      { id: 'cheese_pickle', count: 2 }
    ],
    ingredients: [
      { type: 'BREAD', probability: 0.2 },
      { type: 'MEAT', probability: 0.2 },
      { type: 'BACON', probability: 0.1 },
      { type: 'ONION', probability: 0.1 },
      { type: 'PICKLE', probability: 0.2 },
      { type: 'KETCHUP', probability: 0.1 },
      { type: 'CHEESE', probability: 0.1 }
    ],
    showNewIngredient: false,
    newRecipe: 'bacon_pickle',
    description: "l14_desc"
  },
  {
    id: 15,
    name: "l15_name",
    targetBurgers: 2,
    ingredients: [
      { type: 'BREAD', probability: 0.2 },
      { type: 'MEAT', probability: 0.2 },
      { type: 'BACON', probability: 0.1 },
      { type: 'CHEESE', probability: 0.1 },
      { type: 'ONION', probability: 0.1 },
      { type: 'PICKLE', probability: 0.1 },
      { type: 'KETCHUP', probability: 0.1 },
      { type: 'TOMATO', probability: 0.05 },
      { type: 'LETTUCE', probability: 0.05 } 
    ],
    showNewIngredient: false,
    newRecipe: 'everything_pickle',
    description: "l15_desc"
  },
  {
    id: 16,
    name: "l16_name",
    targetBurgers: 5,
    ingredients: [
      { type: 'BREAD', probability: 0.2 },
      { type: 'MEAT', probability: 0.2 },
      { type: 'BACON', probability: 0.15 },
      { type: 'CHEESE', probability: 0.10 },
      { type: 'ONION', probability: 0.15 },
      { type: 'TOMATO', probability: 0.05 },
      { type: 'EGG', probability: 0.15 }
    ],
    newIngredient: 'EGG',
    showNewIngredient: true,
    newRecipe: 'ranchera',
    description: "l16_desc"
  },
  {
    id: 17,
    name: "l17_name",
    targetBurgers: 7,
    ingredients: [
      { type: 'BREAD', probability: 0.3 },
      { type: 'MEAT', probability: 0.3 },
      { type: 'BACON', probability: 0.04 },
      { type: 'CHEESE', probability: 0.04 },
      { type: 'ONION', probability: 0.04 },
      { type: 'PICKLE', probability: 0.04 },
      { type: 'KETCHUP', probability: 0.1 },
      { type: 'TOMATO', probability: 0.02 },
      { type: 'LETTUCE', probability: 0.02 },
      { type: 'EGG', probability: 0.1 }
    ],
    showNewIngredient: false,
    newRecipe: 'egg_ketchup',
    description: "l17_desc"
  },
  {
    id: 18,
    name: "l18_name",
    targetRecipes: [
      { id: 'huevolla', count: 3 },
      { id: 'tomato_burger', count: 3 }
    ],
    ingredients: [
      { type: 'BREAD', probability: 0.2 },
      { type: 'MEAT', probability: 0.2 },
      { type: 'EGG', probability: 0.15 },
      { type: 'CHEESE', probability: 0.15 },
      { type: 'TOMATO', probability: 0.15 },
      { type: 'ONION', probability: 0.15 }
    ],
    showNewIngredient: false,
    newRecipe: 'huevolla',
    description: "l18_desc"
  },
  // --- Nuevos Niveles (19-48) ---
  {
    id: 19,
    name: "l19_name",
    targetBurgers: 6,
    ingredients: [
      { type: 'BREAD', probability: 0.25 },
      { type: 'MEAT', probability: 0.25 },
      { type: 'AVOCADO', probability: 0.2 },
      { type: 'TOMATO', probability: 0.15 },
      { type: 'CHEESE', probability: 0.15 }
    ],
    newIngredient: 'AVOCADO',
    showNewIngredient: true,
    newRecipe: 'avocado_classic',
    description: "l19_desc",
    timeLimit: 60,
    destructionLimit: 25
  },
  {
    id: 20,
    name: "l20_name",
    targetRecipes: [
      { id: 'avocado_classic', count: 4 },
      { id: 'bacon_cheese', count: 3 }
    ],
    ingredients: [
      { type: 'BREAD', probability: 0.2 },
      { type: 'MEAT', probability: 0.2 },
      { type: 'AVOCADO', probability: 0.2 },
      { type: 'BACON', probability: 0.2 },
      { type: 'CHEESE', probability: 0.2 }
    ],
    description: "l20_desc",
    timeLimit: 75,
    destructionLimit: 30
  },
  {
    id: 21,
    name: "l21_name",
    targetRecipes: [
      { id: 'mexican_style', count: 5 },
      { id: 'classic', count: 5 }
    ],
    ingredients: [
      { type: 'BREAD', probability: 0.2 },
      { type: 'MEAT', probability: 0.2 },
      { type: 'AVOCADO', probability: 0.2 },
      { type: 'TOMATO', probability: 0.2 },
      { type: 'ONION', probability: 0.2 }
    ],
    newRecipe: 'mexican_style',
    description: "l21_desc",
    timeLimit: 80,
    destructionLimit: 35
  },
  {
    id: 22,
    name: "l22_name",
    targetRecipes: [
      { id: 'avocado_bacon', count: 3 },
      { id: 'ranchera', count: 3 }
    ],
    ingredients: [
      { type: 'BREAD', probability: 0.15 },
      { type: 'MEAT', probability: 0.15 },
      { type: 'AVOCADO', probability: 0.15 },
      { type: 'BACON', probability: 0.15 },
      { type: 'CHEESE', probability: 0.15 },
      { type: 'EGG', probability: 0.15 },
      { type: 'ONION', probability: 0.1 }
    ],
    newRecipe: 'avocado_bacon',
    description: "l22_desc",
    timeLimit: 90,
    destructionLimit: 40
  },
  {
    id: 23,
    name: "l23_name",
    targetRecipes: [
      { id: 'green_power', count: 4 },
      { id: 'green_pickle', count: 4 }
    ],
    ingredients: [
      { type: 'BREAD', probability: 0.2 },
      { type: 'MEAT', probability: 0.2 },
      { type: 'AVOCADO', probability: 0.15 },
      { type: 'LETTUCE', probability: 0.15 },
      { type: 'PICKLE', probability: 0.15 },
      { type: 'TOMATO', probability: 0.15 }
    ],
    newRecipe: 'green_power',
    description: "l23_desc",
    timeLimit: 85,
    destructionLimit: 38
  },
  {
    id: 24,
    name: "l24_name",
    targetBurgers: 8,
    ingredients: [
      { type: 'BREAD', probability: 0.25 },
      { type: 'MEAT', probability: 0.25 },
      { type: 'JALAPENO', probability: 0.2 },
      { type: 'CHEESE', probability: 0.15 },
      { type: 'KETCHUP', probability: 0.15 }
    ],
    newIngredient: 'JALAPENO',
    showNewIngredient: true,
    newRecipe: 'spicy_kick',
    description: "l24_desc",
    timeLimit: 70,
    destructionLimit: 28
  },
  {
    id: 25,
    name: "l25_name",
    targetRecipes: [
      { id: 'spicy_kick', count: 5 },
      { id: 'double_cheese', count: 3 }
    ],
    ingredients: [
      { type: 'BREAD', probability: 0.2 },
      { type: 'MEAT', probability: 0.2 },
      { type: 'JALAPENO', probability: 0.2 },
      { type: 'CHEESE', probability: 0.3 },
      { type: 'BACON', probability: 0.1 }
    ],
    description: "l25_desc",
    timeLimit: 80,
    destructionLimit: 32
  },
  {
    id: 26,
    name: "l26_name",
    targetRecipes: [
      { id: 'volcano', count: 4 },
      { id: 'super_bacon', count: 4 }
    ],
    ingredients: [
      { type: 'BREAD', probability: 0.15 },
      { type: 'MEAT', probability: 0.15 },
      { type: 'JALAPENO', probability: 0.25 },
      { type: 'BACON', probability: 0.25 },
      { type: 'KETCHUP', probability: 0.2 }
    ],
    newRecipe: 'volcano',
    description: "l26_desc",
    timeLimit: 95,
    destructionLimit: 45
  },
  {
    id: 27,
    name: "l27_name",
    targetRecipes: [
      { id: 'spicy_mex', count: 4 },
      { id: 'mexican_style', count: 4 }
    ],
    ingredients: [
      { type: 'BREAD', probability: 0.15 },
      { type: 'MEAT', probability: 0.15 },
      { type: 'JALAPENO', probability: 0.15 },
      { type: 'AVOCADO', probability: 0.15 },
      { type: 'CHEESE', probability: 0.15 },
      { type: 'TOMATO', probability: 0.15 },
      { type: 'ONION', probability: 0.1 }
    ],
    newRecipe: 'spicy_mex',
    description: "l27_desc",
    timeLimit: 100,
    destructionLimit: 50
  },
  {
    id: 28,
    name: "l28_name",
    targetRecipes: [
      { id: 'fire_egg', count: 4 },
      { id: 'huevolla', count: 4 }
    ],
    ingredients: [
      { type: 'BREAD', probability: 0.15 },
      { type: 'MEAT', probability: 0.15 },
      { type: 'JALAPENO', probability: 0.15 },
      { type: 'EGG', probability: 0.2 },
      { type: 'ONION', probability: 0.2 },
      { type: 'KETCHUP', probability: 0.15 }
    ],
    newRecipe: 'fire_egg',
    description: "l28_desc",
    timeLimit: 90,
    destructionLimit: 42
  },
  {
    id: 29,
    name: "l29_name",
    targetRecipes: [
      { id: 'volcano', count: 3 },
      { id: 'spicy_kick', count: 3 },
      { id: 'classic', count: 4 }
    ],
    ingredients: [
      { type: 'BREAD', probability: 0.2 },
      { type: 'MEAT', probability: 0.2 },
      { type: 'JALAPENO', probability: 0.2 },
      { type: 'CHEESE', probability: 0.15 },
      { type: 'BACON', probability: 0.15 },
      { type: 'KETCHUP', probability: 0.1 }
    ],
    description: "l29_desc",
    timeLimit: 110,
    destructionLimit: 55
  },
  {
    id: 30,
    name: "l30_name",
    targetBurgers: 7,
    ingredients: [
      { type: 'BREAD', probability: 0.25 },
      { type: 'MEAT', probability: 0.25 },
      { type: 'BEETROOT', probability: 0.2 },
      { type: 'CHEESE', probability: 0.15 },
      { type: 'LETTUCE', probability: 0.15 }
    ],
    newIngredient: 'BEETROOT',
    showNewIngredient: true,
    newRecipe: 'beet_root',
    description: "l30_desc",
    timeLimit: 65,
    destructionLimit: 26
  },
  {
    id: 31,
    name: "l31_name",
    targetRecipes: [
      { id: 'beet_root', count: 5 },
      { id: 'veggie', count: 4 }
    ],
    ingredients: [
      { type: 'BREAD', probability: 0.2 },
      { type: 'MEAT', probability: 0.2 },
      { type: 'BEETROOT', probability: 0.2 },
      { type: 'LETTUCE', probability: 0.2 },
      { type: 'TOMATO', probability: 0.2 }
    ],
    description: "l31_desc",
    timeLimit: 85,
    destructionLimit: 34
  },
  {
    id: 32,
    name: "l32_name",
    targetRecipes: [
      { id: 'purple_rain', count: 4 },
      { id: 'cheese_tomato', count: 4 }
    ],
    ingredients: [
      { type: 'BREAD', probability: 0.15 },
      { type: 'MEAT', probability: 0.15 },
      { type: 'BEETROOT', probability: 0.15 },
      { type: 'CHEESE', probability: 0.15 },
      { type: 'EGG', probability: 0.2 },
      { type: 'TOMATO', probability: 0.2 }
    ],
    newRecipe: 'purple_rain',
    description: "l32_desc",
    timeLimit: 95,
    destructionLimit: 40
  },
  {
    id: 33,
    name: "l33_name",
    targetRecipes: [
      { id: 'sweet_beet', count: 5 },
      { id: 'onioner', count: 4 }
    ],
    ingredients: [
      { type: 'BREAD', probability: 0.2 },
      { type: 'MEAT', probability: 0.2 },
      { type: 'BEETROOT', probability: 0.15 },
      { type: 'ONION', probability: 0.2 },
      { type: 'KETCHUP', probability: 0.15 },
      { type: 'CHEESE', probability: 0.1 }
    ],
    newRecipe: 'sweet_beet',
    description: "l33_desc",
    timeLimit: 90,
    destructionLimit: 38
  },
  {
    id: 34,
    name: "l34_name",
    targetRecipes: [
      { id: 'earthy_veggie', count: 2 },
      { id: 'green_power', count: 3 }
    ],
    ingredients: [
      { type: 'BREAD', probability: 0.15 },
      { type: 'MEAT', probability: 0.15 },
      { type: 'BEETROOT', probability: 0.15 },
      { type: 'AVOCADO', probability: 0.15 },
      { type: 'LETTUCE', probability: 0.15 },
      { type: 'TOMATO', probability: 0.15 },
      { type: 'PICKLE', probability: 0.1 }
    ],
    newRecipe: 'earthy_veggie',
    description: "l34_desc",
    timeLimit: 105,
    destructionLimit: 48
  },
  {
    id: 35,
    name: "l35_name",
    targetRecipes: [
      { id: 'beet_root', count: 2 },
      { id: 'purple_rain', count: 2 },
      { id: 'sweet_beet', count: 2 }
    ],
    ingredients: [
      { type: 'BREAD', probability: 0.15 },
      { type: 'MEAT', probability: 0.15 },
      { type: 'BEETROOT', probability: 0.25 },
      { type: 'CHEESE', probability: 0.15 },
      { type: 'EGG', probability: 0.15 },
      { type: 'ONION', probability: 0.15 }
    ],
    description: "l35_desc",
    timeLimit: 120,
    destructionLimit: 60
  },
  {
    id: 36,
    name: "l36_name",
    targetRecipes: [
      { id: 'ultimate_combo', count: 3 },
      { id: 'classic', count: 6 }
    ],
    ingredients: [
      { type: 'BREAD', probability: 0.12 },
      { type: 'MEAT', probability: 0.12 },
      { type: 'AVOCADO', probability: 0.12 },
      { type: 'JALAPENO', probability: 0.12 },
      { type: 'BEETROOT', probability: 0.12 },
      { type: 'BACON', probability: 0.12 },
      { type: 'CHEESE', probability: 0.12 },
      { type: 'TOMATO', probability: 0.16 }
    ],
    newRecipe: 'ultimate_combo',
    description: "l36_desc",
    timeLimit: 130,
    destructionLimit: 70
  },
  {
    id: 37,
    name: "l37_name",
    targetRecipes: [
      { id: 'chef_special', count: 4 },
      { id: 'ranchera', count: 4 }
    ],
    ingredients: [
      { type: 'BREAD', probability: 0.15 },
      { type: 'MEAT', probability: 0.2 },
      { type: 'EGG', probability: 0.15 },
      { type: 'AVOCADO', probability: 0.15 },
      { type: 'JALAPENO', probability: 0.15 },
      { type: 'BACON', probability: 0.1 },
      { type: 'CHEESE', probability: 0.1 }
    ],
    newRecipe: 'chef_special',
    description: "l37_desc",
    timeLimit: 125,
    destructionLimit: 65
  },
  {
    id: 38,
    name: "l38_name",
    targetRecipes: [
      { id: 'ultimate_combo', count: 3 },
      { id: 'chef_special', count: 3 },
      { id: 'volcano', count: 3 }
    ],
    ingredients: [
      { type: 'BREAD', probability: 0.1 },
      { type: 'MEAT', probability: 0.15 },
      { type: 'AVOCADO', probability: 0.1 },
      { type: 'JALAPENO', probability: 0.15 },
      { type: 'BEETROOT', probability: 0.1 },
      { type: 'BACON', probability: 0.1 },
      { type: 'EGG', probability: 0.1 },
      { type: 'CHEESE', probability: 0.1 },
      { type: 'KETCHUP', probability: 0.1 }
    ],
    description: "l38_desc",
    timeLimit: 150,
    destructionLimit: 80
  },
  {
    id: 39,
    name: "l39_name",
    targetRecipes: [
      { id: 'spicy_mex', count: 5 },
      { id: 'mexican_style', count: 5 }
    ],
    ingredients: [
      { type: 'BREAD', probability: 0.15 },
      { type: 'MEAT', probability: 0.15 },
      { type: 'JALAPENO', probability: 0.2 },
      { type: 'AVOCADO', probability: 0.2 },
      { type: 'CHEESE', probability: 0.15 },
      { type: 'TOMATO', probability: 0.15 }
    ],
    description: "l39_desc",
    timeLimit: 100,
    destructionLimit: 45
  },
  {
    id: 40,
    name: "l40_name",
    targetRecipes: [
      { id: 'purple_rain', count: 5 },
      { id: 'earthy_veggie', count: 3 }
    ],
    ingredients: [
      { type: 'BREAD', probability: 0.15 },
      { type: 'MEAT', probability: 0.15 },
      { type: 'BEETROOT', probability: 0.2 },
      { type: 'CHEESE', probability: 0.1 },
      { type: 'EGG', probability: 0.1 },
      { type: 'AVOCADO', probability: 0.1 },
      { type: 'LETTUCE', probability: 0.1 },
      { type: 'TOMATO', probability: 0.1 }
    ],
    description: "l40_desc",
    timeLimit: 115,
    destructionLimit: 55
  },
  {
    id: 41,
    name: "l41_name",
    targetRecipes: [
      { id: 'volcano', count: 6 },
      { id: 'spicy_kick', count: 6 }
    ],
    ingredients: [
      { type: 'BREAD', probability: 0.15 },
      { type: 'MEAT', probability: 0.15 },
      { type: 'JALAPENO', probability: 0.3 },
      { type: 'BACON', probability: 0.15 },
      { type: 'CHEESE', probability: 0.15 },
      { type: 'KETCHUP', probability: 0.1 }
    ],
    description: "l41_desc",
    timeLimit: 110,
    destructionLimit: 50
  },
  {
    id: 42,
    name: "l42_name",
    targetRecipes: [
      { id: 'ultimate_combo', count: 5 },
      { id: 'everything_pickle', count: 3 }
    ],
    ingredients: [
      { type: 'BREAD', probability: 0.1 },
      { type: 'MEAT', probability: 0.1 },
      { type: 'AVOCADO', probability: 0.1 },
      { type: 'JALAPENO', probability: 0.1 },
      { type: 'BEETROOT', probability: 0.1 },
      { type: 'BACON', probability: 0.1 },
      { type: 'CHEESE', probability: 0.1 },
      { type: 'PICKLE', probability: 0.1 },
      { type: 'ONION', probability: 0.1 },
      { type: 'KETCHUP', probability: 0.1 }
    ],
    description: "l42_desc",
    timeLimit: 140,
    destructionLimit: 75
  },
  {
    id: 43,
    name: "l43_name",
    targetRecipes: [
      { id: 'chef_special', count: 5 },
      { id: 'protein', count: 5 }
    ],
    ingredients: [
      { type: 'BREAD', probability: 0.15 },
      { type: 'MEAT', probability: 0.2 },
      { type: 'EGG', probability: 0.2 },
      { type: 'AVOCADO', probability: 0.15 },
      { type: 'JALAPENO', probability: 0.15 },
      { type: 'CHEESE', probability: 0.15 }
    ],
    description: "l43_desc",
    timeLimit: 120,
    destructionLimit: 60
  },
  {
    id: 44,
    name: "l44_name",
    targetRecipes: [
      { id: 'sweet_beet', count: 6 },
      { id: 'loaded_bbq', count: 4 }
    ],
    ingredients: [
      { type: 'BREAD', probability: 0.15 },
      { type: 'MEAT', probability: 0.15 },
      { type: 'BEETROOT', probability: 0.15 },
      { type: 'ONION', probability: 0.15 },
      { type: 'KETCHUP', probability: 0.15 },
      { type: 'BACON', probability: 0.15 },
      { type: 'CHEESE', probability: 0.1 }
    ],
    description: "l44_desc",
    timeLimit: 110,
    destructionLimit: 52
  },
  {
    id: 45,
    name: "l45_name",
    targetRecipes: [
      { id: 'ultimate_combo', count: 4 },
      { id: 'chef_special', count: 4 },
      { id: 'mexican_style', count: 4 }
    ],
    ingredients: [
      { type: 'BREAD', probability: 0.1 },
      { type: 'MEAT', probability: 0.15 },
      { type: 'AVOCADO', probability: 0.15 },
      { type: 'JALAPENO', probability: 0.15 },
      { type: 'BEETROOT', probability: 0.1 },
      { type: 'BACON', probability: 0.1 },
      { type: 'EGG', probability: 0.1 },
      { type: 'CHEESE', probability: 0.15 }
    ],
    description: "l45_desc",
    timeLimit: 160,
    destructionLimit: 90
  },
  {
    id: 46,
    name: "l46_name",
    targetRecipes: [
      { id: 'volcano', count: 8 },
      { id: 'fire_egg', count: 4 }
    ],
    ingredients: [
      { type: 'BREAD', probability: 0.15 },
      { type: 'MEAT', probability: 0.15 },
      { type: 'JALAPENO', probability: 0.3 },
      { type: 'BACON', probability: 0.1 },
      { type: 'EGG', probability: 0.15 },
      { type: 'KETCHUP', probability: 0.15 }
    ],
    description: "l46_desc",
    timeLimit: 130,
    destructionLimit: 65
  },
  {
    id: 47,
    name: "l47_name",
    targetRecipes: [
      { id: 'earthy_veggie', count: 5 },
      { id: 'green_power', count: 5 },
      { id: 'veggie_cheese', count: 2 }
    ],
    ingredients: [
      { type: 'BREAD', probability: 0.15 },
      { type: 'MEAT', probability: 0.15 },
      { type: 'BEETROOT', probability: 0.15 },
      { type: 'AVOCADO', probability: 0.15 },
      { type: 'LETTUCE', probability: 0.15 },
      { type: 'TOMATO', probability: 0.15 },
      { type: 'PICKLE', probability: 0.1 }
    ],
    description: "l47_desc",
    timeLimit: 140,
    destructionLimit: 70
  },
  {
    id: 48,
    name: "l48_name",
    targetRecipes: [
      { id: 'ultimate_combo', count: 5 },
      { id: 'chef_special', count: 5 },
      { id: 'everything_pickle', count: 5 }
    ],
    ingredients: [
      { type: 'BREAD', probability: 0.1 },
      { type: 'MEAT', probability: 0.1 },
      { type: 'AVOCADO', probability: 0.1 },
      { type: 'JALAPENO', probability: 0.1 },
      { type: 'BEETROOT', probability: 0.1 },
      { type: 'BACON', probability: 0.1 },
      { type: 'EGG', probability: 0.1 },
      { type: 'CHEESE', probability: 0.1 },
      { type: 'PICKLE', probability: 0.1 },
      { type: 'ONION', probability: 0.1 }
    ],
    description: "l48_desc",
    timeLimit: 180,
    destructionLimit: 100
  },
];

// Mapeo de qué recetas están desbloqueadas según el nivel superado
export const getUnlockedRecipesForArcade = (arcadeUnlockedLevel: number) => {
  const recipes = ['classic'];
  if (arcadeUnlockedLevel >= 1) {
    recipes.push('tomato_burger');
    recipes.push('tomatomato');
  } 
  if (arcadeUnlockedLevel >= 2) {
    recipes.push('cheese');
    recipes.push('double_cheese');
    recipes.push('cheese_tomato');
  }
  if (arcadeUnlockedLevel >= 3) {
    recipes.push('veggie');
    recipes.push('veggie_cheese');
  }
  if (arcadeUnlockedLevel >= 5) {
    recipes.push('bacon_cheese');
    recipes.push('super_bacon');
    recipes.push('not_green');
  }
  if (arcadeUnlockedLevel >= 7) {
    recipes.push('ketchup_lettuce');
    recipes.push('dirty_one');
  }
  if (arcadeUnlockedLevel >= 9) {
    recipes.push('tonion_burger');
    recipes.push('onioner');
  }
  if (arcadeUnlockedLevel >= 11) {
    recipes.push('loaded_bbq');
    recipes.push('cheese_onion_ketchup');
    recipes.push('double_meat_bacon');
    recipes.push('veggie_ketchup');
  }
  if (arcadeUnlockedLevel >= 12) {
    recipes.push('cheese_pickle');
    recipes.push('ketchup_pickle');
    recipes.push('pickle_onion');
    recipes.push('green_pickle');
    recipes.push('bacon_pickle');
    recipes.push('everything_pickle');
  }
  if (arcadeUnlockedLevel >= 16) {
    recipes.push('ranchera');
    recipes.push('egg_ketchup');
    recipes.push('protein');
    recipes.push('huevolla');
  }
  if (arcadeUnlockedLevel >= 19) {
    recipes.push('avocado_classic');
    recipes.push('avocado_bacon');
    recipes.push('mexican_style');
    recipes.push('green_power');
  }
  if (arcadeUnlockedLevel >= 24) {
    recipes.push('spicy_kick');
    recipes.push('volcano');
    recipes.push('spicy_mex');
    recipes.push('fire_egg');
  }
  if (arcadeUnlockedLevel >= 30) {
    recipes.push('beet_root');
    recipes.push('purple_rain');
    recipes.push('earthy_veggie');
    recipes.push('sweet_beet');
  }
  if (arcadeUnlockedLevel >= 36) {
    recipes.push('ultimate_combo');
    recipes.push('chef_special');
  }

  return recipes;
};

// Mapeo de qué recetas están desbloqueadas según el nivel de campaña superado
export const getUnlockedRecipesForCampaign = (campaignUnlockedLevel: number) => {
  const recipes: string[] = [];

  // Recorremos todos los niveles hasta el nivel alcanzado
  for (let level = 1; level <= campaignUnlockedLevel; level++) {
    const levelData = LEVELS.find(l => l.id === level);
    if (levelData && levelData.newRecipe) {
      recipes.push(levelData.newRecipe);
    }
  }

  return recipes;
};

// Mapeo de qué ingredientes están disponibles según el nivel superado
export const getUnlockedIngredientsForArcade = (arcadeUnlockedLevel: number): IngredientProbability[] => {
  const ingredients: PieceType[] = ['BREAD', 'MEAT', 'TOMATO']; // TOMATO está disponible desde el inicio
  if (arcadeUnlockedLevel >= 2) ingredients.push('CHEESE');
  if (arcadeUnlockedLevel >= 3) ingredients.push('LETTUCE');
  if (arcadeUnlockedLevel >= 5) ingredients.push('BACON');
  if (arcadeUnlockedLevel >= 7) ingredients.push('KETCHUP');
  if (arcadeUnlockedLevel >= 9) ingredients.push('ONION');
  if (arcadeUnlockedLevel >= 12) ingredients.push('PICKLE');
  if (arcadeUnlockedLevel >= 16) ingredients.push('EGG');
  if (arcadeUnlockedLevel >= 19) ingredients.push('AVOCADO');
  if (arcadeUnlockedLevel >= 24) ingredients.push('JALAPENO');
  if (arcadeUnlockedLevel >= 30) ingredients.push('BEETROOT');

  // Convertir a probabilidades uniformes
  const probability = 1 / ingredients.length;
  return ingredients.map(type => ({ type, probability }));
};

// Mapeo de qué ingredientes están disponibles según el nivel de campaña alcanzado
export const getUnlockedIngredientsForCampaign = (campaignUnlockedLevel: number): IngredientProbability[] => {
  const ingredients: PieceType[] = ['BREAD', 'MEAT', 'TOMATO']; // TOMATO está disponible desde el inicio
  if (campaignUnlockedLevel >= 2) ingredients.push('CHEESE');
  if (campaignUnlockedLevel >= 3) ingredients.push('LETTUCE');
  if (campaignUnlockedLevel >= 5) ingredients.push('BACON');
  if (campaignUnlockedLevel >= 7) ingredients.push('KETCHUP');
  if (campaignUnlockedLevel >= 9) ingredients.push('ONION');
  if (campaignUnlockedLevel >= 12) ingredients.push('PICKLE');
  if (campaignUnlockedLevel >= 16) ingredients.push('EGG');
  if (campaignUnlockedLevel >= 19) ingredients.push('AVOCADO');
  if (campaignUnlockedLevel >= 24) ingredients.push('JALAPENO');
  if (campaignUnlockedLevel >= 30) ingredients.push('BEETROOT');

  // Convertir a probabilidades uniformes
  const probability = 1 / ingredients.length;
  return ingredients.map(type => ({ type, probability }));
};

// Función helper para convertir array de tipos a probabilidades uniformes
export const convertToUniformProbabilities = (types: PieceType[]): IngredientProbability[] => {
  const probability = 1 / types.length;
  return types.map(type => ({ type, probability }));
};

// Función helper para obtener los objetivos de un nivel (compatibilidad con formato antiguo)
export const getLevelTargets = (level: Level): RecipeTarget[] => {
  if (level.targetRecipes) {
    return level.targetRecipes;
  }
  // Compatibilidad con formato antiguo
  if (level.newRecipe && level.targetBurgers) {
    return [{ id: level.newRecipe, count: level.targetBurgers }];
  }
  return [];
};

// Función helper para obtener el total de hamburguesas objetivo de un nivel
export const getTotalTargetBurgers = (level: Level): number => {
  const targets = getLevelTargets(level);
  return targets.reduce((total, target) => total + target.count, 0);
};

export const TRANSLATIONS = {
  es: {
    recipes: "RECETAS",
    ingredients: "INGREDIENTES",
    current_order: "RECETA",
    time: "Tiempo",
    money: "Dinero",
    burgers: "Hamburguesas",
    press_to_start: "PULSA PARA EMPEZAR",
    go: "¡A TRABAJAR!",
    secret_burger: "Hamburguesa Secreta",
    new_discovery: "🍔 ¡RECETA DESCUBIERTA!",
    discovery_msg: "Has descubierto la ",
    level_prefix: "Nivel",
    level: "NIVEL",
    next_ingredient: "Próximo ingrediente",
    next_ingredient_desc: "Completa niveles para desbloquear nuevos ingredientes",
    objective: "Objetivo",
    arcade_title: "ARCADE",
    arcade_btn: "¡MINUTO EXPRESS!",
    arcade_desc: "Consigue monedas haciendo hamburguesas libremente en un minuto, y bate tu propio récord.",
    arcade_intro_desc: "¡Ponte a prueba! Prepara todas las hamburguesas que puedas antes de que se acabe el tiempo. Cuantos más pedidos completes, más dinero ganarás. Además, podrás descubrir nuevas recetas probando combinaciones.",
    campaign_desc: "Supera los niveles y desbloquea nuevas recetas e ingredientes",
    record: "RÉCORD",
    options: "OPCIONES",
    sound: "SONIDO",
    sound_fx: "Efectos de sonido",
    account: "CUENTA",
    google_login: "Conectar con Google",
    danger_zone: "PELIGRO",
    reset_progress: "Reiniciar Progreso 🔄",
    reset_confirm_title: "Borrar Progreso",
    reset_confirm_msg: "¿Estás seguro? Esta acción no se puede deshacer.",
    cancel: "Cancelar",
    delete_all: "BORRAR TODO",
    language: "IDIOMA",
    lang_name: "Español",
    back: "Volver",
    cook: "¡A COCINAR!",
    new_ingredient: "Nuevo",
    new_recipe: "Nueva Receta",
    win_title: "¡NIVEL SUPERADO!",
    lose_title: "¡TIEMPO AGOTADO!",
    arcade_win: "¡NUEVO RÉCORD!",
    arcade_lose: "¡TIEMPO AGOTADO!",
    money_earned: "DINERO CONSEGUIDO",
    continue: "CONTINUAR",
    retry: "REINTENTAR",
    play_again: "JUGAR DE NUEVO",
    back_menu: "VOLVER AL MENÚ",
    exit_title: "¿Salir de la partida?",
    exit_msg: "Perderás el progreso de este nivel.",
    exit_confirm: "Salir",
    shop_title: "TIENDA DE PODERES",
    owned: "Tienes",
    powerup_time_name: "Tiempo Extra",
    powerup_time_desc: "Empieza con 10 segundos adicionales",
    powerup_super_time_name: "Súper Tiempo Extra",
    powerup_super_time_desc: "Empieza con 20 segundos adicionales",
    powerup_destruction_name: "Pack de Eliminaciones",
    powerup_destruction_desc: "75 eliminaciones en vez de 25",
    powerup_super_destruction_name: "Súper Pack Eliminaciones",
    powerup_super_destruction_desc: "150 eliminaciones en vez de 25",
    powerup_inhibitor_name: "Inhibidor de Ingredientes",
    powerup_inhibitor_desc: "Elige un ingrediente para que no aparezca en el nivel",
    select_inhibited_ingredient: "Selecciona ingrediente a inhibir",
    activated: "Activado",
    activate: "Activar",
    shop_energy_name: "Carga de Energía",
    shop_energy_desc: "Recupera 1 punto de energía inmediatamente",
    powerup_activate_time: "Tiempo Extra",
    powerup_activate_super_time: "Súper Tiempo Extra",
    powerup_activate_destruction: "Pack Eliminaciones",
    powerup_activate_super_destruction: "Súper Pack Eliminaciones",
    powerup_destruction_limit: "Límite alcanzado",
    powerup_destruction_limit_msg: "Has usado todas tus eliminaciones",
    destructions: "Eliminaciones",
    welcome_subtitle: "¡Te esperan desafíos deliciosos!",
    login_google: "Iniciar sesión con Google",
    login_footer: "Conéctate para guardar tu progreso",
    logout: "Cerrar sesión",
    success: "Éxito",
    reset_success: "Progreso reiniciado correctamente",
    energy_recovered: "¡Energía recargada!",
    ad_not_completed: "Debes ver el anuncio completo para recibir la energía.",
    ad_error: "No se pudo cargar el anuncio. Inténtalo más tarde.",
    info: "Información",
    error: "Error",
    strange_burger: "Hamburguesa extraña",
    recipe_instruction: "No hace falta que los ingredientes estén en el orden mostrado, pero tiene que empezar y acabar con pan siempre",
    help_time_remaining: "Tiempo restante de juego",
    help_burgers_to_complete: "Hamburguesas a completar",
    help_tap_to_destroy: "Haz un toque rápido en un ingrediente o bien arrastra 2 o más ingredientes adyacentes del mismo tipo para eliminarlos",
    // Ingredientes
    ing_BREAD: "Pan",
    ing_MEAT: "Carne",
    ing_CHEESE: "Queso",
    ing_LETTUCE: "Lechuga",
    ing_TOMATO: "Tomate",
    ing_BACON: "Bacon",
    ing_KETCHUP: "Ketchup",
    ing_PICKLE: "Pepinillo",
    ing_ONION: "Cebolla",
    ing_EGG: "Huevo",
    ing_AVOCADO: "Aguacate",
    ing_JALAPENO: "Jalapeño",
    ing_BEETROOT: "Remolacha",
    // Panel de energía
    energy_panel_title: "⚡ ¡Sin energía!",
    energy_panel_message: "Mira un video para recuperar todos los puntos de energía",
    energy_panel_cancel: "Cancelar",
    energy_panel_watch: "Ver video",
    // Panel de recetas en menú
    recipes_panel_subtitle: "Consulta aquí todas las recetas descubiertas",
    recipes_panel_description: "También puedes crear tus propias recetas",
    // Panel de ingredientes en menú
    ingredients_panel_subtitle: "Consulta aquí todos los ingredientes descubiertos",
    ingredients_panel_description: "Descubre la historia y características de cada ingrediente",
    // Recetas
    r_pure: "Hamburguesa normal",
    r_double: "Doble de Carne",
    r_cheese: "Cheeseburger",
    r_double_cheese: "Doble de Queso",
    r_garden: "Burger del Huerto",
    r_bacon_cheese: "Bacon & Cheese",
    r_super_bacon: "Super Bacon",
    r_onioner: "Cebollera",
    r_ketchup_lettuce: "Ketchuga",
    r_dirty_one: "La Sucia",
    r_classic_usa: "Clásica Americana",
    r_viking: "La Vikinga",
    r_monster: "La Mega Monster",
    r_gourmet: "La Gran Gourmet",
    r_veggie_full: "La Huerta Completa",
    r_not_green: "Anti-Vegetal",
    r_bacon_bbq: "Bacon BBQ Style",
    r_cheese_fresh: "Cheeseburger Fresh",
    r_pickled: "La Encurtida",
    r_tomato_burger: "Burger con Tomate",
    r_tomatomato: "Toma Tomate Tómalo",
    r_tonion_burger: "Tonion Burger",
    r_cheese_tomato: "Cheeseburger con Tomate",
    r_lettuce_burger: "Burger con Lechuga",
    r_cheese_onion: "Queso y Cebolla Crunch",
    r_crunchy_bacon: "Crunchy Bacon",
    r_double_texture: "Doble Texture",
    r_duo_pickled: "Dúo Encurtido",
    r_fresh_pickle: "Fresh Pickle Burger",
    r_lettuce_fresh: "Lechuga Fresh",
    r_tomato_special: "Tomato Special",
    r_onion_grill: "Cebolla Grill",
    r_pickle_bomb: "Pickle Bomb",
    r_bacon_burger: "Bacon Burger",
    r_veggie_cheese: "Vegetal con Queso",
    r_carnivore: "Carnívora",
    r_loaded_bbq: "Chisporroteante",
    r_cheese_onion_ketchup: "Llora-Queso",
    r_double_meat_bacon: "Doble Bestia",
    r_veggie_ketchup: "Huertchup",
    r_cheese_pickle: "Quesinilla",
    r_ketchup_pickle: "Ketchinilla",
    r_pickle_onion: "Lagrimilla",
    r_bacon_pickle: "Cruji-Ácida",
    r_green_pickle: "Verde Viciosa",
    r_everything_pickle: "El Pepinillazo Final",
    r_ranchera: "Hamburguesa Ranchera",
    r_egg_ketchup: "Huevetchup",
    r_protein: "La Proteica",
    r_huevolla: "Huevolla",
    r_avocado_classic: "Aguacate Original",
    r_avocado_bacon: "Bacon-Guacate",
    r_mexican_style: "Estilo Mexicano",
    r_green_power: "Poder Verde",
    r_spicy_kick: "Patada Picante",
    r_volcano: "El Volcán",
    r_spicy_mex: "Mexicana Picante",
    r_fire_egg: "Huevo de Fuego",
    r_beet_root: "Raíz Púrpura",
    r_purple_rain: "Lluvia Púrpura",
    r_earthy_veggie: "Huerto Terrenal",
    r_sweet_beet: "Remolacha Dulce",
    r_ultimate_combo: "El Combo Definitivo",
    r_chef_special: "Especial del Chef",
    // Niveles
    l1_name: "Rumbo al Tomate",
    l2_name: "Más Sabor",
    l3_name: "El Toque Verde",
    l4_name: "Vegetal con Queso",
    l5_name: "Se viene el Bacon",
    l6_name: "Toma tomate!",
    l7_name: "¡Ketchup!",
    l8_name: "Verde, poco",
    l9_name: "Cebollita fresca",
    l10_name: "Cebollera",
    l11_name: "Sabor a la Parrilla",
    l12_name: "¡Pepinillo!",
    l13_name: "Crujiente Verde",
    l14_name: "Salado y Ácido",
    l15_name: "La Gran Mezcla",
    l16_name: "El Toque del Huevo",
    l17_name: "Proteína Extra",
    l18_name: "Probemos la Huevolla",
    l1_desc: "¡Bienvenido! Aprende a usar el TOMATE. En este nivel, solo serviremos hamburguesas con tomate.",
    l2_desc: "¡La mezcla perfecta! Combina el QUESO y el TOMATE para superar este nivel.",
    l3_desc: "¡El Huerto! Has desbloqueado la LECHUGA. Prepara la Hamburguesa Vegetal con tomate y lechuga.",
    l4_desc: "Añadimos QUESO a la vegetal para crear uan delicia. Pero cuidado, en este nivel también hay que hace hamburguesas normales",
    l5_desc: "¡BACON desbloqueado! Añade un toque crujiente.",
    l6_desc: "Para los amantes del TOMATE, añade más TOMATE.",
    l7_desc: "No hacía falta tanto tomate, ¿verdad?",
    l8_desc: "Las verduras no son lo tuyo, ¿verdad? ¡No hay problema! 2 recetas sin verduras",
    l9_desc: "A todos nos gusta la cebolla, ¿no?",
    l10_desc: "¡La cebolla es la reina de las hamburguesas! Añade dos cebollas para crear la Cebollera.",
    l11_desc: "Sin ingredientes nuevos, pero con combinaciones más exigentes. Domina bacon, cebolla y ketchup.",
    l12_desc: "¡Nuevo ingrediente: PEPINILLO! Añade un toque ácido y crujiente a tus hamburguesas.",
    l13_desc: "Mezcla pepinillo con verduras para recetas frescas y rápidas.",
    l14_desc: "Pepinillo + bacon + cebolla: el equilibrio perfecto entre salado y ácido.",
    l15_desc: "El nivel más completo hasta ahora: combina casi todo para lograr la máxima recompensa.",
    l16_desc: "¡HUEVO desbloqueado! El toque perfecto para cualquier hamburguesa. Prepara la Hamburguesa Ranchera con bacon, huevo, queso y cebolla.",
    l17_desc: "¡Proteína extra! Mezcla huevo con ketchup para crear combinaciones únicas. ¡No olvides la receta secreta con doble carne y doble huevo!",
    l18_desc: "¡La Huevolla llega al menú! Prepara hamburguesas con huevo y cebolla. Necesitas hacer 3 Huevollas y 3 hamburguesas con tomate.",
    l19_name: "El Oro Verde",
    l19_desc: "¡AGUACATE desbloqueado! Su textura cremosa es irresistible.",
    l20_name: "Bacon-Guacate",
    l20_desc: "Combina el aguacate con bacon y queso para una mezcla explosiva.",
    l21_name: "Estilo Mexicano",
    l21_desc: "Aguacate, tomate y cebolla. ¡Un clásico que nunca falla!",
    l22_name: "Desayuno Completo",
    l22_desc: "Mezcla aguacate con huevo y bacon para empezar bien el día.",
    l23_name: "Poder Verde",
    l23_desc: "Una combinación ultra fresca de aguacate, lechuga y pepinillo.",
    l24_name: "¡Pica Pica!",
    l24_desc: "¡JALAPEÑO desbloqueado! Solo para los más valientes.",
    l25_name: "Doble de Fuego",
    l25_desc: "Mucho queso para intentar calmar el picante del jalapeño.",
    l26_name: "El Volcán",
    l26_desc: "Doble de jalapeño, bacon y ketchup. ¡Va a arder!",
    l27_name: "Fuego Mexicano",
    l27_desc: "La combinación definitiva: jalapeño y aguacate.",
    l28_name: "Huevo de Fuego",
    l28_desc: "Jalapeño con huevo y cebolla. Un sabor intenso y picante.",
    l29_name: "Infierno en la Cocina",
    l29_desc: "Tres recetas picantes para poner a prueba tus nervios.",
    l30_name: "Raíz Púrpura",
    l30_desc: "¡REMOLACHA desbloqueada! Un toque dulce y un color increíble.",
    l31_name: "Huerto Dulce",
    l31_desc: "Combina la remolacha con lechuga y tomate.",
    l32_name: "Lluvia Púrpura",
    l32_desc: "Remolacha, queso y huevo. Una mezcla sorprendente.",
    l33_name: "Cebolla y Raíz",
    l33_desc: "El dulzor de la remolacha con el toque de la cebolla.",
    l34_name: "Huerto Terrenal",
    l34_desc: "Remolacha y aguacate. La combinación más natural.",
    l35_name: "Trío de Remolacha",
    l35_desc: "Domina todas las recetas con remolacha en un solo nivel.",
    l36_name: "Combo Definitivo",
    l36_desc: "Aguacate, jalapeño y remolacha juntos. ¿Podrás con ello?",
    l37_name: "Especial del Chef",
    l37_desc: "Una receta compleja con doble carne, huevo y aguacate.",
    l38_name: "Maestro de Cocina",
    l38_desc: "Tres recetas de alto nivel. Demuestra que eres el mejor.",
    l39_name: "Fiesta Mexicana",
    l39_desc: "Mucho aguacate y jalapeño para este desafío.",
    l40_name: "Colores del Huerto",
    l40_desc: "Remolacha y aguacate en recetas muy completas.",
    l41_name: "Calor Extremo",
    l41_desc: "Nivel centrado en el jalapeño. ¡No te quemes!",
    l42_name: "El Gran Banquete",
    l42_desc: "Recetas con muchísimos ingredientes. ¡Organización!",
    l43_name: "Proteína y Grasa",
    l43_desc: "Carne, huevo y aguacate. Energía pura.",
    l44_name: "Dulce y Ahumado",
    l44_desc: "Remolacha y bacon. Un contraste delicioso.",
    l45_name: "Desafío Épico",
    l45_desc: "Tres recetas muy difíciles. Solo para expertos.",
    l46_name: "Erupción Volcánica",
    l46_desc: "Muchísimos pedidos de El Volcán. ¡Rápido!",
    l47_name: "Vegetal Extremo",
    l47_desc: "Todas las verduras y hortalizas en un solo nivel.",
    l48_name: "La Prueba Final",
    l48_desc: "El desafío definitivo antes de los niveles secretos.",
    daily_achievements: "LOGROS DIARIOS",
    claim_reward: "RECOGER",
    claimed: "RECOGIDO",
    reward: "Recompensa:",
    achievement_delete_ingredient: "Elimina {target} {ingredient}",
    achievement_create_burger: "Crea {target} hamburguesas",
    achievement_delete_multiple: "Elimina {target} {ingredient} de una pasada",
    // Pantalla de información de nivel
    extra_objectives: "Objetivos extra",
    time_requirement: "Tiempo: {time}s",
    time_requirement_desc: "Supera el nivel en menos tiempo",
    destructions_requirement: "Eliminaciones: {count}",
    destructions_requirement_desc: "Supera el nivel con menos eliminaciones de ingredientes",
    no_ingredients_to_inhibit: "No hay ingredientes disponibles para inhibir en este nivel",
    // Descripciones de ingredientes
    ing_desc_BREAD: "El pan es la base de toda hamburguesa. Sin él, no hay hamburguesa que valga. Su textura esponjosa y su sabor suave complementan perfectamente cualquier ingrediente.",
    ing_desc_MEAT: "La carne es el corazón de la hamburguesa. Jugosa, sabrosa y llena de proteínas, es lo que hace que una hamburguesa sea realmente una hamburguesa.",
    ing_desc_CHEESE: "El queso derretido añade cremosidad y sabor a cualquier hamburguesa. Su textura fundida es irresistible y combina perfectamente con casi todo.",
    ing_desc_LETTUCE: "La lechuga fresca aporta crujiente y frescura. Es el toque verde que equilibra los sabores más intensos de la hamburguesa.",
    ing_desc_TOMATO: "El tomate añade un toque ácido y jugoso. Su color rojo brillante hace que cualquier hamburguesa se vea más apetitosa.",
    ing_desc_BACON: "El bacon crujiente es el ingrediente que todo el mundo ama. Su sabor ahumado y salado añade profundidad a cualquier combinación.",
    ing_desc_KETCHUP: "El ketchup es la salsa más popular del mundo. Su sabor dulce y ligeramente ácido complementa perfectamente las hamburguesas.",
    ing_desc_PICKLE: "El pepinillo añade un toque ácido y crujiente único. Su sabor intenso puede transformar completamente una hamburguesa.",
    ing_desc_ONION: "La cebolla añade un sabor picante y aromático. Ya sea cruda o cocida, siempre aporta carácter a la hamburguesa.",
    ing_desc_EGG: "El huevo frito añade proteína extra y una textura cremosa única. La yema líquida es el toque perfecto para los amantes del desayuno.",
    ing_desc_AVOCADO: "El aguacate aporta cremosidad natural y un sabor suave y delicioso. Es el ingrediente estrella de las hamburguesas más gourmet.",
    ing_desc_JALAPENO: "El jalapeño añade picante y sabor. Para los valientes que buscan una experiencia culinaria intensa y memorable.",
    ing_desc_BEETROOT: "La remolacha aporta dulzor natural y un color púrpura único. Es el ingrediente más sorprendente y versátil de la cocina.",
  },
  en: {
    recipes: "RECIPES",
    ingredients: "INGREDIENTS",
    current_order: "RECIPE",
    time: "Time",
    money: "Money",
    burgers: "Burgers",
    press_to_start: "TAP TO START",
    go: "GO!",
    secret_burger: "Secret Burger",
    new_discovery: "🍔 NEW RECIPE DISCOVERED!",
    discovery_msg: "You have discovered the ",
    level_prefix: "Level",
    level: "LEVEL",
    next_ingredient: "Next ingredient",
    next_ingredient_desc: "Complete levels to unlock new ingredients",
    objective: "Target",
    arcade_title: "ARCADE",
    arcade_btn: "EXPRESS MINUTE!",
    arcade_desc: "Earn coins by making burgers freely in one minute, and beat your own record.",
    arcade_intro_desc: "Test your skills! Prepare as many burgers as you can before time runs out. The more orders you complete, the more money you'll earn. Also, you can discover new recipes by trying combinations.",
    campaign_desc: "Complete levels to unlock new recipes and ingredients",
    record: "BEST",
    options: "OPTIONS",
    sound: "SOUND",
    sound_fx: "Sound Effects",
    account: "ACCOUNT",
    google_login: "Connect with Google",
    danger_zone: "DANGER",
    reset_progress: "Reset Progress 🔄",
    reset_confirm_title: "Delete Progress",
    reset_confirm_msg: "Are you sure? This action cannot be undone.",
    cancel: "Cancel",
    delete_all: "DELETE ALL",
    language: "LANGUAGE",
    lang_name: "English",
    back: "Back",
    cook: "COOK!",
    new_ingredient: "New",
    new_recipe: "New Recipe",
    win_title: "LEVEL CLEARED!",
    lose_title: "TIME'S UP!",
    arcade_win: "NEW RECORD!",
    arcade_lose: "TIME'S UP!",
    money_earned: "MONEY EARNED",
    continue: "CONTINUE",
    retry: "RETRY",
    play_again: "PLAY AGAIN",
    back_menu: "BACK TO MENU",
    exit_title: "Exit game?",
    exit_msg: "You will lose your current progress.",
    exit_confirm: "Exit",
    shop_title: "POWER UP SHOP",
    owned: "Owned",
    powerup_time_name: "Time Boost",
    powerup_time_desc: "Start with 10 extra seconds",
    powerup_super_time_name: "Super Time Boost",
    powerup_super_time_desc: "Start with 20 extra seconds",
    powerup_destruction_name: "Destruction Pack",
    powerup_destruction_desc: "75 destructions instead of 25",
    powerup_super_destruction_name: "Super Destruction Pack",
    powerup_super_destruction_desc: "150 destructions instead of 25",
    powerup_inhibitor_name: "Ingredient Inhibitor",
    powerup_inhibitor_desc: "Choose an ingredient that won't appear in the level",
    select_inhibited_ingredient: "Select ingredient to inhibit",
    activated: "Activated",
    activate: "Activate",
    shop_energy_name: "Energy Refill",
    shop_energy_desc: "Recover 1 energy point immediately",
    powerup_activate_time: "Time Boost",
    powerup_activate_super_time: "Super Time Boost",
    powerup_activate_destruction: "Destruction Pack",
    powerup_activate_super_destruction: "Super Destruction Pack",
    powerup_destruction_limit: "Limit reached",
    powerup_destruction_limit_msg: "You've used all your destructions",
    destructions: "Destructions",
    welcome_subtitle: "Delicious challenges await!",
    login_google: "Sign in with Google",
    login_footer: "Connect to save your progress",
    logout: "Log out",
    success: "Success",
    reset_success: "Progress reset successfully",
    energy_recovered: "Energy recovered!",
    ad_not_completed: "You must watch the ad completely to receive energy.",
    ad_error: "Could not load the ad. Please try again later.",
    info: "Information",
    error: "Error",
    strange_burger: "Strange Burger",
    recipe_instruction: "Ingredients don't need to be in the order shown, but must always start and end with bread",
    help_time_remaining: "Remaining game time",
    help_burgers_to_complete: "Burgers to complete",
    help_tap_to_destroy: "Tap quickly on an ingredient to remove it",
    // Panel de energía
    energy_panel_title: "⚡ No energy!",
    energy_panel_message: "Watch a video to recover all energy points",
    energy_panel_cancel: "Cancel",
    energy_panel_watch: "Watch video",
    // Panel de recetas en menú
    recipes_panel_subtitle: "Check here all discovered recipes",
    recipes_panel_description: "You can also create your own recipes",
    // Panel de ingredientes en menú
    ingredients_panel_subtitle: "Check here all discovered ingredients",
    ingredients_panel_description: "Discover the history and characteristics of each ingredient",
    // Ingredients
    ing_BREAD: "Bread",
    ing_MEAT: "Meat",
    ing_CHEESE: "Cheese",
    ing_LETTUCE: "Lettuce",
    ing_TOMATO: "Tomato",
    ing_BACON: "Bacon",
    ing_KETCHUP: "Ketchup",
    ing_PICKLE: "Pickle",
    ing_ONION: "Onion",
    ing_EGG: "Egg",
    ing_AVOCADO: "Avocado",
    ing_JALAPENO: "Jalapeño",
    ing_BEETROOT: "Beetroot",
    // Recipes
    r_pure: "Regular Burger",
    r_double: "Double Meat",
    r_cheese: "Simple Cheeseburger",
    r_double_cheese: "Double Cheese",
    r_garden: "Garden Burger",
    r_bacon_cheese: "Bacon & Cheese",
    r_super_bacon: "Super Bacon",
    r_onioner: "Onioner",
    r_ketchup_lettuce: "Ketchuga",
    r_dirty_one: "The Dirty One",
    r_not_green: "Anti-Vegetarian",
    r_classic_usa: "American Classic",
    r_viking: "The Viking",
    r_tonion_burger: "Tonion Burger",
    r_monster: "The Mega Monster",
    r_gourmet: "The Grand Gourmet",
    r_veggie_full: "The Full Orchard",
    r_bacon_bbq: "Bacon BBQ Style",
    r_cheese_fresh: "Cheeseburger Fresh",
    r_pickled: "The Pickled One",
    r_tomato_burger: "Tomato Burger",
    r_tomatomato: "TomaTomato",
    r_cheese_tomato: "Tomato Cheeseburger",
    r_lettuce_burger: "Lettuce Burger",
    r_cheese_onion: "Cheese & Onion Crunch",
    r_crunchy_bacon: "Crunchy Bacon",
    r_double_texture: "Double Texture",
    r_duo_pickled: "Pickled Duo",
    r_fresh_pickle: "Fresh Pickle Burger",
    r_lettuce_fresh: "Fresh Lettuce",
    r_tomato_special: "Tomato Special",
    r_onion_grill: "Grilled Onion",
    r_pickle_bomb: "Pickle Bomb",
    r_bacon_burger: "Bacon Burger",
    r_veggie_cheese: "Veggie Cheese",
    r_carnivore: "Carnivore",
    r_loaded_bbq: "The Sizzle Show",
    r_cheese_onion_ketchup: "The Tearjerker",
    r_double_meat_bacon: "Double Trouble",
    r_veggie_ketchup: "Garden Splash",
    r_cheese_pickle: "Pickle-Me-This",
    r_ketchup_pickle: "Ketchy Pickle",
    r_pickle_onion: "Cry & Crunch",
    r_bacon_pickle: "Tangy Crunch",
    r_green_pickle: "Green Gremlin",
    r_everything_pickle: "The Final Pickle",
    r_ranchera: "Ranchera Burger",
    r_egg_ketchup: "Egg Ketchup",
    r_protein: "The Protein",
    r_huevolla: "Eggnion",
    r_avocado_classic: "Classic Avocado",
    r_avocado_bacon: "Bacon-Guac",
    r_mexican_style: "Mexican Style",
    r_green_power: "Green Power",
    r_spicy_kick: "Spicy Kick",
    r_volcano: "The Volcano",
    r_spicy_mex: "Spicy Mexican",
    r_fire_egg: "Fire Egg",
    r_beet_root: "Purple Root",
    r_purple_rain: "Purple Rain",
    r_earthy_veggie: "Earthy Veggie",
    r_sweet_beet: "Sweet Beet",
    r_ultimate_combo: "Ultimate Combo",
    r_chef_special: "Chef's Special",
    // Levels
    l1_name: "Road to Tomato",
    l2_name: "Perfect Mix",
    l3_name: "The Green Touch",
    l4_name: "Veggie and Cheese",
    l5_name: "Bacon is coming",
    l6_name: "Toma Tomato!",
    l7_name: "Ketchup!",
    l8_name: "No green",
    l9_name: "Fresh Onion",
    l10_name: "Onioner",
    l11_name: "Grill Flavor",
    l12_name: "Pickle Time!",
    l13_name: "Green Crunch",
    l14_name: "Salty & Tangy",
    l15_name: "The Big Mix",
    l16_name: "The Egg Touch",
    l17_name: "Extra Protein",
    l18_name: "Try the Eggnion",
    l1_desc: "Welcome! Learn to use TOMATO. In this level, we'll only serve tomato burgers.",
    l2_desc: "The perfect mix! Combine CHEESE and TOMATO to clear this level.",
    l3_desc: "The Orchard! You've unlocked LETTUCE. Prepare the Veggie Burger with tomato and lettuce.",
    l4_desc: "We add CHEESE to the veggie burger to create the most complete burger yet. Take care of the regular burgers",
    l5_desc: "BACON unlocked! Add a crunchy touch.",
    l6_desc: "For tomato lovers, add more tomato.",
    l7_desc: "No need for so much tomato, right?",
    l8_desc: "No green, no problem. 2 recipes without green",
    l9_desc: "We all like onions, right?",
    l10_desc: "The onion is the queen of burgers! Add two onions to create the Onioner.",
    l11_desc: "No new ingredients, but tougher combos. Master bacon, onion and ketchup.",
    l12_desc: "New ingredient: PICKLE! Add a crunchy tang to your burgers.",
    l13_desc: "Mix pickles with veggies for fresh, fast recipes.",
    l14_desc: "Pickle + bacon + onion: the perfect salty & tangy balance.",
    l15_desc: "The most complete level so far: combine almost everything for the biggest reward.",
    l16_desc: "EGG unlocked! The perfect touch for any burger. Prepare the Ranchera Burger with bacon, egg, cheese and onion.",
    l17_desc: "Extra protein! Mix egg with ketchup for unique combinations. Don't forget the secret recipe with double meat and double egg!",
    l18_desc: "Eggnion is on the menu! Prepare burgers with egg and onion. You need to make 3 Eggnions and 3 tomato burgers.",
    l19_name: "Green Gold",
    l19_desc: "AVOCADO unlocked! Its creamy texture is irresistible.",
    l20_name: "Bacon-Guac",
    l20_desc: "Combine avocado with bacon and cheese for an explosive mix.",
    l21_name: "Mexican Style",
    l21_desc: "Avocado, tomato and onion. A classic that never fails!",
    l22_name: "Full Breakfast",
    l22_desc: "Mix avocado with egg and bacon for a great start to the day.",
    l23_name: "Green Power",
    l23_desc: "An ultra-fresh combination of avocado, lettuce and pickle.",
    l24_name: "Spicy Kick!",
    l24_desc: "JALAPEÑO unlocked! Only for the brave.",
    l25_name: "Double Fire",
    l25_desc: "Lots of cheese to try and calm the jalapeño's heat.",
    l26_name: "The Volcano",
    l26_desc: "Double jalapeño, bacon and ketchup. It's going to burn!",
    l27_name: "Mexican Fire",
    l27_desc: "The ultimate combination: jalapeño and avocado.",
    l28_name: "Fire Egg",
    l28_desc: "Jalapeño with egg and onion. An intense and spicy flavor.",
    l29_name: "Hell in the Kitchen",
    l29_desc: "Three spicy recipes to test your nerves.",
    l30_name: "Purple Root",
    l30_desc: "BEETROOT unlocked! A sweet touch and an amazing color.",
    l31_name: "Sweet Orchard",
    l31_desc: "Combine beetroot with lettuce and tomato.",
    l32_name: "Purple Rain",
    l32_desc: "Beetroot, cheese and egg. A surprising mix.",
    l33_name: "Onion and Root",
    l33_desc: "The sweetness of beetroot with a touch of onion.",
    l34_name: "Earthy Orchard",
    l34_desc: "Beetroot and avocado. The most natural combination.",
    l35_name: "Beetroot Trio",
    l35_desc: "Master all beetroot recipes in a single level.",
    l36_name: "Ultimate Combo",
    l36_desc: "Avocado, jalapeño and beetroot together. Can you handle it?",
    l37_name: "Chef's Special",
    l37_desc: "A complex recipe with double meat, egg and avocado.",
    l38_name: "Kitchen Master",
    l38_desc: "Three high-level recipes. Show that you're the best.",
    l39_name: "Mexican Party",
    l39_desc: "Lots of avocado and jalapeño for this challenge.",
    l40_name: "Orchard Colors",
    l40_desc: "Beetroot and avocado in very complete recipes.",
    l41_name: "Extreme Heat",
    l41_desc: "Level focused on jalapeño. Don't get burned!",
    l42_name: "The Big Feast",
    l42_desc: "Recipes with many ingredients. Organization is key!",
    l43_name: "Protein and Fat",
    l43_desc: "Meat, egg and avocado. Pure energy.",
    l44_name: "Sweet and Smoky",
    l44_desc: "Beetroot and bacon. A delicious contrast.",
    l45_name: "Epic Challenge",
    l45_desc: "Three very difficult recipes. Only for experts.",
    l46_name: "Volcanic Eruption",
    l46_desc: "Many orders of The Volcano. Quick!",
    l47_name: "Extreme Veggie",
    l47_desc: "All vegetables and greens in one level.",
    l48_name: "The Final Test",
    l48_desc: "The ultimate challenge before the secret levels.",
    daily_achievements: "DAILY ACHIEVEMENTS",
    claim_reward: "CLAIM",
    claimed: "CLAIMED",
    reward: "Reward:",
    achievement_delete_ingredient: "Remove {target} {ingredient}",
    achievement_create_burger: "Create {target} burgers",
    achievement_delete_multiple: "Remove {target} {ingredient} in one go",
    // Level info screen
    extra_objectives: "Extra Objectives",
    time_requirement: "Time: {time}s",
    time_requirement_desc: "Complete the level in less time",
    destructions_requirement: "Destructions: {count}",
    destructions_requirement_desc: "Complete the level with fewer ingredient removals",
    no_ingredients_to_inhibit: "No ingredients available to inhibit in this level",
    // Ingredient descriptions
    ing_desc_BREAD: "Bread is the foundation of every burger. Without it, there's no burger worth having. Its fluffy texture and mild flavor perfectly complement any ingredient.",
    ing_desc_MEAT: "Meat is the heart of the burger. Juicy, flavorful and full of protein, it's what makes a burger truly a burger.",
    ing_desc_CHEESE: "Melted cheese adds creaminess and flavor to any burger. Its melted texture is irresistible and pairs perfectly with almost everything.",
    ing_desc_LETTUCE: "Fresh lettuce adds crunch and freshness. It's the green touch that balances the more intense flavors of the burger.",
    ing_desc_TOMATO: "Tomato adds a tangy and juicy touch. Its bright red color makes any burger look more appetizing.",
    ing_desc_BACON: "Crispy bacon is the ingredient everyone loves. Its smoky and salty flavor adds depth to any combination.",
    ing_desc_KETCHUP: "Ketchup is the world's most popular sauce. Its sweet and slightly tangy flavor perfectly complements burgers.",
    ing_desc_PICKLE: "Pickle adds a unique tangy and crunchy touch. Its intense flavor can completely transform a burger.",
    ing_desc_ONION: "Onion adds a spicy and aromatic flavor. Whether raw or cooked, it always adds character to the burger.",
    ing_desc_EGG: "Fried egg adds extra protein and a unique creamy texture. The runny yolk is the perfect touch for breakfast lovers.",
    ing_desc_AVOCADO: "Avocado provides natural creaminess and a smooth, delicious flavor. It's the star ingredient of the most gourmet burgers.",
    ing_desc_JALAPENO: "Jalapeño adds spice and flavor. For the brave who seek an intense and memorable culinary experience.",
    ing_desc_BEETROOT: "Beetroot provides natural sweetness and a unique purple color. It's the most surprising and versatile ingredient in the kitchen.",
  }
};

