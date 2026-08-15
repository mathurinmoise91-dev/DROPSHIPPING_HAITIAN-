# DROPSHIPPING_HAITIAN-

Boutique de dropshipping pour le marché haïtien et la diaspora.

## Stack

| Couche | Choix |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Langage | TypeScript |
| UI | React 19 |
| Styles | Tailwind CSS v4 (config CSS-first) |
| Composants | shadcn/ui sur Radix (`radix-ui`) |
| Icônes | Lucide |
| Polices | Rubik (titres) + Nunito Sans (texte), via `next/font` |

## Démarrer

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # build de production
npm run lint
```

## Design system

Les tokens vivent dans `src/app/globals.css`, en variables CSS mappées vers Tailwind
via `@theme inline`.

**Palette** — bleu du drapeau haïtien en couleur primaire, ambre mangue en accent de
conversion. Toutes les paires texte/fond utilisées passent le contraste WCAG AA
(4.5:1), en clair comme en sombre.

Deux points à connaître avant de toucher aux tokens :

- `--accent` est le token **neutre de survol** de shadcn (menus, boutons ghost). Ce
  n'est pas la couleur de marque. L'accent de marque est `--cta`, à utiliser pour les
  promos, prix barrés et CTA principaux.
- L'ambre ne porte jamais de texte blanc (3.19:1, échoue AA). Sa couleur de texte est
  `--cta-foreground`, quasi noire.

Le rouge est réservé à `--destructive` : c'est pourquoi le CTA est ambre et non rouge
drapeau, pour éviter la collision sémantique.

Le mode sombre s'active via la classe `.dark` sur `<html>`. Aucun sélecteur de thème
n'est encore branché.

## Structure

```
src/
  app/           layout (polices, metadata), page d'accueil, globals.css
  components/
    ui/          composants shadcn (sources officielles, éditables)
    site-header.tsx
    product-card.tsx
  lib/
    products.ts  catalogue de démonstration + formatage HTG
    utils.ts     helper cn()
```

## État actuel

La page d'accueil est en place (hero, grille produits, réassurance, CTA final).

Ce qui n'existe pas encore :

- Les routes `/produits`, `/categories`, `/suivi`, `/aide` et `/inscription` sont
  liées depuis la navigation mais non créées — Next.js renvoie 404 sur leur prefetch.
- `src/lib/products.ts` est un catalogue en dur, à remplacer par le flux du
  fournisseur dropshipping.
- Le panier est un bouton sans état ; aucune logique de commande ni de paiement.
- Les visuels produits sont des dégradés de remplacement, au bon ratio pour éviter
  le décalage de mise en page une fois les vraies images branchées.

## Skills IA

`.claude/skills/` contient le pack UI/UX Pro Max, installé via
`npx ui-ux-pro-max-cli init --ai claude`. Ces fichiers guident l'assistant sur les
décisions de design ; ils ne font pas partie du build (exclus du lint).
