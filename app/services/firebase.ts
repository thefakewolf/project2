// Firebase configuration and authentication service
// Note: You'll need to install Firebase SDK and configure it

import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your Firebase config (replace with your actual config)
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const firebaseService = {
  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const token = await user.getIdToken();
      
      // Store Firebase token
      await AsyncStorage.setItem('firebaseToken', token);
      
      return { user, token };
    } catch (error) {
      throw error;
    }
  },

  // Sign up with email and password
  signUp: async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const token = await user.getIdToken();
      
      // Store Firebase token
      await AsyncStorage.setItem('firebaseToken', token);
      
      return { user, token };
    } catch (error) {
      throw error;
    }
  },

  // Sign out
  signOut: async () => {
    try {
      await signOut(auth);
      await AsyncStorage.multiRemove(['firebaseToken', 'userData']);
    } catch (error) {
      throw error;
    }
  },

  // Get current user
  getCurrentUser: () => auth.currentUser,

  // Get current user token
  getCurrentUserToken: async () => {
    const user = auth.currentUser;
    if (user) {
      return await user.getIdToken();
    }
    return null;
  },

  // Listen to auth state changes
  onAuthStateChanged: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
  },

  // Refresh token
  refreshToken: async () => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken(true); // Force refresh
      await AsyncStorage.setItem('firebaseToken', token);
      return token;
    }
    return null;
  }
};

export { auth };
export default firebaseService;