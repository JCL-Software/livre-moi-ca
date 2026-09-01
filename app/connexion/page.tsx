"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { signInWithGoogle, signInWithPassword } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/tableau-de-bord";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    const result = await signInWithPassword(email, password);
    setLoading(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <Card className="w-full max-w-md border-slate-200 shadow-xl shadow-slate-900/10">
      <CardHeader>
        <p className="inline-flex w-fit rounded-full bg-orange-100 px-3 py-1 text-xs font-extrabold text-orange-700">
          Compte
        </p>
        <CardTitle className="font-space text-2xl font-extrabold">Connexion</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form className="space-y-3" onSubmit={onSubmit}>
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
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <Button className="w-full" disabled={loading}>
            {loading ? "Connexion…" : "Se connecter"}
          </Button>
        </form>
        <Separator />
        <form action={async () => signInWithGoogle(next)}>
          <Button type="submit" variant="outline" className="w-full">
            Continuer avec Google
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          Pas encore de compte?{" "}
          <Link href="/inscription" className="text-foreground underline">
            Créer un compte
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="flex justify-center bg-[#fffaf1] px-4 py-16 dark:bg-background">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
