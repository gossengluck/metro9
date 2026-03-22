// Camera System - Zoom, Pan, Smooth Movement
export class Camera {
  constructor(worldWidth, worldHeight, viewportWidth, viewportHeight) {
    // Welt-Dimensionen
    this.worldWidth = worldWidth;
    this.worldHeight = worldHeight;
    
    // Viewport-Dimensionen
    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;
    
    // Kamera-Position (Zentrum der Kamera in Weltkoordinaten)
    this.x = worldWidth / 2;
    this.y = worldHeight / 2;
    
    // Zoom-Level - GEÄNDERT: Start mit 1.0 (100%) statt 0.5
    this.zoom = 1.0;
    this.minZoom = 0.25; // Kann bis 25% rauszoomen
    this.maxZoom = 2.0;
    this.targetZoom = 1.0;
    
    // Smooth Movement
    this.targetX = this.x;
    this.targetY = this.y;
    this.smoothFactor = 0.15;
    
    // Pan-Status
    this.isPanning = false;
    this.panStartX = 0;
    this.panStartY = 0;
    this.panStartCameraX = 0;
    this.panStartCameraY = 0;
    
    // Bounds für Kamera-Bewegung
    this.updateBounds();
  }
  
  updateViewport(width, height) {
    this.viewportWidth = width;
    this.viewportHeight = height;
    this.updateBounds();
  }
  
  updateBounds() {
    const halfWidth = (this.viewportWidth / 2) / this.zoom;
    const halfHeight = (this.viewportHeight / 2) / this.zoom;
    
    this.minX = halfWidth;
    this.maxX = this.worldWidth - halfWidth;
    this.minY = halfHeight;
    this.maxY = this.worldHeight - halfHeight;
    
    if (this.minX > this.maxX) {
      this.minX = this.maxX = this.worldWidth / 2;
    }
    if (this.minY > this.maxY) {
      this.minY = this.maxY = this.worldHeight / 2;
    }
  }
  
  setZoom(zoom, mouseX, mouseY) {
    const oldZoom = this.zoom;
    this.targetZoom = Math.max(this.minZoom, Math.min(this.maxZoom, zoom));
    
    if (mouseX !== undefined && mouseY !== undefined) {
      const worldX = this.screenToWorldX(mouseX);
      const worldY = this.screenToWorldY(mouseY);
      
      this.zoom = this.targetZoom;
      this.updateBounds();
      
      const newWorldX = this.screenToWorldX(mouseX);
      const newWorldY = this.screenToWorldY(mouseY);
      
      this.targetX += (worldX - newWorldX);
      this.targetY += (worldY - newWorldY);
      
      this.clampTargetPosition();
    } else {
      this.zoom = this.targetZoom;
      this.updateBounds();
    }
  }
  
  zoomBy(delta, mouseX, mouseY) {
    const zoomSpeed = 0.1;
    const newZoom = this.zoom * (1 + delta * zoomSpeed);
    this.setZoom(newZoom, mouseX, mouseY);
  }
  
  startPan(screenX, screenY) {
    this.isPanning = true;
    this.panStartX = screenX;
    this.panStartY = screenY;
    this.panStartCameraX = this.targetX;
    this.panStartCameraY = this.targetY;
  }
  
  updatePan(screenX, screenY) {
    if (!this.isPanning) return;
    
    const dx = (screenX - this.panStartX) / this.zoom;
    const dy = (screenY - this.panStartY) / this.zoom;
    
    this.targetX = this.panStartCameraX - dx;
    this.targetY = this.panStartCameraY - dy;
    
    this.clampTargetPosition();
  }
  
  stopPan() {
    this.isPanning = false;
  }
  
  clampTargetPosition() {
    this.targetX = Math.max(this.minX, Math.min(this.maxX, this.targetX));
    this.targetY = Math.max(this.minY, Math.min(this.maxY, this.targetY));
  }
  
  moveTo(x, y) {
    this.targetX = x;
    this.targetY = y;
    this.clampTargetPosition();
  }
  
  jumpTo(x, y) {
    this.x = this.targetX = x;
    this.y = this.targetY = y;
    this.clampTargetPosition();
  }
  
  update() {
    if (Math.abs(this.zoom - this.targetZoom) > 0.001) {
      this.zoom += (this.targetZoom - this.zoom) * this.smoothFactor;
      this.updateBounds();
    }
    
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    
    if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
      this.x += dx * this.smoothFactor;
      this.y += dy * this.smoothFactor;
    } else {
      this.x = this.targetX;
      this.y = this.targetY;
    }
  }
  
  screenToWorldX(screenX) {
    return (screenX - this.viewportWidth / 2) / this.zoom + this.x;
  }
  
  screenToWorldY(screenY) {
    return (screenY - this.viewportHeight / 2) / this.zoom + this.y;
  }
  
  worldToScreenX(worldX) {
    return (worldX - this.x) * this.zoom + this.viewportWidth / 2;
  }
  
  worldToScreenY(worldY) {
    return (worldY - this.y) * this.zoom + this.viewportHeight / 2;
  }
  
  isVisible(worldX, worldY, margin = 0) {
    const screenX = this.worldToScreenX(worldX);
    const screenY = this.worldToScreenY(worldY);
    
    return screenX >= -margin && 
           screenX <= this.viewportWidth + margin &&
           screenY >= -margin && 
           screenY <= this.viewportHeight + margin;
  }
  
  applyTransform(ctx) {
    ctx.save();
    ctx.translate(this.viewportWidth / 2, this.viewportHeight / 2);
    ctx.scale(this.zoom, this.zoom);
    ctx.translate(-this.x, -this.y);
  }
  
  resetTransform(ctx) {
    ctx.restore();
  }
  
  getVisibleBounds() {
    const halfWidth = (this.viewportWidth / 2) / this.zoom;
    const halfHeight = (this.viewportHeight / 2) / this.zoom;
    
    return {
      left: this.x - halfWidth,
      right: this.x + halfWidth,
      top: this.y - halfHeight,
      bottom: this.y + halfHeight
    };
  }
}
