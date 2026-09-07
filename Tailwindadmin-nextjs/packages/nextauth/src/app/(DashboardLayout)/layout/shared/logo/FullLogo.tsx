"use client";

import Link from "next/link";

const FullLogo = () => {
  return (
    <Link href={"/"} className="flex items-center gap-2">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">
        Lm
      </span>
      <span className="text-lg font-semibold text-dark dark:text-white">
        Livre-moi <span className="font-normal text-darklink">Admin</span>
      </span>
    </Link>
  );
};

export default FullLogo;
