import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useToast } from "../ui/use-toast";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { User } from "../../types/interface";
import { getUser, logout } from "../../api/users";
import React from "react";

export function Header() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const { toast } = useToast();

  const fetchUser = async () => {
    try {
      const userData = await getUser();
      setUser(userData);
    } catch (err) {
      setUser(null);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      router.push("/");
      toast({
        title: "Aurevoir !",
        variant: "success"
      });
    } catch (err) {
      toast({
        title: "Erreur lors de la déconnexion. Veuillez Réessayer.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="flex uppercase font-bold justify-between items-center h-20 border-b px-4">
      <Link href="/">Accueil</Link>
      <div className="flex items-center gap-4">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt={user.username}
                />
                <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 font-semibold" align="end">
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => router.push("/taches")}
              >
                Tâches
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => router.push("/parametres")}
              >
                Paramètres
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1 border-t" />
              <DropdownMenuItem
                className="cursor-pointer text-destructive"
                onClick={handleLogout}
              >
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button onClick={() => router.push("/auth")}>Connexion</Button>
        )}
      </div>
    </div>
  );
}
