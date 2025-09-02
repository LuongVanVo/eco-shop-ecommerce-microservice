import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { prisma } from "../config/database.config";

const hashToken = (token: string) =>
  crypto.createHash("sha256").update(token).digest("hex");

export async function validateRefreshTokenMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // 1. Lấy refresh token từ header Authorization
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Missing refresh token" });
    }

    const refreshToken = authHeader.split(" ")[1] as string;
    const tokenHash = hashToken(refreshToken);

    // 2. Tìm trong DB
    const storedToken = await prisma.refreshToken.findFirst({
      where: { tokenHash: tokenHash },
      include: { user: true }, // nếu cần lấy info user
    });

    // 3. Check hợp lệ
    if (!storedToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    if (storedToken.revoked) {
      return res.status(401).json({ message: "Token revoked" });
    }

    if (storedToken.expiresAt < new Date()) {
      return res.status(401).json({ message: "Token expired" });
    }

    // 4. Gắn vào request để route dùng
    (req as any).refreshToken = storedToken;
    (req as any).user = storedToken.user;

    next();
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err });
  }
}
