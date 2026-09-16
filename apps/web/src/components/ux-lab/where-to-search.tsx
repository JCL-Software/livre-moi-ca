import Link from "next/link";
import { Search } from "lucide-react";

export function WhereToSearch() {
  return (
    <Link href="/recherche?type=PARCEL" className="ux-lab-whereto">
      <Search className="h-5 w-5 shrink-0" />
      <span>Où envoyer le colis ?</span>
    </Link>
  );
}
