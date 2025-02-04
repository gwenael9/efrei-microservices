import { apiClientAuthent } from "./apiClient";

// connexion
export const register = async (email: string, username: string, password: string) => {
  const response = await apiClientAuthent.post("/register", { email, username, password });
  return response.data;
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
}
