"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { signInWithGoogle, signUpWithPassword } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    const result = await signUpWithPassword(fullName, email, password);
    setLoading(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Compte créé. Vérifiez votre courriel si la confirmation est activée.");
  }

  return (
    <div className="flex justify-center bg-[#fffaf1] px-4 py-16 dark:bg-background">
      <Card className="w-full max-w-md border-slate-200 shadow-xl shadow-slate-900/10">
        <CardHeader>
          <p className="inline-flex w-fit rounded-full bg-orange-100 px-3 py-1 text-xs font-extrabold text-orange-700">
            Compte
          </p>
          <CardTitle className="font-space text-2xl font-extrabold">Créer un compte</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="space-y-3" onSubmit={onSubmit}>
            <div className="space-y-1.5">
              <Label htmlFor="name">Nom complet</Label>
              <Input
                id="name"
                required
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Courriel</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                minLength={8}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <Button className="w-full" disabled={loading}>
              {loading ? "Création…" : "S'inscrire"}
            </Button>
          </form>
          <Separator />
          <form action={async () => signInWithGoogle()}>
            <Button type="submit" variant="outline" className="w-full">
              Continuer avec Google
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground">
            Déjà inscrit?{" "}
            <Link href="/connexion" className="text-foreground underline">
              Se connecter
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
