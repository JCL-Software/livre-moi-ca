import { ChevronRight } from "lucide-react-native";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import { AppText } from "@/components/ui/AppText";
import { Card } from "@/components/ui/Card";
import { Screen } from "@/components/ui/Screen";
import { mockUser } from "@/data/mock";
import { colors, radius, spacing } from "@/theme/tokens";

const ROWS = [
  { label: "Profil et identité", href: "/maquettes" },
  { label: "Véhicule", href: "/maquettes" },
  { label: "Paiements", href: "/maquettes" },
  { label: "Maquettes visuelles", href: "/maquettes" },
] as const;

export default function AccountScreen() {
  return (
    <Screen scroll>
      <AppText variant="title" weight="bold">
        Compte
      </AppText>
      <AppText color={colors.mutedForeground} style={styles.lead}>
        {mockUser.fullName} · {mockUser.city}
      </AppText>

      <Card style={styles.profile}>
        <View style={styles.avatar}>
          <AppText variant="title" weight="bold" color={colors.primaryForeground}>
            C
          </AppText>
        </View>
        <View>
          <AppText weight="semibold">{mockUser.fullName}</AppText>
          <AppText variant="caption" color={colors.mutedForeground}>
            Compte maquette — rendu seulement
          </AppText>
        </View>
      </Card>

      <View style={styles.list}>
        {ROWS.map((row) => (
          <Card key={row.label} onPress={() => router.push(row.href)} style={styles.rowCard}>
            <View style={styles.row}>
              <AppText weight="medium">{row.label}</AppText>
              <ChevronRight size={18} color={colors.mutedForeground} />
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
  profile: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.lg,
    marginBottom: spacing.lg,
  },
  avatar: {
    alignItems: "center",
    backgroundColor: colors.foreground,
    borderRadius: radius.full,
    height: 56,
    justifyContent: "center",
    width: 56,
  },
  list: {
    gap: spacing.sm,
  },
  rowCard: {
    paddingVertical: 18,
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
