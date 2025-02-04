import React from "react";
import { useEffect, useState } from "react";
import { Task } from "../types/interface";
import { getTasks } from "../api/tasks";
import Loading from "../components/Loading";
import Layout from "../components/Layout/Layout";
import FormTasks from "../components/Tasks/task.form";
import TaskCard from "../components/Tasks/task.card";

export default function Taches() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const tasksData = await getTasks();
      setTasks(tasksData);
    } catch (err) {
      setError("Erreur lors du chargement des tâches.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <Loading />;

  if (error) {
    return (
      <Layout title="Erreur de chargement">
        <p className="text-center mt-5">{error}</p>
      </Layout>
    );
  }

  return (
    <Layout title="Mes tâches">
      <div className="p-6">
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold mb-6">Liste des tâches</h2>
          <FormTasks submitLabel="Confirmer" onSuccess={() => fetchData()} />
        </div>

        {tasks.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onSuccess={() => fetchData()}
              />
            ))}
          </div>
        ) : (
          <div className="text-center mt-5">Aucune tâche pour le moment.</div>
        )}
      </div>
    </Layout>
  );
}
