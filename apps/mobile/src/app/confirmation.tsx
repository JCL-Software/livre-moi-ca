import { Screen } from "@/components/ui/Screen";
import { DeliveryConfirmScreen } from "@/screens/DeliveryConfirmScreen";

export default function ConfirmationRoute() {
  return (
    <Screen edges={[]}>
      <DeliveryConfirmScreen />
    </Screen>
  );
}
