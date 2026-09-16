import { StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { AppText } from "@/components/ui/AppText";

type BrandMarkProps = {
  size?: number;
  showWordmark?: boolean;
};

export function BrandMark({ size = 36, showWordmark = true }: BrandMarkProps) {
  return (
    <View style={styles.row}>
      <Image
        source={require("../../../assets/brand/logo-pin.webp")}
        style={{ height: size, width: size, borderRadius: 8 }}
        contentFit="contain"
      />
      {showWordmark ? (
        <AppText variant="subtitle" weight="semibold">
          Livre-moi.ca
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
});
