import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import RegisterCard from "../components/RegisterCard";
import { RootState } from "../store";
import { register } from "../store/slices/authSlice";

const RegisterScreen: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((s: RootState) => s.auth.user);

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
                <Text style={styles.logoText}>Logo</Text>
              </View>

              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Join NoteTaker today.</Text>
            </View>
          </View>

          <View style={styles.bottomSection}>
            <RegisterCard
              onSubmit={(vals: {
                email: string;
                password: string;
                username: string;
              }) => {
                dispatch(register(vals));
              }}
              onLoginPress={() => router.push("/login")}
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
    justifyContent: "flex-start",
    paddingVertical: 10,
  },
  topSection: {
    marginBottom: 38,
  },
  brandColumn: {
    alignItems: "center",
  },
  logoBox: {
    width: 96,
    height: 96,
    borderRadius: 12,
    backgroundColor: "rgba(249, 250, 252, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  logoText: {
    color: "#FFFFFF",
    fontWeight: "700",
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
    // ensure RegisterCard sits at the bottom area and stretches horizontally
    alignSelf: "stretch",
    marginTop: "auto",
    marginBottom: 24,
  },
});

export default RegisterScreen;
