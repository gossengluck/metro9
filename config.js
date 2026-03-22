// Configuration Module - Tower configs, difficulty settings, and game parameters

// ===== WORLD CONFIGURATION =====
export const WORLD_SCALE = 3;

// ===== TOWER CONFIGURATIONS =====
export const towerConfigs = {
  "Basis": {cost: 100, damage: 15, range: 110, fireRate: 900, projectileColor: "#ffffff", type: "single"},
  "Sniper": {cost: 350, damage: 70, range: 220, fireRate: 1800, projectileColor: "#ffff00", type: "single"},
  "MG": {cost: 250, damage: 8, range: 90, fireRate: 180, projectileColor: "#ff8c00", type: "single"},
  "Laser": {cost: 500, damage: 5, range: 130, fireRate: 45, projectileColor: "#00ffff", type: "laser"},
  "Rakete": {cost: 700, damage: 60, range: 160, fireRate: 2300, projectileColor: "#ff4444", type: "splash", splashRadius: 55},
  "Feuer": {cost: 400, damage: 3, range: 70, fireRate: 90, projectileColor: "#ff6600", type: "cone", coneAngle: 45},
  "Eis": {cost: 350, damage: 8, range: 110, fireRate: 1400, projectileColor: "#add8e6", type: "slow", slowAmount: 0.5, slowDuration: 2000},
  "Gift": {cost: 450, damage: 12, range: 100, fireRate: 1100, projectileColor: "#ba55d3", type: "poison", poisonDamage: 3, poisonDuration: 5000},
  "Blitz": {cost: 650, damage: 35, range: 140, fireRate: 1600, projectileColor: "#fff700", type: "chain", chainCount: 3},
  "Erde": {cost: 550, damage: 40, range: 95, fireRate: 1500, projectileColor: "#a0826d", type: "stun", stunDuration: 800},
  "Mörser": {cost: 600, damage: 50, range: 190, fireRate: 2000, projectileColor: "#8b6914", type: "splash", splashRadius: 65},
  "Kanone": {cost: 750, damage: 60, range: 150, fireRate: 1800, projectileColor: "#556b2f", type: "single"},
  "Artillerie": {cost: 900, damage: 75, range: 210, fireRate: 2600, projectileColor: "#8b7355", type: "splash", splashRadius: 75},
  "Balista": {cost: 500, damage: 55, range: 170, fireRate: 1700, projectileColor: "#a0522d", type: "single"},
  "Trebuchet": {cost: 1000, damage: 80, range: 230, fireRate: 2800, projectileColor: "#8b4513", type: "splash", splashRadius: 85},
  "Tesla": {cost: 850, damage: 45, range: 130, fireRate: 900, projectileColor: "#4169e1", type: "chain", chainCount: 4},
  "Plasma": {cost: 1100, damage: 55, range: 140, fireRate: 700, projectileColor: "#ff00ff", type: "laser"},
  "Ion": {cost: 1250, damage: 70, range: 150, fireRate: 1300, projectileColor: "#7b68ee", type: "chain", chainCount: 5},
  "Photon": {cost: 1300, damage: 50, range: 160, fireRate: 550, projectileColor: "#ffd700", type: "laser"},
  "Quanten": {cost: 1500, damage: 65, range: 170, fireRate: 1100, projectileColor: "#00ced1", type: "single"},
  "Tornado": {cost: 700, damage: 30, range: 120, fireRate: 900, projectileColor: "#20b2aa", type: "slow", slowAmount: 0.6, slowDuration: 2500},
  "Klebstoff": {cost: 400, damage: 8, range: 100, fireRate: 1800, projectileColor: "#daa520", type: "slow", slowAmount: 0.7, slowDuration: 3000},
  "Schock": {cost: 1100, damage: 75, range: 135, fireRate: 1500, projectileColor: "#ff1493", type: "stun", stunDuration: 1000},
  "Vampir": {cost: 900, damage: 50, range: 110, fireRate: 1200, projectileColor: "#8b0000", type: "lifesteal", lifeStealAmount: 0.3},
  "Multishot": {cost: 650, damage: 22, range: 130, fireRate: 700, projectileColor: "#ff8c00", type: "multishot", projectileCount: 3},
  "Nuklear": {cost: 2500, damage: 140, range: 190, fireRate: 4500, projectileColor: "#32cd32", type: "splash", splashRadius: 130},
  "Schwarzloch": {cost: 3000, damage: 110, range: 160, fireRate: 3500, projectileColor: "#191970", type: "pull", splashRadius: 110, pullStrength: 0.5},
  "Supernova": {cost: 2800, damage: 125, range: 180, fireRate: 4000, projectileColor: "#ff6347", type: "splash", splashRadius: 120},
  "Meteor": {cost: 1600, damage: 95, range: 170, fireRate: 2700, projectileColor: "#cd5c5c", type: "splash", splashRadius: 90},
  "Komet": {cost: 1400, damage: 85, range: 160, fireRate: 2200, projectileColor: "#4682b4", type: "single"},
  "Heilung": {cost: 800, damage: 0, range: 130, fireRate: 1800, projectileColor: "#98fb98", type: "heal", healAmount: 15},
  "Verstärker": {cost: 750, damage: 0, range: 140, fireRate: 0, projectileColor: "#ffa07a", type: "buff", buffAmount: 1.5, buffType: "damage"},
  "Verlangsamung": {cost: 600, damage: 15, range: 120, fireRate: 1300, projectileColor: "#b0c4de", type: "slow", slowAmount: 0.5, slowDuration: 2000},
  "Scan": {cost: 500, damage: 0, range: 220, fireRate: 0, projectileColor: "#dda0dd", type: "detector", detectionBonus: 1.3},
  "Schild": {cost: 950, damage: 0, range: 110, fireRate: 0, projectileColor: "#4169e1", type: "shield", shieldAmount: 50, shieldDuration: 5000},
  "Drache": {cost: 2000, damage: 105, range: 150, fireRate: 1800, projectileColor: "#dc143c", type: "cone", coneAngle: 50},
  "Kristall": {cost: 1400, damage: 75, range: 140, fireRate: 1400, projectileColor: "#ba55d3", type: "laser"},
  "Schatten": {cost: 1700, damage: 90, range: 130, fireRate: 1200, projectileColor: "#2f4f4f", type: "pierce", pierceCount: 3},
  "Licht": {cost: 1600, damage: 85, range: 170, fireRate: 1100, projectileColor: "#fffacd", type: "laser"},
  "Omega": {cost: 4000, damage: 165, range: 210, fireRate: 2700, projectileColor: "#ff00ff", type: "splash", splashRadius: 160},
    "Titan": {
    cost: 4200,
    damage: 175,
    range: 215,
    fireRate: 2300,
    projectileColor: "#b8860b",
    type: "single"
  },
  "Golem": {
    cost: 4300,
    damage: 160,
    range: 185,
    fireRate: 2500,
    projectileColor: "#696969",
    type: "stun",
    stunDuration: 1300
  },
  "Phoenix": {
    cost: 4400,
    damage: 55,
    range: 170,
    fireRate: 650,
    projectileColor: "#ff4500",
    type: "cone",
    coneAngle: 50,
    burnDamage: 10,
    burnDuration: 3500
  },
  "Kraken": {
    cost: 4500,
    damage: 135,
    range: 210,
    fireRate: 2400,
    projectileColor: "#006994",
    type: "splash",
    splashRadius: 140
  },
  "Hydra": {
    cost: 4600,
    damage: 70,
    range: 180,
    fireRate: 850,
    projectileColor: "#228b22",
    type: "multishot",
    projectileCount: 4
  },
  "Greif": {
    cost: 4700,
    damage: 105,
    range: 240,
    fireRate: 900,
    projectileColor: "#daa520",
    type: "single"
  },
  "Basilisk": {
    cost: 4800,
    damage: 65,
    range: 175,
    fireRate: 1200,
    projectileColor: "#9acd32",
    type: "poison",
    poisonDamage: 6,
    poisonDuration: 5000
  },
  "Chimara": {
    cost: 4900,
    damage: 95,
    range: 190,
    fireRate: 1100,
    projectileColor: "#8b008b",
    type: "chain",
    chainCount: 5
  },
  "Wächter": {
    cost: 5000,
    damage: 0,
    range: 160,
    fireRate: 0,
    projectileColor: "#4682b4",
    type: "shield",
    shieldAmount: 90,
    shieldDuration: 6000
  },
  "Sentinel": {
    cost: 5100,
    damage: 85,
    range: 200,
    fireRate: 1300,
    projectileColor: "#708090",
    type: "detector",
    detectionBonus: 1.5
  },
  "Zermalmer": {
    cost: 5200,
    damage: 150,
    range: 160,
    fireRate: 2000,
    projectileColor: "#a52a2a",
    type: "single"
  },
  "Sturmbrecher": {
    cost: 5300,
    damage: 120,
    range: 190,
    fireRate: 1000,
    projectileColor: "#1e90ff",
    type: "chain",
    chainCount: 4
  },
  "Lichtbringer": {
    cost: 5400,
    damage: 90,
    range: 210,
    fireRate: 900,
    projectileColor: "#fffacd",
    type: "laser"
  },
  "Schattenjäger": {
    cost: 5500,
    damage: 115,
    range: 185,
    fireRate: 950,
    projectileColor: "#36454f",
    type: "pierce",
    pierceCount: 4
  },
  "Zeitverzehrer": {
    cost: 5600,
    damage: 40,
    range: 180,
    fireRate: 1000,
    projectileColor: "#800080",
    type: "slow",
    slowAmount: 0.65,
    slowDuration: 3500
  },
  "Dimensionsriss": {
    cost: 5700,
    damage: 130,
    range: 200,
    fireRate: 1800,
    projectileColor: "#4b0082",
    type: "pull",
    splashRadius: 130,
    pullStrength: 0.6
  },
  "Graviton": {
    cost: 5800,
    damage: 140,
    range: 205,
    fireRate: 1600,
    projectileColor: "#663399",
    type: "splash",
    splashRadius: 140
  },
  "Antimaterie": {
    cost: 5900,
    damage: 150,
    range: 215,
    fireRate: 2100,
    projectileColor: "#00ffff",
    type: "splash",
    splashRadius: 150
  },
  "Singularität": {
    cost: 6000,
    damage: 0,
    range: 220,
    fireRate: 0,
    projectileColor: "#000000",
    type: "pull",
    splashRadius: 140,
    pullStrength: 0.85
  },
  "Apokalypse": {
    cost: 6500,
    damage: 210,
    range: 230,
    fireRate: 3500,
    projectileColor: "#8b0000",
    type: "splash",
    splashRadius: 180
  }
};

// ===== DIFFICULTY CONFIGURATION =====
export const DIFF = {
  hpScale: (w) => {
    if(w <= 50) {
      return 0.20 * Math.pow(1.08, Math.max(0, w - 1));
    } else {
      // Ab Welle 50: Viel flachere Skalierung
      const base50 = 0.20 * Math.pow(1.08, 49);
      return base50 * Math.pow(1.04, w - 50); // 1.08 -> 1.04 (halbe Steigerung)
    }
  },
  spdScale: (w) => {
    if(w <= 50) {
      return 0.75 * Math.pow(1.012, Math.max(0, w - 1));
    } else {
      // Ab Welle 50: Minimale Geschwindigkeits-Steigerung
      const base50 = 0.75 * Math.pow(1.012, 49);
      return base50 * Math.pow(1.006, w - 50); // 1.012 -> 1.006
    }
  },
  countBase: (w) => {
    if(w < 6) {
      return Math.max(3, Math.floor((3 + 1.2*w) * 0.6));
    } else if(w < 15) {
      return Math.max(3, Math.floor((3 + 1.2*w) * 1.0));
    } else if(w < 50) {
      return Math.max(3, Math.floor((3 + 1.2*w) * 1.2));
    } else {
      // Ab Welle 50: Deutlich weniger neue Gegner
      const base50 = Math.floor((3 + 1.2*50) * 1.2);
      return base50 + Math.floor((w - 50) * 0.4); // Nur +0.4 pro Welle statt +1.44
    }
  },
  spawnInterval: (w) => Math.max(800, 2000 - w * 30)
};

// ===== UTILITY FUNCTIONS =====
export function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}

export function effectScaleForCost(cost) {
  // 50 -> ~0.7, 200 -> ~1.2, 400 -> ~1.6, 700 -> ~2.2
  return clamp(0.5 + Math.log10(Math.max(10, cost)) * 1.1, 0.65, 2.4);
}

// ===== WAVE DEFINITION FUNCTIONS =====
export function pickBossConfig(enemyPool) {
  if (enemyPool.length === 0) return null;
  // Boss = größter baseHealth
  let best = enemyPool[0];
  for(const c of enemyPool) {
    if((c.baseHealth || 0) > (best.baseHealth || 0)) best = c;
  }
  return best;
}

export function waveDefinition(wave, enemyPool) {
  const baseCount = DIFF.countBase(wave);
  const pool = enemyPool;
  if (pool.length === 0) return [];

  // n Typen rotierend auswählen
  const typesToUse = Math.min(5, pool.length);
  const start = wave % pool.length;
  const chosen = [];
  for(let i = 0; i < typesToUse; i++) {
    const cfg = pool[(start + i) % pool.length];
    const count = Math.max(1, Math.floor(baseCount * (cfg.countMult || 1) * (1 - i*0.12)));
    chosen.push({ type: cfg.name, cfg, count, isBoss: false });
  }
  
  // alle 10 Wellen Boss (geändert von 12 auf 10)
  if (wave % 10 === 0) {
    const boss = pickBossConfig(pool);
    if (boss) chosen.push({ type: boss.name, cfg: boss, count: 1 + Math.floor(wave/20), isBoss: true });
  }
  
  return chosen;
}

// ===== MANIFEST LOADER =====
export async function loadManifest(gameState, towerConfigs) {
  try {
    const res = await fetch('manifest.json');
    const manifest = await res.json();

    // Türme
    gameState.towerTypes = manifest.towers.map(t => ({
      name: t.name, 
      file: t.file, 
      shape: t.shape, 
      color: t.color,
      ...(towerConfigs[t.name] || {cost:100,damage:20,range:120,fireRate:1000,projectileColor:"#fff",type:"single"})
    }));

    // Tower-Bilder
    await Promise.allSettled(manifest.towers.map(t => new Promise((res) => {
      const img = new Image(); 
      img.src = t.file;
      img.onload = () => { gameState.towerImages[t.name] = img; res(); };
      img.onerror = () => res();
      setTimeout(res, 800);
    })));

    // Gegner aus manifest.enemies -> enemyPool und enemyImages
    gameState.enemyPool = [];
    gameState.enemyConfigs = {};
    if (Array.isArray(manifest.enemies)) {
      // Bilder laden
      await Promise.allSettled(manifest.enemies.map(e => new Promise((res) => {
        const key = `${e.shape}_${e.hue}`;
        const img = new Image(); 
        img.src = e.file;
        img.onload = () => { gameState.enemyImages[key] = img; res(); };
        img.onerror = () => res();
        setTimeout(res, 800);
      })));

      // Konfigurationen übernehmen (mit Defaults)
      manifest.enemies.forEach((e, idx) => {
        const name = e.name || `${e.shape}_${e.hue}`;
        const cfg = {
          name,
          shape: e.shape,
          hue: e.hue ?? 0,
          baseHealth: e.baseHealth ?? (e.shape==='octagon' ? 400 : e.shape==='square' ? 90 : e.shape==='pentagon' ? 65 : e.shape==='hexagon' ? 50 : e.shape==='star' ? 60 : e.shape==='triangle' ? 25 : 18),
          baseSpeed:  e.baseSpeed  ?? (e.shape==='triangle' ? 1.2 : e.shape==='circle' ? 0.95 : e.shape==='square' ? 0.45 : 0.65),
          reward:     e.reward     ?? (e.shape==='octagon' ? 360 : e.shape==='square' ? 12 : e.shape==='pentagon' ? 10 : e.shape==='hexagon' ? 9 : e.shape==='star' ? 11 : e.shape==='triangle' ? 5 : 2),
          regenPerSec: e.regenPerSec || 0,
          immune: e.immune || {},
          resist: e.resist || {},
          countMult: e.countMult || 1
        };
        gameState.enemyConfigs[name] = cfg;
        gameState.enemyPool.push(cfg);
      });
    }

    gameState.imagesLoaded = true;
  } catch (e) {
    console.error('manifest.json konnte nicht geladen werden', e);
    alert('Fehler: manifest.json konnte nicht geladen werden!');
  }
}
