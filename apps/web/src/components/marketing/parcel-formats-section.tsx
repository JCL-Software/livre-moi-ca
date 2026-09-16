import { UberIconTile, UberTag } from "@/components/baseweb/uber-ui";
import { SectionHeader } from "@/components/marketing/section-header";
import { PARCEL_FORMATS } from "@/lib/parcel-formats";

export function ParcelFormatsSection() {
  return (
    <section className="section-plain py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeader
          badge="Formats acceptés"
          title="Quels formats pouvez-vous faire livrer ?"
          subtitle="Tout ce qui tient dans un véhicule standard, du format enveloppe au coffre plein."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PARCEL_FORMATS.map(({ size, label, icon: Icon, ideal, placement }) => (
            <article
              key={size}
              className="feature-card flex h-full flex-col rounded-lg border border-neutral-200 bg-card p-6 shadow-sm before:hidden dark:border-white/10 dark:bg-card"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <UberIconTile>
                  <Icon size={20} aria-hidden />
                </UberIconTile>
                <UberTag>Format {size}</UberTag>
              </div>
              <h3 className="m-0 text-[15px] font-semibold leading-snug text-black">{label}</h3>
              <div className="mt-3 space-y-2.5 text-[13px] leading-5 text-[#545454]">
                <p className="m-0">
                  <span className="font-bold text-black">Idéal pour :</span> {ideal}
                </p>
                <p className="m-0">
                  <span className="font-bold text-black">Emplacement :</span> {placement}
                </p>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-8 mb-0 rounded-xl bg-[#EEEEEE] px-4 py-3 text-center text-sm font-medium text-black">
          Les matières dangereuses, les armes, les produits illégaux, les articles mal
          emballés et les denrées périssables qui ne peuvent pas être transportées de
          façon sécuritaire ne sont pas acceptés.
        </p>
      </div>
    </section>
  );
}
