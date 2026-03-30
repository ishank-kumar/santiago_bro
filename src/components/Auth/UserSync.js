'use client';

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export default function UserSync() {
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const syncUser = async () => {
      if (isSignedIn && user && isMounted) {
        try {
          await fetch('/api/auth/sync', { 
            method: 'POST',
            signal: controller.signal
          });
          if (isMounted) console.log('User synchronization successful');
        } catch (error) {
          if (error.name !== 'AbortError' && isMounted) {
            console.error('User synchronization failed:', error);
          }
        }
      }
    };

    syncUser();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [isSignedIn, user?.id]);

  return null;
}
