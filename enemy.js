// Enemy Module - Enemy class and related functions

export function getBuffMultiplierFor(tower, towers) {
  let bonus = 0;
  for(const t of towers) {
    if(t.type.type !== 'buff') continue;
    const dx = t.x - tower.x, dy = t.y - tower.y;
    const d = Math.hypot(dx,dy);
    if (d <= t.type.range) bonus += 0.2;
  }
  return 1 + bonus;
}

export class Enemy {
  constructor(conf, path, GRID_SIZE, gameState, ctx, drawShapeFn) {
    this.path = path;
    this.GRID_SIZE = GRID_SIZE;
    this.gameState = gameState;
    this.ctx = ctx;
    this.drawShape = drawShapeFn;
    
    this.typeName = conf.name;
    this.shape = conf.shape;
    this.hue = conf.hue || 0;
    this.isBoss = conf.isBoss || false; // Boss-Flag

    this.maxHealth = conf.baseHealth;
    this.health = this.maxHealth;
    this.baseSpeed = conf.baseSpeed;
    this.reward = conf.reward || 5;
    this.regenPerSec = conf.regenPerSec || 0;

    this.immune = conf.immune || {};
    this.resist = conf.resist || {};

    this.pathIndex = 0; 
    this.progress = 0;
    this.x = path[0].x * GRID_SIZE + GRID_SIZE/2;
    this.y = path[0].y * GRID_SIZE + GRID_SIZE/2;

    this.slowMult = 1; 
    this.slowUntil = 0;
    this.stunUntil = 0;
    this.poisons = [];

    this.prevDir = {dx:0, dy:0};
    this.straightStreak = 0;
    this.cornerSlowUntil = 0;
  }

  segmentDir() {
    const i = this.pathIndex;
    const c = this.path[i], n = this.path[Math.min(i+1, this.path.length-1)];
    return {dx: Math.sign(n.x - c.x), dy: Math.sign(n.y - c.y)};
  }

  effectiveSpeed() {
    if (this.gameState.time < this.stunUntil) return 0;
    const slowActive = (this.gameState.time < this.slowUntil) ? this.slowMult : 1;
    let speed = this.baseSpeed * slowActive;
    if (this.gameState.time < this.cornerSlowUntil) speed *= 0.7;
    if (this.straightStreak >= 4) speed *= 0.88;
    return speed;
  }

  applyDamage(amount, src = {}) {
    if (src.type && this.resist[src.type]) amount *= this.resist[src.type];
    this.health -= amount;
  }
  
  applySlow(amount, duration) {
    if (this.immune.slow) return;
    const mult = Math.max(0.1, 1 - amount);
    if (mult < this.slowMult) this.slowMult = mult;
    this.slowUntil = Math.max(this.slowUntil, this.gameState.time + duration);
  }
  
  applyPoison(dps, duration) {
    if (this.immune.poison) return;
    this.poisons.push({dps, until: this.gameState.time + duration});
  }
  
  applyStun(duration) {
    if (this.immune.stun) return;
    this.stunUntil = Math.max(this.stunUntil, this.gameState.time + duration);
  }
  
  chainHit(dmg, count) {
    if(count <= 0) return;
    const others = this.gameState.enemies
      .filter(e => e !== this && e.health > 0)
      .sort((a,b) => (a.x - this.x)**2 + (a.y - this.y)**2 - ((b.x - this.x)**2 + (b.y - this.y)**2));
    for (const e of others.slice(0, count)) e.applyDamage(dmg, {type:'chain'});
  }
  
  splashHit(dmg, radius) {
    for(const e of this.gameState.enemies) {
      if (e === this || e.health <= 0) continue;
      const dx = e.x - this.x, dy = e.y - this.y;
      if (Math.hypot(dx, dy) <= radius) e.applyDamage(dmg, {type:'splash'});
    }
  }

  update(delta) {
    const now = this.gameState.time;
    
    // DoTs
    this.poisons = this.poisons.filter(p => {
      if (p.until <= now) return false;
      this.applyDamage(p.dps * (delta/1000), {type:'poison'});
      return true;
    });
    
    // Regeneration
    if(this.regenPerSec > 0 && this.health > 0 && this.health < this.maxHealth) {
      this.health = Math.min(this.maxHealth, this.health + this.regenPerSec*(delta/1000));
    }

    const dir = this.segmentDir();
    if (dir.dx !== this.prevDir.dx || dir.dy !== this.prevDir.dy) {
      this.cornerSlowUntil = now + 200;
      this.straightStreak = 1;
      this.prevDir = dir;
    } else {
      this.straightStreak++;
    }

    const moveDist = (this.effectiveSpeed() * delta) / 20;
    this.progress += moveDist;
    while(this.progress >= this.GRID_SIZE && this.pathIndex < this.path.length-1) {
      this.progress -= this.GRID_SIZE; 
      this.pathIndex++;
    }
    
    if(this.pathIndex < this.path.length) {
      const c = this.path[this.pathIndex], n = this.path[Math.min(this.pathIndex+1, this.path.length-1)];
      const t = this.progress / this.GRID_SIZE;
      this.x = (c.x + (n.x - c.x) * t) * this.GRID_SIZE + this.GRID_SIZE/2;
      this.y = (c.y + (n.y - c.y) * t) * this.GRID_SIZE + this.GRID_SIZE/2;
    }
  }

  draw() {
    const key = `${this.shape}_${this.hue}`;
    const img = this.gameState.enemyImages[key];
    
    // Bosse sind größer
    const sizeMultiplier = this.isBoss ? 1.8 : 1;
    
    if (img) {
      const s = 22 * sizeMultiplier;
      this.ctx.drawImage(img, this.x - s, this.y - s, s*2, s*2);
    } else {
      const size = 16 * sizeMultiplier;
      this.ctx.fillStyle = `hsl(${this.hue},70%,50%)`;
      this.ctx.strokeStyle = "#000"; 
      this.ctx.lineWidth = 2;
      this.ctx.save(); 
      this.ctx.translate(this.x, this.y);
      this.drawShape(this.ctx, this.shape, 0, 0, size);
      this.ctx.fill(); 
      this.ctx.stroke(); 
      this.ctx.restore();
    }

    // HP-Bar (auch größer für Bosse)
    const barWidth = this.isBoss ? 60 : 44;
    const barHeight = this.isBoss ? 8 : 6;
    const barY = this.isBoss ? -35 : -30;
    const hp = Math.max(0, this.health) / this.maxHealth;
    
    this.ctx.fillStyle = '#000'; 
    this.ctx.fillRect(this.x - barWidth/2 - 1, this.y + barY, barWidth + 2, barHeight);
    this.ctx.fillStyle = hp > 0.5 ? '#0f0' : hp > 0.25 ? '#ff0' : '#f00';
    this.ctx.fillRect(this.x - barWidth/2, this.y + barY + 1, barWidth * hp, barHeight - 2);
    
    // Boss-Label
    if(this.isBoss) {
      this.ctx.fillStyle = '#ffd700'; 
      this.ctx.font = 'bold 14px Arial'; 
      this.ctx.textAlign = 'center';
      this.ctx.strokeStyle = '#000';
      this.ctx.lineWidth = 3;
      this.ctx.strokeText('BOSS', this.x, this.y + barY - 8);
      this.ctx.fillText('BOSS', this.x, this.y + barY - 8);
    }
  }
  
  reachedEnd() { 
    return this.pathIndex >= this.path.length-1 && this.progress >= this.GRID_SIZE; 
  }
}
