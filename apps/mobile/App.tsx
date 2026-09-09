import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { APP_NAME, APP_TAGLINE } from "@livre-moi/shared/constants";

const NEXT_STEPS = [
  "Publier un trajet",
  "Suivi GPS en direct",
  "OTP / QR + photos colis",
  "Chat et tickets",
];

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.brand}>{APP_NAME}</Text>
      <Text style={styles.tagline}>{APP_TAGLINE}</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Application terrain</Text>
        <Text style={styles.cardBody}>
          L’app Expo est branchée sur le même backend Supabase que le web et
          l’admin, via le package partagé @livre-moi/shared.
        </Text>
        {NEXT_STEPS.map((item) => (
          <Text key={item} style={styles.step}>
            • {item}
          </Text>
        ))}
      </View>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  brand: {
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "700",
    letterSpacing: -0.6,
  },
  tagline: {
    marginTop: 10,
    color: "#cfcfcf",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
  card: {
    marginTop: 36,
    width: "100%",
    maxWidth: 420,
    borderRadius: 18,
    backgroundColor: "#141414",
    padding: 20,
  },
  cardTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  cardBody: {
    color: "#bdbdbd",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 14,
  },
  step: {
    color: "#f2f2f2",
    fontSize: 14,
    marginTop: 6,
  },
});
