import Link from "next/link";
import { Bell, Package } from "lucide-react";
import { Menu } from "@/components/animate-ui/icons/menu";
import { createClient } from "@/lib/supabase/server";
import { BrandLogo } from "@/components/layout/brand-logo";
import { ServiceModeToggle } from "@/components/layout/service-mode-toggle";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { signOut } from "@/lib/actions/auth";
import { countUnreadNotifications } from "@livre-moi/shared/data";

const links = [
  { href: "/recherche", label: "Rechercher" },
  { href: "/colis", label: "Colis disponibles" },
  { href: "/trajets/nouveau", label: "Publier un trajet" },
];

const navLinkClass =
  "rounded-full px-3 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white";

export async function Header() {
  const configured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
  let user = null;
  let unreadNotifications = 0;
  if (configured) {
    const supabase = await createClient();
    const session = await supabase.auth.getUser();
    user = session.data.user;
    if (user) {
      unreadNotifications = await countUnreadNotifications(supabase, user.id);
    }
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
              <Link
                href="/notifications"
                className={`${navLinkClass} relative inline-flex items-center gap-1.5`}
              >
                <Bell className="h-4 w-4" />
                <span className="sr-only">Notifications</span>
                {unreadNotifications > 0 ? (
                  <span className="absolute -top-0.5 -right-0.5 inline-flex min-w-4 items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-black">
                    {unreadNotifications > 9 ? "9+" : unreadNotifications}
                  </span>
                ) : null}
              </Link>
              <Link href="/profil" className={navLinkClass}>
                Profil
              </Link>
              <ThemeToggle className="focus-visible:ring-offset-black" />
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
              <ThemeToggle className="focus-visible:ring-offset-black" />
            </div>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-1 md:hidden">
          <ThemeToggle className="focus-visible:ring-offset-black" />
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                aria-label="Menu"
                className="rounded-full border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                <Menu className="h-5 w-5" size={20} animateOnHover />
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
                    <Link href="/notifications">Notifications</Link>
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
