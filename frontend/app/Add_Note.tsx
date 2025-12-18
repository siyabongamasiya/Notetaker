import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/shared/Button";
import EditText from "../components/shared/EditText";
import SimpleTopCard from "../components/shared/SimpleTopCard";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { createNote } from "../store/slices/notesSlice";

const CATEGORY_OPTIONS = [
  { label: "Work", value: "Work" },
  { label: "Study", value: "Study" },
  { label: "Personal", value: "Personal" },
] as const;

type Category = "Work" | "Study" | "Personal";

const AddNoteScreen: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<Category>("Work");
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);

  /* AUTH GUARD */

  useEffect(() => {
    if (!user) router.replace("/login");
  }, [user]);

  /* SAVE NOTE */

  const handleSave = async () => {
    if (!content.trim()) return;
    try {
      await dispatch(
        createNote({
          title: title.trim() || undefined,
          content: content.trim(),
          category,
        })
      ).unwrap();

      router.replace(`/ViewNotes?category=${category}`);
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <SimpleTopCard
          title="Add note"
          onBack={() => router.replace(`/ViewNotes?category=${category}`)}
        />

        <View style={styles.form}>
          <EditText
            label="Title"
            placeholder="Enter note title"
            value={title}
            onChangeText={setTitle}
          />

          <EditText
            label="Content"
            placeholder="Write your note here..."
            value={content}
            onChangeText={setContent}
            multiline
            numberOfLines={6}
            inputStyle={{ height: 140, textAlignVertical: "top" }}
          />

          {/* -------- CATEGORY DROPDOWN -------- */}

          <View style={styles.field}>
            <Text style={styles.label}>Category</Text>

            <View style={styles.dropdownContainer}>
              <TouchableOpacity
                style={styles.trigger}
                onPress={() => setOpen((s) => !s)}
                activeOpacity={0.8}
              >
                <Text style={styles.triggerText}>
                  {CATEGORY_OPTIONS.find((c) => c.value === category)?.label}
                </Text>
                <Text style={styles.arrow}>{open ? "▲" : "▼"}</Text>
              </TouchableOpacity>

              {open && (
                <View style={styles.options}>
                  {CATEGORY_OPTIONS.map((opt) => (
                    <TouchableOpacity
                      key={opt.value}
                      style={styles.option}
                      onPress={() => {
                        setCategory(opt.value);
                        setOpen(false);
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.optionText}>{opt.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          <View style={styles.saveBtnWrap}>
            <Button text="Save Note" onPress={handleSave} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F8F5FE" },
  container: {
    flex: 1,
    gap: 30,
    paddingHorizontal: 20,
  },
  form: {
    marginTop: 12,
    gap: 16,
  },
  field: {
    width: "100%",
  },
  label: {
    marginBottom: 8,
    color: "#111827",
    fontSize: 14,
    fontWeight: "600",
  },
  dropdownContainer: {
    position: "relative",
  },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  triggerText: {
    color: "#111827",
    fontSize: 14,
  },
  arrow: {
    marginLeft: 8,
    fontSize: 12,
    color: "#6B7280",
  },
  options: {
    position: "absolute",
    top: 56,
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    zIndex: 100,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  optionText: {
    fontSize: 14,
    color: "#111827",
  },
  saveBtnWrap: {
    marginTop: 8,
  },
});

export default AddNoteScreen;
