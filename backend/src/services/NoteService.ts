import { v4 as uuidv4 } from "uuid";
import { pool } from "../db";

export class NotesService {
  async createNote(
    userId: string,
    title: string,
    content: string,
    category?: string
  ) {
    const id = uuidv4();
    const now = new Date();

    const result = await pool.query(
      `
      INSERT INTO "Note" (id, "userId", title, content, category, "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
      `,
      [id, userId, title, content, category ?? null, now, now]
    );

    return result.rows[0];
  }

  async getNotesByUser(userId: string) {
    const result = await pool.query(
      `
      SELECT *
      FROM "Note"
      WHERE "userId" = $1
      ORDER BY "createdAt" DESC
      `,
      [userId]
    );

    return result.rows;
  }

  async getNotesByCategory(userId: string, category: string) {
    const result = await pool.query(
      `
      SELECT *
      FROM "Note"
      WHERE "userId" = $1 AND category = $2
      ORDER BY "createdAt" DESC
      `,
      [userId, category]
    );

    return result.rows;
  }

  async getNoteById(noteId: string, userId: string) {
    const result = await pool.query(
      `
      SELECT *
      FROM "Note"
      WHERE id = $1 AND "userId" = $2
      `,
      [noteId, userId]
    );

    if ((result.rowCount ?? 0) === 0) {
      throw new Error("Note not found");
    }

    return result.rows[0];
  }

  async updateNote(
    noteId: string,
    userId: string,
    title?: string,
    content?: string,
    category?: string
  ) {
    const result = await pool.query(
      `
      UPDATE "Note"
      SET
        title = COALESCE($1, title),
        content = COALESCE($2, content),
        category = COALESCE($3, category),
        "updatedAt" = NOW()
      WHERE id = $4 AND "userId" = $5
      RETURNING *
      `,
      [title ?? null, content ?? null, category ?? null, noteId, userId]
    );

    if ((result.rowCount ?? 0) === 0) {
      throw new Error("Note not found");
    }

    return result.rows[0];
  }

  async deleteNote(noteId: string, userId: string) {
    const result = await pool.query(
      `
      DELETE FROM "Note"
      WHERE id = $1 AND "userId" = $2
      `,
      [noteId, userId]
    );

    if ((result.rowCount ?? 0) === 0) {
      throw new Error("Note not found");
    }

    return { success: true };
  }

  async searchNotes(userId: string, query: string) {
    const result = await pool.query(
      `
      SELECT *
      FROM "Note"
      WHERE "userId" = $1
        AND (title ILIKE $2 OR content ILIKE $2)
      ORDER BY "createdAt" DESC
      `,
      [userId, `%${query}%`]
    );

    return result.rows;
  }
}

export const noteService = new NotesService();
