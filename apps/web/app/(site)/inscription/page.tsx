"use client";

import { useState } from "react";
import { toast } from "sonner";
import { signInWithGoogle, signUpWithPassword } from "@/lib/actions/auth";
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
    toast.success(
      "Compte créé. Vérifiez votre courriel si la confirmation est activée.",
    );
  }

  return (
    <AuthFormShell title="Créer un compte">
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <LabelInputContainer>
          <AuthLabel htmlFor="name">Nom complet</AuthLabel>
          <AuthInput
            id="name"
            placeholder="Jean Tremblay"
            type="text"
            required
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
          />
        </LabelInputContainer>
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
            minLength={8}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </LabelInputContainer>

        <AuthSubmitButton disabled={loading}>
          {loading ? "Création…" : "Créer un compte"}
        </AuthSubmitButton>
      </form>

      <AuthDivider />

      <div className="flex flex-col gap-4">
        <AuthGoogleButton action={async () => signInWithGoogle()} />

        <AuthFooterLink
          prompt="Déjà inscrit ?"
          href="/connexion"
          label="Se connecter"
        />
      </div>
    </AuthFormShell>
  );
}
