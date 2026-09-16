import { StyleSheet, View } from "react-native";
import { colors, radius, spacing } from "@/theme/tokens";
import { AppText } from "./AppText";

type BadgeProps = {
  label: string;
  tone?: "neutral" | "inverse" | "success";
};

export function Badge({ label, tone = "neutral" }: BadgeProps) {
  return (
    <View
      style={[
        styles.badge,
        tone === "inverse" && styles.inverse,
        tone === "success" && styles.success,
      ]}
    >
      <AppText
        variant="micro"
        weight="semibold"
        color={
          tone === "inverse"
            ? colors.primaryForeground
            : tone === "success"
              ? colors.success
              : colors.mutedForeground
        }
      >
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    backgroundColor: colors.muted,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
  },
  inverse: {
    backgroundColor: colors.primary,
  },
  success: {
    backgroundColor: colors.successMuted,
  },
});
