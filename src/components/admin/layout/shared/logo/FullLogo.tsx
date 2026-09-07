"use client";

import Image from "next/image";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

const FullLogo = () => {
  return (
    <Link href="/admin" className="flex items-center gap-2">
      <Image
        src="/brand/logo-pin.webp"
        alt={APP_NAME}
        width={36}
        height={36}
        className="rounded-lg"
      />
      <span className="font-space text-base font-extrabold text-sidebar-foreground">
        {APP_NAME}
      </span>
    </Link>
  );
};

export default FullLogo;
