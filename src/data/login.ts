// src/data/login.ts
// Firebase configuration untuk autentikasi, database, dan fitur lainnya
// 
// SETUP INSTRUCTIONS:
// 1. Pergi ke https://console.firebase.google.com/
// 2. Buat project baru atau pilih project yang sudah ada
// 3. Aktifkan Authentication > Sign-in method > Google
// 4. Aktifkan Firestore Database
// 5. Ganti nilai konfigurasi di bawah dengan nilai dari project Firebase Anda
// 6. Install Firebase: npm install firebase

import { Injectable, signal } from '@angular/core';

// ================================================
// KONFIGURASI FIREBASE - GANTI DENGAN NILAI ANDA
// ================================================
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// ================================================
// USER INTERFACE
// ================================================
export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt?: Date;
  lastLogin?: Date;
  studyStats?: UserStudyStats;
}

export interface UserStudyStats {
  totalStudyDays: number;
  currentStreak: number;
  longestStreak: number;
  kanjiLearned: number;
  vocabLearned: number;
  quizCompleted: number;
  totalScore: number;
  flashcardReviewed: number;
  favoriteLevel: string;
  lastStudyDate?: string;
}

// ================================================
// FIREBASE AUTH SERVICE (MOCK untuk development)
// ================================================
// Uncomment dan ganti dengan implementasi Firebase asli setelah setup Firebase

/*
// IMPLEMENTASI FIREBASE ASLI:
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<AppUser | null>(null);
  isLoading = signal(true);

  constructor() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userData = await this.getUserFromFirestore(user);
        this.currentUser.set(userData);
      } else {
        this.currentUser.set(null);
      }
      this.isLoading.set(false);
    });
  }

  async signInWithGoogle(): Promise<void> {
    const result = await signInWithPopup(auth, googleProvider);
    await this.saveUserToFirestore(result.user);
  }

  async signOut(): Promise<void> {
    await signOut(auth);
    this.currentUser.set(null);
  }

  private async getUserFromFirestore(user: User): Promise<AppUser> {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const data = userSnap.data();
      await updateDoc(userRef, { lastLogin: serverTimestamp() });
      return { uid: user.uid, email: user.email, displayName: user.displayName, photoURL: user.photoURL, ...data } as AppUser;
    }
    
    return this.saveUserToFirestore(user);
  }

  private async saveUserToFirestore(user: User): Promise<AppUser> {
    const userRef = doc(db, 'users', user.uid);
    const newUser: AppUser = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      createdAt: new Date(),
      lastLogin: new Date(),
      studyStats: {
        totalStudyDays: 0,
        currentStreak: 0,
        longestStreak: 0,
        kanjiLearned: 0,
        vocabLearned: 0,
        quizCompleted: 0,
        totalScore: 0,
        flashcardReviewed: 0,
        favoriteLevel: 'N5'
      }
    };
    await setDoc(userRef, newUser, { merge: true });
    return newUser;
  }

  async updateStudyStats(stats: Partial<UserStudyStats>): Promise<void> {
    const user = this.currentUser();
    if (!user) return;
    
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, { 
      studyStats: { ...user.studyStats, ...stats },
      lastLogin: serverTimestamp()
    });
  }
}
*/

// ================================================
// MOCK AUTH SERVICE (Tanpa Firebase - untuk dev)
// ================================================
@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<AppUser | null>(null);
  isLoading = signal(false);

  constructor() {
    try {
      const savedUser = localStorage.getItem('javsensei_user');
      if (savedUser) { this.currentUser.set(JSON.parse(savedUser)); }
    } catch { /* ignore */ }
  }

  async signInWithGoogle(): Promise<void> {
    // MOCK: Simulate Google login
    // Ganti dengan implementasi Firebase asli
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser: AppUser = {
          uid: 'mock_user_' + Date.now(),
          email: 'user@gmail.com',
          displayName: 'Pengguna JavSensei',
          photoURL: null,
          createdAt: new Date(),
          lastLogin: new Date(),
          studyStats: {
            totalStudyDays: 0,
            currentStreak: 0,
            longestStreak: 0,
            kanjiLearned: 0,
            vocabLearned: 0,
            quizCompleted: 0,
            totalScore: 0,
            flashcardReviewed: 0,
            favoriteLevel: 'N5'
          }
        };
        this.currentUser.set(mockUser);
        try { localStorage.setItem('javsensei_user', JSON.stringify(mockUser)); } catch { /* ignore */ }
        resolve();
      }, 1000);
    });
  }

  async signOut(): Promise<void> {
    this.currentUser.set(null);
    try { localStorage.removeItem('javsensei_user'); } catch { /* ignore */ }
  }

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  async updateStudyStats(stats: Partial<UserStudyStats>): Promise<void> {
    const user = this.currentUser();
    if (!user) return;
    
    const updatedUser = {
      ...user,
      studyStats: { ...user.studyStats, ...stats }
    };
    this.currentUser.set(updatedUser);
    try { localStorage.setItem('javsensei_user', JSON.stringify(updatedUser)); } catch { /* ignore */ }
  }
}
