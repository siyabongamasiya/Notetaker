import { Request, Response } from "express";
import { noteService } from "../services/NoteService";

export class NoteController {
  async createNote(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { title, content, category } = req.body;

      if (!title || !content) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const note = await noteService.createNote(
        userId,
        title,
        content,
        category
      );

      return res.status(201).json(note);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getNotes(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const notes = await noteService.getNotesByUser(userId);
      return res.status(200).json(notes);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getNotesByCategory(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { category } = req.params;

      const notes = await noteService.getNotesByCategory(userId, category);
      return res.status(200).json(notes);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getNoteById(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { id } = req.params;

      const note = await noteService.getNoteById(id, userId);
      return res.status(200).json(note);
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  }

  async updateNote(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { id } = req.params;
      const { title, content, category } = req.body;

      const note = await noteService.updateNote(
        id,
        userId,
        title,
        content,
        category
      );

      return res.status(200).json(note);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async deleteNote(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { id } = req.params;

      await noteService.deleteNote(id, userId);
      return res.status(200).json({ message: "Note deleted successfully" });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async searchNotes(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { query } = req.query;

      if (!query) {
        return res.status(400).json({ error: "Query is required" });
      }

      const notes = await noteService.searchNotes(userId, query as string);

      return res.status(200).json(notes);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export const noteController = new NoteController();
