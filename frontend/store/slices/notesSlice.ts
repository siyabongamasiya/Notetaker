import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/services/api";
import Toast from "react-native-toast-message";

const API_URL = "/notes";

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

/* THUNKS*/

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

/* SLICE */

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
      /* CREATE */
      .addCase(createNote.pending, (s) => {
        s.loading = true;
        s.error = null;
        Toast.show({
          type: "info",
          text1: "Creating note...",
          autoHide: false,
        });
      })
      .addCase(createNote.fulfilled, (s, a) => {
        s.loading = false;
        s.notes.unshift(a.payload);
        s.notesByCategory[a.payload.category].unshift(a.payload);
        Toast.hide();
        Toast.show({ type: "success", text1: "Note created" });
      })
      .addCase(createNote.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload as string;
        Toast.hide();
        Toast.show({ type: "error", text1: s.error });
      })

      /* FETCH ALL */
      .addCase(fetchAllNotes.pending, (s) => {
        s.loading = true;
        Toast.show({
          type: "info",
          text1: "Loading notes...",
          autoHide: false,
        });
      })
      .addCase(fetchAllNotes.fulfilled, (s, a) => {
        s.loading = false;
        s.notes = a.payload;
        Toast.hide();
      })
      .addCase(fetchAllNotes.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload as string;
        Toast.hide();
        Toast.show({ type: "error", text1: s.error });
      })

      /* FETCH BY CATEGORY */
      .addCase(fetchNotesByCategory.fulfilled, (s, a) => {
        s.notesByCategory[a.payload.category] = a.payload.notes;
      })

      /* SEARCH */
      .addCase(searchNotes.fulfilled, (s, a) => {
        s.notes = a.payload;
      })

      /*  FETCH BY ID */
      .addCase(fetchNoteById.fulfilled, (s, a) => {
        s.selectedNote = a.payload;
      })

      /* UPDATE */
      .addCase(updateNote.pending, (s) => {
        s.loading = true;
        Toast.show({
          type: "info",
          text1: "Updating note...",
          autoHide: false,
        });
      })
      .addCase(updateNote.fulfilled, (s, a) => {
        s.loading = false;

        const idx = s.notes.findIndex((n) => n.id === a.payload.id);
        if (idx !== -1) s.notes[idx] = a.payload;

        const catList = s.notesByCategory[a.payload.category];
        const catIdx = catList.findIndex((n) => n.id === a.payload.id);
        if (catIdx !== -1) catList[catIdx] = a.payload;

        s.selectedNote = a.payload;

        Toast.hide();
        Toast.show({ type: "success", text1: "Note updated" });
      })
      .addCase(updateNote.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload as string;
        Toast.hide();
        Toast.show({ type: "error", text1: s.error });
      })

      /* DELETE */
      .addCase(deleteNote.fulfilled, (s, a) => {
        s.notes = s.notes.filter((n) => n.id !== a.payload);
        (Object.keys(s.notesByCategory) as Category[]).forEach((cat) => {
          s.notesByCategory[cat] = s.notesByCategory[cat].filter(
            (n) => n.id !== a.payload
          );
        });

        Toast.hide();
        Toast.show({ type: "success", text1: "Note deleted" });
      })
      .addCase(deleteNote.rejected, (s, a) => {
        s.error = a.payload as string;
        Toast.hide();
        Toast.show({ type: "error", text1: s.error });
      });
  },
});

export const { clearSelectedNote } = notesSlice.actions;
export default notesSlice.reducer;
