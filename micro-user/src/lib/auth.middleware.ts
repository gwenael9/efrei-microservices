import { Request, Response, NextFunction } from "express";
import Cookies from "cookies";
import { UserService } from "../services/user.service";
import { jwtVerify } from "jose";
import { Payload } from "..";
import { User } from "../user";

const userService = new UserService();

declare global {
  namespace Express {
    interface Request {
      user?: User | null;
    }
  }
}

// vérifier si l'user est connecté
export const lookToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user) {
    res.status(400).json({ message: "Vous êtes déjà connecté." });
    return;
  }
  next();
};

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let user: User | null = null;
  const cookies = new Cookies(req, res);
  const token = cookies.get("token");

  console.log("tokeeeen", token);

  if (token) {
    try {
      const verify = await jwtVerify<Payload>(
        token,
        new TextEncoder().encode(process.env.JWT_PRIVATE_KEY)
      );
      // si le token est lié à un user, on le stock dans notre context
      user = await userService.findUserByEmail(verify.payload.email);
      req.user = user;
    } catch (err) {
      console.log("erroooooooor", err);
      // supprime le token si invalide
      cookies.set("token");
    }
  }

  next();
};
