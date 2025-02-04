import Layout from "@/components/Layout/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm, FormProvider } from "react-hook-form"; // Ajout de FormProvider
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { verify } from "@/api";
import { useRouter } from "next/router";
import { useToast } from "@/components/ui/use-toast";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function Verify() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);

  // Schéma de validation du formulaire
  const formSchema = z.object({
    code: z.string().length(6, "Le code doit contenir exactement 6 chiffres"),
  });

  const formMethods = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const message = await verify(values.code);
      toast({ title: message, variant: "success" });
      router.push("/auth");
    } catch (error) {
      toast({ title: (error as Error).message, variant: "destructive" });
    }
  };

  return (
    <Layout title="Vérifier votre compte">
      <div className="flex justify-center mt-5">
        <Card className="w-[500px]">
          <CardHeader>
            <CardTitle>Veuillez vérifier votre compte</CardTitle>
            <CardDescription>
              Un code à 6 chiffres vous a été envoyé par mail
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormProvider {...formMethods}>
              <form
                onSubmit={formMethods.handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <FormField
                  control={formMethods.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={6}
                          placeholder="000000"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button variant="success" disabled={loading} type="submit">
                    {loading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Vérifier"
                    )}
                  </Button>
                </div>
              </form>
            </FormProvider>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
