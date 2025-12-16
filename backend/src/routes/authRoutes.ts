import { Router } from "express";
import { authController } from "../controllers/AuthController";
import { authMiddleware } from "../middleware/authMiddleware";

const authRouter = Router();

// Public routes
authRouter.post("/register", (req, res) => authController.register(req, res));
authRouter.post("/login", (req, res) => authController.login(req, res));

// Protected routes
authRouter.get("/profile", authMiddleware, (req, res) =>
  authController.getProfile(req, res)
);
authRouter.put("/profile", authMiddleware, (req, res) =>
  authController.updateProfile(req, res)
);

export default authRouter;
