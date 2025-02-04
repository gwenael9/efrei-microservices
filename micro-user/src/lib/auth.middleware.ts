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
) => {
  const cookies = new Cookies(req, res);
  const token = cookies.get("token");

  if (token) {
    try {
      const verify = await jwtVerify<Payload>(
        token,
        new TextEncoder().encode(process.env.JWT_PRIVATE_KEY)
      );
      const user = await userService.findUserById(verify.payload.id);
      req.user = user;
    } catch (err) {
      console.error("Erreur de vérification du token:", err);
      cookies.set("token"); // Si le token est invalide, on le supprime
    }
  } else {
    console.log("Aucun token trouvé dans les cookies.");
  }
  next();
};

