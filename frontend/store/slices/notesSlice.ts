import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

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
  loading: boolean;
  error: string | null;
};

const initialState: NotesState = {
  notes: [],
  loading: false,
  error: null,
};

/* ================== THUNKS ================== */

// Fetch notes
export const fetchNotes = createAsyncThunk(
  "notes/fetchNotes",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/api/notes");
      return res.data;
    } catch (e: any) {
      return rejectWithValue(
        e.response?.data?.message || "Failed to fetch notes"
      );
    }
  }
);

// Create note
export const createNote = createAsyncThunk(
  "notes/createNote",
  async (
    {
      title,
      content,
      category,
    }: { title?: string; content: string; category: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.post("/api/notes", { title, content, category });
      return res.data;
    } catch (e: any) {
      return rejectWithValue(
        e.response?.data?.message || "Failed to create note"
      );
    }
  }
);

// Update note
export const updateNote = createAsyncThunk(
  "notes/updateNote",
  async (
    {
      id,
      title,
      content,
      category,
    }: { id: string; title?: string; content?: string; category?: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.put(`/api/notes/${id}`, {
        title,
        content,
        category,
      });
      return res.data;
    } catch (e: any) {
      return rejectWithValue(
        e.response?.data?.message || "Failed to update note"
      );
    }
  }
);

// Delete note
export const deleteNote = createAsyncThunk(
  "notes/deleteNote",
  async ({ id }: { id: string }, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/notes/${id}`);
      return id;
    } catch (e: any) {
      return rejectWithValue(
        e.response?.data?.message || "Failed to delete note"
      );
    }
  }
);

/* ================== SLICE ================== */

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch notes
      .addCase(fetchNotes.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchNotes.fulfilled, (s, a) => {
        s.loading = false;
        s.notes = a.payload;
      })
      .addCase(fetchNotes.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload as string;
      })

      // Create note
      .addCase(createNote.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(createNote.fulfilled, (s, a) => {
        s.loading = false;
        s.notes.unshift(a.payload);
      })
      .addCase(createNote.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload as string;
      })

      // Update note
      .addCase(updateNote.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(updateNote.fulfilled, (s, a) => {
        s.loading = false;
        const idx = s.notes.findIndex((n) => n.id === a.payload.id);
        if (idx !== -1) s.notes[idx] = a.payload;
      })
      .addCase(updateNote.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload as string;
      })

      // Delete note
      .addCase(deleteNote.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(deleteNote.fulfilled, (s, a) => {
        s.loading = false;
        s.notes = s.notes.filter((n) => n.id !== a.payload);
      })
      .addCase(deleteNote.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload as string;
      });
  },
});

export default notesSlice.reducer;
