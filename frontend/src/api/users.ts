import { isAxiosError } from "axios";
import { apiClientAuthent } from "./apiClient";

// connexion
export const register = async (
  email: string,
  username: string,
  password: string
) => {
  try {
    const response = await apiClientAuthent.post("/register", {
      email,
      username,
      password,
    });
    return { success: true, message: response.data.message };
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      return { success: false, message: error.response.data.message };
    }
    return {
      success: false,
      message: "Une erreur est survenue lors de l'inscription.",
    };
  }
};

// connexion
export const login = async (email: string, password: string) => {
  const response = await apiClientAuthent.post("/login", { email, password });
  return response.data.message;
};

// deconnexion
export const logout = async () => {
  const response = await apiClientAuthent.get("/logout");
  return response.data;
};

// recup les infos de l'utilisateur connecté
export const getUser = async () => {
  const response = await apiClientAuthent.get("/me");
  return response.data;
};

export const verify = async (code: string) => {
  const response = await apiClientAuthent.post("/verify", { code });
  return response.data.message;
};
