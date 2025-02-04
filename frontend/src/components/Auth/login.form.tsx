import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useRouter } from "next/router";
import { useToast } from "../ui/use-toast";
import React from "react";
import { login, register } from "../../api/users";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

export enum FormType {
  REGISTER = "REGISTER",
  LOGIN = "LOGIN",
}

type nameField = "username" | "email" | "password";

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [formType, setFormType] = useState<FormType>(FormType.LOGIN);
  const [formKey, setFormKey] = useState<number>(0);

  // schéma de validation du formulaire
  const formSchema = z.object({
    email: z.string().min(2, {
      message: "L'adresse mail doit être au bon format",
    }),
    username:
      formType === FormType.REGISTER
        ? z.string().min(2, {
            message: "Votre nom doit contenir au moins 2 caractères",
          })
        : z.string().optional(),
    password: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
  });

  const router = useRouter();
  const { toast } = useToast();

  const handleSwitchForm = () => {
    form.reset();
    setFormKey((prevKey) => prevKey + 1);
    setFormType(
      formType === FormType.REGISTER ? FormType.LOGIN : FormType.REGISTER
    );
  };

  const title =
    formType === FormType.LOGIN ? "Se connecter" : "Créer votre compte";

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // valeurs du formulaire
    const { email, username, password } = values;

    setLoading(true);
    // création de compte
    if (formType === FormType.REGISTER) {
      const response = await register(email, username ?? "", password);
      if (!response.success) {
        toast({
          title: response.message,
          variant: "destructive",
        });
        form.reset();
        setLoading(false);
        return;
      }
      toast({
        title: response.message,
        variant: "success",
      });
      // on redirige vers la page pour vérifier le compte
      router.push("/auth/verify");
    }
    // connexion
    else {
      try {
        const message = await login(email, password);
        toast({
          title: message,
          variant: "success",
        });
        router.push("/taches");
      } catch (error) {
        toast({
          title: (error as Error).message,
          variant: "destructive",
        });
      }
    }
    setLoading(false);
  };

  const formField = (name: nameField, label: string, placeholder?: string) => {
    let type: string;
    if (name == "password") {
      type = "password";
    }
    return (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Input type={type} placeholder={placeholder} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  return (
    <Card className="w-[500px]">
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>
          Veuillez renseigner les informations ci-dessous.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form key={formKey} {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {formField("email", "Email", "example@mail.com")}
            {formType === FormType.REGISTER && (
              <>{formField("username", "Nom", "Votre nom")}</>
            )}
            {formField("password", "Mot de passe")}
            <div className="flex justify-between items-center">
              <p className="text-xs text-center">
                {formType === FormType.REGISTER
                  ? "Vous avez déjà un compte ?"
                  : "Vous n'avez pas de compte ?"}{" "}
                <Button
                  type="button"
                  variant="link"
                  size="link"
                  className="text-xs"
                  onClick={handleSwitchForm}
                >
                  {formType === FormType.REGISTER
                    ? "Se connecter"
                    : "Créer un compte"}
                </Button>
              </p>
              <Button type="submit" variant="success" disabled={loading}>
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : formType === FormType.REGISTER ? (
                  "Créer un compte"
                ) : (
                  "Connexion"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
