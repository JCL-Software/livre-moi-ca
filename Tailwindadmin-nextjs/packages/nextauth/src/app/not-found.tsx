"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Lottie from "lottie-react";
import error404page from "@/../public/animation/error404page.json";

const Error = () => {
  return (
    <>
      <div className="h-screen flex items-center justify-center bg-white dark:bg-dark">
        <div className="text-center">
          <Lottie animationData={error404page} loop={true} />
          <h1 className="text-ld text-4xl mb-6">Page introuvable</h1>
          <h6 className="text-xl text-ld">
            La page que vous cherchez n&apos;existe pas.
          </h6>
          <Button asChild className="mt-6 mx-auto">
            <Link href="/">Retour au tableau de bord</Link>
          </Button>
        </div>
      </div>
    </>
  );
};

export default Error;
