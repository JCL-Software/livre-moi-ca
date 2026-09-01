# NordTrajet

Plateforme unifiée de **covoiturage** et de **cotransportage de colis** pour l’Abitibi-Témiscamingue et le corridor vers Montréal / Gatineau.

Stack : Next.js 16 (App Router) · TypeScript · Tailwind · shadcn/ui · Supabase (Auth, Postgres, PostGIS, Storage) · Leaflet · Nominatim · OSRM / OpenRouteService.

## Démarrage local

```bash
cp .env.example .env.local
npm install
npm run dev
```

Renseignez dans `.env.local` :

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_SITE_URL` (ex. `http://localhost:3000`)

## Supabase

1. Projet cible : `baubdtpbsbaewfuctcig` (région suggérée : `ca-central-1`).
2. SQL Editor : exécutez dans l’ordre
   - [`supabase/migrations/00001_init.sql`](supabase/migrations/00001_init.sql)
   - [`supabase/seed.sql`](supabase/seed.sql)
3. Authentication → Providers : activez **Email** et **Google**.
4. URL de redirection : `https://votre-domaine/auth/callback` et `http://localhost:3000/auth/callback`.
5. Modèle courriel « Confirm signup » :  
   `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email`

Le MCP Cursor est préconfiguré dans [`.cursor/mcp.json`](.cursor/mcp.json).

## Fonctionnalités

- Recherche spatiale `ST_DWithin` (25 / 30 km) + arrêts du corridor (Val-d’Or, Amos, Rouyn, Louvicourt, Mont-Laurier, Maniwaki, etc.)
- Publication de trajet (places, tarifs, colis, préférences)
- Réservation passager ou colis
- Cycle colis : `PENDING` → `CONFIRMED` → `PICKED_UP` → `DELIVERED`
- OTP à 6 chiffres (hash SHA-256, code visible seulement à l’expéditeur)
- Cartes Carto / OSM, géocodage Nominatim mis en cache, routing OSRM (ou ORS si clé)
- PWA installable, mode hors-ligne de base

## Déploiement Vercel

Projet team : [jcl-software](https://vercel.com/jcl-software)

Ajoutez les mêmes variables d’environnement, puis déployez le dépôt GitHub de l’organisation [JCL-Software](https://github.com/orgs/JCL-Software/repositories).
