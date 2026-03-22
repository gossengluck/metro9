// Minimap System - Shows overview of the world
export class Minimap {
  constructor(worldWidth, worldHeight, size = 200) {
    this.worldWidth = worldWidth;
    this.worldHeight = worldHeight;
    this.size = size;
    
    // Position (bottom-left corner)
    this.x = 15;
    this.y = 0; // Will be set based on canvas height
    
    // Minimap dimensions
    this.aspectRatio = worldWidth / worldHeight;
    if (this.aspectRatio > 1) {
      this.width = size;
      this.height = size / this.aspectRatio;
    } else {
      this.width = size * this.aspectRatio;
      this.height = size;
    }
    
    // Interaction
    this.isDragging = false;
    this.isHovered = false;
    
    // Style
    this.backgroundColor = 'rgba(10, 14, 39, 0.85)';
    this.borderColor = '#e94560';
    this.viewportColor = 'rgba(233, 69, 96, 0.3)';
    this.viewportBorderColor = '#e94560';
    this.pathColor = '#444';
    this.towerColor = '#4a9eff';
    this.enemyColor = '#ff4444';
  }
  
  // Update position based on canvas height
  updatePosition(canvasHeight) {
    this.y = canvasHeight - this.height - 15;
  }
  
  // Check if mouse is over minimap
  isMouseOver(mouseX, mouseY) {
    return mouseX >= this.x && 
           mouseX <= this.x + this.width &&
           mouseY >= this.y && 
           mouseY <= this.y + this.height;
  }
  
  // Convert minimap coordinates to world coordinates
  minimapToWorld(minimapX, minimapY) {
    const relX = (minimapX - this.x) / this.width;
    const relY = (minimapY - this.y) / this.height;
    
    return {
      x: relX * this.worldWidth,
      y: relY * this.worldHeight
    };
  }
  
  // Convert world coordinates to minimap coordinates
  worldToMinimap(worldX, worldY) {
    return {
      x: this.x + (worldX / this.worldWidth) * this.width,
      y: this.y + (worldY / this.worldHeight) * this.height
    };
  }
  
  // Handle mouse down on minimap
  handleMouseDown(mouseX, mouseY, camera) {
    if (this.isMouseOver(mouseX, mouseY)) {
      this.isDragging = true;
      const worldPos = this.minimapToWorld(mouseX, mouseY);
      camera.jumpTo(worldPos.x, worldPos.y);
      return true;
    }
    return false;
  }
  
  // Handle mouse move on minimap
  handleMouseMove(mouseX, mouseY, camera) {
    this.isHovered = this.isMouseOver(mouseX, mouseY);
    
    if (this.isDragging) {
      const worldPos = this.minimapToWorld(mouseX, mouseY);
      camera.jumpTo(worldPos.x, worldPos.y);
      return true;
    }
    return false;
  }
  
  // Handle mouse up
  handleMouseUp() {
    this.isDragging = false;
  }
  
  // Draw the minimap
  draw(ctx, camera, gameState) {
    // Background
    ctx.fillStyle = this.backgroundColor;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Border
    ctx.strokeStyle = this.borderColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    
    // Draw path (simplified)
    if (gameState.path && gameState.path.length > 0) {
      ctx.strokeStyle = this.pathColor;
      ctx.lineWidth = Math.max(2, this.width / 100);
      ctx.beginPath();
      
      gameState.path.forEach((point, i) => {
        const pos = this.worldToMinimap(
          point.x * gameState.GRID_SIZE + gameState.GRID_SIZE / 2,
          point.y * gameState.GRID_SIZE + gameState.GRID_SIZE / 2
        );
        
        if (i === 0) {
          ctx.moveTo(pos.x, pos.y);
        } else {
          ctx.lineTo(pos.x, pos.y);
        }
      });
      
      ctx.stroke();
    }
    
    // Draw towers
    ctx.fillStyle = this.towerColor;
    gameState.towers.forEach(tower => {
      const pos = this.worldToMinimap(tower.x, tower.y);
      const size = Math.max(2, this.width / 80);
      ctx.fillRect(pos.x - size / 2, pos.y - size / 2, size, size);
    });
    
    // Draw enemies
    ctx.fillStyle = this.enemyColor;
    gameState.enemies.forEach(enemy => {
      const pos = this.worldToMinimap(enemy.x, enemy.y);
      const size = Math.max(2, this.width / 100);
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2);
      ctx.fill();
    });
    
    // Draw camera viewport
    const bounds = camera.getVisibleBounds();
    const topLeft = this.worldToMinimap(bounds.left, bounds.top);
    const bottomRight = this.worldToMinimap(bounds.right, bounds.bottom);
    
    ctx.fillStyle = this.viewportColor;
    ctx.fillRect(
      topLeft.x,
      topLeft.y,
      bottomRight.x - topLeft.x,
      bottomRight.y - topLeft.y
    );
    
    ctx.strokeStyle = this.viewportBorderColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(
      topLeft.x,
      topLeft.y,
      bottomRight.x - topLeft.x,
      bottomRight.y - topLeft.y
    );
    
    // Hover effect
    if (this.isHovered) {
      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 3;
      ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
    
    // Label
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = 'bold 11px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('KARTE', this.x + 5, this.y + 15);
    
    // Zoom indicator
    ctx.font = '9px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillText(`${Math.round(camera.zoom * 100)}%`, this.x + 5, this.y + this.height - 5);
  }
}
