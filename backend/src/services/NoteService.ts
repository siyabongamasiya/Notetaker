import { v4 as uuidv4 } from "uuid";

type NoteRecord = {
  id: string;
  title: string;
  content: string;
  category: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

const notes = new Map<string, NoteRecord>();

export class NoteService {
  async createNote(
    userId: string,
    title: string,
    content: string,
    category: string = "personal"
  ) {
    const id = uuidv4();
    const now = new Date().toISOString();
    const record: NoteRecord = {
      id,
      title,
      content,
      category: category.toLowerCase(),
      userId,
      createdAt: now,
      updatedAt: now,
    };
    notes.set(id, record);
    return record;
  }

  async getNotesByUser(userId: string) {
    return Array.from(notes.values())
      .filter((n) => n.userId === userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async getNoteById(noteId: string, userId: string) {
    const n = notes.get(noteId);
    if (!n || n.userId !== userId) return null;
    return n;
  }

  async getNotesByCategory(userId: string, category: string) {
    return Array.from(notes.values())
      .filter(
        (n) => n.userId === userId && n.category === category.toLowerCase()
      )
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async updateNote(
    noteId: string,
    userId: string,
    title?: string,
    content?: string,
    category?: string
  ) {
    const n = await this.getNoteById(noteId, userId);
    if (!n) throw new Error("Note not found");
    if (title !== undefined) n.title = title;
    if (content !== undefined) n.content = content;
    if (category !== undefined) n.category = category.toLowerCase();
    n.updatedAt = new Date().toISOString();
    notes.set(noteId, n);
    return n;
  }

  async deleteNote(noteId: string, userId: string) {
    const n = await this.getNoteById(noteId, userId);
    if (!n) throw new Error("Note not found");
    notes.delete(noteId);
    return;
  }

  async searchNotes(userId: string, query: string) {
    const q = query.toLowerCase();
    return Array.from(notes.values())
      .filter(
        (n) =>
          n.userId === userId &&
          (n.title.toLowerCase().includes(q) ||
            n.content.toLowerCase().includes(q))
      )
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
}

export const noteService = new NoteService();
