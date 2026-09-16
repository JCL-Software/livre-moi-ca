import { TrustJourney } from "@/components/marketing/trust-journey";
import { SectionHeader } from "@/components/marketing/section-header";

export function TrustSection({
  tone = "muted",
}: {
  tone?: "muted" | "plain";
}) {
  return (
    <section
      className={
        tone === "muted"
          ? "section-muted py-16 md:py-20"
          : "section-plain py-16 md:py-20"
      }
    >
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeader
          badge="Dans l'application"
          title="Votre livraison, étape par étape"
          subtitle="De la prise en charge à la remise finale, Livre-moi.ca vous permet de suivre chaque étape directement dans l'application."
        />

        <TrustJourney />
      </div>
    </section>
  );
}
