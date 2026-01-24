'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  isSignInWithEmailLink,
  signOut as firebaseSignOut,
  UserCredential,
  ActionCodeSettings
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { auth, googleProvider, db } from '@/lib/firebase';

// Database Types
export interface AppUser {
  id: string;
  displayName: string;
  email: string;
  userType: 'student' | 'teacher' | 'admin';
  createdAt: Timestamp;
  photoUrl?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  createdAt: Timestamp;
  imageUrl?: string;
  teacherId: string;
  teacher?: AppUser;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  orderIndex: number;
  createdAt: Timestamp;
  courseId: string;
  course?: Course;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  orderIndex: number;
  createdAt: Timestamp;
  externalLink?: string;
  moduleId: string;
  module?: Module;
}

export interface Question {
  id: string;
  queryText: string;
  aiResponse: string;
  createdAt: Timestamp;
  aiExplanation?: string;
  aiFollowUpQuestions?: string[];
  studentId: string;
  student?: AppUser;
  lessonId: string;
  lesson?: Lesson;
}

export interface StudentProgress {
  id: string;
  isCompleted: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastAccessedAt?: Timestamp;
  studentId: string;
  student?: AppUser;
  lessonId: string;
  lesson?: Lesson;
}

interface AuthContextType {
  user: User | null;
  appUser: AppUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<UserCredential>;
  signInWithEmail: (email: string, password: string) => Promise<UserCredential>;
  signUpWithEmail: (email: string, password: string) => Promise<UserCredential>;
  sendSignInLink: (email: string) => Promise<void>;
  completeSignInWithEmailLink: (email?: string) => Promise<UserCredential>;
  resetPassword: (email: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user ? `User: ${user.email}` : 'No user');
      
      if (user) {
        // User is signed in, save/update user data in Firestore
        try {
          const userData = await saveUserToFirestore(user);
          setUser(user);
          setAppUser(userData);
          console.log('User data saved to context:', userData.email);
        } catch (error) {
          console.error('Error saving user data:', error);
          setUser(user);
          setAppUser(null);
        }
      } else {
        // User is signed out
        setUser(null);
        setAppUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Handle email link sign-in on page load
  useEffect(() => {
    const handleEmailLinkSignIn = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        try {
          console.log('Email link detected, attempting sign-in...');
          let email = window.localStorage.getItem('emailForSignIn');
          
          if (!email) {
            // User opened the link on a different device
            email = window.prompt('Please provide your email for confirmation');
          }
          
          if (email) {
            console.log('Completing sign-in with email:', email);
            await completeSignInWithEmailLink(email);
            // Clear the URL parameters after successful sign-in
            window.history.replaceState({}, document.title, window.location.pathname);
            console.log('Email link sign-in successful');
          }
        } catch (error) {
          console.error('Error handling email link sign-in:', error);
          // Show user-friendly error
          alert('There was an error signing you in. Please try requesting a new sign-in link.');
        }
      }
    };

    // Add a small delay to ensure the page is fully loaded
    const timer = setTimeout(handleEmailLinkSignIn, 100);
    return () => clearTimeout(timer);
  }, []);

  const saveUserToFirestore = async (user: User): Promise<AppUser> => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      // Clean user data - remove undefined values
      const userData: any = {
        id: user.uid,
        displayName: user.displayName || user.email?.split('@')[0] || 'User',
        email: user.email!,
        updatedAt: serverTimestamp(),
      };

      // Only add photoUrl if it exists and is not null/undefined
      if (user.photoURL) {
        userData.photoUrl = user.photoURL;
      }

      if (!userSnap.exists()) {
        // New user - set default user type as student
        const newUserData = {
          ...userData,
          userType: 'student',
          createdAt: serverTimestamp(),
        };
        
        // Remove any undefined values before saving
        const cleanedData = Object.fromEntries(
          Object.entries(newUserData).filter(([_, value]) => value !== undefined)
        );
        
        await setDoc(userRef, cleanedData);
        return {
          ...cleanedData,
          createdAt: cleanedData.createdAt as Timestamp,
        } as AppUser;
      } else {
        // Existing user - update login timestamp
        const existingData = userSnap.data() as AppUser;
        const updatedData = { ...existingData, ...userData };
        
        // Remove any undefined values before saving
        const cleanedData = Object.fromEntries(
          Object.entries(updatedData).filter(([_, value]) => value !== undefined)
        );
        
        await setDoc(userRef, cleanedData, { merge: true });
        return cleanedData as AppUser;
      }
    } catch (error) {
      console.error('Error saving user to Firestore:', error);
      // Return a default user object if save fails
      const fallbackUser: AppUser = {
        id: user.uid,
        displayName: user.displayName || user.email?.split('@')[0] || 'User',
        email: user.email!,
        userType: 'student',
        createdAt: serverTimestamp() as Timestamp,
      };
      
      // Only add photoUrl if it exists
      if (user.photoURL) {
        fallbackUser.photoUrl = user.photoURL;
      }
      
      return fallbackUser;
    }
  };

  const signInWithGoogle = async (): Promise<UserCredential> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string): Promise<UserCredential> => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result;
    } catch (error) {
      console.error('Error signing in with email:', error);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, password: string): Promise<UserCredential> => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return result;
    } catch (error) {
      console.error('Error signing up with email:', error);
      throw error;
    }
  };

  const sendSignInLink = async (email: string): Promise<void> => {
    try {
      const actionCodeSettings: ActionCodeSettings = {
        url: `${window.location.origin}/auth/email-link`,
        handleCodeInApp: true,
      };
      
      console.log('Sending email link with URL:', actionCodeSettings.url);
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      // Save the email locally so we don't need to ask for it again
      window.localStorage.setItem('emailForSignIn', email);
      console.log('Email link sent successfully, email stored:', email);
    } catch (error) {
      console.error('Error sending sign-in link:', error);
      throw error;
    }
  };

  const completeSignInWithEmailLink = async (providedEmail?: string): Promise<UserCredential> => {
    try {
      if (!isSignInWithEmailLink(auth, window.location.href)) {
        throw new Error('Invalid sign-in link');
      }

      // Get the email if available
      let email = providedEmail || window.localStorage.getItem('emailForSignIn');
      
      if (!email) {
        // User opened the link on a different device
        throw new Error('Email is required to complete sign-in');
      }

      console.log('Completing email link sign-in for:', email);
      const result = await signInWithEmailLink(auth, email, window.location.href);
      
      // Clear email from storage
      window.localStorage.removeItem('emailForSignIn');
      
      console.log('Email link sign-in successful:', result.user.email);
      return result;
    } catch (error) {
      console.error('Error completing email link sign-in:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
      const actionCodeSettings: ActionCodeSettings = {
        url: `${window.location.origin}/login`,
        handleCodeInApp: false,
      };
      await sendPasswordResetEmail(auth, email, actionCodeSettings);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  };

  const sendVerificationEmail = async (): Promise<void> => {
    try {
      if (auth.currentUser) {
        const actionCodeSettings: ActionCodeSettings = {
          url: `${window.location.origin}/login?verified=true`,
          handleCodeInApp: false,
        };
        await sendEmailVerification(auth.currentUser, actionCodeSettings);
      } else {
        throw new Error('No user is currently signed in');
      }
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    appUser,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    sendSignInLink,
    completeSignInWithEmailLink,
    resetPassword,
    sendVerificationEmail,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}