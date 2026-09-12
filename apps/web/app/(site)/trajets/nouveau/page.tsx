import { PublishTripForm } from "@/components/trips/publish-trip-form";

export default function NewTripPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-6 space-y-1">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">Conducteur</p>
        <h1 className="text-3xl font-bold tracking-tight">Publier un trajet</h1>
      </div>
      <PublishTripForm />
    </div>
  );
}
