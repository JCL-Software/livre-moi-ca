import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg space-y-5 px-4 py-24 text-center">
      <p className="inline-flex rounded-full bg-orange-100 px-4 py-2 text-sm font-extrabold text-orange-700 dark:bg-orange-950/60 dark:text-orange-300">
        Erreur 404
      </p>
      <h1 className="font-space text-3xl font-extrabold tracking-tight">Page introuvable</h1>
      <p className="text-muted-foreground">
        Ce trajet n&apos;existe pas ou a été retiré. Revenez à l&apos;accueil pour chercher un départ.
      </p>
      <Button asChild size="lg">
        <Link href="/">Retour à l&apos;accueil</Link>
      </Button>
    </div>
  );
}
