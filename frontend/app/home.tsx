import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CategoryCard from "../components/CategoryCard";
import HomeTopCard from "../components/HomeTopCard";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchNotesByCategory } from "../store/slices/notesSlice";

const categories = [
  { key: "Work", icon: "briefcase-outline" },
  { key: "Study", icon: "book-outline" },
  { key: "Personal", icon: "heart-outline" },
] as const;

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const user = useAppSelector((s) => s.auth.user);
  const notesByCategory = useAppSelector((s) => s.notes.notesByCategory);

  React.useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }


    categories.forEach((c) => {
      dispatch(fetchNotesByCategory(c.key));
    });
  }, []);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: "#F8F5FE" }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <HomeTopCard
          userName={user?.username || "User"}
          style={styles.topCard}
          onProfilePress={() => router.push("/profile")}
        />

        <View style={styles.categoriesHeaderRow}>
          <Text style={styles.categoriesTitle}>Categories</Text>
        </View>

        <View style={styles.categoriesList}>
          {categories.map((cat) => (
            <CategoryCard
              key={cat.key}
              icon={
                <Ionicons name={cat.icon as any} size={24} color="#FFFFFF" />
              }
              name={cat.key.toUpperCase()}
              count={notesByCategory[cat.key].length}
              onPress={() => router.push(`/ViewNotes?category=${cat.key}`)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  topCard: {
    marginBottom: 16,
  },
  categoriesHeaderRow: {
    marginBottom: 12,
  },
  categoriesTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
  categoriesList: {
    gap: 12,
  },
});

export default HomeScreen;
