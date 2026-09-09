# Livre-moi.ca

Monorepo **Turborepo + npm workspaces** pour le covoiturage et le cotransportage de colis au Québec et en Ontario.

Ouvrez `G:\Livre-moi.ca\livre-moi-monorepo` comme projet unique dans Cursor.

```
G:\Livre-moi.ca\livre-moi-monorepo\
  apps/
    web/          Next.js — site public, SEO, recherche, réservation
    mobile/       Expo — app terrain (GPS, push, caméra, OTP/QR)
  packages/
    shared/       Types, client Supabase, validations, logique métier
  Tailwindadmin-nextjs/packages/nextauth/   Admin (@livre-moi/admin)
  supabase/       Migrations Postgres + PostGIS
```

## Stack

| Surface | Package | Stack |
|---------|---------|--------|
| Web public | `@livre-moi/web` | Next.js 16, Tailwind, shadcn/ui |
| Admin | `@livre-moi/admin` | Next.js + Tailwind Admin (port 3001) |
| Mobile | `@livre-moi/mobile` | Expo 57 / React Native |
| Partagé | `@livre-moi/shared` | Types, Zod, Supabase JS, pricing, data |
| Backend | `supabase/` | Auth, Postgres, PostGIS, Realtime, Storage |

Un compte = un `profiles.id` partout. Une base = une vérité.

## Démarrage local

```bash
cp .env.example .env.local          # référence racine
cp apps/web/.env.example apps/web/.env.local
cp apps/mobile/.env.example apps/mobile/.env
npm install
```

Renseignez les clés Supabase (`NEXT_PUBLIC_*` pour le web/admin, `EXPO_PUBLIC_*` pour le mobile — mêmes valeurs).

```bash
npm run dev:web       # http://localhost:3000
npm run dev:admin     # http://localhost:3001
npm run dev:mobile    # Expo Go / simulateur
```

`npm run dev` lance web + admin en parallèle via Turborepo.

## Supabase

1. Projet cible : `baubdtpbsbaewfuctcig` (région suggérée : `ca-central-1`).
2. SQL Editor : exécutez dans l’ordre
   - [`supabase/migrations/00001_init.sql`](supabase/migrations/00001_init.sql)
   - [`supabase/migrations/00002_messaging_support_tracking.sql`](supabase/migrations/00002_messaging_support_tracking.sql)
   - [`supabase/seed.sql`](supabase/seed.sql)

Architecture (web / admin / Expo) : [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Package partagé

`@livre-moi/shared` contient ce que le web et le mobile doivent réutiliser :

- Types (`Trip`, `Booking`, `Profile`, …)
- Client Supabase navigateur (`createBrowserSupabaseClient`)
- Accès données (recherche, trajets, réservations, profils)
- Validations Zod
- Calculateur de prix colis (`estimerPrixColis`)
- Helpers géo / corridor

Les clients Next.js *cookies* (`@supabase/ssr`) restent dans `apps/web` : ils sont spécifiques au runtime web.

## Déploiement Vercel

Dans le projet Vercel, définissez **Root Directory** = `apps/web`.
