# CLAUDE.md — Pokémon Card Registry V2 (Français)

## Contexte Projet
Application React interactive de gestion de collection Pokémon TCG pour le beau-frère de Livio. Permet de tracker les cartes possédées (110+ extensions, 1999-2025) avec sauvegarde automatique, recherche intelligente et noms Pokémon en français via PokeAPI.

**Version actuelle** : **2.0** — Interface & données complètement en français

---

## Fichiers Clés

### Source Principale
- `pokemon-registry.jsx` — Composant React monolithique (~900 lignes)
  - Gère : état, API (PokémonTCG + PokeAPI), UI, sauvegarde, recherche, filtrage, traductions
  - **1 fichier intentionnel** pour clarté et auto-contenance
  - **V2 ajout** : traduction française complète + PokeAPI pour noms Pokémon FR

### Point d'Entrée
- `index.html` — Charge React/Babel via CDN (pas de build tool requis)

### Documentation
- `PROMPT.md` — Spécifications détaillées du projet
- `CLAUDE.md` — Ce fichier (architecture et contexte)
- `README.md` — Guide utilisateur + démarrage

---

## Ressources Externes

### 1. PokémonTCG API
- **Endpoint** : `https://api.pokemontcg.io/v2/cards?q=set.id:{setId}&pageSize=500`
- **Réponse** : `{ data: [ { id, number, name, images, types, rarity, hp, supertype, artist } ] }`
- **Authentification** : Aucune requise (endpoint public)
- **Limitation** : 500 cartes max par requête (fallback à placeholders)

### 2. PokeAPI (NOUVEAU en V2)
- **Endpoint** : `https://pokeapi.co/api/v2/pokemon-species/{slug}`
- **Réponse** : `{ names: [ { name: "...", language: { name: "fr" } }, ... ] }`
- **Utilité** : Traduire les noms Pokémon en français
- **Caching** : localStorage (`pokeapi-fr-names-v1`) pour éviter requêtes répétées
- **Batching** : Max 10 requêtes parallèles pour ne pas surcharger l'API

### 3. Stockage Local
- **Clé** : `"pokemon-registry-v1"` (cartes possédées)
- **Cache FR** : `"pokeapi-fr-names-v1"` (noms Pokémon traduits)
- **Format** : JSON, sauvegarde debounced (800ms)
- **Fallback** : localStorage si `window.storage` indisponible

---

## Architecture Données V2

### État Principal
```javascript
{
  owned: { setId: { cardNumber: boolean } },
  selectedSet: { id, name, name_fr, year, era, total },
  cards: [ { id, number, name, supertype, types, images, rarity, hp, artist, setId, setName } ],
  frenchNames: Map<pokemonSlug, frenchName>,  // NOUVEAU V2
  search: "dracaufeu" | "pikachu" | "25",
  filterOwned: "all" | "owned" | "missing",
  view: "sets" | "cards",
  eraFilter: "all" | eraName,
  previewCard: card | null,
  loadingCards: boolean,
  loadingStorage: boolean,
  stats: { total, owned }
}
```

### Constantes de Traduction (NOUVEAU V2)

**ERA_NAMES_FR** :
- Base → "Ère de Base", Neo → "Ère Néo", XY → "Ère XY", S&M → "Ère SL", S&V → "Ère EV", etc.

**TYPE_NAMES_FR** :
- Fire → "Feu", Water → "Eau", Grass → "Plante", Electric → "Électrique", Psychic → "Psy", Dark → "Ténèbres", Steel → "Métal", etc.

**RARITY_NAMES_FR** :
- Common → "Commun", Uncommon → "Peu Commun", Rare → "Rare", Secret Rare → "Rare Secrète", Ultra Rare → "Ultra Rare", etc.

**SETS** — Chaque extension a `name_fr` :
```javascript
{ id: "base1", name: "Base Set", name_fr: "Édition de Base", year: 1999, era: "Base", total: 102 }
```

---

## Flux Traduction V2

### 1. Extraction Pokémon
```javascript
extractPokemonSlug("Pikachu V") → "pikachu"
extractPokemonSlug("Charizard VMAX") → "charizard"
// Strip suffixes : V, VMAX, VSTAR, GX, EX, LV.X, δ, SP, LEGEND, PRIME
```

### 2. Fetch Noms Français
```
fetchFrenchNames(cards) {
  1. Charger cache localStorage
  2. Identifier slugs manquants
  3. Batcher requêtes PokeAPI (max 10 en parallèle)
  4. Parser response.names.find(n => n.language.name === "fr")
  5. Mettre en cache + retourner Map<slug, frenchName>
}
```

### 3. Rendu UI
```
CardItem : affiche card.frenchName || card.name
CardModal : affiche frenchName dans titre
Types : utilise TYPE_NAMES_FR[type]
Rareté : utilise RARITY_NAMES_FR[rarity]
Extension : affiche set.name_fr || set.name
```

---

## Performance & Cache V2

### localStorage Cache
- **Clé** : `pokeapi-fr-names-v1`
- **Format** : `{ "pikachu": "Pikachu", "charizard": "Dracaufeu", ... }`
- **Bénéfice** : Évite ~50+ requêtes par ouverture de set
- **TTL** : Illimité (invalidation manuelle)

### Batching PokeAPI
```javascript
// Si 75 noms manquants → 8 batchs de 10 + 1 de 5
// Promise.allSettled → pas d'erreur si 1 Pokémon indisponible
// Fallback gracieux : utiliser le nom anglais si FR indisponible
```

---

## Flux Principal V2

### 1. Mount
```
componentDidMount() → loadStorageData() → setOwned() → UI prête
```

### 2. Clic Extension
```
openSet(set) → setSelectedSet + setView("cards") → fetchCards(set)
  → API PokémonTCG (HTTP GET)
  → fetchFrenchNames() en parallèle (PokeAPI batch)
  → setCards() + setFrenchNames() → affichage grille
```

### 3. Recherche (Bilingue)
```
user tape "dracaufeu" ou "charizard"
→ normalize(input) → filteredCards.filter(...)
  → compare contre card.frenchName ET card.name
  → match même si une est en FR et l'autre en EN
```

### 4. Toggle & Sauvegarde
```
toggleCard(setId, cardNum) → setOwned(prev => {...})
  → debouncedSave(newOwned) après 800ms
  → stats update auto
```

---

## Normalisation Recherche

```javascript
const normalize = (str) =>
  str.toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")     // accents → base
    .replace(/[^a-z0-9\s]/g, " ")              // ponctuation → espace
    .replace(/\s+/g, " ").trim();

// Exemples
normalize("Dracaufeu") → "dracaufeu"
normalize("Charizard V") → "charizard v"
normalize("Mr. Mime") → "mr mime"
```

---

## Considérations Importantes

### PokémonTCG API
- Limites : 500 cartes/requête → fallback placeholders
- Aucune auth requise → endpoint public
- Certains Pokémon multilingues dans la base

### PokeAPI
- ~1050 Pokémon supportés (gen 1-9)
- Noms français fiables pour tous
- Rate limiting implicite (~5-10 req/sec) → batching évite blocage
- Cas spéciaux gérés : "Mr. Mime" → "mr-mime", etc.

### Performance & Stockage
- **Lazy load** cartes par extension seulement
- **useCallback** sur toggleCard, fetchCards, fetchFrenchNames
- **localStorage** a ~5-10MB limite → ~2000 cartes possédées OK
- **Debounce 800ms** sauvegarde → max 1-2 saves/sec

### A11y
- Buttons clickables, labels accessibles
- Contraste ≥ 4.5:1 conforme WCAG AA
- Rien ne repose sur JS pour contenu (fallback gracieux)

---

## Améliorations Futures Probables

1. **Multilingue complet** — ajouter ES, IT, DE, JA
2. **Export/Import** — JSON backup
3. **Tri personnalisé** — par rareté, HP, illustrateur
4. **Estimation valeur** — TCGPlayer API
5. **Stats détaillées** — completion % par ère
6. **Partage listes** — URL avec sélection encodée
7. **Tri numérique correct** — gérer `TG01`, `GG25` vs `1`, `25`

---

## Exécution

```bash
# Démarrage simple
npx serve /path/to/pokemon-registry

# App accessible sur http://localhost:3000
```

---

## Notes pour Livio

**V2 apporte** :
- Interface entièrement en français
- Noms Pokémon traduits automatiquement (Dracaufeu, Carapuce, Florizarre, etc.)
- Recherche en français ("dracaufeu" trouve Charizard)
- Tous les labels, messages, filtres en français
- Aucune dépendance supplémentaire (React CDN + PokeAPI public)

**À montrer au beau-frère** :
- 110+ extensions TCG en français
- Traduction en temps réel des Pokémon (cache intelligent)
- Sauvegarde automatique entre sessions
- Responsive design (mobile/desktop)
- Trophée 🏆 à 100% de complétion

---

**Version** : 2.0 (Français)  
**Dernière mise à jour** : Mai 2026  
**Auteur** : Claude Code  
**Pour** : Livio & son beau-frère
