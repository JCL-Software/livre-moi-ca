import { Search } from "lucide-react-native";
import { router } from "expo-router";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { AppText } from "@/components/ui/AppText";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Screen } from "@/components/ui/Screen";
import { mockActiveParcel, mockTrips, mockUser } from "@/data/mock";
import { buildMapboxStaticImageUrl } from "@/lib/mapbox";
import { colors, radius, spacing } from "@/theme/tokens";

const VAL_DOR = { lng: -77.7828, lat: 48.0987 };

export default function HomeScreen() {
  const parcel = mockActiveParcel;
  const mapUrl = buildMapboxStaticImageUrl({
    ...VAL_DOR,
    zoom: 11,
    width: 640,
    height: 360,
  });

  return (
    <Screen scroll>
      <View style={styles.intro}>
        <AppText variant="title" weight="bold">
          Bonjour {mockUser.firstName} 👋
        </AppText>
        <AppText color={colors.mutedForeground}>
          Trouve un conducteur déjà sur la route.
        </AppText>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() => router.push("/demande")}
        style={styles.search}
      >
        <Search size={20} color={colors.mutedForeground} />
        <AppText color={colors.mutedForeground} weight="semibold">
          Où envoyer le colis ?
        </AppText>
      </Pressable>

      <AppText variant="subtitle" weight="semibold" style={styles.section}>
        Position actuelle
      </AppText>
      <View style={styles.mapWrap}>
        {mapUrl ? (
          <Image source={{ uri: mapUrl }} style={styles.map} resizeMode="cover" />
        ) : (
          <View style={[styles.map, styles.mapFallback]} />
        )}
      </View>

      <Card onPress={() => router.push("/suivi")}>
        <View style={styles.cardHead}>
          <Badge label={parcel.status} tone="inverse" />
          <AppText variant="micro" color={colors.mutedForeground}>
            {parcel.driver.name}
          </AppText>
        </View>
        <AppText variant="subtitle" weight="semibold" style={styles.route}>
          {parcel.origin} → {parcel.destination}
        </AppText>
        <AppText variant="caption" color={colors.mutedForeground}>
          {parcel.title} · {parcel.eta}
        </AppText>
      </Card>

      <AppText variant="subtitle" weight="semibold" style={styles.section}>
        Trajets récents
      </AppText>
      <View style={styles.list}>
        {mockTrips.map((trip) => (
          <Card key={trip.id} onPress={() => router.push("/maquettes")}>
            <AppText weight="semibold">{trip.title}</AppText>
            <AppText variant="caption" color={colors.mutedForeground}>
              {trip.route}
            </AppText>
            <AppText variant="caption" color={colors.mutedForeground}>
              {trip.when} · {trip.status}
            </AppText>
          </Card>
        ))}
      </View>

      <View style={styles.actions}>
        <Button label="Trouver un trajet" onPress={() => router.push("/maquettes")} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: {
    gap: 6,
    marginBottom: spacing.lg,
    marginTop: spacing.md,
  },
  search: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: radius.full,
    flexDirection: "row",
    gap: spacing.md,
    minHeight: 56,
    paddingHorizontal: spacing.lg,
    shadowColor: "#d4d4d4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },
  mapWrap: {
    borderRadius: radius.lg,
    overflow: "hidden",
    height: 180,
    backgroundColor: colors.map,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  mapFallback: {
    backgroundColor: colors.map,
  },
  cardHead: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  route: {
    marginBottom: 4,
  },
  list: {
    gap: spacing.md,
  },
  actions: {
    marginTop: spacing.xl,
  },
});
