import { findAccessible } from './engine/rrFinder.js';

const app = document.getElementById('app');

app.innerHTML = `
  <header>
    <h1>adaRR</h1>
    <p>ADA-Compliant Restroom Layout Planner</p>
  </header>

  <div class="step-container">
    <h2 class="step-title">1. Room Setup</h2>
    <div class="room-setup-layout">
      <div class="input-group">
        <label>Width (ft) <input type="number" id="room-width" value="10" min="4" max="20" step="0.5"></label>
        <label>Depth (ft) <input type="number" id="room-depth" value="8" min="4" max="20" step="0.5"></label>
        <label>Door Width (ft) <input type="number" id="door-w" value="2.5" min="2" max="4" step="0.5"></label>
        <div class="swing-toggle">
          <span>Swing:</span>
          <button id="swing-left" class="swing-btn active" title="Hinge on left">◐ Left</button>
          <button id="swing-right" class="swing-btn" title="Hinge on right">◑ Right</button>
        </div>
        <input type="hidden" id="door-x" value="3">
        <input type="hidden" id="door-wall" value="top">
        <button id="generate">Generate Configurations</button>
      </div>
      <div class="preview-area">
        <canvas id="room-preview" width="300" height="240"></canvas>
        <span class="preview-hint">Drag the blue dot along any wall</span>
      </div>
    </div>
  </div>

  <div class="step-container" id="results-section" style="display:none">
    <h2 class="step-title">2. Valid Configurations</h2>
    <label class="overlay-toggle"><input type="checkbox" id="show-overlay"> Show ADA Compliance Overlay</label>
    <p id="results-count"></p>
    <div class="configs-grid" id="configs-grid"></div>
  </div>
`;

// Door state: position along a wall, which wall, and swing direction
const MIN_WALL_OFFSET = 0.5; // 6 inches minimum from any corner
let doorState = { 
  pos: 3,       // position along the wall (feet from wall start)
  width: 2.5,   // door width in feet
  wall: 'top',  // which wall: top, right, bottom, left
  hinge: 'left' // hinge side: left or right (relative to wall direction)
};
let isDragging = false;
let previewScale = 1, previewOffsetX = 0, previewOffsetY = 0;
let currentRoomW = 10, currentRoomH = 8;

// Swing toggle
document.getElementById('swing-left').addEventListener('click', () => {
  doorState.hinge = 'left';
  document.getElementById('swing-left').classList.add('active');
  document.getElementById('swing-right').classList.remove('active');
  drawPreview();
});
document.getElementById('swing-right').addEventListener('click', () => {
  doorState.hinge = 'right';
  document.getElementById('swing-right').classList.add('active');
  document.getElementById('swing-left').classList.remove('active');
  drawPreview();
});

// Get door position in room coordinates based on wall
function getDoorRoomCoords() {
  const w = doorState.width;
  const p = doorState.pos;
  switch (doorState.wall) {
    case 'top':    return { pos1: { x: p, y: 0 }, pos2: { x: p + w, y: 0 } };
    case 'bottom': return { pos1: { x: p, y: currentRoomH }, pos2: { x: p + w, y: currentRoomH } };
    case 'left':   return { pos1: { x: 0, y: p }, pos2: { x: 0, y: p + w } };
    case 'right':  return { pos1: { x: currentRoomW, y: p }, pos2: { x: currentRoomW, y: p + w } };
  }
}

// Get max position for door on current wall
function getMaxPos() {
  const wallLength = (doorState.wall === 'top' || doorState.wall === 'bottom') ? currentRoomW : currentRoomH;
  return wallLength - doorState.width - MIN_WALL_OFFSET;
}

function clampDoorPos() {
  doorState.pos = Math.max(MIN_WALL_OFFSET, Math.min(doorState.pos, getMaxPos()));
}

document.getElementById('generate').addEventListener('click', () => {
  const width = parseFloat(document.getElementById('room-width').value);
  const depth = parseFloat(document.getElementById('room-depth').value);
  currentRoomW = width; currentRoomH = depth;

  const doorCoords = getDoorRoomCoords();
  const room = { x: width, y: depth, door: doorCoords };

  const configs = findAccessible(room);
  renderConfigs(configs, width, depth);
});

function renderConfigs(configs, roomW, roomH) {
  const section = document.getElementById('results-section');
  const grid = document.getElementById('configs-grid');
  const count = document.getElementById('results-count');

  section.style.display = 'block';
  count.textContent = `Found ${configs.length} valid placement${configs.length !== 1 ? 's' : ''}`;
  grid.innerHTML = '';

  configs.forEach((config, i) => {
    const card = document.createElement('div');
    card.className = 'config-card';
    card.innerHTML = `
      <div class="svg-container" id="svg-${config.id}"></div>
      <div class="config-label">Config ${i + 1}: ${config.note}</div>
    `;
    grid.appendChild(card);
    card._configData = config;
    card._roomW = roomW;
    card._roomH = roomH;
    setTimeout(() => drawSVGConfig(config, roomW, roomH, `svg-${config.id}`), 0);
  });

  // Re-apply overlay if checked
  setTimeout(() => {
    const cb = document.getElementById('show-overlay');
    if (cb && cb.checked) {
      document.querySelectorAll('.config-card').forEach(card => {
        const container = card.querySelector('.svg-container');
        if (card._configData) drawOverlayOnSVG(container, card._configData, card._roomW, card._roomH);
      });
    }
  }, 50);
}

function drawSVGConfig(config, roomW, roomH, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const svgW = 220, svgH = 200;
  const padding = 25;
  const availW = svgW - padding * 2, availH = svgH - padding * 2;
  const scale = Math.min(availW / roomW, availH / roomH);
  const ox = padding + (availW - roomW * scale) / 2;
  const oy = padding + (availH - roomH * scale) / 2;
  const toX = (ft) => ox + ft * scale;
  const toY = (ft) => oy + ft * scale;
  const toW = (ft) => ft * scale;

  const canvasOffset = config.canvasOffset;
  const doorP1xFt = (config.door.pos1.x - canvasOffset) / 30.48;
  const doorP1yFt = (config.door.pos1.y - canvasOffset) / 30.48;
  const doorP2xFt = (config.door.pos2.x - canvasOffset) / 30.48;
  const doorP2yFt = (config.door.pos2.y - canvasOffset) / 30.48;

  const locXft = config.toilet.loc.x / 30.48;
  const locYft = config.toilet.loc.y / 30.48;

  const toiletWidthFt = 23 / 12;
  const toiletDepthFt = 28 / 12;
  const tankDepthFt = 8 / 12;
  const bowlDepthFt = toiletDepthFt - tankDepthFt;

  let svg = `<svg viewBox="0 0 ${svgW} ${svgH}" width="${svgW}" height="${svgH}" class="config-svg" xmlns="http://www.w3.org/2000/svg">`;

  // Room floor
  svg += `<rect x="${toX(0)}" y="${toY(0)}" width="${toW(roomW)}" height="${toW(roomH)}" fill="#fafbfc" stroke="none"/>`;

  // Determine which wall the door is on and draw walls with gap
  const doorOnTop = (doorP1yFt === 0 && doorP2yFt === 0);
  const doorOnBottom = (Math.abs(doorP1yFt - roomH) < 0.01 && Math.abs(doorP2yFt - roomH) < 0.01);
  const doorOnLeft = (doorP1xFt === 0 && doorP2xFt === 0);
  const doorOnRight = (Math.abs(doorP1xFt - roomW) < 0.01 && Math.abs(doorP2xFt - roomW) < 0.01);

  const ww = 2.5; // wall width

  // Top wall
  if (doorOnTop) {
    const dStart = Math.min(doorP1xFt, doorP2xFt);
    const dEnd = Math.max(doorP1xFt, doorP2xFt);
    svg += `<line x1="${toX(0)}" y1="${toY(0)}" x2="${toX(dStart)}" y2="${toY(0)}" stroke="#1e293b" stroke-width="${ww}"/>`;
    svg += `<line x1="${toX(dEnd)}" y1="${toY(0)}" x2="${toX(roomW)}" y2="${toY(0)}" stroke="#1e293b" stroke-width="${ww}"/>`;
  } else {
    svg += `<line x1="${toX(0)}" y1="${toY(0)}" x2="${toX(roomW)}" y2="${toY(0)}" stroke="#1e293b" stroke-width="${ww}"/>`;
  }
  // Right wall
  if (doorOnRight) {
    const dStart = Math.min(doorP1yFt, doorP2yFt);
    const dEnd = Math.max(doorP1yFt, doorP2yFt);
    svg += `<line x1="${toX(roomW)}" y1="${toY(0)}" x2="${toX(roomW)}" y2="${toY(dStart)}" stroke="#1e293b" stroke-width="${ww}"/>`;
    svg += `<line x1="${toX(roomW)}" y1="${toY(dEnd)}" x2="${toX(roomW)}" y2="${toY(roomH)}" stroke="#1e293b" stroke-width="${ww}"/>`;
  } else {
    svg += `<line x1="${toX(roomW)}" y1="${toY(0)}" x2="${toX(roomW)}" y2="${toY(roomH)}" stroke="#1e293b" stroke-width="${ww}"/>`;
  }
  // Bottom wall
  if (doorOnBottom) {
    const dStart = Math.min(doorP1xFt, doorP2xFt);
    const dEnd = Math.max(doorP1xFt, doorP2xFt);
    svg += `<line x1="${toX(roomW)}" y1="${toY(roomH)}" x2="${toX(dEnd)}" y2="${toY(roomH)}" stroke="#1e293b" stroke-width="${ww}"/>`;
    svg += `<line x1="${toX(dStart)}" y1="${toY(roomH)}" x2="${toX(0)}" y2="${toY(roomH)}" stroke="#1e293b" stroke-width="${ww}"/>`;
  } else {
    svg += `<line x1="${toX(roomW)}" y1="${toY(roomH)}" x2="${toX(0)}" y2="${toY(roomH)}" stroke="#1e293b" stroke-width="${ww}"/>`;
  }
  // Left wall
  if (doorOnLeft) {
    const dStart = Math.min(doorP1yFt, doorP2yFt);
    const dEnd = Math.max(doorP1yFt, doorP2yFt);
    svg += `<line x1="${toX(0)}" y1="${toY(roomH)}" x2="${toX(0)}" y2="${toY(dEnd)}" stroke="#1e293b" stroke-width="${ww}"/>`;
    svg += `<line x1="${toX(0)}" y1="${toY(dStart)}" x2="${toX(0)}" y2="${toY(0)}" stroke="#1e293b" stroke-width="${ww}"/>`;
  } else {
    svg += `<line x1="${toX(0)}" y1="${toY(roomH)}" x2="${toX(0)}" y2="${toY(0)}" stroke="#1e293b" stroke-width="${ww}"/>`;
  }

  // Door — architectural plan: thick panel from hinge INTO room + quarter-circle arc
  const dw = 3.5;
  const doorLen = Math.sqrt(Math.pow(doorP2xFt - doorP1xFt, 2) + Math.pow(doorP2yFt - doorP1yFt, 2));
  
  let svgHingeX, svgHingeY, svgPanelEndX, svgPanelEndY, svgArcEndX, svgArcEndY;
  let arcSweep; // 0 = counter-clockwise, 1 = clockwise
  
  if (doorOnTop) {
    // Swings into room (+Y)
    if (doorState.hinge === 'left') {
      svgHingeX = toX(doorP1xFt); svgHingeY = toY(0);
      svgPanelEndX = toX(doorP1xFt); svgPanelEndY = toY(doorLen);
      svgArcEndX = toX(doorP1xFt); svgArcEndY = toY(doorLen);
      // Arc from non-hinge end (doorP2x, 0) sweeping clockwise to panel end
      svg += `<path d="M ${toX(doorP2xFt)} ${toY(0)} A ${toW(doorLen)} ${toW(doorLen)} 0 0 1 ${svgArcEndX} ${svgArcEndY}" fill="none" stroke="#1e293b" stroke-width="0.75"/>`;
    } else {
      svgHingeX = toX(doorP2xFt); svgHingeY = toY(0);
      svgPanelEndX = toX(doorP2xFt); svgPanelEndY = toY(doorLen);
      svgArcEndX = toX(doorP2xFt); svgArcEndY = toY(doorLen);
      // Arc from non-hinge end (doorP1x, 0) sweeping counter-clockwise to panel end
      svg += `<path d="M ${toX(doorP1xFt)} ${toY(0)} A ${toW(doorLen)} ${toW(doorLen)} 0 0 0 ${svgArcEndX} ${svgArcEndY}" fill="none" stroke="#1e293b" stroke-width="0.75"/>`;
    }
  } else if (doorOnBottom) {
    // Swings into room (-Y)
    if (doorState.hinge === 'left') {
      svgHingeX = toX(doorP1xFt); svgHingeY = toY(roomH);
      svgPanelEndX = toX(doorP1xFt); svgPanelEndY = toY(roomH - doorLen);
      // Arc from (doorP2x, roomH) counter-clockwise to panel end
      svg += `<path d="M ${toX(doorP2xFt)} ${toY(roomH)} A ${toW(doorLen)} ${toW(doorLen)} 0 0 0 ${svgPanelEndX} ${svgPanelEndY}" fill="none" stroke="#1e293b" stroke-width="0.75"/>`;
    } else {
      svgHingeX = toX(doorP2xFt); svgHingeY = toY(roomH);
      svgPanelEndX = toX(doorP2xFt); svgPanelEndY = toY(roomH - doorLen);
      // Arc from (doorP1x, roomH) clockwise to panel end
      svg += `<path d="M ${toX(doorP1xFt)} ${toY(roomH)} A ${toW(doorLen)} ${toW(doorLen)} 0 0 1 ${svgPanelEndX} ${svgPanelEndY}" fill="none" stroke="#1e293b" stroke-width="0.75"/>`;
    }
  } else if (doorOnLeft) {
    // Swings into room (+X)
    if (doorState.hinge === 'left') {
      svgHingeX = toX(0); svgHingeY = toY(doorP1yFt);
      svgPanelEndX = toX(doorLen); svgPanelEndY = toY(doorP1yFt);
      // Arc from (0, doorP2y) counter-clockwise to panel end
      svg += `<path d="M ${toX(0)} ${toY(doorP2yFt)} A ${toW(doorLen)} ${toW(doorLen)} 0 0 0 ${svgPanelEndX} ${svgPanelEndY}" fill="none" stroke="#1e293b" stroke-width="0.75"/>`;
    } else {
      svgHingeX = toX(0); svgHingeY = toY(doorP2yFt);
      svgPanelEndX = toX(doorLen); svgPanelEndY = toY(doorP2yFt);
      // Arc from (0, doorP1y) clockwise to panel end
      svg += `<path d="M ${toX(0)} ${toY(doorP1yFt)} A ${toW(doorLen)} ${toW(doorLen)} 0 0 1 ${svgPanelEndX} ${svgPanelEndY}" fill="none" stroke="#1e293b" stroke-width="0.75"/>`;
    }
  } else if (doorOnRight) {
    // Swings into room (-X)
    if (doorState.hinge === 'left') {
      svgHingeX = toX(roomW); svgHingeY = toY(doorP1yFt);
      svgPanelEndX = toX(roomW - doorLen); svgPanelEndY = toY(doorP1yFt);
      // Arc from (roomW, doorP2y) clockwise to panel end
      svg += `<path d="M ${toX(roomW)} ${toY(doorP2yFt)} A ${toW(doorLen)} ${toW(doorLen)} 0 0 1 ${svgPanelEndX} ${svgPanelEndY}" fill="none" stroke="#1e293b" stroke-width="0.75"/>`;
    } else {
      svgHingeX = toX(roomW); svgHingeY = toY(doorP2yFt);
      svgPanelEndX = toX(roomW - doorLen); svgPanelEndY = toY(doorP2yFt);
      // Arc from (roomW, doorP1y) counter-clockwise to panel end
      svg += `<path d="M ${toX(roomW)} ${toY(doorP1yFt)} A ${toW(doorLen)} ${toW(doorLen)} 0 0 0 ${svgPanelEndX} ${svgPanelEndY}" fill="none" stroke="#1e293b" stroke-width="0.75"/>`;
    }
  }
  // Panel line
  if (svgHingeX !== undefined) {
    svg += `<line x1="${svgHingeX}" y1="${svgHingeY}" x2="${svgPanelEndX}" y2="${svgPanelEndY}" stroke="#1e293b" stroke-width="${dw}" stroke-linecap="round"/>`;
  }

  // TOILET
  let tankX, tankY, tankW, tankH, bowlCX, bowlCY, bowlRX, bowlRY;
  if (config.rotation === 0) {
    tankX = locXft - toiletWidthFt/2; tankY = 0; tankW = toiletWidthFt; tankH = tankDepthFt;
    bowlCX = locXft; bowlCY = tankDepthFt + bowlDepthFt/2; bowlRX = toiletWidthFt/2; bowlRY = bowlDepthFt/2;
  } else if (config.rotation === 90) {
    tankX = roomW - tankDepthFt; tankY = locYft - toiletWidthFt/2; tankW = tankDepthFt; tankH = toiletWidthFt;
    bowlCX = roomW - tankDepthFt - bowlDepthFt/2; bowlCY = locYft; bowlRX = bowlDepthFt/2; bowlRY = toiletWidthFt/2;
  } else if (config.rotation === 180) {
    tankX = locXft - toiletWidthFt/2; tankY = roomH - tankDepthFt; tankW = toiletWidthFt; tankH = tankDepthFt;
    bowlCX = locXft; bowlCY = roomH - tankDepthFt - bowlDepthFt/2; bowlRX = toiletWidthFt/2; bowlRY = bowlDepthFt/2;
  } else {
    tankX = 0; tankY = locYft - toiletWidthFt/2; tankW = tankDepthFt; tankH = toiletWidthFt;
    bowlCX = tankDepthFt + bowlDepthFt/2; bowlCY = locYft; bowlRX = bowlDepthFt/2; bowlRY = toiletWidthFt/2;
  }

  svg += `<g class="toilet-fixture">`;
  svg += `<rect x="${toX(tankX)}" y="${toY(tankY)}" width="${toW(tankW)}" height="${toW(tankH)}" fill="#e2e8f0" stroke="#475569" stroke-width="1.5" rx="1.5"/>`;
  svg += `<ellipse cx="${toX(bowlCX)}" cy="${toY(bowlCY)}" rx="${toW(bowlRX)}" ry="${toW(bowlRY)}" fill="#f8fafc" stroke="#475569" stroke-width="1.5"/>`;
  svg += `<ellipse cx="${toX(bowlCX)}" cy="${toY(bowlCY)}" rx="${toW(bowlRX*0.6)}" ry="${toW(bowlRY*0.65)}" fill="none" stroke="#94a3b8" stroke-width="0.75"/>`;
  svg += `</g>`;

  svg += `<text x="${svgW/2}" y="${svgH - 3}" text-anchor="middle" font-size="9" fill="#64748B" font-family="Inter, sans-serif">${roomW}' × ${roomH}'</text>`;
  svg += `</svg>`;
  container.innerHTML = svg;
}


// ============================
// ADA Compliance Overlay
// ============================
const ADA = { turningRadius: 5, centerlineDist: 18/12, clearFloorWidth: 48/12, clearFloorDepth: 60/12 };

function drawOverlayOnSVG(container, config, roomW, roomH) {
  const svg = container.querySelector('svg');
  if (!svg) return;
  const svgW = 220, svgH = 200, padding = 25;
  const availW = svgW - padding*2, availH = svgH - padding*2;
  const scale = Math.min(availW/roomW, availH/roomH);
  const ox = padding + (availW - roomW*scale)/2, oy = padding + (availH - roomH*scale)/2;
  const toX = (ft) => ox + ft*scale;
  const toY = (ft) => oy + ft*scale;
  const toW = (ft) => ft*scale;

  const locXft = config.toilet.loc.x / 30.48;
  const locYft = config.toilet.loc.y / 30.48;

  let existing = svg.querySelector('.ada-overlay');
  if (existing) existing.remove();

  // Clip to room
  let clipDef = svg.querySelector('defs.overlay-defs');
  if (!clipDef) {
    clipDef = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    clipDef.setAttribute('class', 'overlay-defs');
    clipDef.innerHTML = `<clipPath id="room-clip-${config.id}"><rect x="${toX(0)}" y="${toY(0)}" width="${toW(roomW)}" height="${toW(roomH)}"/></clipPath>`;
    svg.insertBefore(clipDef, svg.firstChild);
  }

  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g.setAttribute('class', 'ada-overlay');
  g.setAttribute('clip-path', `url(#room-clip-${config.id})`);

  const cx = toX(roomW/2), cy = toY(roomH/2), r = toW(ADA.turningRadius/2);
  g.innerHTML = `
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="rgba(16,185,129,0.5)" stroke-width="1.5" stroke-dasharray="4,3" class="turning-radius"/>
    <text x="${cx}" y="${cy - r - 3}" text-anchor="middle" font-size="7" fill="rgba(16,185,129,0.8)">60" turning radius</text>
  `;

  let clX1, clY1, clX2, clY2;
  if (config.rotation === 0) { clX1 = toX(locXft); clY1 = toY(0); clX2 = toX(locXft); clY2 = toY(ADA.centerlineDist); }
  else if (config.rotation === 90) { clX1 = toX(roomW); clY1 = toY(locYft); clX2 = toX(roomW - ADA.centerlineDist); clY2 = toY(locYft); }
  else if (config.rotation === 180) { clX1 = toX(locXft); clY1 = toY(roomH); clX2 = toX(locXft); clY2 = toY(roomH - ADA.centerlineDist); }
  else { clX1 = toX(0); clY1 = toY(locYft); clX2 = toX(ADA.centerlineDist); clY2 = toY(locYft); }
  g.innerHTML += `<line x1="${clX1}" y1="${clY1}" x2="${clX2}" y2="${clY2}" stroke="rgba(139,92,246,0.7)" stroke-width="1.5" stroke-dasharray="2,2" class="centerline"/>
    <text x="${(parseFloat(clX1)+parseFloat(clX2))/2 + 8}" y="${(parseFloat(clY1)+parseFloat(clY2))/2 - 3}" font-size="7" fill="rgba(139,92,246,0.8)">18" CL</text>`;

  const cw = ADA.clearFloorWidth, cd = ADA.clearFloorDepth;
  let cfx, cfy, cfw, cfh;
  if (config.rotation === 0) { cfx = locXft-cw/2; cfy = 0; cfw = cw; cfh = cd; }
  else if (config.rotation === 90) { cfx = roomW-cd; cfy = locYft-cw/2; cfw = cd; cfh = cw; }
  else if (config.rotation === 180) { cfx = locXft-cw/2; cfy = roomH-cd; cfw = cw; cfh = cd; }
  else { cfx = 0; cfy = locYft-cw/2; cfw = cd; cfh = cw; }
  g.innerHTML += `<rect x="${toX(cfx)}" y="${toY(cfy)}" width="${toW(cfw)}" height="${toW(cfh)}" fill="rgba(245,158,11,0.06)" stroke="rgba(245,158,11,0.4)" stroke-width="1" stroke-dasharray="3,2" class="clear-floor"/>
    <text x="${toX(cfx+cfw/2)}" y="${toY(cfy+cfh/2)+3}" text-anchor="middle" font-size="7" fill="rgba(245,158,11,0.7)">48"×60" clear</text>`;

  svg.appendChild(g);
}

document.addEventListener('change', (e) => {
  if (e.target.id === 'show-overlay') {
    document.querySelectorAll('.config-card').forEach(card => {
      const container = card.querySelector('.svg-container');
      if (e.target.checked && card._configData) drawOverlayOnSVG(container, card._configData, card._roomW, card._roomH);
      else { const ov = container.querySelector('.ada-overlay'); if (ov) ov.remove(); }
    });
  }
});


// ============================
// Interactive Door Drag (any wall)
// ============================
function initPreview() {
  const canvas = document.getElementById('room-preview');
  if (!canvas) return;
  canvas.addEventListener('mousedown', onDoorMouseDown);
  canvas.addEventListener('mousemove', onDoorMouseMove);
  canvas.addEventListener('mouseup', onDoorMouseUp);
  canvas.addEventListener('mouseleave', onDoorMouseUp);
  drawPreview();
}

function drawPreview() {
  const canvas = document.getElementById('room-preview');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const roomW = parseFloat(document.getElementById('room-width').value) || 10;
  const roomH = parseFloat(document.getElementById('room-depth').value) || 8;
  currentRoomW = roomW; currentRoomH = roomH;
  clampDoorPos();

  const pad = 30;
  const availW = canvas.width - pad*2, availH = canvas.height - pad*2;
  previewScale = Math.min(availW/roomW, availH/roomH);
  previewOffsetX = pad + (availW - roomW*previewScale)/2;
  previewOffsetY = pad + (availH - roomH*previewScale)/2;
  const toX = (ft) => previewOffsetX + ft*previewScale;
  const toY = (ft) => previewOffsetY + ft*previewScale;
  const toW = (ft) => ft*previewScale;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Room fill
  ctx.fillStyle = '#fafbfc';
  ctx.fillRect(toX(0), toY(0), toW(roomW), toW(roomH));

  // Draw walls with gap for door
  ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 3; ctx.lineCap = 'square';
  
  const p = doorState.pos;
  const w = doorState.width;

  // Top wall
  if (doorState.wall === 'top') {
    ctx.beginPath(); ctx.moveTo(toX(0), toY(0)); ctx.lineTo(toX(p), toY(0)); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(toX(p+w), toY(0)); ctx.lineTo(toX(roomW), toY(0)); ctx.stroke();
  } else {
    ctx.beginPath(); ctx.moveTo(toX(0), toY(0)); ctx.lineTo(toX(roomW), toY(0)); ctx.stroke();
  }
  // Right wall
  if (doorState.wall === 'right') {
    ctx.beginPath(); ctx.moveTo(toX(roomW), toY(0)); ctx.lineTo(toX(roomW), toY(p)); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(toX(roomW), toY(p+w)); ctx.lineTo(toX(roomW), toY(roomH)); ctx.stroke();
  } else {
    ctx.beginPath(); ctx.moveTo(toX(roomW), toY(0)); ctx.lineTo(toX(roomW), toY(roomH)); ctx.stroke();
  }
  // Bottom wall
  if (doorState.wall === 'bottom') {
    ctx.beginPath(); ctx.moveTo(toX(roomW), toY(roomH)); ctx.lineTo(toX(p+w), toY(roomH)); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(toX(p), toY(roomH)); ctx.lineTo(toX(0), toY(roomH)); ctx.stroke();
  } else {
    ctx.beginPath(); ctx.moveTo(toX(roomW), toY(roomH)); ctx.lineTo(toX(0), toY(roomH)); ctx.stroke();
  }
  // Left wall
  if (doorState.wall === 'left') {
    ctx.beginPath(); ctx.moveTo(toX(0), toY(roomH)); ctx.lineTo(toX(0), toY(p+w)); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(toX(0), toY(p)); ctx.lineTo(toX(0), toY(0)); ctx.stroke();
  } else {
    ctx.beginPath(); ctx.moveTo(toX(0), toY(roomH)); ctx.lineTo(toX(0), toY(0)); ctx.stroke();
  }

  // Door panel and swing arc
  // Convention: panel from hinge INTO room. Arc from non-hinge opening end to panel tip.
  ctx.strokeStyle = '#1e293b';
  
  // Calculate hinge point, panel end, and arc geometry
  let hingeScreenX, hingeScreenY, panelEndScreenX, panelEndScreenY;
  let arcStartAngle, arcEndAngle, arcCounterClockwise;
  
  if (doorState.wall === 'top') {
    // Door swings INTO room (downward, +Y)
    if (doorState.hinge === 'left') {
      hingeScreenX = toX(p); hingeScreenY = toY(0);
      panelEndScreenX = toX(p); panelEndScreenY = toY(w);
      arcStartAngle = 0; arcEndAngle = Math.PI/2; arcCounterClockwise = false;
    } else {
      hingeScreenX = toX(p+w); hingeScreenY = toY(0);
      panelEndScreenX = toX(p+w); panelEndScreenY = toY(w);
      arcStartAngle = Math.PI; arcEndAngle = Math.PI/2; arcCounterClockwise = true;
    }
  } else if (doorState.wall === 'bottom') {
    // Door swings INTO room (upward, -Y)
    if (doorState.hinge === 'left') {
      hingeScreenX = toX(p); hingeScreenY = toY(roomH);
      panelEndScreenX = toX(p); panelEndScreenY = toY(roomH - w);
      arcStartAngle = 0; arcEndAngle = -Math.PI/2; arcCounterClockwise = true;
    } else {
      hingeScreenX = toX(p+w); hingeScreenY = toY(roomH);
      panelEndScreenX = toX(p+w); panelEndScreenY = toY(roomH - w);
      arcStartAngle = Math.PI; arcEndAngle = -Math.PI/2; arcCounterClockwise = false;
    }
  } else if (doorState.wall === 'left') {
    // Door swings INTO room (rightward, +X)
    if (doorState.hinge === 'left') {
      hingeScreenX = toX(0); hingeScreenY = toY(p);
      panelEndScreenX = toX(w); panelEndScreenY = toY(p);
      arcStartAngle = Math.PI/2; arcEndAngle = 0; arcCounterClockwise = true;
    } else {
      hingeScreenX = toX(0); hingeScreenY = toY(p+w);
      panelEndScreenX = toX(w); panelEndScreenY = toY(p+w);
      arcStartAngle = -Math.PI/2; arcEndAngle = 0; arcCounterClockwise = false;
    }
  } else { // right wall
    // Door swings INTO room (leftward, -X)
    if (doorState.hinge === 'left') {
      hingeScreenX = toX(roomW); hingeScreenY = toY(p);
      panelEndScreenX = toX(roomW - w); panelEndScreenY = toY(p);
      arcStartAngle = Math.PI/2; arcEndAngle = Math.PI; arcCounterClockwise = false;
    } else {
      hingeScreenX = toX(roomW); hingeScreenY = toY(p+w);
      panelEndScreenX = toX(roomW - w); panelEndScreenY = toY(p+w);
      arcStartAngle = -Math.PI/2; arcEndAngle = Math.PI; arcCounterClockwise = true;
    }
  }
  
  // Draw panel (thick line from hinge into room)
  ctx.lineWidth = 4; ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(hingeScreenX, hingeScreenY);
  ctx.lineTo(panelEndScreenX, panelEndScreenY);
  ctx.stroke();
  
  // Draw swing arc
  ctx.lineWidth = 0.75; ctx.lineCap = 'butt';
  ctx.beginPath();
  ctx.arc(hingeScreenX, hingeScreenY, toW(w), arcStartAngle, arcEndAngle, arcCounterClockwise);
  ctx.stroke();

  // Drag handle (blue dot at door center)
  let dotX, dotY;
  if (doorState.wall === 'top') { dotX = toX(p + w/2); dotY = toY(0); }
  else if (doorState.wall === 'bottom') { dotX = toX(p + w/2); dotY = toY(roomH); }
  else if (doorState.wall === 'left') { dotX = toX(0); dotY = toY(p + w/2); }
  else { dotX = toX(roomW); dotY = toY(p + w/2); }

  ctx.fillStyle = isDragging ? '#1d4ed8' : '#3b82f6';
  ctx.beginPath(); ctx.arc(dotX, dotY, 6, 0, Math.PI*2); ctx.fill();

  // Dimension
  ctx.fillStyle = '#64748B'; ctx.font = '10px Inter, sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(`${roomW}' × ${roomH}'`, canvas.width/2, toY(roomH) + 18);
}

// Detect which wall a point is nearest to
function nearestWall(mx, my) {
  const toX = (ft) => previewOffsetX + ft*previewScale;
  const toY = (ft) => previewOffsetY + ft*previewScale;
  
  const dTop = Math.abs(my - toY(0));
  const dBottom = Math.abs(my - toY(currentRoomH));
  const dLeft = Math.abs(mx - toX(0));
  const dRight = Math.abs(mx - toX(currentRoomW));
  
  const min = Math.min(dTop, dBottom, dLeft, dRight);
  if (min === dTop) return 'top';
  if (min === dBottom) return 'bottom';
  if (min === dLeft) return 'left';
  return 'right';
}

function getDoorHitbox() {
  const toX = (ft) => previewOffsetX + ft*previewScale;
  const toY = (ft) => previewOffsetY + ft*previewScale;
  const p = doorState.pos, w = doorState.width;
  
  if (doorState.wall === 'top') return { x: toX(p)-8, y: toY(0)-12, w: w*previewScale+16, h: 24 };
  if (doorState.wall === 'bottom') return { x: toX(p)-8, y: toY(currentRoomH)-12, w: w*previewScale+16, h: 24 };
  if (doorState.wall === 'left') return { x: toX(0)-12, y: toY(p)-8, w: 24, h: w*previewScale+16 };
  return { x: toX(currentRoomW)-12, y: toY(p)-8, w: 24, h: w*previewScale+16 };
}

function onDoorMouseDown(e) {
  const rect = e.target.getBoundingClientRect();
  const mx = e.clientX - rect.left, my = e.clientY - rect.top;
  const h = getDoorHitbox();
  if (mx >= h.x && mx <= h.x+h.w && my >= h.y && my <= h.y+h.h) {
    isDragging = true; e.target.style.cursor = 'grabbing'; drawPreview();
  }
}

function onDoorMouseMove(e) {
  const rect = e.target.getBoundingClientRect();
  const mx = e.clientX - rect.left, my = e.clientY - rect.top;
  if (isDragging) {
    // Determine which wall to snap to
    const wall = nearestWall(mx, my);
    doorState.wall = wall;
    
    // Calculate position along that wall
    if (wall === 'top' || wall === 'bottom') {
      doorState.pos = (mx - previewOffsetX) / previewScale - doorState.width/2;
    } else {
      doorState.pos = (my - previewOffsetY) / previewScale - doorState.width/2;
    }
    clampDoorPos();
    document.getElementById('door-x').value = doorState.pos.toFixed(1);
    document.getElementById('door-wall').value = doorState.wall;
    drawPreview();
  } else {
    const h = getDoorHitbox();
    e.target.style.cursor = (mx>=h.x && mx<=h.x+h.w && my>=h.y && my<=h.y+h.h) ? 'grab' : 'default';
  }
}

function onDoorMouseUp(e) {
  if (isDragging) {
    isDragging = false; e.target.style.cursor = 'default'; drawPreview();
    document.getElementById('generate').click();
  }
}

['room-width','room-depth','door-w'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', () => {
    if (id === 'door-w') doorState.width = parseFloat(el.value) || 2.5;
    drawPreview();
  });
});

setTimeout(initPreview, 50);
