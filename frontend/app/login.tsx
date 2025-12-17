import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LoginCard from "../components/LoginCard";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { loginUser } from "../store/slices/authSlice";

const LoginScreen: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);

  React.useEffect(() => {
    if (user) router.replace("/home");
  }, [user]);

  return (
    <LinearGradient
      colors={["#3B7DFF", "#AA48FF", "#3B7DFF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <View style={styles.topSection}>
            <View style={styles.brandColumn}>
              <View style={styles.logoBox}>
                <Image
                  source={require("../assets/images/note-taker-app-icon-512.png")}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>

              <Text style={styles.title}>Note Taker</Text>
              <Text style={styles.subtitle}>
                Your thoughts securely stored.
              </Text>
            </View>
          </View>

          <View style={styles.bottomSection}>
            <LoginCard
              onSubmit={(values: { email: string; password: string }) => {
                dispatch(loginUser(values));
              }}
              onRegisterPress={() => router.push("/register")}
            />
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "space-between",
    paddingVertical: 56,
  },
  topSection: {
    marginBottom: 68,
  },
  brandColumn: {
    alignItems: "center",
  },
  logoBox: {
    width: 96,
    height: 96,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  logo: {
    width: 64,
    height: 64,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
  },
  bottomSection: {
    alignSelf: "stretch",
    marginBottom: 24,
  },
});

export default LoginScreen;
