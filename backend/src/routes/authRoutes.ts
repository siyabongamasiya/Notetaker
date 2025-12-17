import { Router } from "express";
import { authController } from "../controllers/AuthController";
import { authMiddleware } from "../middleware/authMiddleware";
import { Request, Response } from "express";
const authRouter = Router();

// Public routes
authRouter.post("/register", (req : Request, res : Response) => authController.register(req, res));
authRouter.post("/login", (req: Request, res: Response) =>
  authController.login(req, res)
);

// Protected routes
authRouter.get("/profile", authMiddleware, (req : Request, res : Response) =>
  authController.getProfile(req, res)
);
authRouter.put("/profile", authMiddleware, (req: Request, res: Response) =>
  authController.updateProfile(req, res)
);

export default authRouter;
