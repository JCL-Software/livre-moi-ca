import { ScrollView, StyleSheet, View, type ViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, spacing } from "@/theme/tokens";

type ScreenProps = ViewProps & {
  scroll?: boolean;
  padded?: boolean;
  edges?: ("top" | "right" | "bottom" | "left")[];
};

export function Screen({
  scroll = false,
  padded = true,
  edges = ["top"],
  style,
  children,
  ...props
}: ScreenProps) {
  const contentStyle = [padded && styles.padded, style];

  if (scroll) {
    return (
      <SafeAreaView style={styles.safe} edges={edges}>
        <ScrollView
          contentContainerStyle={[styles.scroll, contentStyle]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={edges}>
      <View {...props} style={[styles.body, contentStyle]}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    backgroundColor: colors.background,
    flex: 1,
  },
  body: {
    flex: 1,
  },
  padded: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
  },
  scroll: {
    paddingBottom: spacing.xxxl,
  },
});
