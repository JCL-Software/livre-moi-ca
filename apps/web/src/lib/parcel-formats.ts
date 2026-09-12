import { Backpack, Briefcase, Container, Package } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ParcelSize } from "@/lib/types";

export type ParcelFormatId = "S" | "M" | "L" | "XL";

export type ParcelFormat = {
  size: ParcelFormatId;
  value: ParcelSize;
  label: string;
  icon: LucideIcon;
  ideal: string;
  placement: string;
};

export const PARCEL_FORMATS: ParcelFormat[] = [
  {
    size: "S",
    value: "SMALL",
    label: "Petit format — Enveloppe ou petit sac",
    icon: Briefcase,
    ideal:
      "Documents, clés, petits accessoires, vêtements légers et petits appareils électroniques.",
    placement: "Se glisse facilement sous un siège ou dans un petit espace du coffre.",
  },
  {
    size: "M",
    value: "MEDIUM",
    label: "Format moyen — Boîte à chaussures",
    icon: Backpack,
    ideal:
      "Livres, vêtements, petits colis Marketplace, accessoires et objets du quotidien.",
    placement: "Peut être placé dans le coffre ou sur un siège, selon l'espace disponible.",
  },
  {
    size: "L",
    value: "LARGE",
    label: "Grand format — Carton ou petite valise",
    icon: Package,
    ideal:
      "Petits meubles démontés, outils, équipement de plein air et cartons de déménagement légers.",
    placement: "Nécessite un espace libre dans le coffre ou dans l'habitacle.",
  },
  {
    size: "XL",
    value: "EXTRA_LARGE",
    label: "Très grand format — Plusieurs boîtes ou équipement volumineux",
    icon: Container,
    ideal:
      "Équipement sportif, objets volumineux, plusieurs cartons ou articles nécessitant une grande partie du coffre.",
    placement: "À confirmer directement avec le conducteur avant la réservation.",
  },
];
