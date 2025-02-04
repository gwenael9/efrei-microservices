import { X } from "lucide-react";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import FormTasks from "./task.form";
import React from "react";
import { Task } from "../../types/interface";
import { deleteTask } from "../../api/tasks";

interface TaskCardProps {
  task: Task;
  onSuccess: () => void;
}

export default function TaskCard({ task, onSuccess }: TaskCardProps) {
  const { toast } = useToast();

  // supprimer une tâche
  const handleDeleteTask = async (id: string) => {
    try {
      const messageDelete = await deleteTask(id);
      onSuccess();
      toast({
        title: messageDelete,
        variant: "success",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Erreur lors de la suppression.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className={`border-4`}>
      <CardHeader className="font-bold">
        <CardTitle className="flex justify-between min-h-12 text-y">
          {task.title.toUpperCase()}
        </CardTitle>
      </CardHeader>
      <CardContent>{task.description}</CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center gap-4">
          <FormTasks
            initialData={task}
            submitLabel="Modifier"
            onSuccess={onSuccess}
          />
          <Button
            variant="delete"
            size="card"
            onClick={() => handleDeleteTask(task.id)}
          >
            <X />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
