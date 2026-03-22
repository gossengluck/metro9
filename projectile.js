// Projectile Module - Projectile class and configurations
import { effectScaleForCost } from './config.js';
import { drawProjectileShape } from './projectile-shapes.js';

export class Projectile {
  constructor(tower, target, baseDamage, color, type, splashRadius = 0, meta = {}, gameState, ctx) {
    this.tower = tower;
    this.towerName = tower.type.name;
    this.x = tower.x; 
    this.y = tower.y; 
    this.target = target; 
    this.damage = baseDamage;
    this.color = color; 
    this.type = type;
    this.splashRadius = splashRadius;
    this.meta = meta;
    this.rotation = 0;
    this.age = 0;
    this.gameState = gameState;
    this.ctx = ctx;

    // Effekt-Skalierung nach Turm-Kosten
    const s = effectScaleForCost(tower.type.cost);
    this.scale = s;
    
    // Individuelle Eigenschaften pro Tower
    this.setupVisuals();
    
    this.trail = [];
    this.maxTrail = this.trailLength;
    this.particles = [];
  }
  
  setupVisuals() {
    const config = this.getProjectileConfig(this.towerName);
    this.speed = Math.max(0.1, config.speed * (1 + this.scale * 0.1));
    this.size = Math.max(0.1, config.size * this.scale);
    this.shape = config.shape;
    this.glowIntensity = Math.max(0, config.glow);
    this.trailLength = Math.max(0, Math.round(config.trailLength * this.scale));
    this.particleFreq = Math.max(0, config.particleFreq);
    this.rotationSpeed = config.rotationSpeed;
    this.customDraw = config.customDraw;
  }
  
  getProjectileConfig(name) {
    const configs = {
      'Basis': {speed: 9, size: 6, shape: 'circle', glow: 10, trailLength: 6, particleFreq: 0, rotationSpeed: 0},
      'Sniper': {speed: 18, size: 4, shape: 'arrow', glow: 15, trailLength: 12, particleFreq: 0, rotationSpeed: 0},
      'MG': {speed: 14, size: 4, shape: 'bullet', glow: 8, trailLength: 4, particleFreq: 0.1, rotationSpeed: 0},
      'Laser': {speed: 0, size: 0, shape: 'none', glow: 0, trailLength: 0, particleFreq: 0, rotationSpeed: 0}, // beam
      'Rakete': {speed: 8, size: 10, shape: 'rocket', glow: 20, trailLength: 15, particleFreq: 0.4, rotationSpeed: 0},
      'Feuer': {speed: 0, size: 0, shape: 'none', glow: 0, trailLength: 0, particleFreq: 0, rotationSpeed: 0}, // cone
      'Eis': {speed: 7, size: 8, shape: 'ice', glow: 18, trailLength: 10, particleFreq: 0.3, rotationSpeed: 0.1},
      'Gift': {speed: 6, size: 7, shape: 'poison', glow: 16, trailLength: 12, particleFreq: 0.5, rotationSpeed: 0.05},
      'Blitz': {speed: 20, size: 6, shape: 'lightning', glow: 25, trailLength: 8, particleFreq: 0.6, rotationSpeed: 0},
      'Erde': {speed: 7, size: 9, shape: 'rock', glow: 12, trailLength: 8, particleFreq: 0.2, rotationSpeed: 0.15},
      'Mörser': {speed: 6, size: 12, shape: 'mortar', glow: 15, trailLength: 10, particleFreq: 0.3, rotationSpeed: 0.2},
      'Kanone': {speed: 12, size: 10, shape: 'cannonball', glow: 14, trailLength: 8, particleFreq: 0.1, rotationSpeed: 0.3},
      'Artillerie': {speed: 8, size: 13, shape: 'shell', glow: 16, trailLength: 12, particleFreq: 0.3, rotationSpeed: 0.15},
      'Balista': {speed: 16, size: 12, shape: 'bolt', glow: 12, trailLength: 14, particleFreq: 0, rotationSpeed: 0},
      'Trebuchet': {speed: 7, size: 14, shape: 'boulder', glow: 10, trailLength: 10, particleFreq: 0.2, rotationSpeed: 0.25},
      'Tesla': {speed: 22, size: 7, shape: 'electric', glow: 30, trailLength: 6, particleFreq: 0.8, rotationSpeed: 0},
      'Plasma': {speed: 0, size: 0, shape: 'none', glow: 0, trailLength: 0, particleFreq: 0, rotationSpeed: 0}, // beam
      'Ion': {speed: 20, size: 8, shape: 'ion', glow: 28, trailLength: 10, particleFreq: 0.7, rotationSpeed: 0.3},
      'Photon': {speed: 0, size: 0, shape: 'none', glow: 0, trailLength: 0, particleFreq: 0, rotationSpeed: 0}, // beam
      'Quanten': {speed: 16, size: 9, shape: 'quantum', glow: 35, trailLength: 14, particleFreq: 0.9, rotationSpeed: 0.4},
      'Tornado': {speed: 8, size: 10, shape: 'tornado', glow: 20, trailLength: 15, particleFreq: 0.6, rotationSpeed: 0.5},
      'Klebstoff': {speed: 5, size: 8, shape: 'glue', glow: 14, trailLength: 12, particleFreq: 0.4, rotationSpeed: 0.1},
      'Schock': {speed: 18, size: 9, shape: 'shock', glow: 25, trailLength: 10, particleFreq: 0.7, rotationSpeed: 0},
      'Vampir': {speed: 11, size: 8, shape: 'vampire', glow: 22, trailLength: 12, particleFreq: 0.5, rotationSpeed: 0.2},
      'Multishot': {speed: 13, size: 5, shape: 'arrow', glow: 12, trailLength: 8, particleFreq: 0.2, rotationSpeed: 0},
      'Nuklear': {speed: 5, size: 16, shape: 'nuke', glow: 40, trailLength: 18, particleFreq: 0.9, rotationSpeed: 0.1},
      'Schwarzloch': {speed: 6, size: 15, shape: 'blackhole', glow: 50, trailLength: 20, particleFreq: 1.0, rotationSpeed: 0.6},
      'Supernova': {speed: 7, size: 14, shape: 'star', glow: 45, trailLength: 16, particleFreq: 0.9, rotationSpeed: 0.4},
      'Meteor': {speed: 9, size: 12, shape: 'meteor', glow: 30, trailLength: 14, particleFreq: 0.7, rotationSpeed: 0.3},
      'Komet': {speed: 14, size: 10, shape: 'comet', glow: 28, trailLength: 18, particleFreq: 0.8, rotationSpeed: 0.2},
      'Heilung': {speed: 10, size: 8, shape: 'heal', glow: 24, trailLength: 12, particleFreq: 0.5, rotationSpeed: 0.15},
      'Verstärker': {speed: 0, size: 0, shape: 'none', glow: 0, trailLength: 0, particleFreq: 0, rotationSpeed: 0},
      'Verlangsamung': {speed: 6, size: 8, shape: 'slow', glow: 18, trailLength: 10, particleFreq: 0.4, rotationSpeed: 0.1},
      'Scan': {speed: 0, size: 0, shape: 'none', glow: 0, trailLength: 0, particleFreq: 0, rotationSpeed: 0},
      'Schild': {speed: 0, size: 0, shape: 'none', glow: 0, trailLength: 0, particleFreq: 0, rotationSpeed: 0},
      'Drache': {speed: 0, size: 0, shape: 'none', glow: 0, trailLength: 0, particleFreq: 0, rotationSpeed: 0}, // cone
      'Kristall': {speed: 0, size: 0, shape: 'none', glow: 0, trailLength: 0, particleFreq: 0, rotationSpeed: 0}, // beam
      'Schatten': {speed: 15, size: 9, shape: 'shadow', glow: 20, trailLength: 16, particleFreq: 0.6, rotationSpeed: 0.2},
      'Licht': {speed: 0, size: 0, shape: 'none', glow: 0, trailLength: 0, particleFreq: 0, rotationSpeed: 0}, // beam
      'Omega': {speed: 8, size: 18, shape: 'omega', glow: 55, trailLength: 22, particleFreq: 1.2, rotationSpeed: 0.3}
    };
    return configs[name] || configs['Basis'];
  }
  
  update(dt) {
    if(!this.target || this.target.health <= 0) return true;
    this.age += dt;
    const step = this.speed * (dt/16.67);
    const dx = this.target.x - this.x, dy = this.target.y - this.y;
    const dist = Math.hypot(dx, dy);
    if(dist < step) { 
      this.hit(this.target); 
      return true; 
    }
    
    this.trail.push({x: this.x, y: this.y, age: this.age});
    if(this.trail.length > this.maxTrail) this.trail.shift();
    
    this.x += (dx/dist) * step; 
    this.y += (dy/dist) * step;
    this.rotation += this.rotationSpeed;
    
    // Partikel spawnen
    if(this.particleFreq > 0 && Math.random() < this.particleFreq * (dt/16.67)) {
      this.spawnParticle();
    }
    
    return false;
  }
  
  spawnParticle() {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 2 + 1;
    this.gameState.particles.push({
      type: 'trail_particle',
      x: this.x,
      y: this.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: Math.max(0.1, Math.random() * 3 + 2),
      color: this.color,
      life: Math.random() * 15 + 10,
      maxLife: 25
    });
  }
  
  hit(target) {
    target.applyDamage(this.damage, {type: this.type});
    if(this.type === 'slow') { 
      target.applySlow(this.meta.slowAmount || 0.5, this.meta.slowDuration || 1500); 
    }
    else if(this.type === 'poison') { 
      target.applyPoison(this.meta.poisonDamage || 2, this.meta.poisonDuration || 4000); 
    }
    else if(this.type === 'stun') { 
      target.applyStun(this.meta.stunDuration || 600); 
    }
    else if(this.type === 'chain') { 
      target.chainHit(this.damage * 0.7, this.meta.chainCount || 2); 
    }
    else if(this.type === 'splash' && this.splashRadius > 0) { 
      target.splashHit(this.damage * 0.5, this.splashRadius); 
    }

    // Impact mit individuellen Effekten
    const impactSize = this.splashRadius ? this.splashRadius * 0.6 : this.size * 3;
    this.gameState.particles.push({
      type: 'impact', 
      x: this.x, 
      y: this.y, 
      r: Math.max(0.1, this.size * 0.5), 
      max: Math.max(0.1, impactSize), 
      life: Math.round(15 * this.scale), 
      color: this.color
    });
    
    // Extra Partikel bei Impact
    for(let i = 0; i < Math.round(8 * this.scale); i++) {
      const angle = (Math.PI*2/8) * i + Math.random() * 0.3;
      const speed = Math.random() * 4 + 3;
      this.gameState.particles.push({
        type: 'explosion_particle',
        x: this.x,
        y: this.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.max(0.1, Math.random() * 4 + 2),
        color: this.color,
        life: Math.random() * 20 + 15,
        maxLife: 35
      });
    }
  }
  
  draw() {
    // Trail mit Fade
    if(this.trail.length > 1) {
      this.ctx.save();
      for(let i = 0; i < this.trail.length-1; i++) {
        const alpha = (i / this.trail.length) * 0.6;
        const width = (i / this.trail.length) * this.size * 0.8;
        this.ctx.globalAlpha = alpha;
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = Math.max(1, width);
        this.ctx.beginPath();
        this.ctx.moveTo(this.trail[i].x, this.trail[i].y);
        this.ctx.lineTo(this.trail[i+1].x, this.trail[i+1].y);
        this.ctx.stroke();
      }
      this.ctx.restore();
    }
    
    // Hauptprojektil
    this.ctx.save();
    this.ctx.translate(this.x, this.y);
    
    // Glow
    if(this.glowIntensity > 0) {
      this.ctx.shadowBlur = this.glowIntensity * this.scale;
      this.ctx.shadowColor = this.color;
    }
    
    // Rotation
    if(this.rotationSpeed !== 0) {
      this.ctx.rotate(this.rotation);
    } else {
      // Zeige in Bewegungsrichtung
      const dx = this.target.x - this.x;
      const dy = this.target.y - this.y;
      this.ctx.rotate(Math.atan2(dy, dx));
    }
    
    drawProjectileShape(this.ctx, this.shape, this.size, this.color, this.age, this.rotation);
    this.ctx.restore();
  }
}
