import { DataSource } from "typeorm";
import { User } from "../user";

const db = new DataSource({
  type: "sqlite",
  database: "./userDb.sqlite3",
  entities: [User],
  synchronize: true,
  logging: true,
});

export default db;
