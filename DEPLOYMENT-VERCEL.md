# Deployment Vercel — Pokédex Écarlate Neo

## 🚀 Domaine Final
**`pokedex-ecarlate-neo.fr`**

---

## 📋 Prérequis

- [x] Compte GitHub (gratuit : https://github.com/signup)
- [x] Compte Vercel (gratuit : https://vercel.com/signup)
- [x] Git installé en local (`git --version` dans terminal)
- [x] Node.js & npm installés (`node -v`, `npm -v`)
- [x] VS Code avec Claude Code extension

---

## 🔧 ÉTAPE 1 : Prépare le dossier du projet

```bash
# Crée un dossier pour le projet
mkdir -p ~/projects/pokedex-ecarlate-neo
cd ~/projects/pokedex-ecarlate-neo

# Initialise un repo Git
git init
git config user.name "Ton Nom"
git config user.email "ton.email@example.com"
```

---

## 📁 ÉTAPE 2 : Structure du projet

Crée cette arborescence :

```
pokedex-ecarlate-neo/
├── package.json              (créé ci-après)
├── public/
│   ├── index.html           (créé ci-après)
│   └── favicon.ico          (optionnel)
├── src/
│   ├── index.js             (point d'entrée React)
│   ├── App.jsx              (composant principal)
│   └── index.css            (reset CSS minimal)
├── .gitignore               (créé ci-après)
├── README.md                (créé ci-après)
└── vercel.json              (config Vercel, créé ci-après)
```

---

## 📦 ÉTAPE 3 : Fichiers de configuration

### `package.json`

```json
{
  "name": "pokedex-ecarlate-neo",
  "version": "1.0.0",
  "description": "Pokédex complet - Tracker de collection Pokémon TCG",
  "author": "Livio",
  "license": "MIT",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "react-scripts": "5.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
```

### `public/index.html`

```html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#FFD700" />
    <meta name="description" content="Pokédex Écarlate Neo - Tracker de collection Pokémon TCG" />
    <title>Pokédex Écarlate Neo | Collection Pokémon TCG</title>
  </head>
  <body>
    <noscript>Tu as besoin de JavaScript pour utiliser cette appli.</noscript>
    <div id="root"></div>
  </body>
</html>
```

### `src/index.js`

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### `src/index.css`

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}
```

### `src/App.jsx`

**Copie le contenu de `pokemon-registry.jsx` ici** (que tu as déjà)

```javascript
import { useState, useEffect, useCallback, useRef } from "react";

const SETS = [
  // ... (tout le contenu de pokemon-registry.jsx)
];

// ... reste du code
```

### `.gitignore`

```
# Dependencies
node_modules/
/.pnp
.pnp.js

# Testing
/coverage

# Production
/build
/dist

# Misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.vscode/
.idea/
*.swp
*.swo

# Vercel
.vercel
```

### `vercel.json`

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "env": {
    "GENERATE_SOURCEMAP": "false"
  }
}
```

### `README.md`

```markdown
# Pokédex Écarlate Neo

Tracker complet et interactif de collection Pokémon TCG (Trading Card Game).

## 🎮 Fonctionnalités

- 📦 **110+ extensions** (Base Set 1999 → Journey Together 2025)
- 🔍 **Recherche intelligente** (accents, casse, numéros)
- 💾 **Sauvegarde automatique** du statut possédé/manquant
- 🎴 **Visualisation en grand** de chaque carte
- 📊 **Statistiques** de complétude par extension
- 📱 **Responsive** — fonctionne sur téléphone, tablet, desktop

## 🚀 Démarrage Local

```bash
npm install
npm start
```

Ouvre http://localhost:3000

## 📦 Build Production

```bash
npm run build
```

## 🌐 Hébergement

Déployé sur Vercel : https://pokedex-ecarlate-neo.fr

## 📄 Licence

MIT
```

---

## 🔐 ÉTAPE 4 : Crée le repo GitHub

**Via GitHub.com** :

1. Va sur https://github.com/new
2. **Repository name** : `pokedex-ecarlate-neo`
3. **Description** : `Tracker de collection Pokémon TCG - Pokédex Écarlate Neo`
4. **Public** ✓ (ou Private si tu préfères)
5. **DO NOT** init avec README/gitignore (tu les as déjà)
6. Clique **"Create repository"**

Tu vas voir une page avec des commandes. Garde-la sous les yeux.

---

## 📤 ÉTAPE 5 : Push initial vers GitHub (via VS Code / Terminal)

Depuis ton terminal dans le dossier du projet :

```bash
# Ajoute tous les fichiers
git add .

# Commit
git commit -m "🚀 Initial commit - Pokédex Écarlate Neo setup"

# Crée la branche main (si pas déjà existante)
git branch -M main

# Ajoute l'URL du repo GitHub (remplace par TON username)
git remote add origin https://github.com/TONUSERNAME/pokedex-ecarlate-neo.git

# Push vers GitHub
git push -u origin main
```

**Attends quelques secondes**, puis va vérifier sur https://github.com/TONUSERNAME/pokedex-ecarlate-neo — les fichiers doivent être là !

---

## 🔗 ÉTAPE 6 : Déploie sur Vercel

### Option A : Via Interface Web (Facile)

1. Va sur https://vercel.com/dashboard
2. Clique **"Add New..." → "Project"**
3. Sous "Import Git Repository", cherche `pokedex-ecarlate-neo`
4. Clique **"Import"**
5. **Framework Preset** : `Create React App` (auto-détecté)
6. **Root Directory** : `.`
7. **Environment Variables** : laisser vide
8. Clique **"Deploy"**

**Attends 2-3 min** → Deploy terminé ! 🎉

### Option B : Via Vercel CLI (Avancé)

```bash
# Install Vercel CLI globalement
npm install -g vercel

# Login (ouvre un navigateur pour autoriser)
vercel login

# Deploy depuis le dossier du projet
vercel --prod
```

---

## 🌍 ÉTAPE 7 : Configure le domaine `pokedex-ecarlate-neo.fr`

### 7a. Dans Vercel Dashboard

1. Va sur https://vercel.com/dashboard
2. Clique sur le projet `pokedex-ecarlate-neo`
3. Settings → **Domains**
4. Ajoute `pokedex-ecarlate-neo.fr`
5. Vercel te montre les **DNS records** à configurer

### 7b. Configure le DNS

Dépend de où tu as le domaine (Namecheap, OVH, GoDaddy, etc.) :

**Si tu utilises Vercel Nameservers** (recommandé) :
1. Vercel te donne 4 nameservers
2. Va chez ton registrar
3. Change les nameservers pour ceux de Vercel
4. **Attends 24h** pour que ça propage

**OU Si tu utilises CNAME** (plus rapide, 15-30 min) :
1. Ajoute un record CNAME :
   - **Host** : `pokedex-ecarlate-neo`
   - **Value** : `cname.vercel-dns.com.`
2. Sauvegarde

**Vérifie** avec `nslookup pokedex-ecarlate-neo.fr` dans le terminal.

---

## 📝 Commandes Quotidiennes (Claude Code → GitHub → Vercel)

### Workflow Standard

```bash
# 1️⃣ Ouvre Claude Code dans le dossier
#    (dans VS Code : CMD/CTRL + Shift + P → "Claude Code")

# 2️⃣ Claude Code fait les modifs aux fichiers

# 3️⃣ Quand c'est bon, reviens dans le terminal VS Code

# 4️⃣ Stage les changements
git add .

# 5️⃣ Commit avec un message clair
git commit -m "✨ Feature: Add [description]"
# Exemples :
# git commit -m "🐛 Fix: Search normalization"
# git commit -m "✨ Feature: Add filter by rarity"
# git commit -m "🎨 Style: Dark mode tweaks"

# 6️⃣ Push vers GitHub (déclenche déploiement Vercel auto)
git push origin main

# 7️⃣ Vercel auto-déploie (1-2 min) → Check https://pokedex-ecarlate-neo.fr
```

### Raccourcis Utiles

**Si tu veux revenir en arrière :**
```bash
# Annule le dernier commit (garde les modifs locales)
git reset --soft HEAD~1

# Ou annule tout et reviens au dernier push
git reset --hard origin/main
```

**Si tu veux voir l'historique :**
```bash
git log --oneline -10
```

**Si tu veux voir l'état actuel :**
```bash
git status
```

---

## ✅ Checklist Déploiement

- [ ] Dossier `pokedex-ecarlate-neo/` créé avec structure correcte
- [ ] `package.json`, `vercel.json`, `.gitignore` en place
- [ ] `public/index.html` créé
- [ ] `src/index.js`, `src/index.css`, `src/App.jsx` créés
- [ ] Repo GitHub créé (`pokedex-ecarlate-neo`)
- [ ] `git push` initial réussi
- [ ] Projet importé dans Vercel
- [ ] Deploy Vercel terminé (status : "Production")
- [ ] URL Vercel `.vercel.app` accessible
- [ ] Domaine `pokedex-ecarlate-neo.fr` configuré dans Vercel
- [ ] DNS configuré chez le registrar
- [ ] ✅ `pokedex-ecarlate-neo.fr` en live !

---

## 🧪 Test Local Avant Deploy

Avant de pusher, teste en local :

```bash
# Install les dépendances
npm install

# Démarre le serveur de dev
npm start

# Ouvre http://localhost:3000 dans le navigateur
# Test toutes les fonctionnalités

# Arrête avec CTRL+C

# Build production (teste le build)
npm run build

# Sert le build localement (optionnel)
npx serve -s build
# Ouvre http://localhost:3000
```

---

## 🚨 Problèmes Courants

### "npm: command not found"
→ Node.js pas installé. Va sur https://nodejs.org, installe la version LTS, redémarre le terminal.

### "fatal: not a git repository"
→ T'es pas dans le bon dossier. Fais `cd ~/projects/pokedex-ecarlate-neo` et réessaye.

### Deploy Vercel échoue avec "npm run build" error
→ Souvent `react-scripts` manquant. Fais :
```bash
npm install
npm run build
git add .
git commit -m "Fix: Add missing deps"
git push origin main
```

### Domaine pointe vers mauvais endroit
→ Attends 24h pour la propagation DNS. Puis teste `nslookup pokedex-ecarlate-neo.fr`.

### Je veux annuler un push accidentel
```bash
git revert HEAD        # Crée un commit "inverse"
git push origin main   # Push l'annulation
```

---

## 🎯 Workflow Quotidien Résumé

```
┌─────────────────────────────────────────────────────────┐
│ 1. Claude Code modifie les fichiers (src/App.jsx, etc)  │
├─────────────────────────────────────────────────────────┤
│ 2. git add .                                             │
│ 3. git commit -m "message explicite"                     │
│ 4. git push origin main                                  │
├─────────────────────────────────────────────────────────┤
│ 5. Vercel détecte le push, build auto (2-3 min)         │
├─────────────────────────────────────────────────────────┤
│ 6. ✅ pokedex-ecarlate-neo.fr mis à jour !              │
└─────────────────────────────────────────────────────────┘
```

---

## 📞 Support

**Vercel Docs** : https://vercel.com/docs
**GitHub Docs** : https://docs.github.com
**React Docs** : https://react.dev

---

## 🎉 C'est bon !

Une fois que tout est en place, tu peux montrer `pokedex-ecarlate-neo.fr` au beau-frère.

Chaque modification =  `git push` = live en 2 min. 🚀

Bon coding ! 💪
