import { useRouter } from "expo-router";
import React, { useState } from "react";
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
import { useDispatch, useSelector } from 'react-redux';
import { addNote } from '../store/slices/notesSlice';
import { RootState } from '../store';

const CATEGORY_OPTIONS = ["Work", "Study", "Personal"];

const AddNoteScreen: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<string>("Work");
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((s: RootState) => s.auth.user);

  React.useEffect(() => {
    if (!user) router.replace('/login');
  }, [user]);

  const handleSave = () => {
    // dispatch addNote
    dispatch(addNote({ title, content, category: category.toLowerCase() as any }));
    // Go back to the previous screen when possible to avoid creating duplicate ViewNotes entries
    if ((router as any).back) {
      (router as any).back();
    } else {
      router.replace(`/ViewNotes?category=${category.toLowerCase()}`);
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
          onBack={() => (router.back ? router.back() : router.replace("/home"))}
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
            placeholder="Write you note here..."
            value={content}
            onChangeText={setContent}
            multiline
            numberOfLines={6}
            inputStyle={{ height: 140, textAlignVertical: "top" }}
          />

          <View style={styles.field}>
            <Text style={styles.label}>Category</Text>

            <View style={styles.dropdownContainer}>
              <TouchableOpacity
                style={styles.trigger}
                onPress={() => setOpen((s) => !s)}
                activeOpacity={0.8}
              >
                <Text style={styles.triggerText}>{category}</Text>
                <Text style={styles.arrow}>{open ? "▲" : "▼"}</Text>
              </TouchableOpacity>

              {open && (
                <View style={styles.options}>
                  {CATEGORY_OPTIONS.map((opt) => (
                    <TouchableOpacity
                      key={opt}
                      style={styles.option}
                      onPress={() => {
                        setCategory(opt);
                        setOpen(false);
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.optionText}>{opt}</Text>
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
    minWidth: 140,
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
