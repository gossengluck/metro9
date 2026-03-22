// Input System - Mouse and Keyboard handling for camera control
export class InputHandler {
  constructor(canvas, camera, minimap) {
    this.canvas = canvas;
    this.camera = camera;
    this.minimap = minimap;
    
    // Mouse state
    this.mouseX = 0;
    this.mouseY = 0;
    this.mouseWorldX = 0;
    this.mouseWorldY = 0;
    this.isRightMouseDown = false;
    this.isLeftMouseDown = false;
    
    // Keyboard state
    this.keys = {};
    
    // Pan settings
    this.keyPanSpeed = 5; // Pixels per frame
    
    // Callbacks
    this.onLeftClick = null;
    this.onRightClick = null;
    this.onMouseMove = null;
    
    // Setup event listeners
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    // Mouse wheel for zoom - AKTIVIERT
    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      
      // Check if mouse is over minimap
      if (this.minimap && this.minimap.isMouseOver(this.mouseX, this.mouseY)) {
        return;
      }
      
      const delta = -Math.sign(e.deltaY);
      this.camera.zoomBy(delta, this.mouseX, this.mouseY);
    }, { passive: false });
    
    // Mouse down
    this.canvas.addEventListener('mousedown', (e) => {
      this.updateMousePosition(e);
      
      // Check minimap first
      if (this.minimap && this.minimap.handleMouseDown(this.mouseX, this.mouseY, this.camera)) {
        return;
      }
      
      if (e.button === 0) { // Left click
        this.isLeftMouseDown = true;
        if (this.onLeftClick) {
          this.onLeftClick(this.mouseWorldX, this.mouseWorldY, e);
        }
      } else if (e.button === 2) { // Right click
        e.preventDefault();
        this.isRightMouseDown = true;
        this.camera.startPan(this.mouseX, this.mouseY);
      }
    });
    
    // Mouse move
    this.canvas.addEventListener('mousemove', (e) => {
      this.updateMousePosition(e);
      
      // Update minimap hover state
      if (this.minimap) {
        this.minimap.handleMouseMove(this.mouseX, this.mouseY, this.camera);
      }
      
      // Update pan if right mouse is down
      if (this.isRightMouseDown) {
        this.camera.updatePan(this.mouseX, this.mouseY);
      }
      
      if (this.onMouseMove) {
        this.onMouseMove(this.mouseWorldX, this.mouseWorldY, e);
      }
    });
    
    // Mouse up
    this.canvas.addEventListener('mouseup', (e) => {
      if (e.button === 0) {
        this.isLeftMouseDown = false;
      } else if (e.button === 2) {
        this.isRightMouseDown = false;
        this.camera.stopPan();
      }
      
      if (this.minimap) {
        this.minimap.handleMouseUp();
      }
    });
    
    // Prevent context menu on right click
    this.canvas.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      return false;
    });
    
    // Mouse leave canvas
    this.canvas.addEventListener('mouseleave', () => {
      this.isRightMouseDown = false;
      this.isLeftMouseDown = false;
      this.camera.stopPan();
      if (this.minimap) {
        this.minimap.handleMouseUp();
      }
    });
    
    // Keyboard for additional controls
    window.addEventListener('keydown', (e) => {
      this.keys[e.key.toLowerCase()] = true;
      
      // Space bar to reset camera zoom to 100%
      if (e.code === 'Space') {
        e.preventDefault();
        this.camera.setZoom(1.0);
      }
      
      // +/- for zoom
      if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        this.camera.zoomBy(1, this.canvas.width / 2, this.canvas.height / 2);
      }
      if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        this.camera.zoomBy(-1, this.canvas.width / 2, this.canvas.height / 2);
      }
    });
    
    window.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });
  }
  
  // Update mouse position
  updateMousePosition(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouseX = e.clientX - rect.left;
    this.mouseY = e.clientY - rect.top;
    
    // Convert to world coordinates
    this.mouseWorldX = this.camera.screenToWorldX(this.mouseX);
    this.mouseWorldY = this.camera.screenToWorldY(this.mouseY);
  }
  
  // Update keyboard camera movement
  update() {
    let dx = 0;
    let dy = 0;
    
    // WASD or Arrow keys for camera movement
    if (this.keys['w'] || this.keys['arrowup']) dy -= this.keyPanSpeed;
    if (this.keys['s'] || this.keys['arrowdown']) dy += this.keyPanSpeed;
    if (this.keys['a'] || this.keys['arrowleft']) dx -= this.keyPanSpeed;
    if (this.keys['d'] || this.keys['arrowright']) dx += this.keyPanSpeed;
    
    if (dx !== 0 || dy !== 0) {
      // Adjust for zoom
      dx /= this.camera.zoom;
      dy /= this.camera.zoom;
      
      this.camera.targetX += dx;
      this.camera.targetY += dy;
      this.camera.clampTargetPosition();
    }
  }
  
  // Get current mouse world position
  getMouseWorldPosition() {
    return { x: this.mouseWorldX, y: this.mouseWorldY };
  }
  
  // Get current mouse screen position
  getMouseScreenPosition() {
    return { x: this.mouseX, y: this.mouseY };
  }
  
  // Check if key is pressed
  isKeyPressed(key) {
    return this.keys[key.toLowerCase()] === true;
  }
}
