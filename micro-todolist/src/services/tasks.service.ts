import db from "../lib/datasource";
import { InputCreate, Task } from "../tasks";

export class TasksService {
  private taskService;

  constructor() {
    this.taskService = db.getRepository(Task);
  }

  /**
   * Get All Tasks
   */
  async getAllTasks(id: string) {
    const tasks = await this.taskService.find({
      where: { userId: id },
    });
    return tasks;
  }

  /**
   * Get One Task
   */
  async getOneTask(userId: string, taskId: string) {
    const task = await this.taskService.findOne({
      where: { userId: userId, id: taskId },
    });
    return task;
  }

  /**
   * Create
   */
  async createTask({ title, description, userId }: InputCreate) {
    const task = this.taskService.create({
      title,
      description,
      userId,
    });

    return await this.taskService.save(task);
  }

  /**
   * Delete
   */
  async deleteTask(userId: string, taskId: string) {
    await this.getOneTask(userId, taskId);
    return await this.taskService.delete(taskId);
  }

  /**
   * Update
   */
  async updateTask(taskId: string, infos: Partial<Task>): Promise<Task> {
    const { title, description, userId } = infos;

    if (!userId) {
      throw new Error("UserId undefined");
    }

    const task = await this.getOneTask(userId, taskId);

    if (task?.userId !== userId) {
      throw new Error("Cette tâche ne vous appartient pas.");
    }

    if (title) task.title = title;
    if (description) task.description = description;

    return await this.taskService.save(task);
  }
}
