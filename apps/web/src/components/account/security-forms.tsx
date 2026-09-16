"use client";

import { useState } from "react";
import { toast } from "sonner";
import { requestPasswordReset, signOut, updateEmail, updatePassword } from "@/lib/actions/auth";
import {
  ACCOUNT_FIELD,
  AccountFieldLabel,
} from "@/components/account/account-ui";
import { UberCard } from "@/components/baseweb/uber-ui";

export function SecurityForms({ email }: { email: string }) {
  const [nextEmail, setNextEmail] = useState(email);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  async function onEmail(event: React.FormEvent) {
    event.preventDefault();
    setEmailLoading(true);
    const result = await updateEmail(nextEmail);
    setEmailLoading(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Vérifiez votre courriel pour confirmer le changement.");
  }

  async function onPassword(event: React.FormEvent) {
    event.preventDefault();
    if (password !== confirm) {
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }
    setPasswordLoading(true);
    const result = await updatePassword(password);
    setPasswordLoading(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    setPassword("");
    setConfirm("");
    toast.success("Mot de passe mis à jour.");
  }

  async function onResetLink() {
    setResetLoading(true);
    const result = await requestPasswordReset(email);
    setResetLoading(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Un lien de réinitialisation a été envoyé.");
  }

  return (
    <div className="space-y-4">
      <UberCard>
        <form onSubmit={onEmail} className="space-y-4">
          <div>
            <h2 className="m-0 text-base font-semibold text-black">Courriel</h2>
            <p className="mt-1 mb-0 text-sm text-[#545454]">
              Un message de confirmation sera envoyé à la nouvelle adresse.
            </p>
          </div>
          <div>
            <AccountFieldLabel htmlFor="email">Adresse courriel</AccountFieldLabel>
            <input
              id="email"
              type="email"
              required
              className={ACCOUNT_FIELD}
              value={nextEmail}
              onChange={(event) => setNextEmail(event.target.value)}
            />
          </div>
          <button
            type="submit"
            className="btn-brand h-12 px-5 disabled:opacity-50"
            disabled={emailLoading || nextEmail === email}
          >
            {emailLoading ? "Envoi…" : "Mettre à jour le courriel"}
          </button>
        </form>
      </UberCard>

      <UberCard>
        <form onSubmit={onPassword} className="space-y-4">
          <div>
            <h2 className="m-0 text-base font-semibold text-black">Mot de passe</h2>
            <p className="mt-1 mb-0 text-sm text-[#545454]">Au moins 8 caractères.</p>
          </div>
          <div>
            <AccountFieldLabel htmlFor="password">Nouveau mot de passe</AccountFieldLabel>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              className={ACCOUNT_FIELD}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <div>
            <AccountFieldLabel htmlFor="confirm">Confirmer</AccountFieldLabel>
            <input
              id="confirm"
              type="password"
              required
              minLength={8}
              className={ACCOUNT_FIELD}
              value={confirm}
              onChange={(event) => setConfirm(event.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="submit" className="btn-brand h-12 px-5 disabled:opacity-50" disabled={passwordLoading}>
              {passwordLoading ? "Enregistrement…" : "Changer le mot de passe"}
            </button>
            <button
              type="button"
              className="btn-brand-secondary h-12 px-5 disabled:opacity-50"
              disabled={resetLoading}
              onClick={() => void onResetLink()}
            >
              {resetLoading ? "Envoi…" : "Recevoir un lien par courriel"}
            </button>
          </div>
        </form>
      </UberCard>

      <UberCard>
        <form action={signOut}>
          <h2 className="m-0 text-base font-semibold text-black">Session</h2>
          <p className="mt-1 mb-4 text-sm text-[#545454]">
            Déconnectez-vous de cet appareil. Vos demandes et messages restent enregistrés.
          </p>
          <button type="submit" className="btn-brand-secondary h-12 px-5">
            Se déconnecter
          </button>
        </form>
      </UberCard>
    </div>
  );
}
