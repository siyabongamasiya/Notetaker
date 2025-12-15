import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// use solid background for home
import { Ionicons } from "@expo/vector-icons";
import CategoryCard from "../components/CategoryCard";
import HomeTopCard from "../components/HomeTopCard";

const categories = [
  { name: "work", count: 5, icon_name: "briefcase-outline" },
  { name: "study", count: 3, icon_name: "book-outline" },
  { name: "personal", count: 8, icon_name: "person-outline" },
];

const HomeScreen: React.FC = () => {
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: "#F8F5FE" }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.topSection}>
          <HomeTopCard userName="User" style={styles.topCard} />

          <View style={styles.categoriesHeaderRow}>
            <Text style={styles.categoriesTitle}>Categories</Text>
          </View>

          <View style={styles.categoriesList}>
            <CategoryCard
              icon={
                <Ionicons name="briefcase-outline" size={24} color="#FFFFFF" />
              }
              name="Work"
              count={8}
            />
            <CategoryCard
              icon={<Ionicons name="book-outline" size={24} color="#FFFFFF" />}
              name="Study"
              count={12}
            />

            <CategoryCard
              icon={<Ionicons name="heart-outline" size={24} color="#FFFFFF" />}
              name="Personal"
              count={5}
            />
          </View>
        </View>

        <View style={styles.bottomSection}>
          {/* Placeholder for notes / content */}
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
  topSection: {
    // holds HomeTopCard and categories
  },
  topCard: {
    marginBottom: 16,
  },
  categoriesHeaderRow: {
    marginTop: 8,
    marginBottom: 12,
  },
  categoriesTitle: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "700",
  },
  categoriesList: {
    gap: 12,
  },
  categoryWrap: {
    marginBottom: 12,
  },
  bottomSection: {
    marginTop: 24,
  },
});

export default HomeScreen;
