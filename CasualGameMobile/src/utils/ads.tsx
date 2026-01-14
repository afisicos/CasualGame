import React from 'react';
import { Platform } from 'react-native';

// Verificar si estamos en Expo Go (no tiene módulos nativos)
const isExpoGo = typeof (global as any).__expo !== 'undefined' && (global as any).__expo.Constants?.executionEnvironment === 'storeClient';

// Importar módulos de AdMob de forma segura
let mobileAds: any = null;
let BannerAd: any = null;
let BannerAdSize: any = null;
let TestIds: any = null;
let RewardedAd: any = null;
let AdEventType: any = null;
let RewardedAdEventType: any = null;
let adsModuleAvailable = false;

if (!isExpoGo) {
  try {
    const adsModule = require('react-native-google-mobile-ads');
    // Verificar que el módulo realmente esté disponible
    if (adsModule) {
      // Algunos sistemas de bundling usan .default, otros no
      mobileAds = adsModule.default || adsModule;
      BannerAd = adsModule.BannerAd;
      BannerAdSize = adsModule.BannerAdSize;
      TestIds = adsModule.TestIds;
      RewardedAd = adsModule.RewardedAd;
      AdEventType = adsModule.AdEventType;
      RewardedAdEventType = adsModule.RewardedAdEventType;
      adsModuleAvailable = true;
    }
  } catch (error: any) {
    // Capturar específicamente el error de TurboModuleRegistry
    if (error?.message?.includes('TurboModuleRegistry') || error?.message?.includes('RNGoogleMobileAdsModule')) {
      console.warn('⚠️ Módulo nativo de AdMob no disponible. Los anuncios no funcionarán.');
    } else if (__DEV__) {
      console.warn('⚠️ react-native-google-mobile-ads no está disponible:', error?.message);
    }
    adsModuleAvailable = false;
  }
} else {
  if (__DEV__) {
    console.warn('⚠️ Expo Go detectado. Los anuncios no funcionarán en Expo Go.');
  }
  adsModuleAvailable = false;
}

// Inicializar AdMob
export const initializeAds = async () => {
  // Si no hay módulo disponible, salir silenciosamente
  if (!adsModuleAvailable || isExpoGo) {
    if (__DEV__) {
      console.log('ℹ️ AdMob no disponible, saltando inicialización.');
    }
    return;
  }

  try {
    // Intentar importar dinámicamente para asegurar que funcione en producción
    try {
      const adsModule = await import('react-native-google-mobile-ads');
      const mobileAdsModule = adsModule.default || adsModule;
      
      if (mobileAdsModule && typeof mobileAdsModule === 'function') {
        await mobileAdsModule().initialize();
        console.log('✅ AdMob inicializado correctamente');
      } else if (mobileAdsModule && typeof mobileAdsModule.initialize === 'function') {
        await mobileAdsModule.initialize();
        console.log('✅ AdMob inicializado correctamente (método directo)');
      } else {
        console.warn('⚠️ AdMob no está disponible en este entorno.');
      }
    } catch (importError: any) {
      // Capturar específicamente errores de TurboModuleRegistry
      if (importError?.message?.includes('TurboModuleRegistry') || importError?.message?.includes('RNGoogleMobileAdsModule')) {
        console.warn('⚠️ Módulo nativo de AdMob no disponible. Los anuncios no funcionarán.');
        return;
      }
      // Fallback al método estático si está disponible
      if (mobileAds && typeof mobileAds === 'function') {
        try {
          await mobileAds().initialize();
          console.log('✅ AdMob inicializado correctamente (método estático)');
        } catch (staticError) {
          console.warn('⚠️ Error al inicializar AdMob (método estático):', staticError);
        }
      } else {
        console.warn('⚠️ AdMob no está disponible o es Expo Go.');
      }
    }
  } catch (error: any) {
    // Capturar específicamente errores de TurboModuleRegistry
    if (error?.message?.includes('TurboModuleRegistry') || error?.message?.includes('RNGoogleMobileAdsModule')) {
      console.warn('⚠️ Módulo nativo de AdMob no disponible. Los anuncios no funcionarán.');
      return;
    }
    console.error('❌ Error al inicializar AdMob:', error);
    // No lanzar el error para que la app continúe funcionando
  }
};

// IDs de anuncios - Usar valores por defecto si TestIds no está disponible
const getTestId = (key: 'BANNER' | 'INTERSTITIAL' | 'REWARDED') => {
  if (__DEV__ && TestIds && TestIds[key]) {
    return TestIds[key];
  }
  return null;
};

export const AD_UNIT_IDS = {
  // Banner Ads
  BANNER_ANDROID: getTestId('BANNER') || 'ca-app-pub-XXXXXXXXXXXX/XXXXXXXXXX',
  BANNER_IOS: getTestId('BANNER') || 'ca-app-pub-XXXXXXXXXXXX/XXXXXXXXXX',
  
  // Interstitial Ads
  INTERSTITIAL_ANDROID: getTestId('INTERSTITIAL') || 'ca-app-pub-XXXXXXXXXXXX/XXXXXXXXXX',
  INTERSTITIAL_IOS: getTestId('INTERSTITIAL') || 'ca-app-pub-XXXXXXXXXXXX/XXXXXXXXXX',
  
  // Rewarded Ads - VidasExtra
  REWARDED_ANDROID: __DEV__ ? getTestId('REWARDED') : 'ca-app-pub-3929193083951309/5848093515',
  REWARDED_IOS: __DEV__ ? getTestId('REWARDED') : 'ca-app-pub-3929193083951309/5848093515',
};

// Componente de Banner Ad
export const AdBanner = () => {
  if (!BannerAd || !BannerAdSize) {
    return null; // No renderizar nada si el módulo no está disponible
  }

  const adUnitId = Platform.OS === 'android' 
    ? AD_UNIT_IDS.BANNER_ANDROID 
    : AD_UNIT_IDS.BANNER_IOS;

  return (
    <BannerAd
      unitId={adUnitId}
      size={BannerAdSize.BANNER}
      requestOptions={{
        requestNonPersonalizedAdsOnly: true,
      }}
    />
  );
};

// Función para mostrar Interstitial Ad
export const showInterstitialAd = async () => {
  // Si no hay módulo disponible, salir silenciosamente
  if (!adsModuleAvailable || isExpoGo) {
    if (__DEV__) {
      console.warn('⚠️ Los anuncios no están disponibles en este entorno.');
    }
    return;
  }

  try {

    const { InterstitialAd, AdEventType } = await import('react-native-google-mobile-ads');
    const interstitial = InterstitialAd.createForAdRequest(
      Platform.OS === 'android' 
        ? AD_UNIT_IDS.INTERSTITIAL_ANDROID 
        : AD_UNIT_IDS.INTERSTITIAL_IOS,
      {
        requestNonPersonalizedAdsOnly: true,
      }
    );

    interstitial.addAdEventListener(AdEventType.LOADED, () => {
      interstitial.show();
    });

    interstitial.load();
  } catch (error) {
    console.error('Error al mostrar Interstitial Ad:', error);
    // No lanzar el error para que la app continúe funcionando
  }
};

// Función para mostrar Rewarded Ad
// Retorna una promesa que se resuelve cuando el usuario completa el anuncio
export const showRewardedAd = async (onReward?: () => void): Promise<boolean> => {
  // Si no hay módulo disponible, rechazar inmediatamente
  if (!adsModuleAvailable || isExpoGo) {
    return Promise.reject(new Error('Los anuncios no están disponibles en este entorno.'));
  }

  return new Promise(async (resolve, reject) => {
    let loadTimeout: NodeJS.Timeout | null = null;
    let rewarded: any = null;
    let unsubscribeEarned: (() => void) | null = null;
    let unsubscribeClosed: (() => void) | null = null;
    let unsubscribeError: (() => void) | null = null;
    let unsubscribeLoaded: (() => void) | null = null;

    const cleanup = () => {
      if (loadTimeout) clearTimeout(loadTimeout);
      if (unsubscribeEarned) unsubscribeEarned();
      if (unsubscribeClosed) unsubscribeClosed();
      if (unsubscribeError) unsubscribeError();
      if (unsubscribeLoaded) unsubscribeLoaded();
    };

    try {
      // Asegurar que AdMob esté inicializado primero
      try {
        const adsModule = await import('react-native-google-mobile-ads');
        const mobileAdsModule = adsModule.default || adsModule;
        if (mobileAdsModule && typeof mobileAdsModule === 'function') {
          await mobileAdsModule().initialize();
          console.log('✅ AdMob inicializado antes de cargar anuncio');
        }
      } catch (initError) {
        console.warn('⚠️ No se pudo inicializar AdMob antes de cargar:', initError);
      }

      // Importar módulos dinámicamente para asegurar que funcionen en producción
      let RewardedAdModule: any;
      let AdEventTypeModule: any;
      let RewardedAdEventTypeModule: any;

      try {
        const adsModule = await import('react-native-google-mobile-ads');
        RewardedAdModule = adsModule.RewardedAd;
        AdEventTypeModule = adsModule.AdEventType;
        RewardedAdEventTypeModule = adsModule.RewardedAdEventType;
      } catch (importError: any) {
        // Capturar específicamente errores de TurboModuleRegistry
        if (importError?.message?.includes('TurboModuleRegistry') || importError?.message?.includes('RNGoogleMobileAdsModule')) {
          console.warn('⚠️ Módulo nativo de AdMob no disponible.');
        } else {
          console.error('❌ Error al importar módulos de AdMob:', importError);
        }
        cleanup();
        reject(new Error('Módulo de anuncios no disponible en esta build.'));
        return;
      }

      // Si no hay módulos disponibles
      if (!RewardedAdModule || !AdEventTypeModule || !RewardedAdEventTypeModule) {
        console.error('❌ Módulos de AdMob no disponibles');
        cleanup();
        reject(new Error('Módulo de anuncios no disponible en esta build.'));
        return;
      }

      const adUnitId = Platform.OS === 'android' 
        ? AD_UNIT_IDS.REWARDED_ANDROID 
        : AD_UNIT_IDS.REWARDED_IOS;

      console.log('📱 Cargando anuncio premiado. ID:', adUnitId);
      console.log('📱 Plataforma:', Platform.OS);
      console.log('📱 Modo desarrollo:', __DEV__);

      // Crear instancia del anuncio premiado
      rewarded = RewardedAdModule.createForAdRequest(adUnitId, {
        requestNonPersonalizedAdsOnly: false,
      });

      let rewardEarned = false;
      let isSettled = false;

      // Timeout de 15 segundos para cargar el anuncio
      loadTimeout = setTimeout(() => {
        if (!isSettled) {
          console.error('⏱️ Timeout: El anuncio tardó demasiado en cargar');
          isSettled = true;
          cleanup();
          reject(new Error('El anuncio tardó demasiado en cargar. Intenta más tarde.'));
        }
      }, 15000);

      // Listener para cuando el usuario gana la recompensa
      unsubscribeEarned = rewarded.addAdEventListener(
        RewardedAdEventTypeModule.EARNED_REWARD, 
        (reward: any) => {
          console.log('✅ Usuario ganó recompensa:', reward);
          rewardEarned = true;
        }
      );

      // Listener para cuando se cierra el anuncio
      unsubscribeClosed = rewarded.addAdEventListener(
        AdEventTypeModule.CLOSED, 
        () => {
          console.log('🔒 Anuncio cerrado. Recompensa ganada:', rewardEarned);
          if (!isSettled) {
            isSettled = true;
            if (loadTimeout) clearTimeout(loadTimeout);
            if (rewardEarned) {
              onReward?.();
              resolve(true);
            } else {
              resolve(false);
            }
          }
          cleanup();
        }
      );

      // Listener para errores
      unsubscribeError = rewarded.addAdEventListener(
        AdEventTypeModule.ERROR, 
        (error: any) => {
          console.error('❌ Error en Rewarded Ad:', error);
          console.error('❌ Código de error:', error?.code);
          console.error('❌ Mensaje de error:', error?.message);
          console.error('❌ Causa:', error?.cause);
          
          if (!isSettled) {
            isSettled = true;
            if (loadTimeout) clearTimeout(loadTimeout);
            
            // Manejar diferentes tipos de errores
            const errorCode = error?.code || error?.message || '';
            let errorMessage = 'No se pudo cargar el anuncio. Intenta más tarde.';
            
            if (errorCode.includes('no fill') || errorCode.includes('ERROR_CODE_NO_FILL')) {
              errorMessage = 'No hay anuncios disponibles en este momento. Intenta más tarde.';
            } else if (errorCode.includes('network') || errorCode.includes('ERROR_CODE_NETWORK_ERROR')) {
              errorMessage = 'Error de conexión. Verifica tu internet e intenta de nuevo.';
            } else if (errorCode.includes('internal') || errorCode.includes('ERROR_CODE_INTERNAL_ERROR')) {
              errorMessage = 'Error interno. Intenta más tarde.';
            }
            
            cleanup();
            reject(new Error(errorMessage));
          }
        }
      );

      // Listener para cuando el anuncio está cargado
      unsubscribeLoaded = rewarded.addAdEventListener(
        AdEventTypeModule.LOADED, 
        () => {
          console.log('✅ Anuncio cargado exitosamente, mostrándolo...');
          if (loadTimeout) clearTimeout(loadTimeout);
          
          try {
            rewarded.show();
          } catch (showError: any) {
            console.error('❌ Error al mostrar el anuncio:', showError);
            if (!isSettled) {
              isSettled = true;
              cleanup();
              reject(new Error('Error al mostrar el anuncio. Intenta más tarde.'));
            }
          }
        }
      );

      // Cargar el anuncio
      console.log('🔄 Iniciando carga del anuncio...');
      rewarded.load();
    } catch (error: any) {
      console.error('❌ Error fatal al mostrar Rewarded Ad:', error);
      console.error('❌ Stack:', error?.stack);
      cleanup();
      reject(new Error('Error al cargar el anuncio. Intenta más tarde.'));
    }
  });
};

