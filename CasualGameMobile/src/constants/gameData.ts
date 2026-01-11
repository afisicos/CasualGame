import { PieceType, Level, Recipe } from '../types';

export const LIFE_RECOVERY_TIME = 120; // 2 minutos en segundos
export const MAX_LIVES = 10;

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
};

export const BASE_RECIPES: Recipe[] = [
  { id: 'classic', name: 'r_pure', ingredients: ['BREAD', 'MEAT', 'BREAD'], price: 5, isSecret: false },
  { id: 'cheese', name: 'r_cheese', ingredients: ['BREAD', 'MEAT', 'CHEESE', 'BREAD'], price: 7, isSecret: false },
  { id: 'double_cheese', name: 'r_double_cheese', ingredients: ['BREAD', 'MEAT', 'CHEESE','CHEESE', 'BREAD'], price: 11, isSecret: true },
  { id: 'tomatomato', name: 'r_tomatomato', ingredients: ['BREAD', 'MEAT', 'TOMATO','TOMATO', 'TOMATO', 'BREAD'], price: 13, isSecret: false },
  { id: 'tomato_burger', name: 'r_tomato_burger', ingredients: ['BREAD', 'MEAT', 'TOMATO', 'BREAD'], price: 8, isSecret: false },
  { id: 'cheese_tomato', name: 'r_cheese_tomato', ingredients: ['BREAD', 'MEAT', 'CHEESE', 'TOMATO', 'BREAD'], price: 10, isSecret: false },
  { id: 'veggie', name: 'r_garden', ingredients: ['BREAD', 'MEAT', 'TOMATO', 'LETTUCE', 'BREAD'], price: 10, isSecret: false },
  { id: 'lettuce_burger', name: 'r_lettuce_burger', ingredients: ['BREAD', 'MEAT', 'LETTUCE', 'BREAD'], price: 8, isSecret: true },
  { id: 'veggie_cheese', name: 'r_veggie_cheese', ingredients: ['BREAD', 'MEAT', 'CHEESE', 'TOMATO', 'LETTUCE', 'BREAD'], price: 15, isSecret: true },
  { id: 'bacon_cheese', name: 'r_bacon_cheese', ingredients: ['BREAD', 'MEAT', 'BACON', 'CHEESE', 'BREAD'], price: 12, isSecret: false },
  { id: 'super_bacon', name: 'r_super_bacon', ingredients: ['BREAD', 'MEAT', 'BACON', 'BACON', 'BREAD'], price: 11, isSecret: true },
  { id: 'carnivore', name: 'r_carnivore', ingredients: ['BREAD', 'MEAT', 'MEAT', 'MEAT', 'BREAD'], price: 13, isSecret: true },
];

export const LEVELS: Level[] = [
  { 
    id: 1, 
    name: "l1_name", 
    targetMoney: 30, 
    ingredients: ['BREAD', 'MEAT', 'TOMATO'], 
    newIngredient: 'TOMATO', 
    showNewIngredient: true,
    newRecipe: 'tomato_burger',
    description: "l1_desc" 
  },
  { 
    id: 2, 
    name: "l2_name", 
    targetMoney: 40, 
    ingredients: ['BREAD', 'MEAT', 'CHEESE', 'TOMATO'], 
    newIngredient: 'CHEESE', 
    showNewIngredient: false,
    newRecipe: 'cheese_tomato',
    description: "l2_desc" 
  },
  { 
    id: 3, 
    name: "l3_name", 
    targetMoney: 50, 
    ingredients: ['BREAD', 'MEAT', 'CHEESE', 'TOMATO', 'LETTUCE'], 
    newIngredient: 'LETTUCE', 
    showNewIngredient: true,
    newRecipe: 'veggie',
    description: "l3_desc" 
  },
  { 
    id: 4, 
    name: "l4_name", 
    targetMoney: 60, 
    ingredients: ['BREAD', 'MEAT', 'CHEESE', 'TOMATO', 'LETTUCE'], 
    showNewIngredient: false,
    newRecipe: 'veggie_cheese',
    description: "l4_desc" 
  },
  { 
    id: 5, 
    name: "l5_name", 
    targetMoney: 60, 
    ingredients: ['BREAD', 'MEAT', 'BACON', 'CHEESE', 'TOMATO', 'LETTUCE'], 
    newIngredient: 'BACON', 
    showNewIngredient: true,
    newRecipe: 'bacon_cheese',
    description: "l5_desc" 
  },
  { 
    id: 6, 
    name: "l6_name", 
    targetMoney: 70, 
    ingredients: ['BREAD', 'MEAT', 'BACON', 'CHEESE', 'TOMATO', ], 
    showNewIngredient: false,
    newRecipe: 'tomatomato',
    description: "l6_desc" 
  },
];

// Mapeo de qué recetas están desbloqueadas según el nivel superado
export const getUnlockedRecipesForArcade = (arcadeUnlockedLevel: number) => {
  const recipes = ['classic'];
  if (arcadeUnlockedLevel >= 1) 
    recipes.push('tomato_burger');
  if (arcadeUnlockedLevel >= 2) {
    recipes.push('cheese');
    recipes.push('cheese_tomato');
  }
  if (arcadeUnlockedLevel >= 3) {
    recipes.push('veggie');
  }
  if (arcadeUnlockedLevel >= 4) {
    recipes.push('veggie_cheese');
  }
  if (arcadeUnlockedLevel >= 5) {
    recipes.push('bacon_cheese');
    recipes.push('super_bacon');
  }
  return recipes;
};

// Mapeo de qué ingredientes están disponibles según el nivel superado
export const getUnlockedIngredientsForArcade = (arcadeUnlockedLevel: number) => {
  const ingredients: PieceType[] = ['BREAD', 'MEAT'];
  if (arcadeUnlockedLevel >= 1) ingredients.push('TOMATO');
  if (arcadeUnlockedLevel >= 2) ingredients.push('CHEESE');
  if (arcadeUnlockedLevel >= 3) ingredients.push('LETTUCE');
  if (arcadeUnlockedLevel >= 5) ingredients.push('BACON');
  return ingredients;
};

export const TRANSLATIONS = {
  es: {
    recipes: "RECETAS",
    current_order: "PEDIDO ACTUAL",
    time: "Tiempo",
    money: "Dinero",
    press_to_start: "PULSA PARA EMPEZAR",
    go: "¡A TRABAJAR!",
    secret_burger: "Hamburguesa Secreta",
    new_discovery: "🍔 ¡RECETA DESCUBIERTA!",
    discovery_msg: "Has descubierto la ",
    level_prefix: "Nivel",
    objective: "Objetivo",
    arcade_btn: "¡MINUTO EXPRESS!",
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
    back: "Volver al mapa",
    cook: "¡A COCINAR!",
    new_ingredient: "Nuevo Ingrediente",
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
    // Recetas
    r_pure: "Hamburguesa Pura",
    r_double: "Doble de Carne",
    r_cheese: "Cheeseburger Simple",
    r_double_cheese: "Doble de Queso",
    r_garden: "Burger del Huerto",
    r_bacon_cheese: "Bacon & Cheese",
    r_super_bacon: "Super Bacon",
    r_classic_usa: "Clásica Americana",
    r_viking: "La Vikinga",
    r_monster: "La Mega Monster",
    r_gourmet: "La Gran Gourmet",
    r_veggie_full: "La Huerta Completa",
    r_bacon_bbq: "Bacon BBQ Style",
    r_cheese_fresh: "Cheeseburger Fresh",
    r_pickled: "La Encurtida",
    r_tomato_burger: "Burger con Tomate",
    r_tomatomato: "Toma Tomate Tómalo",
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
    // Niveles
    l1_name: "Rumbo al Tomate",
    l2_name: "Más Sabor",
    l3_name: "El Toque Verde",
    l4_name: "Vegetal con Queso",
    l5_name: "Se viene el Bacon",
    l6_name: "Toma tomate!",
    l7_name: "El Toque Ácido",
    l8_name: "El Final",
    l1_desc: "¡Bienvenido! Aprende a usar el TOMATE. En este nivel, solo serviremos hamburguesas con tomate.",
    l2_desc: "¡La mezcla perfecta! Combina el QUESO y el TOMATE para superar este nivel.",
    l3_desc: "¡El Huerto! Has desbloqueado la LECHUGA. Prepara la Hamburguesa Vegetal con tomate y lechuga.",
    l4_desc: "¡El siguiente paso! Añadimos QUESO a la vegetal para crear la hamburguesa más completa hasta ahora.",
    l5_desc: "¡BACON desbloqueado! Añade un toque crujiente.",
    l6_desc: "Para los amantes del TOMATE, añade más TOMATE.",
    l7_desc: "¡PEPINILLO desbloqueado! Para los amantes de los sabores fuertes.",
    l8_desc: "¡CEBOLLA desbloqueada! La hamburguesa definitiva."
  },
  en: {
    recipes: "RECIPES",
    current_order: "CURRENT ORDER",
    time: "Time",
    money: "Money",
    press_to_start: "TAP TO START",
    go: "GO!",
    secret_burger: "Secret Burger",
    new_discovery: "🍔 NEW RECIPE DISCOVERED!",
    discovery_msg: "You have discovered the ",
    level_prefix: "Level",
    objective: "Target",
    arcade_btn: "EXPRESS MINUTE!",
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
    back: "Back to map",
    cook: "COOK!",
    new_ingredient: "New Ingredient",
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
    // Recipes
    r_pure: "Pure Burger",
    r_double: "Double Meat",
    r_cheese: "Simple Cheeseburger",
    r_double_cheese: "Double Cheese",
    r_garden: "Garden Burger",
    r_bacon_cheese: "Bacon & Cheese",
    r_super_bacon: "Super Bacon",
    r_classic_usa: "American Classic",
    r_viking: "The Viking",
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
    // Levels
    l1_name: "Road to Tomato",
    l2_name: "Perfect Mix",
    l3_name: "The Green Touch",
    l4_name: "Veggie and Cheese",
    l5_name: "Bacon is coming",
    l6_name: "Toma Tomato!",
    l7_name: "The Sour Touch",
    l8_name: "The Final",
    l1_desc: "Welcome! Learn to use TOMATO. In this level, we'll only serve tomato burgers.",
    l2_desc: "The perfect mix! Combine CHEESE and TOMATO to clear this level.",
    l3_desc: "The Orchard! You've unlocked LETTUCE. Prepare the Veggie Burger with tomato and lettuce.",
    l4_desc: "The next step! We add CHEESE to the veggie burger to create the most complete burger yet.",
    l5_desc: "BACON unlocked! Add a crunchy touch.",
    l6_desc: "For tomato lovers, add more tomato.",
    l7_desc: "PICKLE unlocked! For those who love strong flavors.",
    l8_desc: "ONION unlocked! The ultimate burger."
  }
};

