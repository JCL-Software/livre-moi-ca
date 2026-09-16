import { StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { AppText } from "@/components/ui/AppText";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Screen } from "@/components/ui/Screen";
import { mockTrips } from "@/data/mock";
import { colors, spacing } from "@/theme/tokens";

export default function ActivityScreen() {
  return (
    <Screen scroll>
      <AppText variant="title" weight="bold">
        Activité
      </AppText>
      <AppText color={colors.mutedForeground} style={styles.lead}>
        Trajets publiés, places et colis — un même fil.
      </AppText>

      <View style={styles.list}>
        {mockTrips.map((trip) => (
          <Card
            key={trip.id}
            onPress={() =>
              trip.status === "En transit" ? router.push("/suivi") : router.push("/maquettes")
            }
          >
            <View style={styles.row}>
              <Badge
                label={trip.kind === "colis" ? "Colis" : "Covoiturage"}
                tone={trip.kind === "colis" ? "inverse" : "neutral"}
              />
              <Badge label={trip.status} tone={trip.status === "Livrée" ? "success" : "neutral"} />
            </View>
            <AppText weight="semibold" style={styles.title}>
              {trip.title}
            </AppText>
            <AppText variant="caption" color={colors.mutedForeground}>
              {trip.route}
            </AppText>
            <AppText variant="caption" color={colors.mutedForeground}>
              {trip.when}
            </AppText>
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
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  title: {
    marginBottom: 4,
  },
});
