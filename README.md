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

## Images produits (Higgsfield)

Les visuels sont générés par `scripts/generate-product-images.mjs`, qui utilise le
SDK `@higgsfield/client`.

**Pourquoi le SDK et pas la CLI Higgsfield.** La CLI est un binaire précompilé publié
pour `darwin`/`linux` en `x64`/`arm64` uniquement : elle ne s'installe pas sur
Android/Termux (`EBADPLATFORM`), et son `auth login` passe par un OAuth avec callback
sur `localhost`, inutilisable depuis un environnement distant. Le SDK est du
JavaScript pur et s'authentifie par clé API, donc il fonctionne partout.

### Configurer la clé

Récupérez une clé API dans le tableau de bord Higgsfield, puis :

```bash
export HF_API_KEY=<key_id>
export HF_API_SECRET=<key_secret>
# ou, en une seule variable :
export HF_CREDENTIALS=<key_id>:<key_secret>
```

### Générer

```bash
npm run gen:images                              # simulation, ne dépense rien
npm run gen:images -- --yes                     # génère les images manquantes
npm run gen:images -- --only <id> --yes         # un seul produit
npm run gen:images -- --force --yes             # refait celles qui existent déjà
```

Sans `--yes`, le script se contente de lister ce qu'il ferait : chaque image consomme
des crédits Higgsfield.

Les fichiers atterrissent dans `public/products/`, et le script écrit
`src/lib/product-images.json`, qui associe un id de produit à son chemin. La carte
produit lit ce manifeste : un produit absent garde le dégradé de remplacement, ce qui
permet à la grille de s'afficher avant qu'aucune image n'existe. Le créneau reste en
1:1 dans les deux cas, donc ajouter une image ne décale jamais la mise en page.

## État actuel

La page d'accueil est en place (hero, grille produits, réassurance, CTA final).

Ce qui n'existe pas encore :

- Les routes `/produits`, `/categories`, `/suivi`, `/aide` et `/inscription` sont
  liées depuis la navigation mais non créées — Next.js renvoie 404 sur leur prefetch.
- `src/lib/products.ts` est un catalogue en dur, à remplacer par le flux du
  fournisseur dropshipping.
- Le panier est un bouton sans état ; aucune logique de commande ni de paiement.
- Aucune image produit n'a encore été générée : `src/lib/product-images.json` est
  vide et toutes les cartes affichent le dégradé de remplacement. Le script de
  génération est en place mais n'a jamais tourné contre l'API (pas de clé).

## Skills IA

`.claude/skills/` contient le pack UI/UX Pro Max, installé via
`npx ui-ux-pro-max-cli init --ai claude`. Ces fichiers guident l'assistant sur les
décisions de design ; ils ne font pas partie du build (exclus du lint).
