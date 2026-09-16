import { MessageCircle, Navigation } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import Svg, { Circle, Path } from "react-native-svg";
import { AppText } from "@/components/ui/AppText";
import { mockActiveParcel } from "@/data/mock";
import { buildMapboxStaticImageUrl } from "@/lib/mapbox";
import { colors, radius, spacing } from "@/theme/tokens";

type LiveTrackingScreenProps = {
  onOpenChat?: () => void;
  onOpenCode?: () => void;
};

export function LiveTrackingScreen({
  onOpenChat,
  onOpenCode,
}: LiveTrackingScreenProps) {
  const parcel = mockActiveParcel;
  const mapUrl = buildMapboxStaticImageUrl({
    lng: -73.5673,
    lat: 45.5017,
    zoom: 10,
    width: 640,
    height: 840,
  });

  return (
    <View style={styles.root}>
      <View style={styles.map}>
        {mapUrl ? (
          <Image
            source={{ uri: mapUrl }}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            cachePolicy="memory-disk"
            accessibilityLabel="Carte du suivi"
          />
        ) : (
          <Svg
            style={StyleSheet.absoluteFill}
            viewBox="0 0 320 420"
            preserveAspectRatio="xMidYMid slice"
          >
            <Path
              d="M28 70h264M28 140h264M28 210h264M28 280h264M28 350h264"
              stroke={colors.border}
              strokeWidth="1"
            />
            <Path
              d="M80 70v280M160 70v280M240 70v280"
              stroke={colors.border}
              strokeWidth="1"
            />
            <Path
              d="M54 360 C 90 300, 110 250, 148 210 C 190 164, 210 120, 258 88"
              fill="none"
              stroke={colors.mapLine}
              strokeWidth="4"
              strokeLinecap="round"
            />
            <Circle cx="54" cy="360" r="8" fill={colors.foreground} />
            <Circle cx="258" cy="88" r="8" fill={colors.background} stroke={colors.foreground} strokeWidth="3" />
            <Circle cx="168" cy="188" r="10" fill={colors.foreground} />
          </Svg>
        )}

        <View style={styles.originPin}>
          <AppText variant="micro" weight="semibold">
            {parcel.origin}
          </AppText>
        </View>
        <View style={styles.destPin}>
          <AppText variant="micro" weight="semibold">
            {parcel.destination}
          </AppText>
        </View>

        <View style={styles.liveChip}>
          <View style={styles.liveDot} />
          <AppText variant="micro" weight="semibold">
            Conducteur
          </AppText>
        </View>
      </View>

      <View style={styles.sheet}>
        <View style={styles.sheetTop}>
          <View>
            <AppText weight="semibold">
              {parcel.origin} → {parcel.destination}
            </AppText>
            <AppText variant="caption" color={colors.mutedForeground}>
              {parcel.eta}
            </AppText>
          </View>
          <View style={styles.status}>
            <Navigation size={14} color={colors.foreground} />
            <AppText variant="micro" weight="semibold">
              En route
            </AppText>
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            onPress={onOpenChat}
            style={({ pressed }) => [styles.action, pressed && styles.pressed]}
          >
            <MessageCircle size={16} color={colors.foreground} />
            <AppText variant="caption" weight="medium">
              Chat
            </AppText>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={onOpenCode}
            style={({ pressed }) => [styles.action, pressed && styles.pressed]}
          >
            <AppText variant="caption" weight="semibold">
              Code
            </AppText>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.map,
  },
  map: {
    flex: 1,
    overflow: "hidden",
    position: "relative",
  },
  originPin: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radius.full,
    borderWidth: 1,
    bottom: 18,
    left: 18,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    position: "absolute",
  },
  destPin: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radius.full,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    position: "absolute",
    right: 18,
    top: 16,
  },
  liveChip: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: radius.full,
    bottom: 18,
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    position: "absolute",
    right: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  liveDot: {
    backgroundColor: colors.foreground,
    borderRadius: radius.full,
    height: 8,
    width: 8,
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  sheetTop: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  status: {
    alignItems: "center",
    backgroundColor: colors.muted,
    borderRadius: radius.full,
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  action: {
    alignItems: "center",
    backgroundColor: colors.muted,
    borderRadius: radius.full,
    flex: 1,
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
    minHeight: 40,
  },
  pressed: {
    opacity: 0.75,
  },
});
