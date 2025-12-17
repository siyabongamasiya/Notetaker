import { Router } from "express";
import { noteController } from "../controllers/NoteController";
import { authMiddleware } from "../middleware/authMiddleware";
import { Request, Response } from "express";
const notesRouter = Router();

// All note routes require authentication
notesRouter.use(authMiddleware);

notesRouter.post("/", (req, res) => noteController.createNote(req, res));
notesRouter.get("/", (req, res) => noteController.getNotes(req, res));
notesRouter.get("/category/:category", (req, res) =>
  noteController.getNotesByCategory(req, res)
);
notesRouter.get("/search", (req, res) => noteController.searchNotes(req, res));
notesRouter.get("/:id", (req, res) => noteController.getNoteById(req, res));
notesRouter.put("/:id", (req, res) => noteController.updateNote(req, res));
notesRouter.delete("/:id", (req, res) => noteController.deleteNote(req, res));

export default notesRouter;
