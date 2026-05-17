const { useState, useEffect, useCallback, useRef } = React;

const STORAGE_KEY = "pokemon-registry-v1";

const SETS = [
  // Base Era (1999-2002)
  { id: "base1", name: "Base", name_fr: "Édition de Base", year: 1999, era: "Base", total: 102 },
  { id: "base2", name: "Jungle", name_fr: "Jungle", year: 1999, era: "Base", total: 64 },
  { id: "base3", name: "Fossil", name_fr: "Fossile", year: 1999, era: "Base", total: 62 },
  { id: "base4", name: "Base Set 2", name_fr: "Édition de Base 2", year: 2000, era: "Base", total: 130 },
  { id: "base5", name: "Team Rocket", name_fr: "Team Rocket", year: 2000, era: "Base", total: 82 },
  { id: "gym1", name: "Gym Heroes", name_fr: "Arènes Héroïques", year: 2000, era: "Base", total: 132 },
  { id: "gym2", name: "Gym Challenge", name_fr: "Défi Arènes", year: 2000, era: "Base", total: 132 },
  { id: "base6", name: "Legendary Collection", name_fr: "Collection Légendaire", year: 2002, era: "Base", total: 110 },
  // Neo Era (2000-2003)
  { id: "neo1", name: "Neo Genesis", name_fr: "Néo Genèse", year: 2000, era: "Neo", total: 111 },
  { id: "neo2", name: "Neo Discovery", name_fr: "Néo Découverte", year: 2001, era: "Neo", total: 75 },
  { id: "neo3", name: "Neo Revelation", name_fr: "Néo Révélation", year: 2001, era: "Neo", total: 64 },
  { id: "neo4", name: "Neo Destiny", name_fr: "Néo Destinée", year: 2002, era: "Neo", total: 105 },
  { id: "ecard1", name: "Expedition Base Set", name_fr: "Expédition", year: 2002, era: "Neo", total: 165 },
  { id: "ecard2", name: "Aquapolis", name_fr: "Aquapolis", year: 2003, era: "Neo", total: 147 },
  { id: "ecard3", name: "Skyridge", name_fr: "Sommet Cristal", year: 2003, era: "Neo", total: 144 },
  // EX Era (2003-2007)
  { id: "ex1", name: "Ruby & Sapphire", name_fr: "Rubis & Saphir", year: 2003, era: "EX", total: 109 },
  { id: "ex2", name: "Sandstorm", name_fr: "Tempête de Sable", year: 2003, era: "EX", total: 100 },
  { id: "ex3", name: "Dragon", name_fr: "Dragon", year: 2003, era: "EX", total: 97 },
  { id: "ex4", name: "Team Magma vs Team Aqua", name_fr: "Magma vs Aqua", year: 2004, era: "EX", total: 95 },
  { id: "ex5", name: "Hidden Legends", name_fr: "Légendes Cachées", year: 2004, era: "EX", total: 101 },
  { id: "ex6", name: "FireRed & LeafGreen", name_fr: "Rouge Feu & Vert Feuille", year: 2004, era: "EX", total: 112 },
  { id: "ex7", name: "Team Rocket Returns", name_fr: "Retour de Team Rocket", year: 2004, era: "EX", total: 109 },
  { id: "ex8", name: "Deoxys", name_fr: "Déoxys", year: 2005, era: "EX", total: 107 },
  { id: "ex9", name: "Emerald", name_fr: "Émeraude", year: 2005, era: "EX", total: 106 },
  { id: "ex10", name: "Unseen Forces", name_fr: "Forces Cachées", year: 2005, era: "EX", total: 115 },
  { id: "ex11", name: "Delta Species", name_fr: "Espèces Delta", year: 2005, era: "EX", total: 113 },
  { id: "ex12", name: "Legend Maker", name_fr: "Créateur de Légende", year: 2006, era: "EX", total: 92 },
  { id: "ex13", name: "Holon Phantoms", name_fr: "Fantômes Holon", year: 2006, era: "EX", total: 110 },
  { id: "ex14", name: "Crystal Guardians", name_fr: "Gardiens Cristal", year: 2006, era: "EX", total: 100 },
  { id: "ex15", name: "Dragon Frontiers", name_fr: "Frontières Dragon", year: 2006, era: "EX", total: 101 },
  { id: "ex16", name: "Power Keepers", name_fr: "Gardiens du Pouvoir", year: 2007, era: "EX", total: 108 },
  // Diamond & Pearl Era (2007-2009)
  { id: "dp1", name: "Diamond & Pearl", name_fr: "Diamant & Perle", year: 2007, era: "D&P", total: 130 },
  { id: "dp2", name: "Mysterious Treasures", name_fr: "Trésors Mystérieux", year: 2007, era: "D&P", total: 123 },
  { id: "dp3", name: "Secret Wonders", name_fr: "Merveilles Secrètes", year: 2007, era: "D&P", total: 132 },
  { id: "dp4", name: "Great Encounters", name_fr: "Grandes Rencontres", year: 2008, era: "D&P", total: 106 },
  { id: "dp5", name: "Majestic Dawn", name_fr: "Aube Majestueuse", year: 2008, era: "D&P", total: 100 },
  { id: "dp6", name: "Legends Awakened", name_fr: "Légendes Réveillées", year: 2008, era: "D&P", total: 146 },
  { id: "dp7", name: "Stormfront", name_fr: "Avant-Garde Tempête", year: 2008, era: "D&P", total: 100 },
  { id: "pl1", name: "Platinum", name_fr: "Platine", year: 2009, era: "D&P", total: 127 },
  { id: "pl2", name: "Rising Rivals", name_fr: "Rivaux Montants", year: 2009, era: "D&P", total: 111 },
  { id: "pl3", name: "Supreme Victors", name_fr: "Vainqueurs Suprêmes", year: 2009, era: "D&P", total: 147 },
  { id: "pl4", name: "Arceus", name_fr: "Arcéus", year: 2009, era: "D&P", total: 99 },
  // HeartGold & SoulSilver Era (2010)
  { id: "hgss1", name: "HeartGold & SoulSilver", name_fr: "Cœur d'Or & Âme d'Argent", year: 2010, era: "HGSS", total: 123 },
  { id: "hgss2", name: "HS—Unleashed", name_fr: "Déchaîné", year: 2010, era: "HGSS", total: 95 },
  { id: "hgss3", name: "HS—Undaunted", name_fr: "Sans Peur", year: 2010, era: "HGSS", total: 90 },
  { id: "hgss4", name: "HS—Triumphant", name_fr: "Triomphant", year: 2010, era: "HGSS", total: 102 },
  // Black & White Era (2011-2013)
  { id: "bw1", name: "Black & White", name_fr: "Noir & Blanc", year: 2011, era: "B&W", total: 114 },
  { id: "bw2", name: "Emerging Powers", name_fr: "Pouvoirs Naissants", year: 2011, era: "B&W", total: 98 },
  { id: "bw3", name: "Noble Victories", name_fr: "Victoires Nobles", year: 2011, era: "B&W", total: 101 },
  { id: "bw4", name: "Next Destinies", name_fr: "Destinées Futures", year: 2012, era: "B&W", total: 99 },
  { id: "bw5", name: "Dark Explorers", name_fr: "Explorateurs de l'Ombre", year: 2012, era: "B&W", total: 108 },
  { id: "bw6", name: "Dragons Exalted", name_fr: "Dragons Exaltés", year: 2012, era: "B&W", total: 124 },
  { id: "bw7", name: "Boundaries Crossed", name_fr: "Limites Franchies", year: 2012, era: "B&W", total: 149 },
  { id: "bw8", name: "Plasma Storm", name_fr: "Tempête Plasma", year: 2013, era: "B&W", total: 135 },
  { id: "bw9", name: "Plasma Freeze", name_fr: "Dégel Plasma", year: 2013, era: "B&W", total: 116 },
  { id: "bw10", name: "Plasma Blast", name_fr: "Explosion Plasma", year: 2013, era: "B&W", total: 101 },
  { id: "bw11", name: "Legendary Treasures", name_fr: "Trésors Légendaires", year: 2013, era: "B&W", total: 113 },
  // XY Era (2014-2016)
  { id: "xy1", name: "XY", name_fr: "XY", year: 2014, era: "XY", total: 146 },
  { id: "xy2", name: "Flashfire", name_fr: "Feu Flash", year: 2014, era: "XY", total: 106 },
  { id: "xy3", name: "Furious Fists", name_fr: "Fureur Fulgurante", year: 2014, era: "XY", total: 111 },
  { id: "xy4", name: "Phantom Forces", name_fr: "Forces Spectres", year: 2014, era: "XY", total: 119 },
  { id: "xy5", name: "Primal Clash", name_fr: "Choc Primordial", year: 2015, era: "XY", total: 160 },
  { id: "xy6", name: "Roaring Skies", name_fr: "Cieux Rugissants", year: 2015, era: "XY", total: 108 },
  { id: "xy7", name: "Ancient Origins", name_fr: "Origines Antiques", year: 2015, era: "XY", total: 98 },
  { id: "xy8", name: "BREAKthrough", name_fr: "Percée", year: 2015, era: "XY", total: 162 },
  { id: "xy9", name: "BREAKpoint", name_fr: "Point de Rupture", year: 2016, era: "XY", total: 122 },
  { id: "g1", name: "Generations", name_fr: "Générations", year: 2016, era: "XY", total: 83 },
  { id: "xy10", name: "Fates Collide", name_fr: "Destins Croisés", year: 2016, era: "XY", total: 124 },
  { id: "xy11", name: "Steam Siege", name_fr: "Siège de Vapeur", year: 2016, era: "XY", total: 114 },
  { id: "xy12", name: "Evolutions", name_fr: "Évolutions", year: 2016, era: "XY", total: 108 },
  // Sun & Moon Era (2017-2019)
  { id: "sm1", name: "Sun & Moon", name_fr: "Soleil & Lune", year: 2017, era: "S&M", total: 149 },
  { id: "sm2", name: "Guardians Rising", name_fr: "Gardiens Montants", year: 2017, era: "S&M", total: 145 },
  { id: "sm3", name: "Burning Shadows", name_fr: "Brûlantes Ombres", year: 2017, era: "S&M", total: 147 },
  { id: "sm35", name: "Shining Legends", name_fr: "Légendes Brillantes", year: 2017, era: "S&M", total: 73 },
  { id: "sm4", name: "Crimson Invasion", name_fr: "Invasion Écarlate", year: 2017, era: "S&M", total: 111 },
  { id: "sm5", name: "Ultra Prism", name_fr: "Ultra Prisme", year: 2018, era: "S&M", total: 156 },
  { id: "sm6", name: "Forbidden Light", name_fr: "Lumière Interdite", year: 2018, era: "S&M", total: 131 },
  { id: "sm7", name: "Celestial Storm", name_fr: "Tempête Céleste", year: 2018, era: "S&M", total: 181 },
  { id: "sm8", name: "Lost Thunder", name_fr: "Tonnerre Perdu", year: 2018, era: "S&M", total: 214 },
  { id: "sm9", name: "Team Up", name_fr: "Équipe Unie", year: 2019, era: "S&M", total: 181 },
  { id: "sm10", name: "Hidden Fates", name_fr: "Destinées Cachées", year: 2019, era: "S&M", total: 202 },
  // Sword & Shield Era (2019-2021)
  { id: "swsh1", name: "Sword & Shield", name_fr: "Épée & Bouclier", year: 2019, era: "S&S", total: 202 },
  { id: "swsh2", name: "Rebel Clash", name_fr: "Choc des Rebelles", year: 2020, era: "S&S", total: 192 },
  { id: "swsh3", name: "Darkness Ablaze", name_fr: "Ténèbres Enflammées", year: 2020, era: "S&S", total: 189 },
  { id: "swsh4", name: "Vivid Voltage", name_fr: "Tension Électrique", year: 2020, era: "S&S", total: 185 },
  { id: "swsh5", name: "Battle Styles", name_fr: "Styles de Combat", year: 2021, era: "S&S", total: 163 },
  { id: "swsh6", name: "Chilling Reign", name_fr: "Règne Glacial", year: 2021, era: "S&S", total: 198 },
  { id: "swsh7", name: "Evolving Skies", name_fr: "Cieux Évolutifs", year: 2021, era: "S&S", total: 203 },
  // Scarlet & Violet Era (2022-2025)
  { id: "sv1", name: "Scarlet & Violet", name_fr: "Écarlate & Violet", year: 2023, era: "S&V", total: 198 },
  { id: "sv2", name: "Paldea Evolved", name_fr: "Paldéa Évoluée", year: 2023, era: "S&V", total: 193 },
  { id: "sv3", name: "Obsidian Flames", name_fr: "Flammes Obsidiennes", year: 2023, era: "S&V", total: 207 },
  { id: "sv4", name: "Paradox Rift", name_fr: "Faille Paradoxe", year: 2023, era: "S&V", total: 182 },
  { id: "sv5", name: "Temporal Forces", name_fr: "Forces Temporelles", year: 2024, era: "S&V", total: 167 },
  { id: "sv6", name: "Prismatic Evolutions", name_fr: "Évolutions Prismatiques", year: 2024, era: "S&V", total: 194 },
  { id: "sv7", name: "Surging Sparks", name_fr: "Étincelles Montantes", year: 2024, era: "S&V", total: 182 },
  { id: "sv8", name: "Shrouded Fates", name_fr: "Destins Voilés", year: 2025, era: "S&V", total: 190 }
];

const ERA_NAMES_FR = {
  Base: "Ère de Base",
  Neo: "Ère Néo",
  EX: "Ère EX",
  "D&P": "Ère DP",
  HGSS: "Ère HGSS",
  "B&W": "Ère NB",
  XY: "Ère XY",
  "S&M": "Ère SL",
  "S&S": "Ère EB",
  "S&V": "Ère EV"
};

const ERA_COLORS = {
  Base: "#E3350D",
  Neo: "#6B4FA0",
  EX: "#F27A2D",
  "D&P": "#0099CC",
  HGSS: "#C41E3A",
  "B&W": "#333333",
  XY: "#1F75B8",
  "S&M": "#FFB81C",
  "S&S": "#E60012",
  "S&V": "#8B0000"
};

const TYPE_COLORS = {
  Normal: "#A8A878",
  Fire: "#F08030",
  Water: "#6890F0",
  Electric: "#F8D030",
  Grass: "#78C850",
  Ice: "#98D8D8",
  Fighting: "#C03028",
  Poison: "#A040A0",
  Ground: "#E0C068",
  Flying: "#A890F0",
  Psychic: "#F85888",
  Bug: "#A8B820",
  Rock: "#B8A038",
  Ghost: "#705898",
  Dragon: "#7038F8",
  Dark: "#705848",
  Steel: "#B8B8D0",
  Fairy: "#EE99AC"
};

const TYPE_NAMES_FR = {
  Normal: "Normal",
  Fire: "Feu",
  Water: "Eau",
  Electric: "Électrique",
  Grass: "Plante",
  Ice: "Glace",
  Fighting: "Combat",
  Poison: "Poison",
  Ground: "Sol",
  Flying: "Vol",
  Psychic: "Psy",
  Bug: "Insecte",
  Rock: "Roche",
  Ghost: "Spectre",
  Dragon: "Dragon",
  Dark: "Ténèbres",
  Steel: "Métal",
  Fairy: "Fée"
};

const RARITY_NAMES_FR = {
  "Common": "Commun",
  "Uncommon": "Peu Commun",
  "Rare": "Rare",
  "Rare Holo": "Rare Holo",
  "Ultra Rare": "Ultra Rare",
  "Secret Rare": "Rare Secrète",
  "Illustration Rare": "Rare Illustrée",
  "Special Illustration Rare": "Rare Illustration Spéciale",
  "Hyper Rare": "Hyper Rare",
  "Amazing Rare": "Rare Incroyable",
  "Radiant Rare": "Rare Radiante",
  "LEGEND": "LÉGENDE",
  "Promo": "Promo"
};

const ERA_ORDER = ["Base", "Neo", "EX", "D&P", "HGSS", "B&W", "XY", "S&M", "S&S", "S&V"];

const normalize = (str) => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const getEra = (setId) => {
  const set = SETS.find(s => s.id === setId);
  return set ? set.era : "Base";
};

const debounce = (fn, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

const FR_NAMES_CACHE_KEY = "pokeapi-fr-names-v1";

const extractPokemonSlug = (cardName) => {
  if (!cardName) return null;
  const suffixes = [" V", " VMAX", " VSTAR", " GX", " EX", " LV.X", " δ", " SP", " LEGEND", " PRIME"];
  let slug = cardName;
  for (const suffix of suffixes) {
    if (slug.endsWith(suffix)) {
      slug = slug.slice(0, -suffix.length);
    }
  }
  return slug
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
};

const fetchFrenchNames = async (cards) => {
  if (!cards || cards.length === 0) return new Map();

  let cache = {};
  try {
    const cached = localStorage.getItem(FR_NAMES_CACHE_KEY);
    if (cached) cache = JSON.parse(cached);
  } catch (e) {
    console.error("Failed to load cache:", e);
  }

  const toFetch = [];
  cards.forEach(card => {
    const slug = extractPokemonSlug(card.name);
    if (slug && !cache[slug] && card.supertype === "Pokémon") {
      toFetch.push({ slug, card });
    }
  });

  if (toFetch.length === 0) {
    return new Map(Object.entries(cache).map(([slug, name]) => [slug, name]));
  }

  const batchSize = 10;
  for (let i = 0; i < toFetch.length; i += batchSize) {
    const batch = toFetch.slice(i, i + batchSize);
    await Promise.allSettled(
      batch.map(async ({ slug }) => {
        try {
          const resp = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${slug}`);
          if (resp.ok) {
            const data = await resp.json();
            const frName = data.names?.find(n => n.language?.name === "fr")?.name;
            if (frName) cache[slug] = frName;
          }
        } catch (e) {
          console.error(`Failed to fetch French name for ${slug}:`, e);
        }
      })
    );
  }

  try {
    localStorage.setItem(FR_NAMES_CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.error("Failed to save cache:", e);
  }

  return new Map(Object.entries(cache));
};

function GlobalHeader({ totalCards, ownedCards, currentSetName, onExport, onImportClick }) {
  const percentage = totalCards > 0 ? Math.round((ownedCards / totalCards) * 100) : 0;

  return (
    <div style={{
      background: "linear-gradient(135deg, #16213E 0%, #0D0D1A 100%)",
      padding: "20px 30px",
      borderBottom: "2px solid #FFD700",
      position: "sticky",
      top: 0,
      zIndex: 10,
      backdropFilter: "blur(10px)"
    }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
          <h1 style={{ fontSize: "32px", fontFamily: "'Bebas Neue'", color: "#FFD700", letterSpacing: "2px" }}>
            🎴 REGISTRE DE CARTES POKÉMON
          </h1>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button
              onClick={onExport}
              style={{
                padding: "8px 16px",
                background: "#4CAF50",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: "bold",
                transition: "0.15s"
              }}
              onMouseEnter={e => e.target.style.opacity = "0.8"}
              onMouseLeave={e => e.target.style.opacity = "1"}
            >
              📥 Exporter
            </button>
            <button
              onClick={onImportClick}
              style={{
                padding: "8px 16px",
                background: "#2196F3",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: "bold",
                transition: "0.15s"
              }}
              onMouseEnter={e => e.target.style.opacity = "0.8"}
              onMouseLeave={e => e.target.style.opacity = "1"}
            >
              📤 Importer
            </button>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "14px", color: "#888", marginBottom: "5px" }}>Collection</div>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#FFD700" }}>
                {ownedCards} / {totalCards}
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <div style={{ flex: 1, background: "#1A1A2E", height: "8px", borderRadius: "4px", overflow: "hidden" }}>
            <div
              style={{
                width: `${percentage}%`,
                height: "100%",
                background: `linear-gradient(90deg, #4CAF50, #FFD700)`,
                transition: "width 0.3s ease"
              }}
            />
          </div>
          <div style={{ fontSize: "13px", color: "#FFD700", fontWeight: "bold", minWidth: "50px", textAlign: "right" }}>
            {percentage}%
          </div>
        </div>
        {currentSetName && (
          <div style={{ fontSize: "12px", color: "#888", marginTop: "10px" }}>
            📍 {currentSetName}
          </div>
        )}
      </div>
    </div>
  );
}

function CardModal({ card, onClose, onToggle, isOwned, frenchName }) {
  if (!card) return null;

  const cardTypesDisplay = card.types ? (
    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "15px" }}>
      {card.types.map((type, idx) => (
        <span
          key={idx}
          style={{
            background: TYPE_COLORS[type] || "#666",
            color: "#fff",
            padding: "4px 12px",
            borderRadius: "12px",
            fontSize: "12px",
            fontWeight: "bold"
          }}
        >
          {TYPE_NAMES_FR[type] || type}
        </span>
      ))}
    </div>
  ) : null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.85)",
        backdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
        padding: "20px"
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#16213E",
          borderRadius: "12px",
          padding: "30px",
          maxWidth: "450px",
          width: "100%",
          border: "1px solid #FFD700",
          maxHeight: "90vh",
          overflowY: "auto"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "24px", fontFamily: "'Bebas Neue'", color: "#FFD700" }}>Détails de la carte</h2>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "#FFD700",
              fontSize: "24px",
              cursor: "pointer",
              padding: 0,
              width: "30px",
              height: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            ✕
          </button>
        </div>

        {card.images?.large && (
          <img
            src={card.images.large}
            alt={card.name}
            style={{
              width: "100%",
              borderRadius: "8px",
              marginBottom: "20px",
              border: "1px solid #FFD700"
            }}
          />
        )}

        <h3 style={{ fontSize: "22px", fontWeight: "bold", color: "#F0F0F0", marginBottom: "10px" }}>
          {frenchName || card.name}
        </h3>

        <div style={{ fontSize: "13px", color: "#888", marginBottom: "15px" }}>
          #{card.number} • {card.setName}
        </div>

        {cardTypesDisplay}

        <div style={{ display: "flex", gap: "20px", fontSize: "12px", color: "#888", marginBottom: "20px", flexWrap: "wrap" }}>
          {card.hp && <div>💪 PV : {card.hp}</div>}
          {card.rarity && <div>⭐ {RARITY_NAMES_FR[card.rarity] || card.rarity}</div>}
          {card.artist && <div>🎨 {card.artist}</div>}
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => onToggle(card.setId, card.number)}
            style={{
              flex: 1,
              padding: "12px 20px",
              background: isOwned ? "#4CAF50" : "#FF5252",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "0.15s",
              fontSize: "14px"
            }}
            onMouseEnter={e => e.target.style.opacity = "0.8"}
            onMouseLeave={e => e.target.style.opacity = "1"}
          >
            {isOwned ? "✅ Possédée" : "❌ Manquante"}
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "12px 20px",
              background: "#16213E",
              color: "#FFD700",
              border: "1px solid #FFD700",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "0.15s",
              fontSize: "14px"
            }}
            onMouseEnter={e => e.target.style.background = "#1A1A2E"}
            onMouseLeave={e => e.target.style.background = "#16213E"}
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

function CardItem({ card, isOwned, onToggle, onPreview, setId }) {
  return (
    <div
      style={{
        background: "#16213E",
        borderRadius: "8px",
        overflow: "hidden",
        border: `2px solid ${isOwned ? "#4CAF50" : "#FFD700"}`,
        transition: "transform 0.15s, box-shadow 0.15s",
        cursor: "pointer"
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 8px 16px rgba(255, 215, 0, 0.3)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div
        onClick={() => onPreview(card)}
        style={{
          position: "relative",
          paddingBottom: "140%",
          overflow: "hidden",
          background: "#0D0D1A"
        }}
      >
        {card.images?.small ? (
          <img
            src={card.images.small}
            alt={card.name}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover"
            }}
          />
        ) : (
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#1A1A2E",
            color: "#888",
            fontSize: "12px"
          }}>
            No Image
          </div>
        )}
        {isOwned && (
          <div
            style={{
              position: "absolute",
              top: "5px",
              right: "5px",
              background: "#4CAF50",
              color: "#fff",
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              fontWeight: "bold"
            }}
          >
            ✓
          </div>
        )}
      </div>

      <div style={{ padding: "12px" }}>
        <div style={{ fontSize: "12px", color: "#FFD700", fontFamily: "'DM Mono'", marginBottom: "4px" }}>
          #{card.number}
        </div>
        <div
          style={{
            fontSize: "13px",
            fontWeight: "bold",
            color: "#F0F0F0",
            marginBottom: "8px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical"
          }}
        >
          {card.frenchName || card.name}
        </div>

        {card.types && card.types.length > 0 && (
          <div style={{ display: "flex", gap: "4px", marginBottom: "8px", flexWrap: "wrap" }}>
            {card.types.map((type, idx) => (
              <span
                key={idx}
                style={{
                  background: TYPE_COLORS[type] || "#666",
                  color: "#fff",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontSize: "10px",
                  fontWeight: "bold"
                }}
              >
                {(TYPE_NAMES_FR[type] || type).charAt(0)}
              </span>
            ))}
          </div>
        )}

        <button
          onClick={() => onToggle(setId, card.number)}
          style={{
            width: "100%",
            padding: "8px",
            background: isOwned ? "#4CAF50" : "#FF5252",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: "bold",
            transition: "0.15s"
          }}
          onMouseEnter={e => e.target.style.opacity = "0.8"}
          onMouseLeave={e => e.target.style.opacity = "1"}
        >
          {isOwned ? "✅ Possédée" : "Marquer"}
        </button>
      </div>
    </div>
  );
}

function CardsView({ selectedSet, cards, owned, search, filterOwned, onBack, onToggle, onPreview, loadingCards, onSearchChange, onFilterChange, frenchNames }) {
  const setId = selectedSet.id;
  const ownedInSet = owned[setId] || {};

  const normalizedSearch = normalize(search);

  let filteredCards = cards.filter(card => {
    const cardOwned = !!ownedInSet[card.number];

    if (filterOwned === "owned" && !cardOwned) return false;
    if (filterOwned === "missing" && cardOwned) return false;

    if (normalizedSearch) {
      const cardNameNorm = normalize(card.name);
      const cardNumberStr = String(card.number);
      const words = normalizedSearch.split(" ");
      const matchName = words.every(w => cardNameNorm.includes(w));
      const matchNumber = cardNumberStr.includes(normalizedSearch);
      if (!matchName && !matchNumber) return false;
    }

    return true;
  });

  const ownedCount = Object.values(ownedInSet).filter(Boolean).length;

  return (
    <div>
      <div style={{
        background: "#16213E",
        padding: "20px 30px",
        borderBottom: "1px solid #FFD700",
        position: "sticky",
        top: "100px",
        zIndex: 5
      }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "15px" }}>
            <button
              onClick={onBack}
              style={{
                background: "transparent",
                border: "1px solid #FFD700",
                color: "#FFD700",
                padding: "8px 12px",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
                transition: "0.15s"
              }}
              onMouseEnter={e => {
                e.target.style.background = "#FFD700";
                e.target.style.color = "#0D0D1A";
              }}
              onMouseLeave={e => {
                e.target.style.background = "transparent";
                e.target.style.color = "#FFD700";
              }}
            >
              ← Retour
            </button>
            <h2 style={{ fontSize: "24px", fontFamily: "'Bebas Neue'", color: "#FFD700" }}>
              {selectedSet.name_fr || selectedSet.name} ({selectedSet.year})
            </h2>
            <div style={{ marginLeft: "auto", fontSize: "12px", color: "#888" }}>
              {ownedCount} / {selectedSet.total} cartes
            </div>
          </div>

          <input
            type="text"
            placeholder={loadingCards ? "Chargement des cartes..." : "Rechercher par nom ou numéro..."}
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            disabled={loadingCards}
            style={{
              width: "100%",
              padding: "10px 15px",
              background: "#0D0D1A",
              border: "1px solid #FFD700",
              borderRadius: "6px",
              color: "#F0F0F0",
              fontSize: "14px",
              fontFamily: "'Nunito'",
              opacity: loadingCards ? 0.5 : 1,
              cursor: loadingCards ? "not-allowed" : "text"
            }}
          />

          <div style={{ display: "flex", gap: "10px", marginTop: "15px", flexWrap: "wrap" }}>
            <button
              onClick={() => onFilterChange("all")}
              style={{
                padding: "8px 16px",
                background: filterOwned === "all" ? "#FFD700" : "#16213E",
                color: filterOwned === "all" ? "#0D0D1A" : "#FFD700",
                border: "1px solid #FFD700",
                borderRadius: "20px",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: "bold",
                transition: "0.15s"
              }}
            >
              🎴 Toutes
            </button>
            <button
              onClick={() => onFilterChange("owned")}
              style={{
                padding: "8px 16px",
                background: filterOwned === "owned" ? "#4CAF50" : "#16213E",
                color: filterOwned === "owned" ? "#fff" : "#4CAF50",
                border: "1px solid #4CAF50",
                borderRadius: "20px",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: "bold",
                transition: "0.15s"
              }}
            >
              ✅ Possédées
            </button>
            <button
              onClick={() => onFilterChange("missing")}
              style={{
                padding: "8px 16px",
                background: filterOwned === "missing" ? "#FF5252" : "#16213E",
                color: filterOwned === "missing" ? "#fff" : "#FF5252",
                border: "1px solid #FF5252",
                borderRadius: "20px",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: "bold",
                transition: "0.15s"
              }}
            >
              ❌ Manquantes
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: "30px", maxWidth: "1400px", margin: "0 auto" }}>
        {loadingCards ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#888" }}>
            <div style={{ fontSize: "24px", marginBottom: "15px" }}>🔄</div>
            <div style={{ fontSize: "16px" }}>Chargement en cours...</div>
          </div>
        ) : filteredCards.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#888" }}>
            <div style={{ fontSize: "24px", marginBottom: "15px" }}>🔍</div>
            <div style={{ fontSize: "16px" }}>Aucune carte trouvée</div>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
              gap: "20px"
            }}
          >
            {filteredCards.map(card => {
              const cardSlug = extractPokemonSlug(card.name);
              const frenchName = cardSlug ? frenchNames.get(cardSlug) : null;
              return (
                <CardItem
                  key={card.id}
                  card={{ ...card, frenchName }}
                  isOwned={!!ownedInSet[card.number]}
                  onToggle={onToggle}
                  onPreview={onPreview}
                  setId={setId}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function SetCard({ set, owned, onOpen }) {
  const ownedCount = Object.values(owned[set.id] || {}).filter(Boolean).length;
  const percentage = Math.round((ownedCount / set.total) * 100);
  const isComplete = percentage === 100;

  return (
    <div
      onClick={() => onOpen(set)}
      style={{
        background: "#16213E",
        borderRadius: "8px",
        padding: "20px",
        cursor: "pointer",
        border: `2px solid ${ERA_COLORS[set.era]}`,
        transition: "transform 0.15s, box-shadow 0.15s"
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = `0 8px 16px ${ERA_COLORS[set.era]}40`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "15px" }}>
        <div>
          <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "#F0F0F0", marginBottom: "4px" }}>
            {set.name_fr || set.name}
          </h3>
          <div style={{ fontSize: "12px", color: "#888" }}>
            {set.year}
          </div>
        </div>
        {isComplete && (
          <div style={{ fontSize: "24px" }}>🏆</div>
        )}
      </div>

      <div style={{ marginBottom: "12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
          <span style={{ fontSize: "12px", color: "#888" }}>Progression</span>
          <span style={{ fontSize: "12px", fontWeight: "bold", color: percentage > 50 ? "#4CAF50" : percentage > 25 ? "#FFD700" : "#FF5252" }}>
            {percentage}%
          </span>
        </div>
        <div style={{ background: "#0D0D1A", height: "6px", borderRadius: "3px", overflow: "hidden" }}>
          <div
            style={{
              width: `${percentage}%`,
              height: "100%",
              background: `linear-gradient(90deg, ${ERA_COLORS[set.era]}, #FFD700)`,
              transition: "width 0.3s ease"
            }}
          />
        </div>
      </div>

      <div style={{ fontSize: "12px", color: "#888", textAlign: "center" }}>
        {ownedCount} / {set.total}
      </div>
    </div>
  );
}

function SetsView({ owned, eraFilter, onOpenSet, eras, onEraFilterChange }) {
  const setsByEra = {};
  SETS.forEach(set => {
    if (!setsByEra[set.era]) setsByEra[set.era] = [];
    setsByEra[set.era].push(set);
  });

  const filteredEras = eraFilter === "all" ? ERA_ORDER : [eraFilter];

  return (
    <div style={{ padding: "30px", maxWidth: "1400px", margin: "0 auto" }}>
      <div style={{ marginBottom: "30px" }}>
        <div style={{ fontSize: "14px", color: "#888", marginBottom: "12px" }}>Filtrer par ère :</div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            onClick={() => onEraFilterChange("all")}
            style={{
              padding: "8px 16px",
              background: eraFilter === "all" ? "#FFD700" : "#16213E",
              color: eraFilter === "all" ? "#0D0D1A" : "#F0F0F0",
              border: "1px solid #FFD700",
              borderRadius: "20px",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "0.15s",
              fontSize: "12px"
            }}
          >
            Toutes
          </button>
          {ERA_ORDER.map(era => (
            <button
              key={era}
              onClick={() => onEraFilterChange(era)}
              style={{
                padding: "8px 16px",
                background: eraFilter === era ? ERA_COLORS[era] : "#16213E",
                color: eraFilter === era ? "#fff" : "#F0F0F0",
                border: `1px solid ${ERA_COLORS[era]}`,
                borderRadius: "20px",
                cursor: "pointer",
                fontWeight: "bold",
                transition: "0.15s",
                fontSize: "12px"
              }}
            >
              {era}
            </button>
          ))}
        </div>
      </div>

      {filteredEras.map(era => (
        <div key={era} style={{ marginBottom: "40px" }}>
          <h2 style={{
            fontSize: "24px",
            fontFamily: "'Bebas Neue'",
            color: ERA_COLORS[era],
            marginBottom: "20px",
            paddingBottom: "10px",
            borderBottom: `2px solid ${ERA_COLORS[era]}`
          }}>
            {ERA_NAMES_FR[era] || era}
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "15px"
            }}
          >
            {(setsByEra[era] || []).map(set => (
              <SetCard
                key={set.id}
                set={set}
                owned={owned}
                onOpen={onOpenSet}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function PokemonRegistry() {
  const [owned, setOwned] = useState({});
  const [selectedSet, setSelectedSet] = useState(null);
  const [cards, setCards] = useState([]);
  const [loadingCards, setLoadingCards] = useState(false);
  const [search, setSearch] = useState("");
  const [filterOwned, setFilterOwned] = useState("all");
  const [view, setView] = useState("sets");
  const [eraFilter, setEraFilter] = useState("all");
  const [previewCard, setPreviewCard] = useState(null);
  const [loadingStorage, setLoadingStorage] = useState(true);
  const [frenchNames, setFrenchNames] = useState(new Map());
  const debounceRef = useRef(null);

  const calculateStats = useCallback(() => {
    let total = 0, ownedCount = 0;
    SETS.forEach(set => {
      total += set.total;
      const setOwned = owned[set.id] || {};
      ownedCount += Object.values(setOwned).filter(Boolean).length;
    });
    return { total, owned: ownedCount };
  }, [owned]);

  const stats = calculateStats();

  const loadStorageData = useCallback(async () => {
    try {
      const rawData = window.storage?.getItem?.(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
      const data = rawData ? JSON.parse(rawData) : {};
      setOwned(data);
    } catch (e) {
      console.error("Failed to load storage:", e);
    } finally {
      setLoadingStorage(false);
    }
  }, []);

  const saveStorageData = useCallback((data) => {
    try {
      const json = JSON.stringify(data);
      if (window.storage?.setItem) {
        window.storage.setItem(STORAGE_KEY, json);
      } else {
        localStorage.setItem(STORAGE_KEY, json);
      }
    } catch (e) {
      console.error("Failed to save storage:", e);
    }
  }, []);

  const debouncedSave = useCallback((data) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      saveStorageData(data);
    }, 800);
  }, [saveStorageData]);

  const toggleCard = useCallback((setId, cardNumber) => {
    setOwned(prev => {
      const newOwned = { ...prev };
      if (!newOwned[setId]) newOwned[setId] = {};
      newOwned[setId] = { ...newOwned[setId] };
      newOwned[setId][cardNumber] = !newOwned[setId][cardNumber];
      debouncedSave(newOwned);
      return newOwned;
    });
  }, [debouncedSave]);

  const fetchCards = useCallback(async (set) => {
    setLoadingCards(true);
    try {
      const url = `https://api.pokemontcg.io/v2/cards?q=set.id:${set.id}&pageSize=500&orderBy=number`;
      const response = await fetch(url);
      const data = await response.json();

      const mappedCards = (data.data || []).map(card => ({
        id: card.id,
        number: card.number,
        name: card.name,
        supertype: card.supertype || "",
        types: card.types || [],
        images: card.images || {},
        rarity: card.rarity || "",
        artist: card.artist || "",
        hp: card.hp || null,
        setId: set.id,
        setName: set.name
      }));

      setCards(mappedCards);
      const frNames = await fetchFrenchNames(mappedCards);
      setFrenchNames(frNames);
    } catch (e) {
      console.error("Failed to fetch cards:", e);
      const placeholders = [];
      for (let i = 1; i <= set.total; i++) {
        placeholders.push({
          id: `${set.id}-${i}`,
          number: String(i),
          name: `Card #${i}`,
          supertype: "Pokémon",
          types: [],
          images: {},
          rarity: "",
          artist: "",
          hp: null,
          setId: set.id,
          setName: set.name
        });
      }
      setCards(placeholders);
      setFrenchNames(new Map());
    } finally {
      setLoadingCards(false);
    }
  }, []);

  const openSet = useCallback((set) => {
    setSelectedSet(set);
    setView("cards");
    setSearch("");
    setFilterOwned("all");
    fetchCards(set);
  }, [fetchCards]);

  const closeSet = useCallback(() => {
    setView("sets");
    setSelectedSet(null);
    setCards([]);
    setSearch("");
    setFilterOwned("all");
  }, []);

  useEffect(() => {
    loadStorageData();
  }, [loadStorageData]);

  const handleSearchChange = useCallback((value) => {
    setSearch(value);
  }, []);

  const handleFilterChange = useCallback((filter) => {
    setFilterOwned(filter);
  }, []);

  const handleEraFilterChange = useCallback((era) => {
    setEraFilter(era);
  }, []);

  const handlePreviewCard = useCallback((card) => {
    setPreviewCard(card);
  }, []);

  const handleCloseModal = useCallback(() => {
    setPreviewCard(null);
  }, []);

  const handleExport = useCallback(() => {
    const dataToExport = {
      owned,
      exportedAt: new Date().toISOString(),
      version: "1.0"
    };
    const json = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `pokemon-collection-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [owned]);

  const handleImportClick = useCallback(() => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".json";
    fileInput.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const data = JSON.parse(text);
        if (data.owned && typeof data.owned === "object") {
          setOwned(data.owned);
          saveStorageData(data.owned);
          alert("✅ Collection importée avec succès !");
        } else {
          alert("❌ Format de fichier invalide");
        }
      } catch (e) {
        console.error("Import error:", e);
        alert("❌ Erreur lors de l'import du fichier");
      }
    };
    fileInput.click();
  }, [saveStorageData]);

  if (loadingStorage) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "#0D0D1A",
        color: "#888"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "20px" }}>🔄</div>
          <div style={{ fontSize: "18px" }}>Chargement de votre collection...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#0D0D1A", minHeight: "100vh", color: "#F0F0F0" }}>
      <GlobalHeader
        totalCards={stats.total}
        ownedCards={stats.owned}
        currentSetName={selectedSet?.name}
        onExport={handleExport}
        onImportClick={handleImportClick}
      />

      {view === "sets" && (
        <SetsView
          owned={owned}
          eraFilter={eraFilter}
          onOpenSet={openSet}
          eras={ERA_ORDER}
          onEraFilterChange={handleEraFilterChange}
        />
      )}

      {view === "cards" && selectedSet && (
        <CardsView
          selectedSet={selectedSet}
          cards={cards}
          owned={owned}
          search={search}
          filterOwned={filterOwned}
          onBack={closeSet}
          onToggle={toggleCard}
          onPreview={handlePreviewCard}
          loadingCards={loadingCards}
          onSearchChange={handleSearchChange}
          onFilterChange={handleFilterChange}
          frenchNames={frenchNames}
        />
      )}

      {previewCard && (() => {
        const cardSlug = extractPokemonSlug(previewCard.name);
        const frenchName = cardSlug ? frenchNames.get(cardSlug) : null;
        return (
          <CardModal
            card={previewCard}
            onClose={handleCloseModal}
            onToggle={toggleCard}
            isOwned={!!owned[previewCard.setId]?.[previewCard.number]}
            frenchName={frenchName}
          />
        );
      })()}
    </div>
  );
}

function App() {
  return <PokemonRegistry />;
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
