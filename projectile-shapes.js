// Projectile Shapes Module - Visual rendering for different projectile types

export function drawProjectileShape(ctx, shape, size, color, age, rotation) {
  const s = Math.max(0.1, size); // Ensure positive radius
  ctx.fillStyle = color;
  ctx.strokeStyle = 'rgba(255,255,255,0.8)';
  ctx.lineWidth = Math.max(1, s * 0.15);
  
  switch(shape) {
    case 'circle':
      ctx.beginPath();
      ctx.arc(0, 0, s, 0, Math.PI*2);
      ctx.fill();
      ctx.stroke();
      break;
      
    case 'arrow':
    case 'bolt':
      ctx.beginPath();
      ctx.moveTo(s*1.2, 0);
      ctx.lineTo(-s*0.5, -s*0.4);
      ctx.lineTo(-s*0.3, 0);
      ctx.lineTo(-s*0.5, s*0.4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;
      
    case 'bullet':
      ctx.beginPath();
      ctx.ellipse(0, 0, s*1.3, s*0.6, 0, 0, Math.PI*2);
      ctx.fill();
      ctx.stroke();
      break;
      
    case 'rocket':
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(s*1.2, 0);
      ctx.lineTo(-s*0.6, -s*0.5);
      ctx.lineTo(-s*0.8, 0);
      ctx.lineTo(-s*0.6, s*0.5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ff6600';
      ctx.beginPath();
      ctx.moveTo(-s*0.8, 0);
      ctx.lineTo(-s*1.5, -s*0.3);
      ctx.lineTo(-s*1.5, s*0.3);
      ctx.closePath();
      ctx.fill();
      break;
      
    case 'ice':
      ctx.save();
      ctx.fillStyle = color;
      for(let i=0; i<6; i++) {
        ctx.rotate(Math.PI/3);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(s, 0);
        ctx.lineTo(s*0.7, s*0.3);
        ctx.lineTo(s*0.7, -s*0.3);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
      ctx.restore();
      break;
      
    case 'poison':
      ctx.globalAlpha = 0.7;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(0, 0, s, 0, Math.PI*2);
      ctx.fill();
      ctx.globalAlpha = 0.4;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-s*0.3, -s*0.3, s*0.4, 0, Math.PI*2);
      ctx.fill();
      break;
      
    case 'lightning':
    case 'electric':
      ctx.strokeStyle = color;
      ctx.lineWidth = s*0.4;
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.moveTo(-s, 0);
      for(let i=0; i<4; i++) {
        ctx.lineTo((i-1.5)*s*0.5, (Math.random()-0.5)*s*2);
      }
      ctx.lineTo(s, 0);
      ctx.stroke();
      break;
      
    case 'rock':
    case 'boulder':
      ctx.fillStyle = color;
      ctx.beginPath();
      const sides = 8;
      for(let i=0; i<sides; i++) {
        const angle = (i/sides) * Math.PI*2;
        const r = s * (0.8 + Math.random()*0.4);
        ctx.lineTo(Math.cos(angle)*r, Math.sin(angle)*r);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;
      
    case 'mortar':
    case 'shell':
    case 'cannonball':
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(0, 0, s, 0, Math.PI*2);
      ctx.fill();
      ctx.strokeStyle = '#000';
      ctx.lineWidth = s*0.15;
      ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,0.5)';
      ctx.lineWidth = s*0.1;
      ctx.beginPath();
      ctx.arc(0, 0, s*0.6, 0, Math.PI*2);
      ctx.stroke();
      break;
      
    case 'ion':
    case 'quantum':
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(0, 0, s*0.7, 0, Math.PI*2);
      ctx.fill();
      for(let i=0; i<3; i++) {
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.4 - i*0.1;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, s*(1+i*0.3), 0, Math.PI*2);
        ctx.stroke();
      }
      break;
      
    case 'tornado':
      ctx.strokeStyle = color;
      ctx.lineWidth = s*0.3;
      for(let i=0; i<3; i++) {
        const offset = (age*0.1 + i*Math.PI*2/3) % (Math.PI*2);
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.arc(Math.cos(offset)*s*0.5, Math.sin(offset)*s*0.5, s*0.4, 0, Math.PI*2);
        ctx.stroke();
      }
      break;
      
    case 'glue':
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.arc(0, s*0.2, s*0.8, 0, Math.PI*2);
      ctx.arc(0, -s*0.2, s*1.0, 0, Math.PI*2);
      ctx.fill();
      break;
      
    case 'shock':
      for(let i=0; i<2; i++) {
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.6 - i*0.2;
        ctx.lineWidth = s*0.4;
        ctx.beginPath();
        ctx.arc(0, 0, s*(1+i*0.5), 0, Math.PI*2);
        ctx.stroke();
      }
      break;
      
    case 'vampire':
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(0, -s*0.3);
      ctx.quadraticCurveTo(-s*0.7, -s, -s*1.2, -s*0.5);
      ctx.quadraticCurveTo(-s*0.5, 0, 0, s*0.3);
      ctx.quadraticCurveTo(s*0.5, 0, s*1.2, -s*0.5);
      ctx.quadraticCurveTo(s*0.7, -s, 0, -s*0.3);
      ctx.fill();
      ctx.stroke();
      break;
      
    case 'nuke':
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(0, -s*0.4, s*0.7, 0, Math.PI*2);
      ctx.fill();
      ctx.fillRect(-s*0.5, 0, s, s*0.8);
      ctx.strokeStyle = '#000';
      ctx.lineWidth = s*0.1;
      ctx.stroke();
      ctx.strokeStyle = '#ff0';
      ctx.lineWidth = 2;
      for(let i=0; i<3; i++) {
        ctx.save();
        ctx.rotate(i*Math.PI*2/3);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -s*0.5);
        ctx.stroke();
        ctx.restore();
      }
      break;
      
    case 'blackhole':
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, s);
      gradient.addColorStop(0, '#000');
      gradient.addColorStop(0.5, color);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, s, 0, Math.PI*2);
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for(let i=0; i<20; i++) {
        const angle = i * 0.5 + rotation*3;
        const r = (i/20) * s;
        ctx.lineTo(Math.cos(angle)*r, Math.sin(angle)*r);
      }
      ctx.stroke();
      break;
      
    case 'star':
      ctx.fillStyle = color;
      ctx.beginPath();
      for(let i=0; i<10; i++) {
        const angle = (i*Math.PI/5);
        const r = (i%2===0) ? s : s*0.5;
        const px = Math.cos(angle)*r;
        const py = Math.sin(angle)*r;
        if(i===0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;
      
    case 'meteor':
    case 'comet':
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(0, 0, s, 0, Math.PI*2);
      ctx.fill();
      ctx.stroke();
      const gradient2 = ctx.createLinearGradient(0, 0, -s*2, 0);
      gradient2.addColorStop(0, color);
      gradient2.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient2;
      ctx.fillRect(-s*2, -s*0.5, s*2, s);
      break;
      
    case 'heal':
      ctx.fillStyle = color;
      ctx.fillRect(-s*0.3, -s, s*0.6, s*2);
      ctx.fillRect(-s, -s*0.3, s*2, s*0.6);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.strokeRect(-s*0.3, -s, s*0.6, s*2);
      ctx.strokeRect(-s, -s*0.3, s*2, s*0.6);
      break;
      
    case 'slow':
      ctx.strokeStyle = color;
      ctx.lineWidth = s*0.2;
      ctx.beginPath();
      ctx.arc(0, 0, s, 0, Math.PI*2);
      ctx.stroke();
      ctx.lineWidth = s*0.15;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -s*0.7);
      ctx.moveTo(0, 0);
      ctx.lineTo(s*0.5, 0);
      ctx.stroke();
      break;
      
    case 'shadow':
      ctx.globalAlpha = 0.6;
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(0, 0, s*1.2, 0, Math.PI*2);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(0, 0, s*0.8, 0, Math.PI*2);
      ctx.fill();
      break;
      
    case 'omega':
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = s*0.3;
      ctx.beginPath();
      ctx.arc(0, 0, s*0.8, Math.PI*0.2, Math.PI*0.8);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(-s*0.3, s*0.6, s*0.3, 0, Math.PI*2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(s*0.3, s*0.6, s*0.3, 0, Math.PI*2);
      ctx.fill();
      break;
      
    default:
      ctx.beginPath();
      ctx.arc(0, 0, s, 0, Math.PI*2);
      ctx.fill();
      ctx.stroke();
  }
}
