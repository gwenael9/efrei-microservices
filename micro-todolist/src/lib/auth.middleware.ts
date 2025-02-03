import { Request, Response, NextFunction } from "express";
import axios from "axios";
import Cookies from "cookies";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; email: string } | null;
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

  console.log("tokeeeen", token);

  try {
    // Vérifier le token en appelant le microservice d'authentification
    const response = await axios.get("http://localhost:4000/me", {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });

    console.log("Réponse de l'authentification : ", response.data);

    req.user = response.data;
    next();
  } catch (error) {
    res.status(401).json({ message: (error as Error).message });
    return;
  }
};
