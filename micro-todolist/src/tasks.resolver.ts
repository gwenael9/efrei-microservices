import { Request, Response } from "express";
import { TasksService } from "./services/tasks.service";

const taskService = new TasksService();

export class TasksController {
  static async getAllTasks(req: Request, res: Response) {
    try {
      const tasks = await taskService.getAllTasks(req.user?.id ?? "");
      res.json(tasks);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erreur lors de la récupération des tâches" });
    }
  }
  static async getOneTask(req: Request, res: Response) {
    try {
      const task = await taskService.getOneTask(req.user!.id, req.params.id);
      res.json(task);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erreur lors de la récupération de la tâche" });
    }
  }

  static async createTask(req: Request, res: Response) {
    try {
      const task = await taskService.createTask({
        ...req.body,
        userId: req.user?.id,
      });
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la création de la tâche" });
    }
  }

  static async deleteTask(req: Request, res: Response) {
    try {
      await taskService.deleteTask(req.user?.id ?? "", req.params.id);
      res.status(204).send();
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erreur lors de la suppression de la tâche" });
    }
  }

  static async updateTask(req: Request, res: Response) {
    try {
      const updatedTask = await taskService.updateTask(req.params.id, {
        ...req.body,
        userId: req.user?.id,
      });
      res.json(updatedTask);
    } catch (error) {
      res.status(500).json({
        error: (error as Error).message || "Erreur lors de la mise à jour",
      });
    }
  }
}
