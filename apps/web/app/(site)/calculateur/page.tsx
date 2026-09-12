import type { Metadata } from "next";
import { ParcelEstimator } from "@/components/pricing/parcel-estimator";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Estimateur de prix colis",
  description: `Estimez le coût d'un envoi collaboratif avec ${APP_NAME}. Prix calculé selon la distance réelle et le poids du colis, au Québec et en Ontario.`,
};

export default function CalculateurPage() {
  return (
    <section className="section-muted">
      <div className="mx-auto max-w-7xl px-4 py-8 md:py-10 lg:py-12">
        <ParcelEstimator />
      </div>
    </section>
  );
}
