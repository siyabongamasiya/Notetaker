import { Request, Response } from "express";
import { authService } from "../services/AuthService";

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { email, username, password } = req.body;
      if (!email || !username || !password) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const result = await authService.register(email, username, password);
      return res.status(201).json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const result = await authService.login(email, password);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(401).json({ error: error.message });
    }
  }

  async getProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const user = await authService.getUserById(userId);
      return res.status(200).json(user);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async updateProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { email, username } = req.body;

      const user = await authService.updateProfile(userId, email, username);
      return res.status(200).json(user);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export const authController = new AuthController();
