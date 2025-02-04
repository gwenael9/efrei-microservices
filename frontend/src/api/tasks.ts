import { apiClientTasks } from "./apiClient";

// voir nos tâches
export const getTasks = async () => {
  try {
    const response = await apiClientTasks.get("/tasks");
    return response.data;
  } catch (err) {
    console.error("Failed to fetch tasks");
    throw err;
  }
};

// voir une tâche
export const getTask = async (taskId: string) => {
  try {
    const response = await apiClientTasks.get(`/tasks/${taskId}`);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch tasks");
    throw err;
  }
};

// nouvelle tâche
export const addTask = async (taskData: {
  title: string;
  description: string;
}) => {
  try {
    const response = await apiClientTasks.post("/tasks", taskData);
    return response.data;
  } catch (err) {
    console.error("Failed to add task");
    throw err;
  }
};

// modifier une tâche
export const updateTask = async (
  taskId: number,
  updateData: {
    title: string;
    description: string;
  }
) => {
  try {
    const response = await apiClientTasks.put(`/tasks/${taskId}`, updateData);
    return response.data;
  } catch (err) {
    console.error("Failed to update task");
    throw err;
  }
};

// supprime une tâche
export const deleteTask = async (taskId: string) => {
  try {
    const response = await apiClientTasks.delete(`/tasks/${taskId}`);
    return response.data.message;
  } catch (err) {
    console.error("Failed to delete task");
    throw err;
  }
};
