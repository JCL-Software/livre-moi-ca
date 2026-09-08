import React from "react";
import LeftSidebarPart from "../LeftSidebarPart";
import AuthForgotPassword from "../../authforms/AuthForgotPassword";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";
import FullLogo from "@/app/(DashboardLayout)/layout/shared/logo/FullLogo";
export const metadata: Metadata = {
  title: "Mot de passe oublié — Livre-moi.ca Admin",
  description: "Réinitialisez le mot de passe de votre compte administrateur Livre-moi.ca.",
};


const Forgotpwd = () => {
  return (
    <>
      <div className="p-5 lg:bg-transparent lg:dark:bg-transparent bg-lightprimary lg:fixed top-0 z-50 w-full">
        <FullLogo />
      </div>
      <div className="relative overflow-hidden h-screen">
        <div className="grid grid-cols-12 gap-3 h-screen bg-white dark:bg-dark">
          <div className="xl:col-span-8 lg:col-span-7 col-span-12 bg-lightprimary dark:bg-lightprimary lg:block hidden relative overflow-hidden">
            <LeftSidebarPart />
          </div>
          <div className="xl:col-span-4 lg:col-span-5 col-span-12 sm:px-12 p-5">
            <div className="flex h-screen items-center px-3 lg:justify-start justify-center">
              <div className="max-w-[420px] w-full mx-auto">
                <h3 className="text-2xl font-bold my-3">Mot de passe oublié</h3>
                <p className="text-darklink text-sm font-medium">
                  Saisissez l’adresse courriel associée à votre compte. Nous vous
                  enverrons un lien pour réinitialiser votre mot de passe.
                </p>
                <AuthForgotPassword />
                <Button
                  asChild
                  className="mt-4 w-full rounded-md bg-orange-50 text-orange-500 hover:bg-orange-500 hover:text-white"
                >
                  <Link href="/auth/auth1/login">
                    Retour à la connexion
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div >
    </>
  );
};

export default Forgotpwd;
