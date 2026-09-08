"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import AuthContext from "@/app/context/auth-context";

const AuthLogin = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { signin } = useContext(AuthContext);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signin(email, password);
      router.push("/");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Connexion impossible");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form className="mt-6" onSubmit={handleSubmit}>
        <div className="mb-4">
          <div className="mb-2 block">
            <Label htmlFor="Email">Email admin</Label>
          </div>
          <Input
            id="Email"
            type="email"
            value={email}
            autoComplete="username"
            className={`form-control ${
              error !== "" ? "border border-error rounded-md" : ""
            }`}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <div className="mb-2 block">
            <Label htmlFor="userpwd">Mot de passe</Label>
          </div>
          <Input
            id="userpwd"
            type="password"
            value={password}
            autoComplete="current-password"
            className={`form-control ${
              error !== "" ? "border border-error rounded-md" : ""
            }`}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error ? (
          <p className="mb-4 text-sm text-error">{error}</p>
        ) : null}
        <div className="flex justify-between my-5">
          <div className="flex items-center gap-2">
            <Checkbox id="accept" className="checkbox" />
            <Label
              htmlFor="accept"
              className="opacity-90 font-normal cursor-pointer mb-0"
            >
              Se souvenir
            </Label>
          </div>
          <Link
            href={"/auth/auth1/forgot-password"}
            className="text-sm font-medium text-orange-500 hover:text-orange-600"
          >
            Mot de passe oublié ?
          </Link>
        </div>
        <Button
          className="w-full bg-orange-500 text-white hover:bg-orange-600"
          type="submit"
          disabled={loading}
        >
          {loading ? "Connexion…" : "Se connecter"}
        </Button>
      </form>
    </>
  );
};

export default AuthLogin;
