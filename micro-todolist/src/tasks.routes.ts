import { Router } from "express";
import { authMiddleware } from "./lib/auth.middleware";
import { TasksController } from "./tasks.resolver";

const router = Router();

router.get("/", authMiddleware, TasksController.getAllTasks);
router.get("/:id", authMiddleware, TasksController.getOneTask);
router.post("/", authMiddleware, TasksController.createTask);
router.put("/:id", authMiddleware, TasksController.updateTask);
router.delete("/:id", authMiddleware, TasksController.deleteTask);

export default router;
