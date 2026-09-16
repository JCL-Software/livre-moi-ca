import { Screen } from "@/components/ui/Screen";
import { ParcelPhotosScreen } from "@/screens/ParcelPhotosScreen";

export default function PhotosRoute() {
  return (
    <Screen edges={[]}>
      <ParcelPhotosScreen />
    </Screen>
  );
}
