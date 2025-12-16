import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Note = {
  id: string;
  title?: string;
  content: string;
  dateAdded: string; // ISO
  lastUpdated?: string; // ISO
  category: "work" | "study" | "personal";
};

type NotesState = {
  notes: Note[];
};

const sample: Note[] = [
  {
    id: "1",
    title: "Design review",
    content: "Review the new UI designs and give feedback.",
    dateAdded: new Date().toISOString(),
    category: "work",
  },
  {
    id: "2",
    title: "Math notes",
    content: "Summarize chapter 4 on integrals.",
    dateAdded: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    category: "study",
  },
  {
    id: "3",
    title: "Grocery list",
    content: "Buy milk, eggs, and bread.",
    dateAdded: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    category: "personal",
  },
  {
    id: "4",
    title: "Sprint plan",
    content: "Prepare sprint plan for next week.",
    dateAdded: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    category: "work",
  },
];

const initialState: NotesState = {
  notes: sample,
};

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    addNote: (state, action: PayloadAction<Omit<Note, "id" | "dateAdded">>) => {
      const id = String(Date.now());
      const newNote: Note = {
        id,
        ...action.payload,
        dateAdded: new Date().toISOString(),
      };
      state.notes.unshift(newNote);
    },
    updateNote: (
      state,
      action: PayloadAction<{ id: string; changes: Partial<Note> }>
    ) => {
      const idx = state.notes.findIndex((n) => n.id === action.payload.id);
      if (idx === -1) return;
      const updated: Note = {
        ...state.notes[idx],
        ...action.payload.changes,
        lastUpdated: new Date().toISOString(),
      };
      state.notes[idx] = updated;
    },
    deleteNote: (state, action: PayloadAction<{ id: string }>) => {
      state.notes = state.notes.filter((n) => n.id !== action.payload.id);
    },
  },
});

export const { addNote, updateNote, deleteNote } = notesSlice.actions;
export default notesSlice.reducer;
