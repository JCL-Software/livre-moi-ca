import { router } from "expo-router";
import { LiveTrackingScreen } from "@/screens/LiveTrackingScreen";

export default function SuiviRoute() {
  return (
    <LiveTrackingScreen
      onOpenChat={() => router.push("/messages")}
      onOpenCode={() => router.push("/confirmation")}
    />
  );
}
