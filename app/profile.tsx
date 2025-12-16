import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LogoutButton from "../components/LogoutButton";
import Button from "../components/shared/Button";
import EditText from "../components/shared/EditText";
import SimpleTopCard from "../components/shared/SimpleTopCard";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updateProfile, logout } from '../store/slices/authSlice';

const ProfileScreen: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((s: RootState) => s.auth.user);

  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSave = () => {
    dispatch(updateProfile({ email, username, password }));
    if ((router as any).back) {
      (router as any).back();
    } else {
      router.replace("/home");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    router.replace('/login');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <SimpleTopCard
          title="Profile Settings"
          onBack={() =>
            router.back ? (router.back as any)() : router.replace("/home")
          }
        />

        <View style={styles.form}>
          <EditText
            label="Username"
            placeholder="Enter username"
            value={username}
            onChangeText={setUsername}
          />

          <EditText
            label="Email"
            placeholder="Enter email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <EditText
            label="Password"
            placeholder="Enter password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View style={styles.actions}>
          <Button text="Save Changes" onPress={handleSave} />

          <View style={styles.logoutWrap}>
            <LogoutButton onPress={handleLogout} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F8F5FE" },
  container: {
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  form: {
    marginTop: 50,
    gap: 12,
  },
  actions: {
    marginTop: 40,
    gap: 12,
  },
  logoutWrap: {
    marginTop: 8,
  },
});

export default ProfileScreen;
