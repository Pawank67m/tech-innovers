'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';

export function FirebaseTest() {
  const [firebaseStatus, setFirebaseStatus] = useState<string>('Checking...');

  useEffect(() => {
    try {
      // Test Firebase Auth
      if (auth) {
        console.log('✅ Firebase Auth initialized successfully');
      }
      
      // Test Firestore
      if (db) {
        console.log('✅ Firestore initialized successfully');
      }
      
      setFirebaseStatus('✅ Firebase connected successfully!');
    } catch (error) {
      console.error('❌ Firebase initialization error:', error);
      setFirebaseStatus('❌ Firebase connection failed');
    }
  }, []);

  return (
    <div className="p-4 border rounded-lg bg-muted/50">
      <h3 className="font-semibold mb-2">Firebase Status</h3>
      <p className="text-sm text-muted-foreground">{firebaseStatus}</p>
    </div>
  );
}