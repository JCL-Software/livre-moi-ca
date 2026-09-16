import { Pressable, StyleSheet, View, type ViewProps } from "react-native";
import { colors, radius, spacing } from "@/theme/tokens";

type CardProps = ViewProps & {
  onPress?: () => void;
};

export function Card({ style, onPress, children, ...props }: CardProps) {
  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [styles.card, pressed && styles.pressed, style]}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View {...props} style={[styles.card, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: spacing.xl,
  },
  pressed: {
    backgroundColor: colors.muted,
  },
});
