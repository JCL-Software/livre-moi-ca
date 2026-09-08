"use client";

import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/" aria-label="Livre-moi.ca">
      <Image
        src="/brand/logo-pin.webp"
        alt=""
        width={36}
        height={36}
        className="h-9 w-9 rounded-lg object-contain"
      />
    </Link>
  );
};

export default Logo;
