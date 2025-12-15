import AddNoteFab from "@/components/AddNoteFab";
import NoteItemCard from "@/components/NoteItemCard";
import NotesTopCard from "@/components/NotesTopCard";
import Sorter from "@/components/Sorter";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ModalScreen() {
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  return (
    <SafeAreaView style={styles.container}>
      <NotesTopCard
        title="My Notes"
        category="work"
        onBack={() => console.log("Go back")}
        onSearch={(text) => console.log("Search:", text)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "flex-start",
    padding: 20,
    paddingBottom: 28,
  },
  list: {
    width: "100%",
    gap: 12,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
