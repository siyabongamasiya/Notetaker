import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

const JWT_SECRET = process.env.JWT_SECRET || "default-secret";

type UserRecord = {
  id: string;
  email: string;
  username: string;
  password: string; // hashed
  createdAt: string;
  updatedAt: string;
};

const users = new Map<string, UserRecord>();
const usersByEmail = new Map<string, string>();

export class AuthService {
  async register(email: string, username: string, password: string) {
    if (usersByEmail.has(email)) throw new Error("Email already registered");
    const hashed = await bcrypt.hash(password, 10);
    const id = uuidv4();
    const now = new Date().toISOString();
    const user: UserRecord = {
      id,
      email,
      username,
      password: hashed,
      createdAt: now,
      updatedAt: now,
    };
    users.set(id, user);
    usersByEmail.set(email, id);

    const token = jwt.sign({ userId: id, email }, JWT_SECRET, {
      expiresIn: "7d",
    });
    return { user: { id, email, username }, token };
  }

  async login(email: string, password: string) {
    const id = usersByEmail.get(email);
    if (!id) throw new Error("User not found");
    const user = users.get(id)!;
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new Error("Invalid password");
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });
    return {
      user: { id: user.id, email: user.email, username: user.username },
      token,
    };
  }

  async getUserById(userId: string) {
    const u = users.get(userId);
    if (!u) return null;
    return { id: u.id, email: u.email, username: u.username };
  }

  async updateProfile(userId: string, email?: string, username?: string) {
    const u = users.get(userId);
    if (!u) throw new Error("User not found");
    if (email && email !== u.email) {
      if (usersByEmail.has(email)) throw new Error("Email already in use");
      usersByEmail.delete(u.email);
      usersByEmail.set(email, userId);
      u.email = email;
    }
    if (username) u.username = username;
    u.updatedAt = new Date().toISOString();
    users.set(userId, u);
    return { id: u.id, email: u.email, username: u.username };
  }
}

export const authService = new AuthService();
