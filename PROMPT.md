# Pokémon Card Registry — Prompt Claude Code

## Objectif
Créer une application React interactive de gestion de collection de cartes Pokémon permettant à l'utilisateur de tracker les cartes qu'il possède, avec sauvegarde persistante et visualisation intuitive.

---

## Spécifications Fonctionnelles

### 1. **Vue Extensions**
- Afficher **110+ extensions TCG** (Base Set 1999 → Journey Together 2025)
- **Grouper par ère** : Base, Jungle/Fossil, Neo, EX, D&P, HeartGold, B&W, XY, S&M, S&S, S&V
- Pour chaque extension :
  - Nom, année, nombre total de cartes
  - Barre de progression (cartes possédées / total)
  - Trophée 🏆 si collection complétée (100%)
  - % de complétude affiché en couleur
- **Filtrage par ère** — boutons colorés pour filtrer les extensions affichées
- **Statistiques globales** en header : X/Y cartes possédées, pourcentage complété

### 2. **Vue Cartes**
- Au clic sur une extension, afficher toutes ses cartes paginées depuis **PokémonTCG API** (`https://api.pokemontcg.io/v2/cards`)
- Grille de cartes responsive (5–6 cartes par ligne sur desktop)
- Chaque carte affiche :
  - **Image** (hauteur 350–400px, ratio 2.5:3.5)
  - **Numéro de carte** (`#1`, `#101`, `TG01`, etc.)
  - **Nom du Pokémon** (en gras, 2 lignes max)
  - **Types** (badge coloré : Fire, Water, Grass, Electric, etc.)
  - **Bouton "Marquer"** pour toggle possédée/manquante

### 3. **Visualisation en Grand**
- **Clic sur l'image** → modale full-size avec :
  - Image en haute résolution
  - Nom, numéro, extension, types
  - Rareté, illustrateur, PV (si disponible)
  - Bouton pour toggle possédée depuis la modale
  - Fermeture au clic sur ✕ ou backdrop

### 4. **Recherche & Filtrage**
- **Barre de recherche** dans la vue cartes :
  - Recherche par **nom du Pokémon** (insensible à la casse, ignore accents, ponctuation)
  - Recherche par **numéro de carte** (`1`, `101`, `TG01`)
  - Recherche par **mots partiels** (`pika` trouve Pikachu, Pikachu V, Pikachu VMAX)
  - Placeholder change pendant le chargement des cartes
  - Désactivée tant que les cartes chargent

- **Filtres de statut** :
  - ☑️ **Toutes** — affiche toutes les cartes
  - ✅ **Possédées** — affiche que les cartes marquées comme possédées
  - ❌ **Manquantes** — affiche que les cartes non possédées

### 5. **Sauvegarde Persistante**
- Utiliser **`window.storage` API** (artifact storage)
- Structurer : `{ setId: { cardNumber: true/false } }`
- Sauvegarde auto avec **debounce 800ms** après chaque toggle
- Charger au mount du composant
- État préservé entre sessions

### 6. **Design & UX**
- **Thème sombre** : `#0D0D1A` (background), `#16213E` (surfaces), `#FFD700` (accents or)
- **Typographie** : Bebas Neue (titres), Nunito (corps), DM Mono (nombres)
- **Animations** : transitions 0.15–0.3s sur cartes, modales fade-in
- **Header sticky** avec progress globale (cartes/extension en cours)
- **Bouton retour** (←) dans header de la vue cartes
- **Responsive** : grille auto-fill pour mobile/tablet/desktop
- **Emoji** pour visuels : ⚡, 🎴, 🔍, ✅, ❌, 🏆, 🔍 (zoom hint)

---

## Architecture

### État React (useState)
```
- owned: { [setId]: { [cardNumber]: boolean } }
- selectedSet: { id, name, year, total }
- cards: array de cartes (depuis API)
- loadingCards: boolean
- search: string
- filterOwned: "all" | "owned" | "missing"
- view: "sets" | "cards"
- eraFilter: "all" | ère name
- stats: { total, owned }
- loadingStorage: boolean
- previewCard: card object | null
```

### Fonctions Clés
- `loadStorageData()` — fetch depuis window.storage au mount
- `saveStorageData(data)` — debounced save via window.storage
- `fetchCards(set)` — appel API PokémonTCG, fallback placeholders
- `toggleCard(setId, cardNum)` — toggle owned + trigger save
- `normalize(str)` — normalize recherche (accents, casse, ponctuation)
- `getEra(setId)` — map setId → ère name
- `setOwnedCount(setId)` — count cartes possédées par extension

### Données
**Constantes** :
- `SETS` — array complet des 110+ extensions avec `id, name, year, total`
- `ERA_COLORS` — map ère → couleur hex
- `TYPE_COLORS` — map type Pokémon → couleur hex
- `STORAGE_KEY = "pokemon-registry-v1"`

---

## Détails Implémentation

### API PokémonTCG
- **Endpoint** : `https://api.pokemontcg.io/v2/cards?q=set.id:{setId}&pageSize=500&orderBy=number`
- **Réponse** : `{ data: [ { id, number, name, images: { small, large }, types, rarity, artist, hp } ] }`
- **Fallback** : Si erreur réseau, générer placeholders avec numéros de 1 à `set.total`

### Recherche Normalisée
```javascript
const normalize = (str) =>
  str.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")   // strip accents
    .replace(/[^a-z0-9\s]/g, " ")                        // ponctuation → espace
    .replace(/\s+/g, " ").trim();

// Usage : si search, match ALL words de query dans le nom
```

### Style & Couleurs
- **Primary** : `#FFD700` (gold)
- **Success** : `#4CAF50` (green, cartes possédées)
- **Danger** : `#FF5252` (red, manquantes)
- **Background dark** : `#0D0D1A`
- **Surface** : `#16213E`, `#1A1A2E`
- **Text primary** : `#F0F0F0`
- **Text secondary** : `#888`, `#666`

---

## Fichier Structure (Artifact)
```
/pokemon-registry.jsx  (1 fichier React, ~700 lignes)
```

---

## Notes Importantes
1. **Pas d'imports externes** sauf React (useState, useEffect, useCallback, useRef)
2. **Pas de bibliothèques CSS** — tout via `style={{}}` inline
3. **Gestion du layout** — CSS Grid pour extensions/cartes, flexbox pour controls
4. **Performance** — useCallback + debounce sur save, lazy fetch des cartes par extension
5. **Fallback gracieux** — si API down, placeholder cards avec numéro seul
6. **A11y** — buttons clickables, labels accessibles, contraste suffisant

---

## Tests Manuels à Faire
- [ ] Cliquer extension → cartes chargent et affichent images
- [ ] Rechercher `pikachu` → filtre marche malgré casse/accents
- [ ] Cliquer carte → modale s'ouvre avec image large
- [ ] Toggle "Marquer" → couleur change, ✓ apparaît, stats updatées
- [ ] F5 refresh → collection sauvegardée et rechargée
- [ ] Filtres ✅/❌ fonctionnent
- [ ] Header progress bar met à jour en temps réel
- [ ] Trophée 🏆 apparaît quand extension à 100%
- [ ] Mobile responsive : scroll horizontal ok, toucher ok
