// Map Generation Module - Handles path and grid generation

export function buildRandomPath(cols, rows, opts = {}) {
  const startY = Math.floor(rows/2);
  const marginX = 1, marginY = 2;
  const maxStraight = opts.maxStraight || 6;
  const biasRight = 0.6;

  const visited = new Set();
  const enc = (x,y) => `${x},${y}`;
  const inBounds = (x,y) => x >= marginX && x <= cols-1-marginX && y >= marginY && y <= rows-1-marginY;

  let x = marginX, y = Math.min(Math.max(startY, marginY), rows-1-marginY);
  const path = [{x,y}];
  visited.add(enc(x,y));

  let dir = {dx:1, dy:0};
  let straightLen = 0;

  function neighbors(cx, cy) {
    const moves = [
      {dx: 1, dy: 0, w: biasRight},
      {dx:-1, dy: 0, w: 0.10},
      {dx: 0, dy:-1, w: 0.25},
      {dx: 0, dy: 1, w: 0.25}
    ];
    const filtered = moves.filter(m => {
      const nx = cx + m.dx, ny = cy + m.dy;
      if(!inBounds(nx,ny)) return false;
      if(visited.has(enc(nx,ny))) return false;
      if(dir.dx===m.dx && dir.dy===m.dy && straightLen >= maxStraight) return false;
      return true;
    });
    const sum = filtered.reduce((a,m) => a+(m.w||1), 0);
    let r = Math.random()*sum, pick = null;
    for(const m of filtered) { 
      r -= (m.w||1); 
      if(r <= 0) { 
        pick = m; 
        break; 
      } 
    }
    return pick;
  }

  let attempts = 0;
  while(x < cols-1-marginX && attempts < cols*rows*4) {
    attempts++;
    const move = neighbors(x,y);
    if(!move) {
      if(path.length > 1) {
        const last = path.pop(); 
        visited.delete(enc(last.x, last.y));
        const prev = path[path.length-1];
        x = prev.x; 
        y = prev.y; 
        straightLen = 0; 
        dir = {dx:1,dy:0};
        continue;
      } else break;
    }
    x += move.dx; 
    y += move.dy;
    path.push({x,y}); 
    visited.add(enc(x,y));
    if(move.dx === dir.dx && move.dy === dir.dy) straightLen++;
    else { 
      dir = {dx:move.dx, dy:move.dy}; 
      straightLen = 1; 
    }
  }

  while(x < cols-1-marginX) {
    x += 1;
    if(!inBounds(x,y) || visited.has(enc(x,y))) break;
    path.push({x,y}); 
    visited.add(enc(x,y));
  }
  
  return path;
}

export function initializeGrid(path, GRID_WIDTH, GRID_HEIGHT) {
  const grid = Array(GRID_HEIGHT).fill().map(() => Array(GRID_WIDTH).fill(0));
  
  for(let i = 0; i < path.length-1; i++) {
    const s = path[i], e = path[i+1];
    const dx = Math.sign(e.x - s.x), dy = Math.sign(e.y - s.y);
    let x = s.x, y = s.y;
    while(x !== e.x || y !== e.y) {
      if(y >= 0 && y < GRID_HEIGHT && x >= 0 && x < GRID_WIDTH) grid[y][x] = 1;
      if(x !== e.x) x += dx; 
      if(y !== e.y) y += dy;
    }
  }
  
  const last = path[path.length-1];
  if(last && last.y >= 0 && last.y < GRID_HEIGHT && last.x >= 0 && last.x < GRID_WIDTH) {
    grid[last.y][last.x] = 1;
  }
  
  return grid;
}

export function regenerateMap(gameState, GRID_WIDTH, GRID_HEIGHT) {
  const path = buildRandomPath(GRID_WIDTH, GRID_HEIGHT, {maxStraight: 5 + Math.floor(Math.random()*3)});
  const grid = initializeGrid(path, GRID_WIDTH, GRID_HEIGHT);
  
  // Reset Entities
  gameState.towers = [];
  gameState.selectedTower = null;
  gameState.selectedTowerObject = null;
  gameState.enemies = [];
  gameState.projectiles = [];
  gameState.particles = [];
  gameState.pendingSpawns = [];
  gameState.waveActive = false;
  
  return { path, grid };
}

export function drawShape(context, shape, x, y, size) {
  context.beginPath();
  switch(shape) {
    case 'circle': 
      context.arc(x, y, size, 0, Math.PI*2); 
      break;
    case 'square': 
      context.rect(x-size, y-size, size*2, size*2); 
      break;
    case 'triangle':
      context.moveTo(x, y-size); 
      context.lineTo(x+size, y+size); 
      context.lineTo(x-size, y+size); 
      break;
    case 'diamond':
      context.moveTo(x, y-size); 
      context.lineTo(x+size, y); 
      context.lineTo(x, y+size); 
      context.lineTo(x-size, y); 
      break;
    case 'pentagon':
      for(let i = 0; i < 5; i++) {
        const a = (i*2*Math.PI/5) - Math.PI/2; 
        const px = x + Math.cos(a)*size; 
        const py = y + Math.sin(a)*size; 
        if(i === 0) context.moveTo(px, py); 
        else context.lineTo(px, py);
      } 
      break;
    case 'hexagon':
      for(let i = 0; i < 6; i++) {
        const a = i*2*Math.PI/6; 
        const px = x + Math.cos(a)*size; 
        const py = y + Math.sin(a)*size; 
        if(i === 0) context.moveTo(px, py); 
        else context.lineTo(px, py);
      } 
      break;
    case 'star':
      for(let i = 0; i < 10; i++) {
        const a = (i*Math.PI/5) - Math.PI/2; 
        const r = (i%2 === 0) ? size : size/2; 
        const px = x + Math.cos(a)*r; 
        const py = y + Math.sin(a)*r; 
        if(i === 0) context.moveTo(px, py); 
        else context.lineTo(px, py);
      } 
      break;
    case 'octagon':
      for(let i = 0; i < 8; i++) {
        const a = i*2*Math.PI/8; 
        const px = x + Math.cos(a)*size; 
        const py = y + Math.sin(a)*size; 
        if(i === 0) context.moveTo(px, py); 
        else context.lineTo(px, py);
      } 
      break;
  }
  context.closePath();
}
