import {
  Camera,
  Lock,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import { AnimateIcon } from "@/components/ui/animate-icon";
import { SectionHeader } from "@/components/marketing/section-header";

const TRUST_POINTS = [
  {
    icon: Lock,
    title: "Validation par code sécurisé (OTP)",
    text: "Le conducteur n'est payé que lorsque le destinataire lui transmet le code secret reçu par SMS/notification à la livraison. Pas de code, pas de validation.",
  },
  {
    icon: Camera,
    title: "Constat photo au départ et à l'arrivée",
    text: "Une photo de l'état extérieur du paquet est enregistrée dans l'application au moment de la prise en charge pour éviter tout malentendu.",
  },
  {
    icon: ShieldCheck,
    title: "Profils de membres vérifiés",
    text: "Vérification de l'identité, du numéro de téléphone et avis communautaires pour savoir exactement avec qui vous voyagez ou partagez votre trajet.",
  },
  {
    icon: MessageCircle,
    title: "Messagerie directe intégrée",
    text: "Coordonnez facilement le point de rendez-vous (station-service, stationnement d'épicerie, bordure de la 117) sans divulguer vos informations personnelles.",
  },
];

export function TrustSection() {
  return (
    <section className="border-y border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-950 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeader
          badge="Confiance & sécurité"
          title="Vos colis voyagent en toute tranquillité"
          subtitle="Des outils simples et stricts pour garantir la sécurité de chaque échange."
        />

        <div className="grid gap-5 sm:grid-cols-2">
          {TRUST_POINTS.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:from-slate-900 dark:to-slate-950"
            >
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-orange-500/5 transition-transform group-hover:scale-150" />
              <AnimateIcon animateOnView className="relative mb-4">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#1E3A5F] text-orange-400">
                  <Icon className="h-5 w-5" />
                </span>
              </AnimateIcon>
              <h3 className="relative font-space text-lg font-bold text-slate-950 dark:text-white">
                {title}
              </h3>
              <p className="relative mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
