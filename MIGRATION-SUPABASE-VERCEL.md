# Migration — GitHub Pages → Vercel + Supabase

**Date :** Août 2026  
**Objectif :** Passer d'un site statique (2 fichiers, localStorage) à une app React buildée sur Vercel avec une vraie base de données Supabase multi-utilisateurs.

---

## Ce qui a changé

### Avant
- React 18 chargé via CDN (unpkg + Babel standalone)
- Pas de build system (pas de npm, pas de node_modules)
- Auth : username/password en clair dans `index.html`
- Données : localStorage du navigateur (perdues si on change d'appareil)
- Hébergement : GitHub Pages (site statique)
- 2 fichiers : `index.html` + `pokemon-registry.jsx`

### Après
- React 18 via npm + Vite (build tool moderne)
- Auth : Supabase Auth (email/password, comptes réels)
- Données : Supabase PostgreSQL (synchronisées, multi-appareils)
- Hébergement : Vercel (auto-deploy sur `git push`)
- Structure propre avec `src/`

---

## Fichiers créés ou modifiés

### Nouveaux fichiers
| Fichier | Rôle |
|---------|------|
| `package.json` | Dépendances npm (react, react-dom, @supabase/supabase-js, vite) |
| `vite.config.js` | Configuration Vite |
| `src/main.jsx` | Point d'entrée React (remplace le `ReactDOM.createRoot` inline) |
| `src/supabase.js` | Client Supabase (lit les variables d'env) |
| `src/App.jsx` | Composant principal migré (voir détails ci-dessous) |
| `vercel.json` | Config Vercel (`outputDirectory: dist`, `framework: vite`) |
| `.env.local` | Variables d'env locales (non commitées) |

### Fichiers modifiés
| Fichier | Ce qui a changé |
|---------|----------------|
| `index.html` | Supprimé : CDN React/Babel, tout le bloc `<script>` auth, le formulaire HTML login. Gardé : fonts Google, styles globaux body/root |
| `.gitignore` | Ajouté : `dist/`, `.vercel` |

### Fichier conservé tel quel
- `pokemon-registry.jsx` — conservé pour référence, remplacé fonctionnellement par `src/App.jsx`

---

## Détail des adaptations dans `src/App.jsx`

### 1. Imports (ligne 1)
```js
// Avant
const { useState, useEffect, useCallback, useRef } = React;

// Après
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from './supabase.js';
```

### 2. Supprimé
- `const STORAGE_KEY = "pokemon-registry-v1"` — remplacé par table Supabase
- `const NOTES_KEY = "pokemon-notes-v1"` — remplacé par table Supabase
- Fonction `debounce()` — plus nécessaire (upsert direct)
- `saveStorageData()` — remplacée par upsert Supabase
- `debouncedSave()` — remplacée par upsert Supabase
- `debounceRef` — plus nécessaire
- `ReactDOM.createRoot(...)` en bas du fichier — déplacé dans `src/main.jsx`

### 3. Nouveau composant `LoginScreen`
Remplace le formulaire HTML de `index.html`. Interface identique (même design doré), mais rendu en React avec état géré par Supabase Auth.

### 4. Nouveau bouton "Déconnexion" dans `GlobalHeader`
Prop `onLogout` ajoutée, appelle `supabase.auth.signOut()`.

### 5. Nouvel état auth dans `PokemonRegistry`
```js
const [user, setUser] = useState(null);
const [authLoading, setAuthLoading] = useState(true);
const [loginError, setLoginError] = useState('');
```

### 6. useEffect auth (remplace sessionStorage)
```js
useEffect(() => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    setUser(session?.user ?? null);
    setAuthLoading(false);
  });
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    setUser(session?.user ?? null);
  });
  return () => subscription.unsubscribe();
}, []);
```

### 7. `loadStorageData` → Supabase
Charge la collection et les notes depuis Supabase au lieu de localStorage. Dépend de `user` (se re-déclenche à la connexion).

```js
// Transformation : rows Supabase → format interne { setId: { cardNumber: true|'wish' } }
for (const row of collResult.data) {
  ownedData[row.set_id][row.card_number] = row.status === 'owned' ? true : 'wish';
}
```

### 8. `cycleCardStatus` → upsert/delete Supabase
Au lieu de tout re-sérialiser en localStorage, on fait une opération ciblée sur la ligne concernée :
- Passage à `'wish'` ou `true` → `supabase.from('collections').upsert(...)`
- Passage à `undefined` (décoché) → `supabase.from('collections').delete()`

### 9. `handleImportClick` → import bulk vers Supabase
Après avoir parsé le JSON, toutes les cartes sont envoyées en batches de 500 via `supabase.from('collections').upsert(...)`.

### 10. `handleUpdateNote` → upsert Supabase
```js
await supabase.from('card_notes').upsert({ user_id, card_id, condition, price, ... })
```

### 11. Retours précoces au render
```jsx
if (authLoading) return <LoadingScreen />;
if (!user) return <LoginScreen onLogin={handleLogin} error={loginError} />;
if (loadingStorage) return <LoadingScreen />;
// ... reste de l'app
```

### 12. Export default
```js
export default function App() { return <PokemonRegistry />; }
```

---

## Base de données Supabase

### Table `collections`
```sql
CREATE TABLE collections (
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  set_id text NOT NULL,
  card_number text NOT NULL,
  status text NOT NULL CHECK (status IN ('owned', 'wish')),
  updated_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, set_id, card_number)
);
```

### Table `card_notes`
```sql
CREATE TABLE card_notes (
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  card_id text NOT NULL,
  condition text,
  price text,
  purchase_date text,
  note_text text,
  updated_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, card_id)
);
```

### Row Level Security (RLS)
```sql
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own" ON collections
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

ALTER TABLE card_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own" ON card_notes
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
```

Chaque utilisateur ne voit et ne modifie que ses propres données.

### Ce qui reste en localStorage (inchangé)
- `pokeapi-fr-names-v1` — cache des traductions françaises (PokeAPI). Pas critique, juste un cache de performance.

---

## Étapes manuelles restantes

### Étape 1 — Exporter les données actuelles
Dans l'ancienne app → cliquer **📥 Exporter** → conserver le fichier JSON.

### Étape 2 — Créer le projet Supabase
1. Aller sur [supabase.com](https://supabase.com) → New project
2. Récupérer dans Settings → API :
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public key** → `VITE_SUPABASE_ANON_KEY`

### Étape 3 — Créer les tables
SQL Editor → coller et exécuter le SQL des deux tables + RLS ci-dessus.

### Étape 4 — Créer les comptes utilisateurs
Supabase → Authentication → Users → **Create user** :
- Livio : `livio@...` + mot de passe
- Beau-frère : `ecarlate@...` + mot de passe

### Étape 5 — Renseigner `.env.local`
```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

### Étape 6 — Tester en local
```bash
npm run dev
# → http://localhost:5173
# → Se connecter avec email/mot de passe Supabase
# → Importer le JSON exporté à l'étape 1
```

### Étape 7 — Déployer sur Vercel
1. Aller sur [vercel.com](https://vercel.com) → Import Git Repository → choisir ce repo
2. Settings → Environment Variables → ajouter `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`
3. Deploy → puis chaque `git push` redéploie automatiquement

---

## Résultat

- `npm run build` → ✅ build en 2s, 403 kB (112 kB gzippé)
- Multi-utilisateurs avec collections séparées
- Données synchronisées sur tous les appareils
- Auth sécurisée (plus de mot de passe en clair dans le code)
- Deploy automatique via GitHub → Vercel
