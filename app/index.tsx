import AddNoteFab from "@/components/AddNoteFab";
import NoteItemCard from "@/components/NoteItemCard";
import NotesTopCard from "@/components/NotesTopCard";
import Sorter from "@/components/Sorter";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LoginScreen from "./login";
import RegisterScreen from "./register";
import HomeScreen from "./home";
import AddNoteScreen from "./Add_Note";
import EditNoteScreen from "./Edit_note";
import ViewNotesScreen from "./ViewNotes";
import ProfileScreen from "./profile";

export default function ModalScreen() {
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  return (
    <SafeAreaView style={styles.container}>
      <ProfileScreen/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "flex-start",
    padding: 5,
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
