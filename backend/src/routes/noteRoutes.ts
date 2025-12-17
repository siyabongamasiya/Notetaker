import { Router } from "express";
import { noteController } from "../controllers/NoteController";
import { authMiddleware } from "../middleware/authMiddleware";
import { Request, Response } from "express";
const notesRouter = Router();

// All note routes require authentication
notesRouter.use(authMiddleware);

notesRouter.post("/", (req : Request, res : Response) => noteController.createNote(req, res));
notesRouter.get("/", (req: Request, res: Response) =>
  noteController.getNotes(req, res)
);
notesRouter.get("/category/:category", (req: Request, res: Response) =>
  noteController.getNotesByCategory(req, res)
);
notesRouter.get("/search", (req: Request, res: Response) =>
  noteController.searchNotes(req, res)
);
notesRouter.get("/:id", (req: Request, res: Response) =>
  noteController.getNoteById(req, res)
);
notesRouter.put("/:id", (req: Request, res: Response) =>
  noteController.updateNote(req, res)
);
notesRouter.delete("/:id", (req: Request, res: Response) =>
  noteController.deleteNote(req, res)
);

export default notesRouter;
