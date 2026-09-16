"use client";

import * as React from "react";
import { ACCOUNT_FIELD } from "@/components/account/account-ui";
import { cn } from "@/lib/utils";

export type AuthInputProps = React.InputHTMLAttributes<HTMLInputElement>;

const AuthInput = React.forwardRef<HTMLInputElement, AuthInputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(ACCOUNT_FIELD, className)}
        ref={ref}
        {...props}
      />
    );
  },
);
AuthInput.displayName = "AuthInput";

export { AuthInput };
