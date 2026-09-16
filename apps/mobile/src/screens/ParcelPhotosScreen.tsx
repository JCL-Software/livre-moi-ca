import { Camera } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { colors, radius, spacing } from "@/theme/tokens";

export function ParcelPhotosScreen() {
  return (
    <View style={styles.root}>
      <AppText
        variant="micro"
        weight="bold"
        color={colors.mutedForeground}
        align="center"
        style={styles.kicker}
      >
        PREUVE PHOTO
      </AppText>
      <AppText variant="title" weight="bold" align="center">
        Photos du colis
      </AppText>
      <AppText variant="caption" color={colors.mutedForeground} align="center">
        L’état est photographié à la prise en charge et à la remise.
      </AppText>

      <View style={styles.grid}>
        <View style={styles.figure}>
          <View style={[styles.photo, styles.photoPickup]}>
            <View style={styles.box} />
          </View>
          <AppText variant="caption" weight="semibold">
            Prise en charge
          </AppText>
        </View>
        <View style={styles.figure}>
          <View style={[styles.photo, styles.photoDrop]}>
            <View style={[styles.box, styles.boxLight]} />
          </View>
          <AppText variant="caption" weight="semibold">
            Remise
          </AppText>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          label="Ajouter une photo"
          variant="secondary"
          icon={<Camera size={18} color={colors.foreground} />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    gap: spacing.md,
    paddingTop: spacing.md,
  },
  kicker: {
    letterSpacing: 2,
  },
  grid: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  figure: {
    flex: 1,
    gap: spacing.sm,
  },
  photo: {
    alignItems: "center",
    aspectRatio: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    justifyContent: "center",
  },
  photoPickup: {
    backgroundColor: "#d8d8d8",
  },
  photoDrop: {
    backgroundColor: "#efefef",
  },
  box: {
    backgroundColor: "#c4b28a",
    borderRadius: 6,
    height: 54,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    width: 72,
  },
  boxLight: {
    backgroundColor: "#ddd3b8",
  },
  footer: {
    marginTop: "auto",
  },
});
