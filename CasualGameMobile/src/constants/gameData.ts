import { PieceType, Level, Recipe } from '../types';

export const ENERGY_RECOVERY_TIME = 300; // 5 minutos en segundos
export const MAX_ENERGY = 10;

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
  { id: 'antivegetal', name: 'r_antivegetal', ingredients: ['BREAD', 'MEAT', 'MEAT', 'CHEESE', 'BACON', 'BREAD'], price: 16 },
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

];

export const LEVELS: Level[] = [
  {
    id: 1,
    name: "l1_name",
    targetBurgers: 6,
    ingredients: ['BREAD', 'MEAT', 'TOMATO'],
    newIngredient: 'TOMATO',
    showNewIngredient: true,
    newRecipe: 'tomato_burger',
    description: "l1_desc"
  },
  {
    id: 2,
    name: "l2_name",
    targetBurgers: 4,
    ingredients: ['BREAD', 'MEAT', 'CHEESE', 'TOMATO'],
    newIngredient: 'CHEESE',
    showNewIngredient: false,
    newRecipe: 'cheese_tomato',
    description: "l2_desc"
  },
  {
    id: 3,
    name: "l3_name",
    targetBurgers: 5,
    ingredients: ['BREAD', 'MEAT', 'CHEESE', 'TOMATO', 'LETTUCE'],
    newIngredient: 'LETTUCE',
    showNewIngredient: true,
    newRecipe: 'veggie',
    description: "l3_desc"
  },
  {
    id: 4,
    name: "l4_name",
    targetBurgers: 3,
    ingredients: ['BREAD', 'MEAT', 'CHEESE', 'TOMATO', 'LETTUCE'],
    showNewIngredient: false,
    newRecipe: 'veggie_cheese',
    description: "l4_desc"
  },
  {
    id: 5,
    name: "l5_name",
    targetBurgers: 5,
    ingredients: ['BREAD', 'MEAT', 'BACON', 'CHEESE', 'TOMATO'],
    newIngredient: 'BACON',
    showNewIngredient: true,
    newRecipe: 'bacon_cheese',
    description: "l5_desc"
  },
  {
    id: 6,
    name: "l6_name",
    targetBurgers: 4,
    ingredients: ['BREAD', 'MEAT', 'BACON', 'CHEESE', 'TOMATO','LETTUCE'],
    showNewIngredient: false,
    newRecipe: 'tomatomato',
    description: "l6_desc"
  },
  {
    id: 7,
    name: "l7_name",
    targetBurgers: 6,
    ingredients: ['BREAD', 'MEAT', 'LETTUCE', 'CHEESE', 'TOMATO', 'KETCHUP'],
    newIngredient: 'KETCHUP',
    showNewIngredient: true,
    newRecipe: 'ketchup_lettuce',
    description: "l7_desc"
  },
  {
    id: 8,
    name: "l8_name",
    targetBurgers: 4,
    ingredients: ['BREAD', 'MEAT', 'BACON', 'CHEESE', 'TOMATO', 'KETCHUP', 'LETTUCE'],
    showNewIngredient: false,
    newRecipe: 'antivegetal',
    description: "l8_desc"
  },
  {
    id: 9,
    name: "l9_name",
    targetBurgers: 2,
    ingredients: ['BREAD', 'MEAT', 'BACON', 'CHEESE', 'TOMATO', 'KETCHUP', 'ONION', 'LETTUCE'],
    newIngredient: 'ONION',
    showNewIngredient: true,
    newRecipe: 'tonion_burger',
    description: "l9_desc"
  },
  {
    id: 10,
    name: "l10_name",
    targetBurgers: 10,
    ingredients: ['BREAD', 'MEAT', 'BACON', 'CHEESE', 'ONION'],
    showNewIngredient: false,
    newRecipe: 'onioner',
    description: "l10_desc"
  },
  {
    id: 11,
    name: "l11_name",
    targetBurgers: 5,
    ingredients: ['BREAD', 'MEAT', 'BACON', 'CHEESE', 'TOMATO', 'KETCHUP', 'ONION'],
    showNewIngredient: false,
    newRecipe: 'loaded_bbq',
    description: "l11_desc"
  },
  {
    id: 12,
    name: "l12_name",
    targetBurgers: 5,
    ingredients: ['BREAD', 'MEAT', 'CHEESE', 'KETCHUP', 'ONION', 'PICKLE'],
    newIngredient: 'PICKLE',
    showNewIngredient: true,
    newRecipe: 'cheese_pickle',
    description: "l12_desc"
  },
  {
    id: 13,
    name: "l13_name",
    targetBurgers: 6,
    ingredients: ['BREAD', 'MEAT', 'TOMATO', 'LETTUCE', 'KETCHUP', 'PICKLE'],
    showNewIngredient: false,
    newRecipe: 'green_pickle',
    description: "l13_desc"
  },
  {
    id: 14,
    name: "l14_name",
    targetBurgers: 5,
    ingredients: ['BREAD', 'MEAT', 'BACON', 'ONION', 'PICKLE', 'KETCHUP', 'CHEESE', 'TOMATO'],
    showNewIngredient: false,
    newRecipe: 'bacon_pickle',
    description: "l14_desc"
  },
  {
    id: 15,
    name: "l15_name",
    targetBurgers: 2,
    ingredients: ['BREAD', 'MEAT', 'BACON', 'CHEESE', 'ONION', 'PICKLE', 'KETCHUP', 'TOMATO', 'LETTUCE'],
    showNewIngredient: false,
    newRecipe: 'everything_pickle',
    description: "l15_desc"
  },
  {
    id: 16,
    name: "l16_name",
    targetBurgers: 5,
    ingredients: ['BREAD', 'MEAT', 'BACON', 'CHEESE', 'ONION', 'TOMATO', 'EGG'],
    newIngredient: 'EGG',
    showNewIngredient: true,
    newRecipe: 'ranchera',
    description: "l16_desc"
  },
  {
    id: 17,
    name: "l17_name",
    targetBurgers: 7,
    ingredients: ['BREAD', 'MEAT', 'BACON', 'CHEESE', 'ONION', 'PICKLE', 'KETCHUP', 'TOMATO', 'LETTUCE', 'EGG'],
    showNewIngredient: false,
    newRecipe: 'egg_ketchup',
    description: "l17_desc"
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
    recipes.push('antivegetal');
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
export const getUnlockedIngredientsForArcade = (arcadeUnlockedLevel: number) => {
  const ingredients: PieceType[] = ['BREAD', 'MEAT', 'TOMATO']; // TOMATO está disponible desde el inicio
  if (arcadeUnlockedLevel >= 2) ingredients.push('CHEESE');
  if (arcadeUnlockedLevel >= 3) ingredients.push('LETTUCE');
  if (arcadeUnlockedLevel >= 5) ingredients.push('BACON');
  if (arcadeUnlockedLevel >= 7) ingredients.push('KETCHUP');
  if (arcadeUnlockedLevel >= 9) ingredients.push('ONION');
  if (arcadeUnlockedLevel >= 12) ingredients.push('PICKLE');
  if (arcadeUnlockedLevel >= 16) ingredients.push('EGG');
  return ingredients;
};

// Mapeo de qué ingredientes están disponibles según el nivel de campaña alcanzado
export const getUnlockedIngredientsForCampaign = (campaignUnlockedLevel: number) => {
  const ingredients: PieceType[] = ['BREAD', 'MEAT', 'TOMATO']; // TOMATO está disponible desde el inicio
  if (campaignUnlockedLevel >= 2) ingredients.push('CHEESE');
  if (campaignUnlockedLevel >= 3) ingredients.push('LETTUCE');
  if (campaignUnlockedLevel >= 5) ingredients.push('BACON');
  if (campaignUnlockedLevel >= 7) ingredients.push('KETCHUP');
  if (campaignUnlockedLevel >= 9) ingredients.push('ONION');
  if (campaignUnlockedLevel >= 12) ingredients.push('PICKLE');
  if (campaignUnlockedLevel >= 16) ingredients.push('EGG');
  return ingredients;
};

export const TRANSLATIONS = {
  es: {
    recipes: "RECETAS",
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
    objective: "Objetivo",
    arcade_title: "ARCADE",
    arcade_btn: "¡MINUTO EXPRESS!",
    arcade_desc: "Consigue monedas haciendo hamburguesas libremente en un minuto, y bate tu propio récord.",
    arcade_intro_desc: "¡Ponte a prueba! Prepara todas las hamburguesas que puedas antes de que se acabe el tiempo. Cuantos más pedidos completes, más dinero ganarás. Además, podras descubrir nuevas recetas probando combinaciones.",
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
    help_tap_to_destroy: "Haz un toque rápido en un ingrediente para eliminarlo",
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
    // Panel de energía
    energy_panel_title: "⚡ ¡Sin energía!",
    energy_panel_message: "Mira un video para recuperar todos los puntos de energía",
    energy_panel_cancel: "Cancelar",
    energy_panel_watch: "Ver video",
    // Panel de recetas en menú
    recipes_panel_subtitle: "Consulta aquí todas las recetas descubiertas",
    recipes_panel_description: "También puedes crear tus propias recetas",
    // Recetas
    r_pure: "Hamburguesa Pura",
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
    r_antivegetal: "Anti-Vegetal",
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
    // Niveles
    l1_name: "Rumbo al Tomate",
    l2_name: "Más Sabor",
    l3_name: "El Toque Verde",
    l4_name: "Vegetal con Queso",
    l5_name: "Se viene el Bacon",
    l6_name: "Toma tomate!",
    l7_name: "¡Ketchup!",
    l8_name: "Verde no",
    l9_name: "Cebollita fresca",
    l10_name: "Cebollera",
    l11_name: "Sabor a la Parrilla",
    l12_name: "¡Pepinillo!",
    l13_name: "Crujiente Verde",
    l14_name: "Salado y Ácido",
    l15_name: "La Gran Mezcla",
    l16_name: "El Toque del Huevo",
    l17_name: "Proteína Extra",
    l1_desc: "¡Bienvenido! Aprende a usar el TOMATE. En este nivel, solo serviremos hamburguesas con tomate.",
    l2_desc: "¡La mezcla perfecta! Combina el QUESO y el TOMATE para superar este nivel.",
    l3_desc: "¡El Huerto! Has desbloqueado la LECHUGA. Prepara la Hamburguesa Vegetal con tomate y lechuga.",
    l4_desc: "¡El siguiente paso! Añadimos QUESO a la vegetal para crear la hamburguesa más completa hasta ahora.",
    l5_desc: "¡BACON desbloqueado! Añade un toque crujiente.",
    l6_desc: "Para los amantes del TOMATE, añade más TOMATE.",
    l7_desc: "No hacía falta tanto tomate, ¿verdad?",
    l8_desc: "Las verduras no son lo tuyo, ¿verdad? ¡No hay problema!",
    l9_desc: "A todos nos gusta la cebolla, ¿no?",
    l10_desc: "¡La cebolla es la reina de las hamburguesas! Añade dos cebollas para crear la Cebollera.",
    l11_desc: "Sin ingredientes nuevos, pero con combinaciones más exigentes. Domina bacon, cebolla y ketchup.",
    l12_desc: "¡Nuevo ingrediente: PEPINILLO! Añade un toque ácido y crujiente a tus hamburguesas.",
    l13_desc: "Mezcla pepinillo con verduras para recetas frescas y rápidas.",
    l14_desc: "Pepinillo + bacon + cebolla: el equilibrio perfecto entre salado y ácido.",
    l15_desc: "El nivel más completo hasta ahora: combina casi todo para lograr la máxima recompensa.",
    l16_desc: "¡HUEVO desbloqueado! El toque perfecto para cualquier hamburguesa. Prepara la Hamburguesa Ranchera con bacon, huevo, queso y cebolla.",
    l17_desc: "¡Proteína extra! Mezcla huevo con ketchup para crear combinaciones únicas. ¡No olvides la receta secreta con doble carne y doble huevo!",
  },
  en: {
    recipes: "RECIPES",
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
    r_onioner: "Onioner",
    r_ketchup_lettuce: "Ketchuga",
    r_dirty_one: "The Dirty One",
    r_antivegetal: "Anti-Vegetarian",
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
    l1_desc: "Welcome! Learn to use TOMATO. In this level, we'll only serve tomato burgers.",
    l2_desc: "The perfect mix! Combine CHEESE and TOMATO to clear this level.",
    l3_desc: "The Orchard! You've unlocked LETTUCE. Prepare the Veggie Burger with tomato and lettuce.",
    l4_desc: "The next step! We add CHEESE to the veggie burger to create the most complete burger yet.",
    l5_desc: "BACON unlocked! Add a crunchy touch.",
    l6_desc: "For tomato lovers, add more tomato.",
    l7_desc: "No need for so much tomato, right?",
    l8_desc: "No green, no problem",
    l9_desc: "We all like onions, right?",
    l10_desc: "The onion is the queen of burgers! Add two onions to create the Onioner.",
    l11_desc: "No new ingredients, but tougher combos. Master bacon, onion and ketchup.",
    l12_desc: "New ingredient: PICKLE! Add a crunchy tang to your burgers.",
    l13_desc: "Mix pickles with veggies for fresh, fast recipes.",
    l14_desc: "Pickle + bacon + onion: the perfect salty & tangy balance.",
    l15_desc: "The most complete level so far: combine almost everything for the biggest reward.",
  }
};

