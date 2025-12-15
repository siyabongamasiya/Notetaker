import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AddNoteFab from "../components/AddNoteFab";
import NoteItemCard from "../components/NoteItemCard";
import NotesTopCard from "../components/NotesTopCard";
import Sorter from "../components/Sorter";

const CATEGORY_COLORS: Record<string, string> = {
  work: "#3B7DFF",
  study: "#AA48FF",
  personal: "#E70076",
};

const SAMPLE_NOTES = [
  {
    id: "1",
    category: "work",
    title: "Design review",
    description: "Review the new UI designs and give feedback.",
    date: new Date(),
  },
  {
    id: "2",
    category: "study",
    title: "Math notes",
    description: "Summarize chapter 4 on integrals.",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
  },
  {
    id: "3",
    category: "personal",
    title: "Grocery list",
    description: "Buy milk, eggs, and bread.",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
  },
  {
    id: "4",
    category: "work",
    title: "Sprint plan",
    description: "Prepare sprint plan for next week.",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
  },
];

const ViewNotesScreen: React.FC = () => {
  const router = useRouter();
  // try to read a `category` param from the router params if available,
  // fall back to "work" when not provided. expo-router may expose
  // params differently depending on routing setup, so use a safe any-cast.
  const params = (router as any).params ?? {};
  const selectedCategory = (params.category as string) || "study";
  const [order, setOrder] = useState<"newest" | "oldest">("newest");

  const color = CATEGORY_COLORS[selectedCategory?.toLowerCase()] || "#3B7DFF";

  const notes = useMemo(() => {
    const filtered = SAMPLE_NOTES.filter(
      (n) => n.category === selectedCategory.toLowerCase()
    );
    const sorted = filtered.sort((a, b) => {
      if (order === "newest") return +new Date(b.date) - +new Date(a.date);
      return +new Date(a.date) - +new Date(b.date);
    });
    return sorted;
  }, [selectedCategory, order]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: "#F8F5FE" }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <NotesTopCard
          title={`${selectedCategory[0].toUpperCase()}${selectedCategory.slice(
            1
          )} Notes`}
          category={selectedCategory as any}
        />

        <View style={styles.controlsRow}>
          <Sorter value={order} onChange={(o) => setOrder(o)} />
        </View>

        <View style={styles.list}>
          {notes.map((n) => (
              <TouchableOpacity
                key={n.id}
                activeOpacity={0.8}
                onPress={() => {
                  const current = (router as any).pathname || '';
                  if (current !== '/Edit_note') router.push(`/Edit_note?id=${n.id}`);
                }}
              >
                <NoteItemCard title={n.title} description={n.description} date={n.date} />
              </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <AddNoteFab
        color={color}
        onPress={() => {
          const current = (router as any).pathname || '';
          if (current !== '/Add_Note') router.push('/Add_Note');
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  controlsRow: {
    marginTop: 12,
    marginBottom: 12,
  },
  list: {
    marginTop: 8,
    marginBottom: 120,
  },
});

export default ViewNotesScreen;
