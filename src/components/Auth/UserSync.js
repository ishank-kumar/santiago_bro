'use client';

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export default function UserSync() {
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    const syncUser = async () => {
      if (isSignedIn && user) {
        try {
          await fetch('/api/auth/sync', { method: 'POST' });
        } catch (error) {
          console.error('User synchronization failed:', error);
        }
      }
    };

    syncUser();
  }, [isSignedIn, user]);

  return null;
}
