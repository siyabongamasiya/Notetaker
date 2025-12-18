import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { pool } from "../db";

const JWT_SECRET = process.env.JWT_SECRET || "default-secret";

export class AuthService {
  async register(email: string, username: string, password: string) {
    const existing = await pool.query(
      'SELECT id FROM "User" WHERE email = $1',
      [email]
    );

    if ((existing.rowCount ?? 0) > 0) {
      throw new Error("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuidv4();

    const result = await pool.query(
      `
      INSERT INTO "User" (
        id,
        email,
        username,
        password,
        "createdAt",
        "updatedAt"
      )
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING id, email, username
      `,
      [id, email, username, hashedPassword]
    );

    const user = result.rows[0];

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1d",
    });

    return { user, token };
  }

  async login(email: string, password: string) {
    const result = await pool.query(
      'SELECT id, email, username, password FROM "User" WHERE email = $1',
      [email]
    );

    if ((result.rowCount ?? 0) === 0) {
      throw new Error("User not found");
    }

    const user = result.rows[0];

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error("Invalid password");
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      token,
    };
  }

  async getUserById(userId: string) {
    const result = await pool.query(
      'SELECT id, email, username FROM "User" WHERE id = $1',
      [userId]
    );

    if ((result.rowCount ?? 0) === 0) {
      return null;
    }

    return result.rows[0];
  }

  async updateProfile(userId: string, email?: string, username?: string) {
    if (!email && !username) {
      throw new Error("Nothing to update");
    }

    if (email) {
      const existing = await pool.query(
        'SELECT id FROM "User" WHERE email = $1 AND id != $2',
        [email, userId]
      );

      if ((existing.rowCount ?? 0) > 0) {
        throw new Error("Email already in use");
      }
    }

    const result = await pool.query(
      `
      UPDATE "User"
      SET
        email = COALESCE($1, email),
        username = COALESCE($2, username),
        "updatedAt" = NOW()
      WHERE id = $3
      RETURNING id, email, username
      `,
      [email ?? null, username ?? null, userId]
    );

    if ((result.rowCount ?? 0) === 0) {
      throw new Error("User not found");
    }

    return result.rows[0];
  }
}

export const authService = new AuthService();
