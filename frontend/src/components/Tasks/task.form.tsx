import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useToast } from "../ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Pencil, Plus } from "lucide-react";
import React from "react";
import { Task } from "../../types/interface";
import { addTask, updateTask } from "../../api/tasks";

const formSchema = z.object({
  title: z
    .string()
    .min(2, "Le titre doit contenir au moins 2 caractères.")
    .max(20, "Le titre ne peut dépasser 20 caractères."),
  description: z
    .string()
    .min(5, "La description doit contenir au moins 5 caractères."),
});

interface TaskFormProps {
  initialData?: Task;
  submitLabel: string;
  onSuccess: () => void;
}

export default function FormTasks({
  initialData,
  submitLabel,
  onSuccess,
}: TaskFormProps) {
  // Sois on récup les valeurs de la tâche à modifier sois vide
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );

  // gère l'ouverture de la modal
  const [isOpen, setIsOpen] = useState(false);

  // gère les erreurs
  const [error, setError] = useState<{
    title?: string;
    description?: string;
    categorie?: string;
  }>({});

  const { toast } = useToast();

  // soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError({});

    // on vérifie que nos données soit valide
    const validation = formSchema.safeParse({ title, description });

    // si pas valide, on renvoie une erreur
    if (!validation.success) {
      const fieldErrors = validation.error.formErrors.fieldErrors;
      setError({
        title: fieldErrors.title ? fieldErrors.title[0] : "",
        description: fieldErrors.description ? fieldErrors.description[0] : "",
      });
      return;
    }

    // on modifie/ajoute la tâche
    try {
      if (initialData) {
        // mise à jour de la tâche
        await updateTask(initialData.id, {
          title,
          description,
        });
        toast({
          title: "Tâche modifiée avec succès !",
          variant: "success",
        });
      } else {
        // ajout de la nouvelle tâche
        await addTask({
          title,
          description,
        });
        toast({
          title: `La tâche "${title}" a été créée avec succès !`,
          variant: "success",
        });
        setTitle("");
        setDescription("");
      }
      // si tout est bon, le refetch de nos tasks est faites (page /taches)
      onSuccess();
      // on ferme la modal
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Une erreur est survenue.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
      }}
    >
      <DialogTrigger asChild>
        {initialData ? (
          <Button variant="edit" size="card">
            <Pencil size={16} />
          </Button>
        ) : (
          <Button>
            <Plus className="mr-2" />
            Ajouter une tâche
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Modifier la tâche" : "Nouvelle tâche"}
          </DialogTitle>
          <DialogDescription>
            Veuillez renseigner les informations suivantes.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nom
              </Label>
              <Input
                id="name"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
              />
            </div>
            {error.title && (
              <p className="col-span-4 text-red-500 text-sm">{error.title}</p>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
            {error.description && (
              <p className="col-span-4 text-red-500 text-sm">
                {error.description}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="success" type="submit">
              {submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
