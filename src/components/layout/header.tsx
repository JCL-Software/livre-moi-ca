import Link from "next/link";
import { Menu, Package } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { BrandLogo } from "@/components/layout/brand-logo";
import { ServiceModeToggle } from "@/components/layout/service-mode-toggle";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { signOut } from "@/lib/actions/auth";

const links = [
  { href: "/recherche", label: "Rechercher" },
  { href: "/trajets/nouveau", label: "Publier un trajet" },
];

const navLinkClass =
  "rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-orange-600 dark:text-slate-300 dark:hover:text-orange-400";

export async function Header() {
  const configured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
  let user = null;
  if (configured) {
    const supabase = await createClient();
    const session = await supabase.auth.getUser();
    user = session.data.user;
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/50 bg-white/95 shadow-sm backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/95">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <BrandLogo priority />

        <div className="hidden md:flex">
          <ServiceModeToggle variant="header" />
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={navLinkClass}>
              {link.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link href="/tableau-de-bord" className={navLinkClass}>
                Tableau de bord
              </Link>
              <Link href="/profil" className={navLinkClass}>
                Profil
              </Link>
              <ThemeToggle />
              <form action={signOut}>
                <Button type="submit" variant="outline" size="sm" className="rounded-xl">
                  Déconnexion
                </Button>
              </form>
            </>
          ) : (
            <div className="ml-2 flex items-center gap-2">
              <ThemeToggle />
              <Button asChild variant="ghost" size="sm">
                <Link href="/connexion">Connexion</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 font-extrabold text-white shadow-lg shadow-orange-500/25 hover:from-orange-600 hover:to-orange-700"
              >
                <Link href="/inscription">Créer un compte</Link>
              </Button>
            </div>
          )}
        </nav>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                aria-label="Menu"
                className="rounded-xl border-slate-200"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="mt-8 flex flex-col gap-3">
                <BrandLogo />
                <ServiceModeToggle variant="header" className="w-fit" />
                {links.map((link) => (
                  <Link key={link.href} href={link.href} className="text-base font-medium">
                    {link.label}
                  </Link>
                ))}
                {user ? (
                  <>
                    <Link href="/tableau-de-bord">Tableau de bord</Link>
                    <Link href="/profil">Profil</Link>
                    <form action={signOut}>
                      <Button type="submit" variant="outline" className="w-full rounded-xl">
                        Déconnexion
                      </Button>
                    </form>
                  </>
                ) : (
                  <>
                    <Button asChild variant="outline" className="rounded-xl">
                      <Link href="/connexion">Connexion</Link>
                    </Button>
                    <Button asChild className="rounded-xl bg-orange-500 font-extrabold hover:bg-orange-600">
                      <Link href="/inscription">Créer un compte</Link>
                    </Button>
                  </>
                )}
                <p className="flex items-center gap-2 pt-4 text-xs text-muted-foreground">
                  <Package className="h-4 w-4 text-orange-500" />
                  Passagers et colis sur le même trajet
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
