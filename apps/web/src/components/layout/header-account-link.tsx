"use client";

import Link from "next/link";
import { UberAvatar } from "@/components/baseweb/uber-ui";

function displayName(name: string, email: string) {
  return name.trim() || email || "Compte";
}

export function HeaderAccountLink({
  name,
  email,
  avatarUrl,
  verified = false,
}: {
  name: string;
  email: string;
  avatarUrl: string | null;
  verified?: boolean;
}) {
  return (
    <Link href="/compte" aria-label="Mon compte" className="block">
      <UberAvatar
        name={displayName(name, email)}
        src={avatarUrl}
        size="32px"
        verified={verified}
        tone="onDark"
      />
    </Link>
  );
}
