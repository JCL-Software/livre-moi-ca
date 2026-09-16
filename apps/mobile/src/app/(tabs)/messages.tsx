import { StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { AppText } from "@/components/ui/AppText";
import { Card } from "@/components/ui/Card";
import { Screen } from "@/components/ui/Screen";
import { mockMessages } from "@/data/mock";
import { colors, radius, spacing } from "@/theme/tokens";

export default function MessagesScreen() {
  return (
    <Screen scroll>
      <AppText variant="title" weight="bold">
        Messages
      </AppText>
      <AppText color={colors.mutedForeground} style={styles.lead}>
        Échanges avec le conducteur et le support.
      </AppText>

      <View style={styles.list}>
        {mockMessages.map((message) => (
          <Card key={message.id} onPress={() => router.push("/demande")}>
            <View style={styles.row}>
              <View style={styles.avatar}>
                <AppText weight="bold" color={colors.primaryForeground}>
                  {message.name.charAt(0)}
                </AppText>
              </View>
              <View style={styles.copy}>
                <View style={styles.head}>
                  <AppText weight="semibold">{message.name}</AppText>
                  <AppText variant="micro" color={colors.mutedForeground}>
                    {message.time}
                  </AppText>
                </View>
                <AppText variant="caption" color={colors.mutedForeground} numberOfLines={2}>
                  {message.preview}
                </AppText>
              </View>
              {message.unread ? <View style={styles.unread} /> : null}
            </View>
          </Card>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  lead: {
    marginBottom: spacing.xl,
    marginTop: 6,
  },
  list: {
    gap: spacing.md,
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
  },
  avatar: {
    alignItems: "center",
    backgroundColor: colors.foreground,
    borderRadius: radius.full,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  head: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  unread: {
    backgroundColor: colors.foreground,
    borderRadius: radius.full,
    height: 8,
    width: 8,
  },
});
