import { type ReactNode } from "react";
import { Pressable, type PressableProps, StyleSheet, View } from "react-native";
import { colors, radius } from "@/theme/tokens";
import { AppText } from "./AppText";

type ButtonProps = PressableProps & {
  label: string;
  variant?: "primary" | "secondary" | "ghost";
  icon?: ReactNode;
};

export function Button({
  label,
  variant = "primary",
  icon,
  style,
  ...props
}: ButtonProps) {
  const isPrimary = variant === "primary";

  return (
    <Pressable
      accessibilityRole="button"
      {...props}
      style={(state) => [
        styles.base,
        isPrimary && styles.primary,
        variant === "secondary" && styles.secondary,
        variant === "ghost" && styles.ghost,
        state.pressed && styles.pressed,
        typeof style === "function" ? style(state) : style,
      ]}
    >
      <View style={styles.row}>
        {icon}
        <AppText
          weight="medium"
          color={isPrimary ? colors.primaryForeground : colors.foreground}
        >
          {label}
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    borderRadius: radius.md,
    justifyContent: "center",
    minHeight: 52,
    paddingHorizontal: 20,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.background,
    borderColor: colors.foreground,
    borderWidth: 1,
  },
  ghost: {
    backgroundColor: colors.muted,
  },
  pressed: {
    opacity: 0.82,
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
});
