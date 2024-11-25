import { InputRegister, User } from "../user";
import db from "../lib/datasource";
import * as argon2 from "argon2";
import { SignJWT } from "jose";
import * as dotenv from "dotenv";

dotenv.config();

export class UserService {
  private userRepository;

  constructor() {
    this.userRepository = db.getRepository(User);
  }

  static emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  async findUserByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error("Utilisateur inconnu.");
    }
    return user;
  }

  async getUserProfile(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    return user;
  }

  // créer un nouvel utilisateur
  async createUser({
    email,
    password,
    username,
    verificationCode,
  }: InputRegister) {
    const existingUser = await this.findUserByEmail(email);
    if (existingUser) {
      throw new Error("Vous avez déjà un compte, veuillez vous connecter.");
    }

    // hachage du mot de passe
    const hashedPassword = await argon2.hash(password);

    // on vérifie le format de l'email
    if (!UserService.emailRegex.test(email)) {
      throw new Error("L'adresse email n'est pas bon au format !");
    }

    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      username,
      verificationCode,
    });

    return await this.userRepository.save(user);
  }

  async verifyUser(email: string, password: string): Promise<User> {
    // on vérifie le format de l'email
    if (!UserService.emailRegex.test(email)) {
      throw new Error("L'adresse email n'est pas bon au format !");
    }

    const user = await this.findUserByEmail(email);
    const messageError = "E-mail et/ou mot de passe incorrect.";

    if (!user) {
      throw new Error(messageError);
    }

    if (!user.isVerified) {
      throw new Error(
        "Votre compte n'est pas vérifié. Veuillez vérifier votre e-mail."
      );
    }

    const verifyPassword = await argon2.verify(user.password, password);

    if (!verifyPassword) {
      throw new Error(messageError);
    }

    return user;
  }

  async genereToken(user: User) {
    const jwtSecret = process.env.JWT_PRIVATE_KEY;

    if (!jwtSecret) {
      throw new Error("La clé secrète JWT n'est pas définie.");
    }

    // généré un token JWT
    const token = await new SignJWT({ email: user.email })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("12h")
      .sign(new TextEncoder().encode(jwtSecret));

    return token;
  }

  // supprimer son compte
  async deleteUser(id: string) {
    await this.findUserById(id);
    return await this.userRepository.delete(id);
  }

  async verifyAccount(email: string, code: string): Promise<User> {
    const user = await this.findUserByEmail(email);

    if (!user) {
      throw new Error("Utilisateur introuvable.");
    }

    if (user.verificationCode !== code) {
      throw new Error("Code de vérification incorrect.");
    }

    user.isVerified = true;
    user.verificationCode = "";

    return await this.userRepository.save(user);
  }
}
