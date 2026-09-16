import { StyleSheet, View } from "react-native";
import { AppText } from "@/components/ui/AppText";
import { mockActiveParcel } from "@/data/mock";
import { colors, radius, spacing } from "@/theme/tokens";

const QR_ON = new Set([0, 1, 2, 4, 5, 7, 10, 12, 14, 17, 19, 20, 22, 23, 24]);

export function DeliveryConfirmScreen() {
  return (
    <View style={styles.root}>
      <AppText
        variant="micro"
        weight="bold"
        color={colors.mutedForeground}
        align="center"
        style={styles.kicker}
      >
        REMISE SÉCURISÉE
      </AppText>
      <AppText variant="title" weight="bold" align="center">
        Livraison confirmée
      </AppText>

      <View style={styles.qr}>
        {Array.from({ length: 25 }, (_, index) => (
          <View
            key={index}
            style={[styles.cell, QR_ON.has(index) ? styles.cellOn : styles.cellOff]}
          />
        ))}
      </View>

      <AppText variant="caption" color={colors.mutedForeground} align="center">
        Code de remise
      </AppText>
      <AppText variant="display" weight="bold" align="center" style={styles.code}>
        {mockActiveParcel.handoverCode}
      </AppText>

      <View style={styles.banner}>
        <AppText variant="caption" weight="semibold" color={colors.success} align="center">
          QR scanné — Colis reçu
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    gap: spacing.sm,
    paddingTop: spacing.md,
  },
  kicker: {
    letterSpacing: 2,
  },
  qr: {
    alignSelf: "center",
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    height: 148,
    marginVertical: spacing.lg,
    padding: spacing.md,
    width: 148,
  },
  cell: {
    borderRadius: 2,
    height: 20,
    width: 20,
  },
  cellOn: {
    backgroundColor: colors.foreground,
  },
  cellOff: {
    backgroundColor: colors.muted,
  },
  code: {
    letterSpacing: 8,
  },
  banner: {
    backgroundColor: colors.successMuted,
    borderRadius: radius.md,
    marginTop: "auto",
    paddingVertical: spacing.md,
  },
});
