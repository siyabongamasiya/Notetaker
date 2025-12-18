import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AddNoteFab from "../components/AddNoteFab";
import NoteItemCard from "../components/NoteItemCard";
import NotesTopCard from "../components/NotesTopCard";
import Sorter from "../components/Sorter";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { deleteNote, Note } from "../store/slices/notesSlice";

/* ---------------- CATEGORY COLORS ---------------- */

const CATEGORY_COLORS: Record<"all" | "work" | "study" | "personal", string> = {
  all: "#6B7280",
  work: "#3B7DFF",
  study: "#AA48FF",
  personal: "#E70076",
};

const ViewNotesScreen: React.FC = () => {
  const router = useRouter();
  const { category } = useLocalSearchParams<{ category?: string }>();

  const selectedCategory = (
    category ? String(category) : "all"
  ).toLowerCase() as "all" | "work" | "study" | "personal";

  const [order, setOrder] = useState<"newest" | "oldest">("newest");
  const [query, setQuery] = useState("");

  const dispatch = useAppDispatch();
  const notesAll = useAppSelector((s) => s.notes.notes) as Note[];
  const user = useAppSelector((s) => s.auth.user);

  /* ---------------- AUTH GUARD ---------------- */

  useEffect(() => {
    if (!user) router.replace("/login");
  }, [user]);

  /* ---------------- FILTER + SORT ---------------- */

  const notes = useMemo(() => {
    const base =
      selectedCategory === "all"
        ? notesAll
        : notesAll.filter((n) => n.category === selectedCategory);

    const searched = query
      ? base.filter((n) => {
          const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
          return terms.every((t) =>
            (n.content + " " + (n.title || "")).toLowerCase().includes(t)
          );
        })
      : base;

    return [...searched].sort((a, b) => {
      if (order === "newest") {
        return +new Date(b.createdAt) - +new Date(a.createdAt);
      }
      return +new Date(a.createdAt) - +new Date(b.createdAt);
    });
  }, [notesAll, selectedCategory, order, query]);

  const color = CATEGORY_COLORS[selectedCategory];

  /* ---------------- RENDER ---------------- */

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: "#F8F5FE" }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <NotesTopCard
          title={
            selectedCategory === "all"
              ? "All Notes"
              : `${selectedCategory[0].toUpperCase()}${selectedCategory.slice(
                  1
                )} Notes`
          }
          category={selectedCategory}
          onSearch={setQuery}
        />

        <View style={styles.controlsRow}>
          <Sorter value={order} onChange={setOrder} />
        </View>

        {query ? (
          <View style={{ marginTop: 8, marginBottom: 8 }}>
            <Text style={{ color: "#374151" }}>{notes.length} result(s)</Text>
          </View>
        ) : null}

        <View style={styles.list}>
          {notes.map((n) => (
            <NoteItemCard
              key={n.id}
              title={n.title || ""}
              description={n.content}
              date={new Date(n.createdAt)}
              onPress={() => router.push(`/Edit_note?id=${n.id}`)}
              onDelete={() => dispatch(deleteNote(n.id))}
            />
          ))}
        </View>
      </ScrollView>

      <AddNoteFab color={color} onPress={() => router.push("/Add_Note")} />
    </SafeAreaView>
  );
};

/* ---------------- STYLES ---------------- */

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
