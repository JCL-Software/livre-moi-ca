import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React from "react";

const AuthForgotPassword = () => {
  return (
    <>
      <form className="mt-6">
        <div className="mb-4">
          <div className="mb-2 block">
            <Label htmlFor="emadd">Adresse courriel</Label>
          </div>
          <Input
            id="emadd"
            type="email"
            className="form-control"
          />
        </div>
        <Button className="w-full bg-orange-500 text-white hover:bg-orange-600">
          Envoyer le lien
        </Button>
      </form>
    </>
  );
};

export default AuthForgotPassword;
