import { DataSource } from "typeorm";
import { Task } from "../tasks";

const db = new DataSource({
  type: "sqlite",
  database: "./taskDb.sqlite3",
  entities: [Task],
  synchronize: true,
  logging: true,
});

export default db;
