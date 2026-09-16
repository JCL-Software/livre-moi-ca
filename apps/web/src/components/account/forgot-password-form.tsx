"use client";

import { useState } from "react";
import { toast } from "sonner";
import { requestPasswordReset } from "@/lib/actions/auth";
import { AuthInput } from "@/components/ui/auth-input";
import {
  AuthFooterLink,
  AuthFormShell,
  AuthLabel,
  AuthSubmitButton,
  LabelInputContainer,
} from "@/components/auth/auth-form";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    const result = await requestPasswordReset(email);
    setLoading(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Si un compte existe, un lien a été envoyé.");
  }

  return (
    <AuthFormShell title="Mot de passe oublié">
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
        <AuthSubmitButton disabled={loading}>
          {loading ? "Envoi…" : "Envoyer le lien"}
        </AuthSubmitButton>
      </form>
      <div className="mt-4">
        <AuthFooterLink prompt="Vous vous souvenez ?" href="/connexion" label="Connexion" />
      </div>
    </AuthFormShell>
  );
}
