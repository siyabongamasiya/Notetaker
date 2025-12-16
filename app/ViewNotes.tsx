import { useRouter } from "expo-router";
import React, { useMemo, useState, useEffect } from "react";
import { ScrollView, StyleSheet, View, TouchableOpacity, TextInput, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AddNoteFab from "../components/AddNoteFab";
import NoteItemCard from "../components/NoteItemCard";
import NotesTopCard from "../components/NotesTopCard";
import Sorter from "../components/Sorter";
import { useSelector } from 'react-redux';
import { RootState } from '../store';

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
  const [query, setQuery] = useState('');
  const notesAll = useSelector((s: RootState) => s.notes.notes);
  const user = useSelector((s: RootState) => s.auth.user);

  useEffect(() => {
    if (!user) router.replace('/login');
  }, [user]);

  const color = CATEGORY_COLORS[selectedCategory?.toLowerCase()] || "#3B7DFF";

  const notes = useMemo(() => {
    const base = notesAll.filter((n) => n.category === selectedCategory.toLowerCase());
    const searched = query
      ? base.filter((n) => {
          const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
          return terms.every((t) => (n.content + ' ' + (n.title || '')).toLowerCase().includes(t));
        })
      : base;
    const sorted = [...searched].sort((a, b) => {
      if (order === "newest") return +new Date(b.dateAdded) - +new Date(a.dateAdded);
      return +new Date(a.dateAdded) - +new Date(b.dateAdded);
    });
    return sorted;
  }, [notesAll, selectedCategory, order, query]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: "#F8F5FE" }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <NotesTopCard
          title={`${selectedCategory[0].toUpperCase()}${selectedCategory.slice(
            1
          )} Notes`}
          category={selectedCategory as any}
          onSearch={(t) => setQuery(t)}
        />

        <View style={styles.controlsRow}>
          <Sorter value={order} onChange={(o) => setOrder(o)} />
        </View>

        {query ? (
          <View style={{ marginTop: 8, marginBottom: 8 }}>
            <Text style={{ color: '#374151' }}>{notes.length} result(s)</Text>
          </View>
        ) : null}

        <View style={styles.list}>
          {notes.map((n) => (
              <TouchableOpacity
                key={n.id}
                activeOpacity={0.8}
                onPress={() => {
                  router.push(`/Edit_note?id=${n.id}`);
                }}
              >
                <NoteItemCard title={n.title || ''} description={n.content} date={new Date(n.dateAdded)} />
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
