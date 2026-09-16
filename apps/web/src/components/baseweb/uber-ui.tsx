"use client";

import Link from "next/link";
import { Avatar } from "baseui/avatar";
import { Block } from "baseui/block";
import { Tag, KIND as TAG_KIND, HIERARCHY, SIZE as TAG_SIZE } from "baseui/tag";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const CARD_STYLE = {
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "#EEEEEE",
} as const;

export function UberCard({
  children,
  as = "div",
  padded = true,
  className,
}: {
  children: React.ReactNode;
  as?: "div" | "article" | "li" | "section" | "form";
  padded?: boolean;
  className?: string;
}) {
  return (
    <Block
      as={as}
      className={className}
      overrides={{
        Block: {
          style: {
            ...CARD_STYLE,
            paddingLeft: padded ? "20px" : "0",
            paddingRight: padded ? "20px" : "0",
            paddingTop: padded ? "20px" : "0",
            paddingBottom: padded ? "20px" : "0",
          },
        },
      }}
    >
      {children}
    </Block>
  );
}

export function UberCardLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} className={cn("block h-full no-underline", className)}>
      <UberCard as="article" className="h-full">
        {children}
      </UberCard>
    </Link>
  );
}

export function UberIconTile({
  children,
  size = 40,
}: {
  children: React.ReactNode;
  size?: number;
}) {
  return (
    <Block
      as="span"
      overrides={{
        Block: {
          style: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: "8px",
            backgroundColor: "#EEEEEE",
            color: "#000000",
            flexShrink: 0,
          },
        },
      }}
    >
      {children}
    </Block>
  );
}

export function UberTag({
  children,
  tone = "soft",
}: {
  children: React.ReactNode;
  tone?: "solid" | "soft" | "muted" | "success";
}) {
  const kind =
    tone === "solid"
      ? TAG_KIND.black
      : tone === "success"
        ? TAG_KIND.green
        : TAG_KIND.gray;
  const hierarchy = tone === "solid" ? HIERARCHY.primary : HIERARCHY.secondary;

  return (
    <Tag
      closeable={false}
      kind={kind}
      hierarchy={hierarchy}
      size={TAG_SIZE.small}
      noMargin
      contentMaxWidth={null}
    >
      {children}
    </Tag>
  );
}

function avatarPx(size: string) {
  const value = Number.parseInt(size, 10);
  return Number.isFinite(value) ? value : 32;
}

export function UberAvatar({
  name,
  src,
  size = "36px",
  verified = false,
  tone = "onLight",
}: {
  name: string;
  src?: string | null;
  size?: string;
  verified?: boolean;
  tone?: "onLight" | "onDark";
}) {
  const px = avatarPx(size);
  const onDark = tone === "onDark";
  const avatar = (
    <Avatar
      name={name || "Compte"}
      src={src || undefined}
      size={size}
      overrides={{
        Root: {
          style: {
            backgroundColor: onDark ? "rgba(255,255,255,0.18)" : "#EEEEEE",
          },
        },
        Initials: {
          style: {
            color: onDark ? "#ffffff" : "#000000",
            fontSize: px >= 64 ? "22px" : px >= 48 ? "16px" : "11px",
            fontWeight: 600,
          },
        },
      }}
    />
  );

  if (!verified) return avatar;

  const mark = Math.max(12, Math.min(22, Math.round(px * 0.3)));
  const inset = Math.max(1, Math.round(px * 0.07));
  return (
    <span className="relative inline-flex shrink-0 overflow-visible">
      {avatar}
      <span
        title="Identité vérifiée"
        className="pointer-events-none absolute"
        style={{ left: inset, bottom: inset }}
      >
        <ShieldCheck
          size={mark}
          fill="#059669"
          color="#ffffff"
          strokeWidth={2}
          aria-hidden
        />
      </span>
    </span>
  );
}

export function UberEmpty({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <UberCard>
      <p className="m-0 text-center font-medium text-black">{title}</p>
      <p className="mt-1 mb-0 text-center text-sm text-[#545454]">{description}</p>
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </UberCard>
  );
}
