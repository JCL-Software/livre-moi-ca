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
  "rounded-full px-3 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white";

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
    <header className="sticky top-0 z-40 h-16 bg-black text-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-4 sm:gap-3">
        <BrandLogo priority variant="light" />

        <ServiceModeToggle variant="header" />

        <nav className="hidden min-w-0 flex-1 items-center justify-end gap-1 md:flex">
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
              <ThemeToggle className="rounded-full border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white aria-expanded:bg-white/10 aria-expanded:text-white dark:border-white/20 dark:bg-transparent dark:text-white dark:hover:bg-white/10 dark:hover:text-white" />
              <form action={signOut}>
                <Button
                  type="submit"
                  variant="outline"
                  size="sm"
                  className="rounded-full border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
                >
                  Déconnexion
                </Button>
              </form>
            </>
          ) : (
            <div className="ml-2 flex items-center gap-2">
              <ThemeToggle className="rounded-full border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white aria-expanded:bg-white/10 aria-expanded:text-white dark:border-white/20 dark:bg-transparent dark:text-white dark:hover:bg-white/10 dark:hover:text-white" />
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="rounded-full text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/connexion">Connexion</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="rounded-full bg-white px-4 font-semibold text-black hover:bg-neutral-200"
              >
                <Link href="/inscription">Créer un compte</Link>
              </Button>
            </div>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-1 md:hidden">
          <ThemeToggle className="rounded-full border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white aria-expanded:bg-white/10 aria-expanded:text-white dark:border-white/20 dark:bg-transparent dark:text-white dark:hover:bg-white/10 dark:hover:text-white" />
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                aria-label="Menu"
                className="rounded-full border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-white">
              <div className="mt-8 flex flex-col gap-3">
                <BrandLogo variant="dark" />
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
                      <Button type="submit" variant="outline" className="w-full rounded-full">
                        Déconnexion
                      </Button>
                    </form>
                  </>
                ) : (
                  <>
                    <Button asChild variant="outline" className="rounded-full">
                      <Link href="/connexion">Connexion</Link>
                    </Button>
                    <Button asChild className="rounded-full font-semibold">
                      <Link href="/inscription">Créer un compte</Link>
                    </Button>
                  </>
                )}
                <p className="flex items-center gap-2 pt-4 text-xs text-muted-foreground">
                  <Package className="h-4 w-4 text-black" />
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
