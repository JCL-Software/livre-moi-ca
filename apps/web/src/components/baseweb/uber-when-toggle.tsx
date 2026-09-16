"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export type WhenMode = "now" | "later";

export function UberWhenToggle({
  value,
  onChange,
}: {
  value: WhenMode;
  onChange: (value: WhenMode) => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    const timeout = window.setTimeout(() => {
      document.addEventListener("mousedown", handlePointerDown);
    }, 0);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(timeout);
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="uber-when-wrap">
      <button
        type="button"
        className="uber-when"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={(event) => {
          event.stopPropagation();
          setOpen((current) => !current);
        }}
      >
        <Clock className="h-4 w-4" aria-hidden />
        {value === "now" ? "Maintenant" : "Plus tard"}
        <ChevronDown className="h-4 w-4" aria-hidden />
      </button>
      {open ? (
        <div className="uber-when-menu" role="listbox">
          <WhenOption
            selected={value === "now"}
            onClick={() => {
              onChange("now");
              setOpen(false);
            }}
          >
            Maintenant
          </WhenOption>
          <WhenOption
            selected={value === "later"}
            onClick={() => {
              onChange("later");
              setOpen(false);
            }}
          >
            Plus tard
          </WhenOption>
        </div>
      ) : null}
    </div>
  );
}

function WhenOption({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      className={cn("uber-when-option", selected && "is-selected")}
      onClick={onClick}
    >
      {children}
      {selected ? <Check className="h-4 w-4" aria-hidden /> : null}
    </button>
  );
}
