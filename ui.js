import { waveDefinition } from './config.js';
import { drawShape } from './map.js';

export function updateUI(gameState, pauseOverlay) {
  document.getElementById('lives').textContent = Math.max(0, Math.floor(gameState.lives));
  document.getElementById('gold').textContent = Math.floor(gameState.gold);
  document.getElementById('wave').textContent = `${gameState.wave}`;
  document.getElementById('score').textContent = Math.floor(gameState.score).toLocaleString();
  document.getElementById('startWaveBtn').disabled = gameState.waveActive || gameState.paused;
  
  document.querySelectorAll('.tower-btn').forEach((btn, i) => {
    const t = gameState.towerTypes[i];
    if(t && gameState.gold < t.cost) btn.classList.add('disabled'); 
    else btn.classList.remove('disabled');
  });
  
  document.querySelectorAll('.unlock-btn').forEach((btn) => {
    const costText = btn.textContent.match(/\d+/);
    if(costText) {
      const cost = parseInt(costText[0]);
      if(gameState.gold >= cost) {
        btn.classList.add('can-afford');
      } else {
        btn.classList.remove('can-afford');
      }
    }
  });
  
  pauseOverlay.classList.toggle('active', gameState.paused);
  updateWaveInfoPreview(gameState);
  
  if(gameState.selectedTowerObject) {
    const tower = gameState.selectedTowerObject;
    const upCost = Math.floor(tower.type.cost * 1.0 * Math.pow(1.25, tower.level - 1));
    const upBtn = document.getElementById('upgradeBtn');
    upBtn.disabled = tower.level >= 20 || gameState.gold < upCost;
  }
}

export function updateWaveInfoPreview(gameState) {
  const info = document.getElementById('waveInfo');
  const def = waveDefinition(Math.min(gameState.wave + 1, gameState.maxWaves), gameState.enemyPool);
  const tags = def.map(e => `<span class="tag">${e.type} ×${e.count}</span>`).join(' ');
  info.innerHTML = `Nächste Welle: ${tags || '—'}`;
}

export function showTowerInfo(tower, gameState) {
  gameState.selectedTowerObject = tower; 
  gameState.selectedTower = null;
  document.querySelectorAll('.tower-btn').forEach(b => b.classList.remove('selected'));
  document.getElementById('towerInfoPanel').classList.add('active');

  const iconCanvas = document.getElementById('infoIcon');
  const iconCtx = iconCanvas.getContext('2d');
  iconCtx.clearRect(0, 0, 60, 60);
  const img = gameState.towerImages[tower.type.name];
  if(img && gameState.imagesLoaded) { 
    iconCtx.drawImage(img, 0, 0, 60, 60); 
  } else {
    iconCtx.fillStyle = tower.type.color; 
    iconCtx.strokeStyle = "#000"; 
    iconCtx.lineWidth = 3;
    iconCtx.save(); 
    iconCtx.translate(30, 30); 
    drawShape(iconCtx, tower.type.shape, 0, 0, 22); 
    iconCtx.fill(); 
    iconCtx.stroke(); 
    iconCtx.restore();
  }
  
  document.getElementById('infoName').textContent = tower.type.name;
  document.getElementById('infoLevel').textContent = `Level ${tower.level}/20`;
  
  let statsHTML = '';
  if (tower.level < 20) {
    const futureDamage = Math.floor(tower.type.damage * 1.15);
    const futureRange = Math.floor(tower.type.range * 1.08);
    const futureFireRate = Math.floor(tower.type.fireRate * 0.95);
    const damageIncrease = futureDamage - Math.floor(tower.type.damage);
    const rangeIncrease = futureRange - Math.floor(tower.type.range);
    const fireRateDecrease = Math.floor(tower.type.fireRate) - futureFireRate;
    
    statsHTML = `
      <div class="info-stat-item">
        <span class="info-stat-label">Schaden</span><br>
        <span class="info-stat-value">${Math.floor(tower.type.damage)} <span class="upgrade-preview">→ ${futureDamage} (+${damageIncrease})</span></span>
      </div>
      <div class="info-stat-item">
        <span class="info-stat-label">Reichweite</span><br>
        <span class="info-stat-value">${Math.floor(tower.type.range)} <span class="upgrade-preview">→ ${futureRange} (+${rangeIncrease})</span></span>
      </div>
      <div class="info-stat-item">
        <span class="info-stat-label">Feuerrate</span><br>
        <span class="info-stat-value">${Math.floor(tower.type.fireRate)}ms <span class="upgrade-preview">→ ${futureFireRate}ms (-${fireRateDecrease}ms)</span></span>
      </div>
      <div class="info-stat-item">
        <span class="info-stat-label">Typ</span><br>
        <span class="info-stat-value">${tower.type.type}</span>
      </div>
    `;
  } else {
    statsHTML = `
      <div class="info-stat-item">
        <span class="info-stat-label">Schaden</span><br>
        <span class="info-stat-value">${Math.floor(tower.type.damage)}</span>
      </div>
      <div class="info-stat-item">
        <span class="info-stat-label">Reichweite</span><br>
        <span class="info-stat-value">${Math.floor(tower.type.range)}</span>
      </div>
      <div class="info-stat-item">
        <span class="info-stat-label">Feuerrate</span><br>
        <span class="info-stat-value">${Math.floor(tower.type.fireRate)}ms</span>
      </div>
      <div class="info-stat-item">
        <span class="info-stat-label">Typ</span><br>
        <span class="info-stat-value">${tower.type.type}</span>
      </div>
    `;
  }
  
  document.getElementById('infoStats').innerHTML = statsHTML;
  
  const upCost = Math.floor(tower.type.cost * 1.0 * Math.pow(1.25, tower.level - 1));
  const upBtn = document.getElementById('upgradeBtn');
  upBtn.textContent = tower.level >= 20 ? 'Max Level!' : `↑ Upgrade (💰 ${upCost})`;
  upBtn.disabled = tower.level >= 20 || gameState.gold < upCost;
  const sellVal = Math.floor(tower.totalCost * 0.5);
  document.getElementById('sellBtn').textContent = `💰 Verkaufen (${sellVal} Gold)`;
}

export function getUnlockCost(tower) {
  return Math.floor(tower.cost * 2.5);
}

export function unlockTower(towerName, gameState, createTowerButtons, updateUI) {
  const tower = gameState.towerTypes.find(t => t.name === towerName);
  if(!tower) return;
  
  const unlockCost = getUnlockCost(tower);
  if(gameState.gold >= unlockCost) {
    if(confirm(`Tower "${towerName}" für ${unlockCost} Gold freischalten?`)) {
      gameState.gold -= unlockCost;
      gameState.unlockedTowers.push(towerName);
      createTowerButtons();
      updateUI();
    }
  }
}

export function createTowerButtons(gameState) {
  const gridEl = document.getElementById('towerGrid'); 
  gridEl.innerHTML = '';
  
  gameState.towerTypes.forEach(t => {
    const isUnlocked = gameState.unlockedTowers.includes(t.name);
    const unlockCost = getUnlockCost(t);
    const canAfford = gameState.gold >= unlockCost;
    
    const btn = document.createElement('div'); 
    btn.className = 'tower-btn';
    btn.style.position = 'relative';
    if(isUnlocked) btn.classList.add('unlocked');
    else btn.classList.add('locked');
    
    const icon = document.createElement('canvas'); 
    icon.className = 'tower-icon'; 
    icon.width = 50; 
    icon.height = 50;
    const ictx = icon.getContext('2d');
    const img = gameState.towerImages[t.name];
    
    if(!isUnlocked) {
      ictx.filter = 'grayscale(100%) brightness(0.4)';
    }
    
    if(img && gameState.imagesLoaded) { 
      ictx.drawImage(img, 0, 0, 50, 50); 
    } else { 
      ictx.fillStyle = isUnlocked ? t.color : '#444'; 
      ictx.strokeStyle = isUnlocked ? "#000" : "#222"; 
      ictx.lineWidth = 2; 
      ictx.save(); 
      ictx.translate(25, 25); 
      drawShape(ictx, t.shape, 0, 0, 18); 
      ictx.fill(); 
      ictx.stroke(); 
      ictx.restore(); 
    }
    btn.appendChild(icon);

    const name = document.createElement('div'); 
    name.className = 'tower-name'; 
    name.textContent = t.name;
    name.style.color = isUnlocked ? '#fff' : '#ddd';
    name.style.position = 'relative';
    name.style.zIndex = '15';
    btn.appendChild(name);
    
    const cost = document.createElement('div'); 
    cost.className = 'tower-cost';
    cost.style.position = 'relative';
    cost.style.zIndex = '15';
    if(isUnlocked) {
      cost.textContent = `💰 ${t.cost}`;
      cost.style.color = '#ffd700';
    } else {
      cost.textContent = `💰 ${t.cost} Gold`;
      cost.style.color = '#888';
      cost.style.fontSize = '11px';
      cost.style.fontWeight = 'normal';
    }
    btn.appendChild(cost);

    const info = document.createElement('div');
    info.className = 'tower-info';
    info.style.position = 'relative';
    info.style.zIndex = '15';
    
    if(isUnlocked) {
      info.innerHTML = `<strong>DMG:</strong> ${t.damage} | <strong>RNG:</strong> ${t.range}<br><strong>FR:</strong> ${t.fireRate}ms<br><strong>Typ:</strong> ${t.type}`;
    } else {
      info.innerHTML = `<strong>DMG:</strong> ${t.damage} | <strong>RNG:</strong> ${t.range}<br><strong>FR:</strong> ${t.fireRate}ms<br><strong>Typ:</strong> ${t.type}`;
      info.style.color = '#aaa';
      info.style.fontSize = '9px';
      info.style.background = 'rgba(0,0,0,0.5)';
      info.style.padding = '3px 4px';
      info.style.borderRadius = '3px';
      info.style.marginTop = '3px';
    }
    btn.appendChild(info);

    if(!isUnlocked) {
      const lockBadge = document.createElement('div');
      lockBadge.style.position = 'absolute';
      lockBadge.style.top = '5px';
      lockBadge.style.right = '5px';
      lockBadge.style.fontSize = '18px';
      lockBadge.style.zIndex = '100';
      lockBadge.style.pointerEvents = 'none';
      lockBadge.style.textShadow = '0 0 4px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.7)';
      lockBadge.innerHTML = '🔒';
      
      btn.appendChild(lockBadge);
      
      const unlockBtn = document.createElement('button');
      unlockBtn.className = 'unlock-btn';
      unlockBtn.style.position = 'relative';
      unlockBtn.style.zIndex = '20';
      unlockBtn.style.marginTop = '6px';
      unlockBtn.style.width = '100%';
      unlockBtn.style.display = 'block';
      unlockBtn.style.textAlign = 'center';
      if(canAfford) unlockBtn.classList.add('can-afford');
      unlockBtn.innerHTML = `<div style="font-weight:bold;">✨ Freischalten</div><div style="font-size:10px; margin-top:2px;">${unlockCost} 💰</div>`;
      
      unlockBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        unlockTower(t.name, gameState, () => createTowerButtons(gameState), () => updateUI(gameState, document.getElementById('pauseOverlay')));
      });
      
      btn.appendChild(unlockBtn);
    }

    if(isUnlocked) {
      btn.addEventListener('click', () => {
        if(gameState.gold >= t.cost) {
          document.querySelectorAll('.tower-btn').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected'); 
          gameState.selectedTower = t; 
          gameState.selectedTowerObject = null;
          document.getElementById('towerInfoPanel').classList.remove('active');
        }
      });
    }
    
    gridEl.appendChild(btn);
  });
}
