"use client";

import { useRouter } from "next/navigation";
import { Button, KIND, SIZE, SHAPE, type ButtonOverrides } from "baseui/button";

export function UberButtonLink({
  href,
  children,
  kind = KIND.primary,
  size = SIZE.default,
  shape = SHAPE.default,
  overrides,
}: {
  href: string;
  children: React.ReactNode;
  kind?: (typeof KIND)[keyof typeof KIND];
  size?: (typeof SIZE)[keyof typeof SIZE];
  shape?: (typeof SHAPE)[keyof typeof SHAPE];
  overrides?: ButtonOverrides;
}) {
  const router = useRouter();
  return (
    <Button
      kind={kind}
      size={size}
      shape={shape}
      overrides={overrides}
      onClick={() => router.push(href)}
    >
      {children}
    </Button>
  );
}
