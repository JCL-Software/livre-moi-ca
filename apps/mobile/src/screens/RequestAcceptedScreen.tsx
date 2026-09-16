import { StyleSheet, View } from "react-native";
import { colors, radius, spacing } from "@/theme/tokens";
import { AppText } from "@/components/ui/AppText";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { mockActiveParcel } from "@/data/mock";

type RequestAcceptedScreenProps = {
  compact?: boolean;
};

export function RequestAcceptedScreen({ compact = false }: RequestAcceptedScreenProps) {
  const parcel = mockActiveParcel;

  return (
    <View style={[styles.root, compact && styles.compact]}>
      <AppText
        variant="micro"
        weight="bold"
        color={colors.mutedForeground}
        align="center"
        style={styles.kicker}
      >
        NOTIFICATION
      </AppText>
      <AppText variant="title" weight="bold" align="center">
        Demande acceptée
      </AppText>

      <Card style={styles.card}>
        <View style={styles.driverRow}>
          <View style={styles.avatar}>
            <AppText weight="bold" color={colors.primaryForeground}>
              {parcel.driver.initial}
            </AppText>
          </View>
          <View style={styles.driverCopy}>
            <AppText weight="semibold">{parcel.driver.name}</AppText>
            <AppText variant="caption" color={colors.mutedForeground}>
              Conducteur vérifié · {parcel.driver.rating}
            </AppText>
          </View>
          <Badge label="Vérifié" tone="success" />
        </View>

        <View style={styles.route}>
          <AppText weight="semibold">
            {parcel.origin} → {parcel.destination}
          </AppText>
          <AppText variant="caption" color={colors.mutedForeground}>
            {parcel.title} · {parcel.departure}
          </AppText>
        </View>
      </Card>

      <View style={styles.banner}>
        <AppText variant="caption" weight="semibold" align="center">
          Votre colis est pris en charge
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    gap: spacing.lg,
    paddingTop: spacing.md,
  },
  compact: {
    paddingTop: 0,
  },
  kicker: {
    letterSpacing: 2,
  },
  card: {
    gap: spacing.lg,
  },
  driverRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
  },
  avatar: {
    alignItems: "center",
    backgroundColor: colors.foreground,
    borderRadius: radius.full,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  driverCopy: {
    flex: 1,
  },
  route: {
    gap: 4,
  },
  banner: {
    backgroundColor: colors.muted,
    borderRadius: radius.md,
    marginTop: "auto",
    paddingVertical: spacing.md,
  },
});
