# SITE-WEB

Marketplace haïtienne. Nouveau départ, indépendant de la vitrine à la racine du
dépôt, qui reste intacte.

## Stack

| Couche | Choix |
|---|---|
| Framework | Next.js 16 (App Router) |
| Langage | TypeScript |
| Styles | Tailwind CSS v4 (config CSS-first) |
| Internationalisation | next-intl 4 |
| Base de données | Prisma 7 (schéma à venir) |
| Polices | Bricolage Grotesque (titres) + Public Sans (texte) |

## Démarrer

```bash
npm install
npm run dev            # http://localhost:3000 → redirige vers /fr
npm run build
npm run lint
npm run check:i18n     # parité des traductions
```

## Déploiement

Projet Vercel `site-web`, lié au dépôt avec `site-web` comme répertoire racine —
l'application à la racine du dépôt a son propre projet, `kay-boutik`, et les deux
se déploient indépendamment.

La branche de production est `main`. Tant que cette refonte n'y est pas fusionnée,
seules les branches de travail produisent des aperçus.

## Langues

Français par défaut, kreyòl ayisyen et anglais. Chaque langue a son préfixe
d'URL (`/fr`, `/ht`, `/en`), ce qui donne une adresse partageable par langue et
un `hreflang` honnête.

Aucune chaîne d'interface n'est codée en dur : tout passe par `messages/*.json`.
`npm run check:i18n` échoue si une clé manque, est en trop ou est vide dans une
des trois langues. Il tourne sur 53 clés aujourd'hui.

## Design

Direction « Fer Découpé ». Les tokens vivent dans `src/app/globals.css`.

- **Indigo profond** en fond, **cuivre** pour les actions, **vert argent** réservé
  aux signaux de confiance (en stock, payé, livré), **encre chaude** pour le texte,
  **papier clair** pour les surfaces.
- Le rouge n'est jamais décoratif : il ne signifie qu'une erreur ou une annulation.
- Le motif `.motif` est une trame inspirée du fer découpé de Croix-des-Bouquets,
  dessinée en SVG : quelques centaines d'octets, net à toute taille.
- Toutes les paires utilisées passent WCAG AA, en clair comme en sombre.

Le thème a trois états : clair, sombre, ou suivi du système. Un script bloquant
dans le layout applique le choix avant le premier rendu, pour éviter le
clignotement.

## Règle anti-données fictives

`src/lib/catalogue.ts` est le seul point de lecture du catalogue. Aucune base
n'étant connectée, chaque fonction renvoie un résultat réellement vide, et les
pages affichent de vrais zéros et de vrais états vides. Brancher Prisma plus tard
ne changera rien au-dessus de cette couche.

Les moyens de paiement non configurés s'affichent désactivés avec la mention
« Bientôt disponible ». Aucune transaction simulée.

## État

| État | Élément |
|---|---|
| ✅ | Direction visuelle, tokens, thèmes clair/sombre |
| ✅ | i18n FR/HT/EN avec parité vérifiée |
| ✅ | Page d'accueil avec états vides réels |
| 🔴 | Base de données, schéma Prisma |
| 🔴 | Authentification, comptes |
| 🔴 | Catalogue, panier, commandes |
| 🔴 | Espaces vendeur, livreur, administration |
| ⚪ | MonCash, NatCash, cartes — aucun compte marchand |
