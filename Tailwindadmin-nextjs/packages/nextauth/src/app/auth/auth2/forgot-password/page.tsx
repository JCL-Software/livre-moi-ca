import { Card } from "@/components/ui/card";
import React from "react";
import Link from "next/link";
import AuthForgotPassword from "../../authforms/AuthForgotPassword";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import FullLogo from "@/app/(DashboardLayout)/layout/shared/logo/FullLogo";
export const metadata: Metadata = {
  title: "Mot de passe oublié — Livre-moi.ca Admin",
  description: "Réinitialisez le mot de passe de votre compte administrateur Livre-moi.ca.",
};


const BoxedForgotpwd = () => {
  return (
    <>
      <div className="relative overflow-hidden h-screen bg-lightprimary dark:bg-darkprimary">
        <div className="flex h-full justify-center items-center px-4">
          <Card className="md:w-[450px] w-full border-none">
            <div className="mx-auto mb-6 w-fit">
              <FullLogo />
            </div>
            <p className="text-darklink text-sm text-center my-4">
              Saisissez l’adresse courriel associée à votre compte. Nous vous
              enverrons un lien pour réinitialiser votre mot de passe.
            </p>
            <AuthForgotPassword />
            <Button
              asChild
              className="mt-3 w-full bg-orange-50 text-orange-500 hover:bg-orange-500 hover:text-white"
            >
              <Link href="/auth/auth2/login">
                Retour à la connexion
              </Link>
            </Button>
          </Card>
        </div>
      </div>
    </>
  );
};

export default BoxedForgotpwd;
