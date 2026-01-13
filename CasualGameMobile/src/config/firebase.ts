import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCQwdpeEBAVhAfdNFG4tAirTNJ3edqMA9U",
  authDomain: "burger-match-ded9c.firebaseapp.com",
  projectId: "burger-match-ded9c",
  storageBucket: "burger-match-ded9c.firebasestorage.app",
  messagingSenderId: "409326253302",
  appId: "1:409326253302:web:5bdd17b5f3c65f697ba8d7",
  measurementId: "G-RWJY2C61KK"
};

const app = initializeApp(firebaseConfig);

// Inicializar Analytics solo si está soportado (no funciona en Expo Go)
let analytics: any = null;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});

export { app, analytics };
export default app;
