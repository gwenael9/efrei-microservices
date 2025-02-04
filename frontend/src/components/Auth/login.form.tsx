import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useRouter } from "next/router";
import { useToast } from "../ui/use-toast";
import Loading from "../Loading";
import React from "react";
import { login } from "../../api/users";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const message = await login(email, password);
      router.push("/taches");
      setLoading(false);
      toast({
        title: message,
        variant: "success"
      });
    } catch (err) {
      setLoading(false);
      toast({
        title: "Une erreur est sourvenue. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="font-bold">Connexion</h2>
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <div>
          <Input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
            required
          />
        </div>
        <div>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="flex-1"
            required
          />
        </div>

        <Button variant="success" type="submit">
          Connexion
        </Button>
      </form>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
