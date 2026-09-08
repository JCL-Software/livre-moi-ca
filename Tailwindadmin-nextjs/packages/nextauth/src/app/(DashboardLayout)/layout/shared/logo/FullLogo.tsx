"use client";

import Image from "next/image";
import Link from "next/link";

const FullLogo = () => {
  return (
    <Link
      href="/"
      className="group flex shrink-0 items-center gap-2"
      aria-label="Livre-moi.ca"
    >
      <Image
        src="/brand/logo-pin.webp"
        alt=""
        width={36}
        height={36}
        className="h-9 w-9 rounded-lg object-contain transition-transform group-hover:scale-105"
      />
      <span className="text-lg font-bold text-dark dark:text-white">
        Livre-moi
        <span className="text-orange-500 dark:text-orange-400">.ca</span>
      </span>
    </Link>
  );
};

export default FullLogo;
