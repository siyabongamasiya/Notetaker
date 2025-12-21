import { useRouter } from "expo-router";
import { useEffect } from "react";

import { useAppSelector } from "../store/hooks";

export default function IndexRedirect() {
  const router = useRouter();
  const user = useAppSelector((s) => s.auth.user);
  useEffect(() => {
    // Delay the initial replace until after the root layout mounts.
    // Using requestAnimationFrame ensures the navigation happens after
    // the native commit so the router is ready and avoids the
    // "navigate before mounting the Root Layout" error.
    const raf = requestAnimationFrame(() => {
      router.replace(user ? "/home" : "/login");
    });
    return () => cancelAnimationFrame(raf);
  }, [router, user]);
  return null;
}
