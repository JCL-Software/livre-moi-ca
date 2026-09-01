import { PublishTripForm } from "@/components/trips/publish-trip-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewTripPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-6 space-y-1">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">Conducteur</p>
        <h1 className="text-3xl font-bold tracking-tight">Publier un trajet</h1>
      </div>
      <Card className="border-border/80 shadow-lg shadow-primary/5">
        <CardHeader>
          <CardTitle>Détails du trajet</CardTitle>
        </CardHeader>
        <CardContent>
          <PublishTripForm />
        </CardContent>
      </Card>
    </div>
  );
}
