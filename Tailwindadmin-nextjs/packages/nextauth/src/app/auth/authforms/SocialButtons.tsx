"use client";

import React, { useContext } from "react";
import Image from "next/image";
import AuthContext from "@/app/context/auth-context";

interface MyAppProps {
  title?: string;
}

const SocialButtons: React.FC<MyAppProps> = ({ title }) => {
  const { loginWithProvider } = useContext(AuthContext);

  const handleGoogle = async () => {
    try {
      await loginWithProvider("google");
    } catch (error) {
      console.error("Google login failed", error);
    }
  };

  return (
    <>
      <div className="my-6">
        <button
          type="button"
          onClick={handleGoogle}
          className="flex w-full items-center justify-center gap-2 rounded-md border border-ld px-4 py-2.5 text-center text-ld text-primary-ld"
        >
          <Image
            src={"/images/svgs/google-icon.svg"}
            alt="google"
            height={18}
            width={18}
          />
          Google
        </button>
      </div>
      <div className="flex items-center justify-center gap-2">
        <hr className="grow border-ld" />
        <p className="text-base font-medium text-ld">{title}</p>
        <hr className="grow border-ld" />
      </div>
    </>
  );
};

export default SocialButtons;
