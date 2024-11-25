import { UserService } from "./services/user.service";
import Cookies from "cookies";
import { Request, Response } from "express";
import { InputLogin, InputRegister, User } from "./user";
import { randomInt } from "crypto";
import { MailService } from "./services/mail.service";

const userService = new UserService();
const mailService = new MailService();

export class UserController {
  // création de compte
  static async register(req: Request, res: Response) {
    const infos: InputRegister = req.body;
    try {
      const verificationCode = randomInt(100000, 999999).toString();
      const user = await userService.createUser({
        ...infos,
        verificationCode,
        isVerified: false,
      });

      // Envoyer le code par e-mail via le microservice de mail
      await mailService.sendEmail({
        to: user.email,
        subject: "Vérifiez votre compte",
        body: `Votre code de vérification est : ${verificationCode}`,
      });

      res.status(201).json({
        message:
          "Votre compte a bien été créé ! Un code de vérification a été envoyé par e-mail.",
      });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  // connexion ==> retourne un message
  static async login(req: Request, res: Response) {
    const infos: InputLogin = req.body;
    try {
      // vérifier si l'user existe et que le mot de passe est correct
      const user = await userService.verifyUser(infos.email, infos.password);

      if (!user) {
        res
          .status(400)
          .json({ message: "E-mail et/ou mot de passe incorrect." });
      }

      // on créé le token
      const token = await userService.genereToken(user);

      // on le place dans les cookies
      const cookies = new Cookies(req, res);
      cookies.set("token", token, { httpOnly: true });

      res.status(200).json({ message: `Bienvenue ${user.username} !` });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  // déconnexion ==> retourne un message
  static async logout(req: Request, res: Response) {
    try {
      const cookies = await new Cookies(req, res);
      cookies.set("token");

      res.status(200).json({ message: "Déconnexion réussite." });
    } catch (err) {
      res.status(500).json({ message: "Erreur lors de la déconnexion." });
    }
  }

  // obtenir le profil de l'user connecté
  static async getProfile(req: Request, res: Response) {
    const user = req.user;

    // si aucun user connecté
    if (!user) {
      res.status(400).json({ message: "Utilisateur inconnu." });
      return;
    }

    try {
      const userWithEmailAndUserName = await userService.getUserProfile(
        user.id
      );
      res.status(200).json(userWithEmailAndUserName);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  // supprimer un user
  static async deleteUser(req: Request, res: Response) {
    const { id } = req.params;

    try {
      await userService.deleteUser(id);
      res.status(200).json({ message: "L'utilisateur a bien été supprimé." });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  // vérification du compte via code
  static async verifyAccount(req: Request, res: Response) {
    const { email, code } = req.body;

    try {
      await userService.verifyAccount(email, code);

      res.status(200).json({ message: "Compte vérifié avec succès !" });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
}
