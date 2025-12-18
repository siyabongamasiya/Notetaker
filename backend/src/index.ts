import cors from "cors";
import "dotenv/config";
import express from "express";
import authRouter from "./routes/authRoutes";
import notesRouter from "./routes/noteRoutes";
import { Request, Response } from "express";
const app = express();
const PORT = process.env.PORT || 4000;


app.use(cors());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/notes", notesRouter);


app.get("/", (req: Request, res: Response) => {
  res.json({ status: "ok", message: "Notetaker backend running" });
});


app.listen(PORT, () => {
  console.log(`✓ Backend listening on http://localhost:${PORT}`);
  console.log(`✓ API endpoints:`);
  console.log(`  POST   /api/auth/register`);
  console.log(`  POST   /api/auth/login`);
  console.log(`  GET    /api/notes`);
});
