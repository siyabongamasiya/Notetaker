import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/services/api";

const API_URL = "/notes"; // base handled in api.ts

/* ================== TYPES ================== */

export type Category = "Work" | "Study" | "Personal";

export type Note = {
  id: string;
  title?: string;
  content: string;
  category: Category;
  createdAt: string;
  updatedAt: string;
};

type NotesState = {
  notes: Note[];
  notesByCategory: Record<Category, Note[]>;
  selectedNote: Note | null;
  loading: boolean;
  error: string | null;
};

/* ================== INITIAL STATE ================== */

const initialState: NotesState = {
  notes: [],
  notesByCategory: {
    Work: [],
    Study: [],
    Personal: [],
  },
  selectedNote: null,
  loading: false,
  error: null,
};

/* ================== THUNKS ================== */

// POST /api/notes
export const createNote = createAsyncThunk(
  "notes/createNote",
  async (
    {
      title,
      content,
      category,
    }: { title?: string; content: string; category: Category },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post(API_URL, { title, content, category });
      return res.data as Note;
    } catch (e: any) {
      return rejectWithValue(
        e.response?.data?.message || "Failed to create note"
      );
    }
  }
);

// GET /api/notes
export const fetchAllNotes = createAsyncThunk(
  "notes/fetchAllNotes",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(API_URL);
      return res.data as Note[];
    } catch (e: any) {
      return rejectWithValue(
        e.response?.data?.message || "Failed to fetch notes"
      );
    }
  }
);

// GET /api/notes/category/:category
export const fetchNotesByCategory = createAsyncThunk(
  "notes/fetchNotesByCategory",
  async (category: Category, { rejectWithValue }) => {
    try {
      const res = await api.get(`${API_URL}/category/${category}`);
      return { category, notes: res.data as Note[] };
    } catch (e: any) {
      return rejectWithValue(
        e.response?.data?.message || "Failed to fetch category notes"
      );
    }
  }
);

// GET /api/notes/search?q=
export const searchNotes = createAsyncThunk(
  "notes/searchNotes",
  async (query: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`${API_URL}/search?q=${query}`);
      return res.data as Note[];
    } catch (e: any) {
      return rejectWithValue(
        e.response?.data?.message || "Failed to search notes"
      );
    }
  }
);

// GET /api/notes/:id
export const fetchNoteById = createAsyncThunk(
  "notes/fetchNoteById",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`${API_URL}/${id}`);
      return res.data as Note;
    } catch (e: any) {
      return rejectWithValue(
        e.response?.data?.message || "Failed to fetch note"
      );
    }
  }
);

// PUT /api/notes/:id
export const updateNote = createAsyncThunk(
  "notes/updateNote",
  async (
    {
      id,
      title,
      content,
      category,
    }: { id: string; title?: string; content?: string; category?: Category },
    { rejectWithValue }
  ) => {
    try {
      console.log({ id, title, content, category });
      const res = await api.put(`${API_URL}/${id}`, {
        title,
        content,
        category,
      });
      return res.data as Note;
    } catch (e: any) {
      return rejectWithValue(
        e.response?.data?.message || "Failed to update note"
      );
    }
  }
);

// DELETE /api/notes/:id
export const deleteNote = createAsyncThunk(
  "notes/deleteNote",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`${API_URL}/${id}`);
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
  reducers: {
    clearSelectedNote(state) {
      state.selectedNote = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNote.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(createNote.fulfilled, (s, a) => {
        s.loading = false;
        s.notes.unshift(a.payload);
        s.notesByCategory[a.payload.category].unshift(a.payload);
      })
      .addCase(createNote.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload as string;
      })

      .addCase(fetchAllNotes.pending, (s) => {
        s.loading = true;
      })
      .addCase(fetchAllNotes.fulfilled, (s, a) => {
        s.loading = false;
        s.notes = a.payload;
      })
      .addCase(fetchAllNotes.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload as string;
      })

      .addCase(fetchNotesByCategory.fulfilled, (s, a) => {
        s.notesByCategory[a.payload.category] = a.payload.notes;
      })

      .addCase(searchNotes.fulfilled, (s, a) => {
        s.notes = a.payload;
      })

      .addCase(fetchNoteById.fulfilled, (s, a) => {
        s.selectedNote = a.payload;
      })

      .addCase(updateNote.fulfilled, (s, a) => {
        const idx = s.notes.findIndex((n) => n.id === a.payload.id);
        if (idx !== -1) s.notes[idx] = a.payload;

        const catList = s.notesByCategory[a.payload.category];
        const catIdx = catList.findIndex((n) => n.id === a.payload.id);
        if (catIdx !== -1) catList[catIdx] = a.payload;

        s.selectedNote = a.payload;
      })

      .addCase(deleteNote.fulfilled, (s, a) => {
        s.notes = s.notes.filter((n) => n.id !== a.payload);
        (Object.keys(s.notesByCategory) as Category[]).forEach((cat) => {
          s.notesByCategory[cat] = s.notesByCategory[cat].filter(
            (n) => n.id !== a.payload
          );
        });
      });
  },
});

export const { clearSelectedNote } = notesSlice.actions;
export default notesSlice.reducer;
