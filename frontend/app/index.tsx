import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function IndexRedirect() {
  const router = useRouter();
  useEffect(() => {
    // Delay the initial replace until after the root layout mounts.
    // Using requestAnimationFrame ensures the navigation happens after
    // the native commit so the router is ready and avoids the
    // "navigate before mounting the Root Layout" error.
    const raf = requestAnimationFrame(() => {
      router.replace('/login');
    });
    return () => cancelAnimationFrame(raf);
  }, [router]);
  return null;
}
