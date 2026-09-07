"use client";

import { createContext, useEffect, useReducer, ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/app/guards/supabase/supabase-client";

type AdminUser = {
  id: string;
  email: string;
  displayName: string;
  avatar?: string;
  role: "USER" | "ADMIN";
};

interface InitialStateType {
  isAuthenticated: boolean;
  isInitialized: boolean;
  isAdmin: boolean;
  user: AdminUser | null;
  platform: "Supabase";
}

const initialState: InitialStateType = {
  isAuthenticated: false,
  isInitialized: false,
  isAdmin: false,
  user: null,
  platform: "Supabase",
};

const reducer = (state: InitialStateType, action: any) => {
  switch (action.type) {
    case "AUTH_STATE_CHANGED":
      return { ...state, ...action.payload, isInitialized: true };
    default:
      return state;
  }
};

async function loadAdminProfile(
  userId: string,
  email?: string | null,
  meta?: Record<string, unknown>
) {
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, avatar_url, role")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;

  const role = (profile?.role as "USER" | "ADMIN" | undefined) ?? "USER";
  if (role !== "ADMIN") {
    // Hors du callback auth (pas de contention de lock)
    await supabase.auth.signOut();
    throw new Error("Accès réservé aux administrateurs Livre-moi.ca");
  }

  return {
    id: userId,
    email: profile?.email || email || "",
    displayName:
      profile?.full_name ||
      (typeof meta?.full_name === "string" ? meta.full_name : null) ||
      email ||
      "Admin",
    avatar: profile?.avatar_url || "",
    role,
  } satisfies AdminUser;
}

function loggedOutPayload() {
  return {
    isAuthenticated: false,
    isAdmin: false,
    user: null,
    platform: "Supabase" as const,
  };
}

const AuthContext = createContext<any | null>({
  ...initialState,
  signup: () => Promise.resolve(),
  signin: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  setPlatform: () => {},
  loginWithProvider: () => Promise.resolve(),
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    let cancelled = false;

    const applySession = (session: Session | null) => {
      // Différer hors du mutex auth pour éviter le steal de lock
      setTimeout(async () => {
        if (cancelled) return;

        try {
          if (!session?.user) {
            dispatch({
              type: "AUTH_STATE_CHANGED",
              payload: loggedOutPayload(),
            });
            return;
          }

          const user = await loadAdminProfile(
            session.user.id,
            session.user.email,
            session.user.user_metadata
          );

          if (cancelled) return;

          dispatch({
            type: "AUTH_STATE_CHANGED",
            payload: {
              isAuthenticated: true,
              isAdmin: true,
              user,
              platform: "Supabase",
            },
          });
        } catch {
          if (cancelled) return;
          dispatch({
            type: "AUTH_STATE_CHANGED",
            payload: loggedOutPayload(),
          });
        }
      }, 0);
    };

    // Un seul chemin d'init : INITIAL_SESSION évite getSession() en parallèle
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        applySession(session);
      }
    );

    return () => {
      cancelled = true;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const loginWithProvider = async (provider: "google" | "github") => {
    return supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const signup = async () => {
    throw new Error(
      "L'inscription admin n'est pas ouverte. Demandez un rôle ADMIN."
    );
  };

  const signin = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    if (!data.user) throw new Error("Connexion impossible");

    // Vérifie le rôle immédiatement ; onAuthStateChange mettra à jour l'UI
    await loadAdminProfile(
      data.user.id,
      data.user.email,
      data.user.user_metadata
    );
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        setPlatform: () => {},
        loginWithProvider,
        signup,
        signin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
