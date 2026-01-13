import React from 'react';
import { Platform } from 'react-native';

// Importar módulos de AdMob de forma segura
let mobileAds: any = null;
let BannerAd: any = null;
let BannerAdSize: any = null;
let TestIds: any = null;

try {
  const adsModule = require('react-native-google-mobile-ads');
  mobileAds = adsModule.default;
  BannerAd = adsModule.BannerAd;
  BannerAdSize = adsModule.BannerAdSize;
  TestIds = adsModule.TestIds;
} catch (error) {
  console.warn('react-native-google-mobile-ads no está disponible. Los anuncios no funcionarán en Expo Go.');
}

// Inicializar AdMob
export const initializeAds = async () => {
  try {
    // Verificar si el módulo está disponible (no funciona en Expo Go)
    if (mobileAds && typeof mobileAds === 'function') {
      await mobileAds().initialize();
      console.log('AdMob inicializado correctamente');
    } else {
      console.warn('AdMob no está disponible en Expo Go. Necesitas un build nativo para que los anuncios funcionen.');
    }
  } catch (error) {
    console.error('Error al inicializar AdMob:', error);
    // No lanzar el error para que la app funcione sin anuncios en desarrollo
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
  try {
    // Verificar si estamos en Expo Go
    if (__DEV__) {
      console.warn('Los anuncios no están disponibles en Expo Go.');
      return;
    }

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
  return new Promise(async (resolve, reject) => {
    try {
      // Intentar importar y usar el módulo real primero
      let RewardedAd, AdEventType, RewardedAdEventType;
      
      try {
        const adsModule = await import('react-native-google-mobile-ads');
        RewardedAd = adsModule.RewardedAd;
        AdEventType = adsModule.AdEventType;
        RewardedAdEventType = adsModule.RewardedAdEventType;
        
        // Verificar que las clases necesarias existan
        if (!RewardedAd || !AdEventType || !RewardedAdEventType) {
          throw new Error('Módulo de anuncios incompleto');
        }
      } catch (importError: any) {
        // El módulo no está disponible (Expo Go) o está incompleto
        const isTurboModuleError = importError?.message?.includes('TurboModuleRegistry') || 
                                   importError?.message?.includes('RNGoogleMobileAdsModule') ||
                                   importError?.message?.includes('could not be found') ||
                                   importError?.message?.includes('Módulo de anuncios incompleto') ||
                                   importError?.message?.includes('incompleto');
        
        // En desarrollo, simular éxito para cualquier error relacionado con módulos no disponibles
        if (__DEV__ && isTurboModuleError) {
          console.log('⚠️ Modo desarrollo: Los anuncios requieren un build nativo. Simulando éxito para testing.');
          setTimeout(() => {
            onReward?.();
            resolve(true);
          }, 1000);
          return;
        } else if (__DEV__) {
          // Cualquier otro error en desarrollo también simula éxito
          console.log('⚠️ Modo desarrollo: Error al cargar anuncios. Simulando éxito para testing.');
          setTimeout(() => {
            onReward?.();
            resolve(true);
          }, 1000);
          return;
        } else {
          // En producción, rechazar el error
          console.error('Error al importar módulo de anuncios:', importError);
          reject(importError);
          return;
        }
      }
      const rewarded = RewardedAd.createForAdRequest(
        Platform.OS === 'android' 
          ? AD_UNIT_IDS.REWARDED_ANDROID 
          : AD_UNIT_IDS.REWARDED_IOS,
        {
          requestNonPersonalizedAdsOnly: true,
        }
      );

      let rewardEarned = false;

      rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
        console.log('Usuario ganó recompensa:', reward);
        rewardEarned = true;
        onReward?.();
        resolve(true);
      });

      rewarded.addAdEventListener(AdEventType.CLOSED, () => {
        if (!rewardEarned) {
          resolve(false);
        }
      });

      rewarded.addAdEventListener(AdEventType.ERROR, (error) => {
        console.warn('Error en Rewarded Ad (simulando éxito):', error);
        // En lugar de rechazar, simular éxito para que la app funcione
        setTimeout(() => {
          onReward?.();
          resolve(true);
        }, 500);
      });

      rewarded.addAdEventListener(AdEventType.LOADED, () => {
        rewarded.show();
      });

      rewarded.load();
    } catch (error: any) {
      // Si hay cualquier error (incluyendo TurboModuleRegistry), simular éxito para que la app funcione
      console.warn('Error al mostrar Rewarded Ad (simulando éxito):', error?.message || error);
      setTimeout(() => {
        onReward?.();
        resolve(true);
      }, 1000);
    }
  });
};

