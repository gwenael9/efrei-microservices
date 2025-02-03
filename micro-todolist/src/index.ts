import express from "express";
import cors from "cors";
import taskRoutes from "./tasks.routes";

const app = express();

app.use(express.json());
app.use(
  "/",
  cors<cors.CorsRequest>({
    origin: "http://localhost:4000",
    credentials: true,
  }),
  express.json()
);

// Routes protégées
app.use("/tasks", taskRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Serveur Task en écoute sur le port ${PORT}`);
});
