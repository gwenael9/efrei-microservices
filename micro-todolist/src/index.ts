import express from "express";
import cors from "cors";
import taskRoutes from "./tasks.routes";
import * as dotenv from "dotenv";
import db from "./lib/datasource";

dotenv.config();

export interface Payload {
  id: string;
}

const app = express();
const PORT = 5001;

app.use(express.json());
app.use(
  "/",
  cors<cors.CorsRequest>({
    origin: ["http://localhost:4000", "http://localhost:3000"],
    credentials: true,
  }),
  express.json()
);


// initialiser la base de données
db.initialize()
.then(() => {
    app.use("/tasks", taskRoutes);

    app.listen(PORT, () => {
      console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Erreur lors de la connexion à la base de données:", error);
  });


