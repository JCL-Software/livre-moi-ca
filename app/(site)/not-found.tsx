import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg space-y-5 px-4 py-24 text-center">
      <p className="text-sm font-medium text-neutral-500">
        Erreur 404
      </p>
      <h1 className="text-3xl font-bold tracking-tight">Page introuvable</h1>
      <p className="text-muted-foreground">
        Ce trajet n&apos;existe pas ou a été retiré. Revenez à l&apos;accueil pour chercher un départ.
      </p>
      <Button asChild size="lg">
        <Link href="/">Retour à l&apos;accueil</Link>
      </Button>
    </div>
  );
}
