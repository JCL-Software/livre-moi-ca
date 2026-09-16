import { router, type Href } from "expo-router";
import { StyleSheet, View } from "react-native";
import { AppText } from "@/components/ui/AppText";
import { Card } from "@/components/ui/Card";
import { Screen } from "@/components/ui/Screen";
import { colors, spacing } from "@/theme/tokens";

const PREVIEWS: { href: Href; title: string; text: string }[] = [
  { href: "/", title: "Accueil", text: "Tableau de bord et actions principales." },
  { href: "/activite", title: "Activité", text: "Liste des trajets et colis." },
  { href: "/messages", title: "Messages", text: "Conversations conducteur et support." },
  { href: "/compte", title: "Compte", text: "Profil maquette et réglages." },
  { href: "/demande", title: "Demande acceptée", text: "Notification de prise en charge." },
  { href: "/suivi", title: "Suivi en direct", text: "Carte, chat et code de remise." },
  { href: "/photos", title: "Photos du colis", text: "Preuves à la prise et à la remise." },
  { href: "/confirmation", title: "Livraison confirmée", text: "QR et code de remise." },
];

export default function MaquettesScreen() {
  return (
    <Screen scroll edges={[]}>
      <AppText color={colors.mutedForeground} style={styles.lead}>
        Écrans de travail visuel, sans backend. Touchez une carte pour juger le rendu.
      </AppText>
      <View style={styles.list}>
        {PREVIEWS.map((preview) => (
          <Card key={preview.title} onPress={() => router.push(preview.href)}>
            <AppText weight="semibold">{preview.title}</AppText>
            <AppText variant="caption" color={colors.mutedForeground} style={styles.text}>
              {preview.text}
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
  },
  list: {
    gap: spacing.sm,
  },
  text: {
    marginTop: 4,
  },
});
