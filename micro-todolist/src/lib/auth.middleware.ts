import { Payload } from "..";
import { Request, Response, NextFunction } from "express";
import Cookies from "cookies";
import { jwtVerify } from "jose";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cookies = new Cookies(req, res);
  const token = cookies.get("token");

  if (!token) {
    res.status(401).json({ message: "Accès refusé, token manquant" });
    return;
  }

  try {
    // Vérifier le token
    const verify = await jwtVerify<Payload>(
      token,
      new TextEncoder().encode(process.env.JWT_PRIVATE_KEY)
    );

    req.userId = verify.payload.id;

    next();
  } catch (error) {
    res.status(401).json({ message: (error as Error).message });
    return;
  }
};
