# Architecture cible — Livre-moi.ca

Monorepo Turborepo. Ouvrir `G:\Livre-moi.ca\livre-moi-monorepo` comme unique workspace Cursor.

## Surfaces

| Surface | Package | Stack | Rôle |
|---------|---------|--------|------|
| **Web public** | `@livre-moi/web` | Next.js 16 | SEO, landing, FAQ, recherche / réservation bureau |
| **Admin** | `@livre-moi/admin` | Next.js + Tailwind Admin | Modération, litiges, users, trajets, GPS, chats |
| **Mobile terrain** | `@livre-moi/mobile` | Expo 57 | Conducteurs & clients réguliers : push, GPS, caméra, OTP/QR, chat |
| **Partagé** | `@livre-moi/shared` | TS + Zod + supabase-js | Types, client Supabase, validations, métier |
| **Backend** | `supabase/` | Auth, Postgres + PostGIS, Realtime, Storage | Une base = une vérité |

Un compte = un `profiles.id` partout.

```
┌─────────────────────┐   ┌─────────────────────┐   ┌─────────────────────┐
│  @livre-moi/web     │   │  @livre-moi/admin   │   │  @livre-moi/mobile  │
│  SEO · résa · trust │   │  tickets · GPS · RH │   │  action · push · GPS│
└──────────┬──────────┘   └──────────┬──────────┘   └──────────┬──────────┘
           │                         │                         │
           └──────────── @livre-moi/shared ────────────────────┘
                                     ▼
                    ┌────────────────────────────────┐
                    │  Supabase Auth · DB · Realtime │
                    └────────────────────────────────┘
```

## Arborescence

```
G:\Livre-moi.ca\livre-moi-monorepo\
  apps/web/                 Site public Next.js
  apps/mobile/              App Expo
  packages/shared/          Code commun
  Tailwindadmin-nextjs/packages/nextauth/   Admin (@livre-moi/admin)
  supabase/                 Migrations
  turbo.json
```

## Répartition des fonctionnalités

### Mobile (Expo) — Épuré
- Publier un trajet (flux court)
- Mes trajets / réservations
- OTP / QR + photo colis
- Suivi live (émission GPS conducteur)
- Chat + messages rapides
- Ouvrir un ticket (« Signaler un problème »)
- Push notifications

### Web public (Next.js) — Découverte
- Landing colis + covoiturage, FAQ, confiance
- Recherche spatiale & réservation
- Profil / tableau de bord léger (existant)
- Liens App Store / Play (plus tard)

### Admin (Next.js + template)
- Stats du jour (trajets, colis, revenus)
- Users (vérif identité, blocage)
- Trajets & bookings + tracé GPS historique
- Conversations liées à un trajet / booking
- Centre tickets / litiges (Kanban + fiche)

## Données nouvelles (migration `00002`)

| Table | Usage |
|-------|--------|
| `conversations` + `messages` | Chat conducteur ↔ client (Realtime + historique admin) |
| `trip_locations` | Points GPS persistés (litiges) ; le live utilise aussi Broadcast |
| `support_tickets` + `ticket_messages` | Support / litiges |

Les colis restent des `bookings` (`booking_type = PARCEL`) — Pas de table `packages` séparée.

### Live GPS vs historique
- **Live** : canal Realtime Broadcast `trip:{id}` (léger, pas d’écriture DB à chaque tick).
- **Historique** : insert périodique (30–60 s ou ~50 m) dans `trip_locations` pour l’admin.

### Messagerie
- Realtime `postgres_changes` sur `messages`.
- Push Expo si l’app est fermée (webhook / Edge Function → Expo Push API).

## Ordre de construction recommandé

1. **Schéma SQL** (`00002`, `00003`) — Figé et appliqué sur Supabase.
2. **Admin panel** — `@livre-moi/admin` (port `3001`, `npm run dev:admin`).
3. **Expo** — Cœur terrain (GPS, push, caméra) sur `@livre-moi/shared`.
4. Paiements, avis UI, polish prod.

### Admin actuel

- App : `Tailwindadmin-nextjs/packages/nextauth` (`@livre-moi/admin`)
- Auth : Supabase uniquement, garde `profiles.role = ADMIN`
- Pages métier : `/`, `/users`, `/trips`, `/trips/[id]`, `/bookings`, `/tickets`, `/tickets/[id]`, `/conversations`
- Apps template portées : `/apps/kanban`, `/apps/chats`, `/apps/notes`, `/apps/tickets` (+ create)
- UI template : `/shadcn-tables/*`, `/widgets/cards`
- Doc template : https://tailwind-admin.github.io/tailwind-admin-documentation/premium-documentation/nextjs/index.html

## Références SQL

1. [`supabase/migrations/00001_init.sql`](../supabase/migrations/00001_init.sql) — Cœur métier
2. [`supabase/migrations/00002_messaging_support_tracking.sql`](../supabase/migrations/00002_messaging_support_tracking.sql) — Messages, tickets, GPS
3. [`supabase/migrations/00003_admin_policies.sql`](../supabase/migrations/00003_admin_policies.sql) — Politiques lecture/écriture ADMIN
