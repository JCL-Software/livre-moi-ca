# Laboratoire UX (isolé)

Ce dossier est un **git worktree** : `G:\Livre-moi.ca\livre-moi-ux-lab`  
Branche : `experiment/ux-skins`

L’autre éditeur reste sur `G:\Livre-moi.ca\livre-moi-monorepo`. Les deux copies ne partagent pas les fichiers source.

## Itération actuelle : Base Web (Uber)

Le lab utilise le design system d’Uber : [Base Web](https://baseweb.design/) (`baseui` + Styletron).

Accueil type Uber (carte + origine/destination), header noir Base Web, boutons Base Web. Mapbox reste la carte du projet.

## Lancer le site (port 3010)

```bash
cd G:\Livre-moi.ca\livre-moi-ux-lab
npm run dev:web
```

Ouvre http://localhost:3010 — le panneau **Lab UX** en bas à droite permute les skins.

Page récap : http://localhost:3010/ux-lab

## Lancer l’app mobile (lab)

```bash
cd G:\Livre-moi.ca\livre-moi-ux-lab
npm run dev:mobile
```

Le mobile du lab reprend le tab bar flottant + CTA bleu de [Ryde](https://github.com/arushsingh03/uber-clone).

## Référence clonée (non branchée au projet)

`G:\Livre-moi.ca\ux-references\ryde-uber-clone`

Pour voir l’app originale : `cd` dans ce dossier, `npm install`, `npx expo start`.  
Elle utilise Google Maps / Clerk / Stripe — on n’importe **pas** cette stack. Livre-moi garde Mapbox.

## Ajouter un autre clone

1. `git clone <url> G:\Livre-moi.ca\ux-references\<nom>`
2. Extraire couleurs / typo / rayons depuis `tailwind.config.js`
3. Ajouter un id dans `apps/web/src/lib/ux-lab/skins.ts`
4. Ajouter le bloc `html[data-ux-skin="..."]` dans `apps/web/app/globals.css`
