# Architecture cible — Livre-moi.ca

## Surfaces

| Surface | Stack | Rôle |
|---------|--------|------|
| **Web public** | Next.js (ce dépôt) | SEO, landing, FAQ, recherche / réservation bureau |
| **Admin** | Next.js + template [Tailwind Admin](https://tailwind-admin.com/nextjs) | Modération, litiges, users, trajets, GPS, chats |
| **Mobile terrain** | Expo (nouveau dépôt ou `apps/mobile` monorepo) | Conducteurs & clients réguliers : push, GPS, caméra, OTP/QR, chat |
| **Backend** | Supabase | Auth unique, Postgres + PostGIS, Realtime, Storage |

Un compte = un `profiles.id` partout. Une base = une vérité.

```
┌─────────────────────┐   ┌─────────────────────┐   ┌─────────────────────┐
│  Next.js (public)   │   │  Next.js (admin)    │   │  Expo (mobile)      │
│  SEO · résa · trust │   │  tickets · GPS · RH │   │  action · push · GPS│
└──────────┬──────────┘   └──────────┬──────────┘   └──────────┬──────────┘
           │                         │                         │
           └─────────────────────────┼─────────────────────────┘
                                     ▼
                    ┌────────────────────────────────┐
                    │  Supabase Auth · DB · Realtime │
                    └────────────────────────────────┘
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
2. **Admin panel** — `Tailwindadmin-nextjs/packages/nextauth` (port `3001`, `npm run dev:admin`).
3. **Expo** — Cœur terrain (GPS, push, caméra) sur le même backend.
4. Paiements, avis UI, polish prod.

### Admin actuel

- App : `Tailwindadmin-nextjs/packages/nextauth`
- Auth : Supabase uniquement, garde `profiles.role = ADMIN`
- Pages métier : `/`, `/users`, `/trips`, `/trips/[id]`, `/bookings`, `/tickets`, `/tickets/[id]`, `/conversations`
- Apps template portées : `/apps/kanban`, `/apps/chats`, `/apps/notes`, `/apps/tickets` (+ create)
- UI template : `/shadcn-tables/*`, `/widgets/cards`
- Doc template : https://tailwind-admin.github.io/tailwind-admin-documentation/premium-documentation/nextjs/index.html

### Pourquoi Admin avant Expo ?

| Critère | Admin d’abord | Expo d’abord |
|---------|---------------|--------------|
| Stack déjà maîtrisée | Oui (Next.js) | Nouveau runtime |
| Opérer litiges dès les 1ers users | Oui | Difficile sans outils |
| Valider le schéma (tickets, GPS, chat) | UI admin = premier consommateur | Possible, mais ops aveugle |
| Valeur terrain (push, GPS fond) | Différée | Immédiate |
| Contournement court terme | — | PWA / mobile web pour actions basiques |

**Décision :** Admin en premier. Expo ensuite.  
Le web + PWA couvrent l’usage basique pendant que l’admin sécurise l’opération ; Expo apporte ensuite le vrai avantage terrain.

## Monorepo (optionnel)

Plus tard : Turborepo avec `apps/web`, `apps/admin`, `apps/mobile`, `packages/shared` (types `Trip`, `Booking`, helpers Supabase). Pas bloquant : l’admin tourne déjà dans `Tailwindadmin-nextjs/packages/nextauth`.

## Références SQL

1. [`supabase/migrations/00001_init.sql`](../supabase/migrations/00001_init.sql) — Cœur métier
2. [`supabase/migrations/00002_messaging_support_tracking.sql`](../supabase/migrations/00002_messaging_support_tracking.sql) — Messages, tickets, GPS
3. [`supabase/migrations/00003_admin_policies.sql`](../supabase/migrations/00003_admin_policies.sql) — Politiques lecture/écriture ADMIN
