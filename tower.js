// Tower Module - Tower class and related functions
import { effectScaleForCost } from './config.js';
import { Projectile } from './projectile.js';
import { getBuffMultiplierFor } from './enemy.js';

export class Tower {
  constructor(type, gx, gy, GRID_SIZE, gameState, grid, ctx, drawShape, updateUI, showTowerInfo, targetLevel = 1) {
    this.type = {...type};
    this.gridX = gx; 
    this.gridY = gy;
    this.GRID_SIZE = GRID_SIZE;
    this.gameState = gameState;
    this.grid = grid;
    this.ctx = ctx;
    this.drawShape = drawShape;
    this.updateUI = updateUI;
    this.showTowerInfo = showTowerInfo;
    
    this.x = gx * GRID_SIZE + GRID_SIZE/2; 
    this.y = gy * GRID_SIZE + GRID_SIZE/2;
    this.lastShot = 0; 
    this.level = 1; 
    this.totalCost = this.type.cost;
    this.sizeScale = effectScaleForCost(this.type.cost);
    
    // Wenn targetLevel > 1, automatisch upgraden
    if(targetLevel > 1) {
      for(let i = 1; i < targetLevel; i++) {
        this.performUpgrade();
      }
    }
  }
  
  // Hilfsfunktion: Upgrade ohne Gold-Check (für Konstruktor)
  performUpgrade() {
    if(this.level >= 20) return;
    const cost = Math.floor(this.type.cost * 1.0 * Math.pow(1.25, this.level - 1));
    this.totalCost += cost;
    this.level++;
    
    // Stats verbessern
    this.type.damage = Math.floor(this.type.damage * 1.15);
    this.type.range = Math.floor(this.type.range * 1.08);
    this.type.fireRate = Math.floor(this.type.fireRate * 0.95);
    this.sizeScale = Math.min(3.0, this.sizeScale * 1.03);
  }
  
  upgrade() {
    if(this.level >= 20) return; // Max Level 20
    // Upgrade-Kosten steigen mit Level (sehr teuer gemacht)
    const cost = Math.floor(this.type.cost * 1.0 * Math.pow(1.25, this.level - 1));
    if(this.gameState.gold >= cost) {
      this.gameState.gold -= cost; 
      this.performUpgrade();
      
      this.updateUI(); 
      this.showTowerInfo(this);
    }
  }
  
  sell() {
    const val = Math.floor(this.totalCost * 0.5);
    this.gameState.gold += val;
    const i = this.gameState.towers.indexOf(this);
    this.gameState.towers.splice(i, 1);
    
    this.grid[this.gridY][this.gridX] = 0;
    document.getElementById('towerInfoPanel').classList.remove('active');
    this.gameState.selectedTowerObject = null; 
    this.updateUI();
  }
  
  update(enemies) {
    const now = this.gameState.time;
    if(this.type.type !== 'buff' && now - this.lastShot < this.type.fireRate) return;

    // Ziel
    let target = null, min = Infinity;
    for(const e of enemies) {
      const d = Math.hypot(e.x - this.x, e.y - this.y);
      if(d < this.type.range && d < min) {
        min = d; 
        target = e;
      }
    }
    
    if(!target) {
      if(this.type.type === 'heal') {
        const hasEnemy = enemies.some(e => Math.hypot(e.x - this.x, e.y - this.y) <= this.type.range);
        if(hasEnemy && now - this.lastShot >= this.type.fireRate) {
          this.lastShot = now;
          this.gameState.lives = Math.min(20, this.gameState.lives + 1);
          this.updateUI();
        }
      }
      return;
    }

    if(this.type.type === 'buff') { 
      return; 
    }

    if(now - this.lastShot < this.type.fireRate) return;
    this.lastShot = now;

    const dmg = (this.type.damage || 0) * getBuffMultiplierFor(this, this.gameState.towers);
    const s = this.sizeScale;

    if(this.type.type === 'laser') {
      target.applyDamage(dmg, {type:'laser'});
      this.gameState.particles.push({
        type:'beam',
        x1:this.x,
        y1:this.y,
        x2:target.x,
        y2:target.y,
        color:this.type.projectileColor,
        life:Math.round(10*s),
        width:Math.max(4, 5*s)
      });
    }
    else if(this.type.type === 'cone') {
      const angleToTarget = Math.atan2(target.y - this.y, target.x - this.x);
      const half = (this.type.coneAngle || 45) * Math.PI/180 / 2;
      for(const e of enemies) {
        const dx = e.x - this.x, dy = e.y - this.y;
        const dist = Math.hypot(dx, dy);
        if(dist > this.type.range) continue;
        const ang = Math.atan2(dy, dx);
        let diff = Math.atan2(Math.sin(ang - angleToTarget), Math.cos(ang - angleToTarget));
        if(Math.abs(diff) <= half) { 
          e.applyDamage(dmg, {type:'cone'}); 
        }
      }
      this.gameState.particles.push({
        type:'beam',
        x1:this.x,
        y1:this.y,
        x2:target.x,
        y2:target.y,
        color:this.type.projectileColor,
        life:Math.round(8*s),
        width:Math.max(3, 4*s)
      });
    }
    else if(this.type.type === 'splash') {
      this.gameState.projectiles.push(new Projectile(
        this, target, dmg, this.type.projectileColor, 'splash', this.type.splashRadius || 50, {}, 
        this.gameState, this.ctx
      ));
    }
    else if(this.type.type === 'slow') {
      this.gameState.projectiles.push(new Projectile(
        this, target, dmg, this.type.projectileColor, 'slow', 0, {
          slowAmount: this.type.slowAmount || 0.5, 
          slowDuration: this.type.slowDuration || 1500
        },
        this.gameState, this.ctx
      ));
    }
    else if(this.type.type === 'poison') {
      this.gameState.projectiles.push(new Projectile(
        this, target, dmg, this.type.projectileColor, 'poison', 0, {
          poisonDamage: this.type.poisonDamage || 2, 
          poisonDuration: this.type.poisonDuration || 4000
        },
        this.gameState, this.ctx
      ));
    }
    else if(this.type.type === 'stun') {
      this.gameState.projectiles.push(new Projectile(
        this, target, dmg, this.type.projectileColor, 'stun', 0, {
          stunDuration: this.type.stunDuration || 600
        },
        this.gameState, this.ctx
      ));
    }
    else if(this.type.type === 'chain') {
      this.gameState.projectiles.push(new Projectile(
        this, target, dmg, this.type.projectileColor, 'chain', 0, {
          chainCount: this.type.chainCount || 3
        },
        this.gameState, this.ctx
      ));
    }
    else if(this.type.type === 'heal') {
      this.gameState.lives = Math.min(20, this.gameState.lives + 1);
      this.updateUI();
    }
    else {
      this.gameState.projectiles.push(new Projectile(
        this, target, dmg, this.type.projectileColor, 'single', 0, {},
        this.gameState, this.ctx
      ));
    }
  }
  
  draw() {
    const base = this.GRID_SIZE / 3;
    const size = base * this.sizeScale; // teurere Türme größer
    const img = this.gameState.towerImages[this.type.name];
    if (img) {
      const s = size * 1.2;
      this.ctx.drawImage(img, this.x - s, this.y - s, s*2, s*2);
    } else {
      this.ctx.fillStyle = this.type.color; 
      this.ctx.strokeStyle = "#000"; 
      this.ctx.lineWidth = 2;
      this.ctx.save(); 
      this.ctx.translate(this.x, this.y);
      this.drawShape(this.ctx, this.type.shape, 0, 0, size);
      this.ctx.fill(); 
      this.ctx.stroke(); 
      this.ctx.restore();
    }
    if(this.level > 1) {
      this.ctx.fillStyle = '#ffd700'; 
      this.ctx.font = 'bold 11px Arial'; 
      this.ctx.textAlign = 'center';
      this.ctx.fillText(this.level, this.x, this.y - size - 6);
    }
  }
}
