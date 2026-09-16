"use client";

import { Building2, Mail, ShoppingBag } from "lucide-react";
import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import { ArrowRight } from "@/components/animate-ui/icons/arrow-right";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { WrenchIcon } from "@/components/ui/wrench";
import { SectionHeader } from "@/components/marketing/section-header";
import { cn } from "@/lib/utils";

type AppIcon = ComponentType<{
  className?: string;
  size?: number;
  animateOnHover?: boolean;
}>;

function withoutHoverProp(
  Icon: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>,
): AppIcon {
  return function StaticIcon({ animateOnHover: _animateOnHover, ...props }) {
    return <Icon {...props} />;
  };
}

const ShoppingBagIcon = withoutHoverProp(ShoppingBag);
const MailIcon = withoutHoverProp(Mail);
const Building2Icon = withoutHoverProp(Building2);

const USE_CASES: {
  icon: AppIcon;
  title: string;
  description: string;
  className: string;
}[] = [
  {
    icon: ShoppingBagIcon,
    title: "Marketplace et achats entre particuliers",
    description:
      "Faites transporter un achat trouvé dans une autre ville par quelqu'un qui emprunte déjà cette route.",
    className: "md:col-span-2",
  },
  {
    icon: WrenchIcon,
    title: "Pièces et objets urgents",
    description: "Faites parvenir rapidement une pièce, un outil ou du matériel dont vous avez besoin.",
    className: "md:col-span-1",
  },
  {
    icon: MailIcon,
    title: "Documents et objets importants",
    description:
      "Clés, dossiers, appareils électroniques ou objets oubliés : organisez leur transport simplement.",
    className: "md:col-span-1",
  },
  {
    icon: Building2Icon,
    title: "Petites entreprises",
    description:
      "Livrez vos produits ou votre matériel à vos clients sans devoir gérer votre propre flotte.",
    className: "md:col-span-2",
  },
];

export function UseCasesSection() {
  return (
    <section className="section-muted py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeader
          badge="Cas d'usage"
          title="Des situations bien réelles"
          subtitle="Que ce soit pour un achat entre particuliers, une pièce urgente ou une livraison professionnelle, Livre-moi.ca vous aide à faire circuler ce qui compte."
        />

        <BentoGrid className="max-w-6xl md:grid-cols-3">
          {USE_CASES.map((useCase) => {
            const Icon = useCase.icon;
            return (
              <Link
                key={useCase.title}
                href="/colis/nouveau"
                className={cn("block h-full", useCase.className)}
              >
                <BentoGridItem
                  className="h-full"
                  icon={<Icon size={20} />}
                  title={useCase.title}
                  description={
                    <>
                      <span>{useCase.description}</span>
                      <span className="use-case-cta mt-3 flex items-center gap-1 text-[13px] font-semibold text-black opacity-0 transition duration-200 group-hover/bento:translate-x-0.5 group-hover/bento:opacity-100 dark:text-white">
                        Publier un colis
                        <ArrowRight className="h-3.5 w-3.5" size={14} animateOnHover />
                      </span>
                    </>
                  }
                />
              </Link>
            );
          })}
        </BentoGrid>
      </div>
    </section>
  );
}
