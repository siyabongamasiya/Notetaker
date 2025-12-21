import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import {
  Stack,
  useRootNavigationState,
  useRouter,
  useSegments,
} from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import "react-native-reanimated";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";

import { useColorScheme } from "@/hooks/use-color-scheme";
import store from "../store";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { getProfile, logout } from "../store/slices/authSlice";

export const unstable_settings = {
  anchor: "(tabs)",
};

const PUBLIC_ROUTES = new Set(["", "index", "login", "register"]);

function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);

  const [hydrating, setHydrating] = React.useState(true);

  // Load token and profile on app start so routing decisions are correct
  React.useEffect(() => {
    let isActive = true;

    (async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          await dispatch(getProfile()).unwrap();
        } else {
          await AsyncStorage.removeItem("token");
        }
      } catch (error) {
        await AsyncStorage.removeItem("token");
        dispatch(logout());
      } finally {
        if (isActive) setHydrating(false);
      }
    })();

    return () => {
      isActive = false;
    };
  }, [dispatch]);

  // Redirect based on auth state and current segment
  React.useEffect(() => {
    if (!navigationState?.key || hydrating) return;

    const firstSegment = segments[0] ?? "index";
    const isPublic = PUBLIC_ROUTES.has(firstSegment);

    if (!user && !isPublic) {
      router.replace("/login");
    } else if (user && isPublic) {
      router.replace("/home");
    }
  }, [segments, user, hydrating, navigationState?.key, router]);

  if (hydrating) return null;

  return <>{children}</>;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <Provider store={store}>
      <AuthGate>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack screenOptions={{ headerShown: false }} />
          <Toast />
          <StatusBar style="auto" />
        </ThemeProvider>
      </AuthGate>
    </Provider>
  );
}
