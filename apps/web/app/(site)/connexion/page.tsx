"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { signInWithGoogle, signInWithPassword } from "@/lib/actions/auth";
import { AuthInput } from "@/components/ui/auth-input";
import {
  AuthDivider,
  AuthFooterLink,
  AuthFormShell,
  AuthGoogleButton,
  AuthLabel,
  AuthSubmitButton,
  LabelInputContainer,
} from "@/components/auth/auth-form";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/compte";
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
    <AuthFormShell title="Connexion">
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <LabelInputContainer>
          <AuthLabel htmlFor="email">Courriel</AuthLabel>
          <AuthInput
            id="email"
            placeholder="jean@exemple.com"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </LabelInputContainer>
        <LabelInputContainer>
          <AuthLabel htmlFor="password">Mot de passe</AuthLabel>
          <AuthInput
            id="password"
            placeholder="••••••••"
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </LabelInputContainer>

        <AuthSubmitButton disabled={loading}>
          {loading ? "Connexion…" : "Se connecter"}
        </AuthSubmitButton>
      </form>

      <AuthDivider />

      <div className="flex flex-col gap-4">
        <AuthGoogleButton action={async () => signInWithGoogle(next)} />

        <AuthFooterLink
          prompt="Mot de passe oublié ?"
          href="/mot-de-passe-oublie"
          label="Réinitialiser"
        />

        <AuthFooterLink
          prompt="Pas encore de compte ?"
          href="/inscription"
          label="Créer un compte"
        />
      </div>
    </AuthFormShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
