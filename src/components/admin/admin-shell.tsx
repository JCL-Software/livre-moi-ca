"use client";

import type { AdminContext } from "@/lib/auth/admin";
import Header from "./layout/header/Header";
import Sidebar from "./layout/sidebar/Sidebar";
import "@/components/admin/admin-theme.css";

type Props = {
  admin: AdminContext;
  children: React.ReactNode;
};

export function AdminShell({ admin, children }: Props) {
  return (
    <div className="admin-theme flex w-full min-h-screen">
      <div className="page-wrapper flex w-full">
        <div className="hidden xl:block">
          <Sidebar />
        </div>
        <div className="body-wrapper w-full bg-background">
          <Header admin={admin} />
          <div className="container mx-auto px-6 py-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
