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
        <input type="hidden" id="door-x" value="3">
        <input type="hidden" id="door-wall" value="top">
        <button id="generate">Generate Configurations</button>
      </div>
      <div class="preview-area">
        <canvas id="room-preview" width="300" height="240"></canvas>
        <span class="preview-hint">Drag the blue dot to move the door</span>
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

document.getElementById('generate').addEventListener('click', () => {
  const width = parseFloat(document.getElementById('room-width').value);
  const depth = parseFloat(document.getElementById('room-depth').value);
  const doorPos = parseFloat(document.getElementById('door-x').value);
  const doorW = parseFloat(document.getElementById('door-w').value);
  const wall = document.getElementById('door-wall').value;

  let door;
  if (wall === 'top') {
    door = { pos1: { x: doorPos, y: 0 }, pos2: { x: doorPos + doorW, y: 0 } };
  } else if (wall === 'bottom') {
    door = { pos1: { x: doorPos, y: depth }, pos2: { x: doorPos + doorW, y: depth } };
  } else if (wall === 'left') {
    door = { pos1: { x: 0, y: doorPos }, pos2: { x: 0, y: doorPos + doorW } };
  } else { // right
    door = { pos1: { x: width, y: doorPos }, pos2: { x: width, y: doorPos + doorW } };
  }

  const room = { x: width, y: depth, door };

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

  // Re-apply overlay if checkbox is checked
  setTimeout(() => {
    const overlayCheckbox = document.getElementById('show-overlay');
    if (overlayCheckbox && overlayCheckbox.checked) {
      document.querySelectorAll('.config-card').forEach(card => {
        const container = card.querySelector('.svg-container');
        if (card._configData) drawOverlayOnSVG(container, card._configData, card._roomW, card._roomH);
      });
    }
  }, 50);
}

/**
 * Architectural plan-view rendering.
 * 
 * Engine coordinate system:
 * - Origin (0,0) = top-left. X right, Y down.
 * - toilet.loc.x/y = centerline ON the wall (CM, no offset)
 * - canvasOffset added only to door coords
 * 
 * Rotations (which wall toilet is against):
 * - 0: top wall (y=0), toilet extends down
 * - 90: right wall (x=roomW), extends left
 * - 180: bottom wall (y=roomH), extends up
 * - 270: left wall (x=0), extends right
 */
function drawSVGConfig(config, roomW, roomH, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const svgW = 220, svgH = 200;
  const padding = 25;
  const availW = svgW - padding * 2;
  const availH = svgH - padding * 2;
  const scale = Math.min(availW / roomW, availH / roomH);
  const ox = padding + (availW - roomW * scale) / 2;
  const oy = padding + (availH - roomH * scale) / 2;
  const toX = (ft) => ox + ft * scale;
  const toY = (ft) => oy + ft * scale;
  const toW = (ft) => ft * scale;

  // Convert engine output
  const canvasOffset = config.canvasOffset;
  const doorP1xFt = (config.door.pos1.x - canvasOffset) / 30.48;
  const doorP2xFt = (config.door.pos2.x - canvasOffset) / 30.48;
  const doorWidthFt = doorP2xFt - doorP1xFt;

  const locXft = config.toilet.loc.x / 30.48;
  const locYft = config.toilet.loc.y / 30.48;

  // Toilet dimensions
  const toiletWidthFt = 23 / 12;
  const toiletDepthFt = 28 / 12;
  const tankDepthFt = 8 / 12;
  const bowlDepthFt = toiletDepthFt - tankDepthFt;

  const wallW = 2.5; // wall stroke width
  const doorW = 3.5; // door panel stroke width (thicker than wall)

  let svg = `<svg viewBox="0 0 ${svgW} ${svgH}" width="${svgW}" height="${svgH}" class="config-svg" xmlns="http://www.w3.org/2000/svg">`;

  // Room floor
  svg += `<rect x="${toX(0)}" y="${toY(0)}" width="${toW(roomW)}" height="${toW(roomH)}" fill="#fafbfc" stroke="none"/>`;

  // Walls — draw each segment, leaving gap for door on top wall
  // Top wall left of door
  svg += `<line x1="${toX(0)}" y1="${toY(0)}" x2="${toX(doorP1xFt)}" y2="${toY(0)}" stroke="#1e293b" stroke-width="${wallW}" stroke-linecap="square"/>`;
  // Top wall right of door
  svg += `<line x1="${toX(doorP2xFt)}" y1="${toY(0)}" x2="${toX(roomW)}" y2="${toY(0)}" stroke="#1e293b" stroke-width="${wallW}" stroke-linecap="square"/>`;
  // Right wall
  svg += `<line x1="${toX(roomW)}" y1="${toY(0)}" x2="${toX(roomW)}" y2="${toY(roomH)}" stroke="#1e293b" stroke-width="${wallW}" stroke-linecap="square"/>`;
  // Bottom wall
  svg += `<line x1="${toX(roomW)}" y1="${toY(roomH)}" x2="${toX(0)}" y2="${toY(roomH)}" stroke="#1e293b" stroke-width="${wallW}" stroke-linecap="square"/>`;
  // Left wall
  svg += `<line x1="${toX(0)}" y1="${toY(roomH)}" x2="${toX(0)}" y2="${toY(0)}" stroke="#1e293b" stroke-width="${wallW}" stroke-linecap="square"/>`;

  // Door — architectural convention:
  // Hinge at left side (doorP1x), door swings inward (into room = +Y direction)
  // 1. Door panel (thick line from hinge to open position)
  svg += `<line x1="${toX(doorP1xFt)}" y1="${toY(0)}" x2="${toX(doorP1xFt)}" y2="${toY(doorWidthFt)}" 
    stroke="#1e293b" stroke-width="${doorW}" stroke-linecap="round"/>`;
  // 2. Swing arc (quarter circle from closed to open position)
  svg += `<path d="M ${toX(doorP2xFt)} ${toY(0)} A ${toW(doorWidthFt)} ${toW(doorWidthFt)} 0 0 1 ${toX(doorP1xFt)} ${toY(doorWidthFt)}" 
    fill="none" stroke="#1e293b" stroke-width="0.75" stroke-dasharray="none"/>`;

  // TOILET
  let tankX, tankY, tankW, tankH, bowlCX, bowlCY, bowlRX, bowlRY;

  if (config.rotation === 0) {
    // Top wall, extends down
    tankX = locXft - toiletWidthFt / 2;
    tankY = 0;
    tankW = toiletWidthFt;
    tankH = tankDepthFt;
    bowlCX = locXft;
    bowlCY = tankDepthFt + bowlDepthFt / 2;
    bowlRX = toiletWidthFt / 2;
    bowlRY = bowlDepthFt / 2;
  } else if (config.rotation === 90) {
    // Right wall, extends left
    tankX = roomW - tankDepthFt;
    tankY = locYft - toiletWidthFt / 2;
    tankW = tankDepthFt;
    tankH = toiletWidthFt;
    bowlCX = roomW - tankDepthFt - bowlDepthFt / 2;
    bowlCY = locYft;
    bowlRX = bowlDepthFt / 2;
    bowlRY = toiletWidthFt / 2;
  } else if (config.rotation === 180) {
    // Bottom wall, extends up
    tankX = locXft - toiletWidthFt / 2;
    tankY = roomH - tankDepthFt;
    tankW = toiletWidthFt;
    tankH = tankDepthFt;
    bowlCX = locXft;
    bowlCY = roomH - tankDepthFt - bowlDepthFt / 2;
    bowlRX = toiletWidthFt / 2;
    bowlRY = bowlDepthFt / 2;
  } else {
    // Left wall (270), extends right
    tankX = 0;
    tankY = locYft - toiletWidthFt / 2;
    tankW = tankDepthFt;
    tankH = toiletWidthFt;
    bowlCX = tankDepthFt + bowlDepthFt / 2;
    bowlCY = locYft;
    bowlRX = bowlDepthFt / 2;
    bowlRY = toiletWidthFt / 2;
  }

  svg += `<g class="toilet-fixture">`;
  // Tank
  svg += `<rect x="${toX(tankX)}" y="${toY(tankY)}" width="${toW(tankW)}" height="${toW(tankH)}" 
    fill="#e2e8f0" stroke="#475569" stroke-width="1.5" rx="1.5"/>`;
  // Bowl (outer)
  svg += `<ellipse cx="${toX(bowlCX)}" cy="${toY(bowlCY)}" rx="${toW(bowlRX)}" ry="${toW(bowlRY)}" 
    fill="#f8fafc" stroke="#475569" stroke-width="1.5"/>`;
  // Seat opening (inner)
  svg += `<ellipse cx="${toX(bowlCX)}" cy="${toY(bowlCY)}" rx="${toW(bowlRX * 0.6)}" ry="${toW(bowlRY * 0.65)}" 
    fill="none" stroke="#94a3b8" stroke-width="0.75"/>`;
  svg += `</g>`;

  // Dimension label
  svg += `<text x="${svgW/2}" y="${svgH - 3}" text-anchor="middle" font-size="9" fill="#64748B" font-family="Inter, sans-serif">${roomW}' × ${roomH}'</text>`;

  svg += `</svg>`;
  container.innerHTML = svg;
}


// ============================
// ADA Compliance Overlay
// ============================
const ADA = {
  turningRadius: 5,
  centerlineDist: 18/12,
  clearFloorWidth: 48/12,
  clearFloorDepth: 60/12,
};

function drawOverlayOnSVG(container, config, roomW, roomH) {
  const svg = container.querySelector('svg');
  if (!svg) return;

  const svgW = 220, svgH = 200;
  const padding = 25;
  const availW = svgW - padding * 2;
  const availH = svgH - padding * 2;
  const scale = Math.min(availW / roomW, availH / roomH);
  const ox = padding + (availW - roomW * scale) / 2;
  const oy = padding + (availH - roomH * scale) / 2;
  const toX = (ft) => ox + ft * scale;
  const toY = (ft) => oy + ft * scale;
  const toW = (ft) => ft * scale;

  const locXft = config.toilet.loc.x / 30.48;
  const locYft = config.toilet.loc.y / 30.48;

  let existing = svg.querySelector('.ada-overlay');
  if (existing) existing.remove();

  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g.setAttribute('class', 'ada-overlay');

  // Turning radius
  const cx = toX(roomW/2), cy = toY(roomH/2), r = toW(ADA.turningRadius/2);
  g.innerHTML = `
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="rgba(16,185,129,0.5)" 
      stroke-width="1.5" stroke-dasharray="4,3" class="turning-radius"/>
    <text x="${cx}" y="${cy - r - 3}" text-anchor="middle" font-size="7" fill="rgba(16,185,129,0.8)">60" turning radius</text>
  `;

  // Centerline
  let clX1, clY1, clX2, clY2;
  if (config.rotation === 0) { clX1 = toX(locXft); clY1 = toY(0); clX2 = toX(locXft); clY2 = toY(ADA.centerlineDist); }
  else if (config.rotation === 90) { clX1 = toX(roomW); clY1 = toY(locYft); clX2 = toX(roomW - ADA.centerlineDist); clY2 = toY(locYft); }
  else if (config.rotation === 180) { clX1 = toX(locXft); clY1 = toY(roomH); clX2 = toX(locXft); clY2 = toY(roomH - ADA.centerlineDist); }
  else { clX1 = toX(0); clY1 = toY(locYft); clX2 = toX(ADA.centerlineDist); clY2 = toY(locYft); }
  g.innerHTML += `
    <line x1="${clX1}" y1="${clY1}" x2="${clX2}" y2="${clY2}" 
      stroke="rgba(139,92,246,0.7)" stroke-width="1.5" stroke-dasharray="2,2" class="centerline"/>
    <text x="${(parseFloat(clX1)+parseFloat(clX2))/2 + 8}" y="${(parseFloat(clY1)+parseFloat(clY2))/2 - 3}" font-size="7" fill="rgba(139,92,246,0.8)">18" CL</text>
  `;

  // Clear floor space
  const cw = ADA.clearFloorWidth, cd = ADA.clearFloorDepth;
  let cfx, cfy, cfw, cfh;
  if (config.rotation === 0) { cfx = locXft - cw/2; cfy = 0; cfw = cw; cfh = cd; }
  else if (config.rotation === 90) { cfx = roomW - cd; cfy = locYft - cw/2; cfw = cd; cfh = cw; }
  else if (config.rotation === 180) { cfx = locXft - cw/2; cfy = roomH - cd; cfw = cw; cfh = cd; }
  else { cfx = 0; cfy = locYft - cw/2; cfw = cd; cfh = cw; }
  g.innerHTML += `
    <rect x="${toX(cfx)}" y="${toY(cfy)}" width="${toW(cfw)}" height="${toW(cfh)}" 
      fill="rgba(245,158,11,0.06)" stroke="rgba(245,158,11,0.4)" stroke-width="1" stroke-dasharray="3,2" class="clear-floor"/>
    <text x="${toX(cfx + cfw/2)}" y="${toY(cfy + cfh/2) + 3}" text-anchor="middle" font-size="7" fill="rgba(245,158,11,0.7)">48"×60" clear</text>
  `;

  svg.appendChild(g);
}

document.addEventListener('change', (e) => {
  if (e.target.id === 'show-overlay') {
    document.querySelectorAll('.config-card').forEach(card => {
      const container = card.querySelector('.svg-container');
      if (e.target.checked && card._configData) {
        drawOverlayOnSVG(container, card._configData, card._roomW, card._roomH);
      } else {
        const ov = container.querySelector('.ada-overlay');
        if (ov) ov.remove();
      }
    });
  }
});


// ============================
// Interactive Door Drag
// ============================
const MIN_WALL_OFFSET = 0.5;
let doorState = { pos: 3, width: 2.5, wall: 'top' };
let isDragging = false;
let previewScale = 1, previewOffsetX = 0, previewOffsetY = 0;
let currentRoomW = 10, currentRoomH = 8;

function getWallLength(wall) {
  return (wall === 'top' || wall === 'bottom') ? currentRoomW : currentRoomH;
}

function getMaxPos(wall) {
  return getWallLength(wall) - doorState.width - MIN_WALL_OFFSET;
}

function clampDoorPos(pos, wall) {
  return Math.max(MIN_WALL_OFFSET, Math.min(pos, getMaxPos(wall)));
}

function nearestWall(mx, my) {
  const roomLeft = previewOffsetX;
  const roomTop = previewOffsetY;
  const roomRight = previewOffsetX + currentRoomW * previewScale;
  const roomBottom = previewOffsetY + currentRoomH * previewScale;
  const dists = {
    top: Math.abs(my - roomTop),
    bottom: Math.abs(my - roomBottom),
    left: Math.abs(mx - roomLeft),
    right: Math.abs(mx - roomRight)
  };
  let min = Infinity, nearest = 'top';
  for (const [wall, d] of Object.entries(dists)) {
    if (d < min) { min = d; nearest = wall; }
  }
  return nearest;
}

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

  // Walls (thick, with door gap on current wall)
  ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 3; ctx.lineCap = 'square';

  const wall = doorState.wall;
  const pos = doorState.pos;
  const dw = doorState.width;

  // Top wall
  if (wall === 'top') {
    ctx.beginPath(); ctx.moveTo(toX(0), toY(0)); ctx.lineTo(toX(pos), toY(0)); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(toX(pos + dw), toY(0)); ctx.lineTo(toX(roomW), toY(0)); ctx.stroke();
  } else {
    ctx.beginPath(); ctx.moveTo(toX(0), toY(0)); ctx.lineTo(toX(roomW), toY(0)); ctx.stroke();
  }
  // Right wall
  if (wall === 'right') {
    ctx.beginPath(); ctx.moveTo(toX(roomW), toY(0)); ctx.lineTo(toX(roomW), toY(pos)); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(toX(roomW), toY(pos + dw)); ctx.lineTo(toX(roomW), toY(roomH)); ctx.stroke();
  } else {
    ctx.beginPath(); ctx.moveTo(toX(roomW), toY(0)); ctx.lineTo(toX(roomW), toY(roomH)); ctx.stroke();
  }
  // Bottom wall
  if (wall === 'bottom') {
    ctx.beginPath(); ctx.moveTo(toX(roomW), toY(roomH)); ctx.lineTo(toX(pos + dw), toY(roomH)); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(toX(pos), toY(roomH)); ctx.lineTo(toX(0), toY(roomH)); ctx.stroke();
  } else {
    ctx.beginPath(); ctx.moveTo(toX(roomW), toY(roomH)); ctx.lineTo(toX(0), toY(roomH)); ctx.stroke();
  }
  // Left wall
  if (wall === 'left') {
    ctx.beginPath(); ctx.moveTo(toX(0), toY(roomH)); ctx.lineTo(toX(0), toY(pos + dw)); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(toX(0), toY(pos)); ctx.lineTo(toX(0), toY(0)); ctx.stroke();
  } else {
    ctx.beginPath(); ctx.moveTo(toX(0), toY(roomH)); ctx.lineTo(toX(0), toY(0)); ctx.stroke();
  }

  // Door panel and swing arc
  ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 4; ctx.lineCap = 'round';
  if (wall === 'top') {
    ctx.beginPath(); ctx.moveTo(toX(pos), toY(0)); ctx.lineTo(toX(pos), toY(dw)); ctx.stroke();
    ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1; ctx.lineCap = 'butt';
    ctx.beginPath(); ctx.arc(toX(pos), toY(0), toW(dw), 0, Math.PI/2); ctx.stroke();
  } else if (wall === 'right') {
    ctx.beginPath(); ctx.moveTo(toX(roomW), toY(pos)); ctx.lineTo(toX(roomW - dw), toY(pos)); ctx.stroke();
    ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1; ctx.lineCap = 'butt';
    ctx.beginPath(); ctx.arc(toX(roomW), toY(pos), toW(dw), Math.PI/2, Math.PI); ctx.stroke();
  } else if (wall === 'bottom') {
    ctx.beginPath(); ctx.moveTo(toX(pos + dw), toY(roomH)); ctx.lineTo(toX(pos + dw), toY(roomH - dw)); ctx.stroke();
    ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1; ctx.lineCap = 'butt';
    ctx.beginPath(); ctx.arc(toX(pos + dw), toY(roomH), toW(dw), Math.PI, 3*Math.PI/2); ctx.stroke();
  } else { // left
    ctx.beginPath(); ctx.moveTo(toX(0), toY(pos + dw)); ctx.lineTo(toX(dw), toY(pos + dw)); ctx.stroke();
    ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1; ctx.lineCap = 'butt';
    ctx.beginPath(); ctx.arc(toX(0), toY(pos + dw), toW(dw), -Math.PI/2, 0); ctx.stroke();
  }

  // Drag handle (blue dot at center of door opening on the wall)
  ctx.fillStyle = isDragging ? '#1d4ed8' : '#3b82f6';
  ctx.beginPath();
  let dotX, dotY;
  if (wall === 'top') { dotX = toX(pos + dw/2); dotY = toY(0); }
  else if (wall === 'right') { dotX = toX(roomW); dotY = toY(pos + dw/2); }
  else if (wall === 'bottom') { dotX = toX(pos + dw/2); dotY = toY(roomH); }
  else { dotX = toX(0); dotY = toY(pos + dw/2); }
  ctx.arc(dotX, dotY, 6, 0, Math.PI*2);
  ctx.fill();

  // Dimension label
  ctx.fillStyle = '#64748B'; ctx.font = '11px Inter, sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(`${roomW}' × ${roomH}'`, canvas.width/2, toY(roomH) + 20);
}

function getDoorHitbox() {
  const wall = doorState.wall;
  const pos = doorState.pos;
  const dw = doorState.width;
  if (wall === 'top') {
    const x = previewOffsetX + pos * previewScale;
    return { x: x-8, y: previewOffsetY-12, w: dw*previewScale+16, h: 24 };
  } else if (wall === 'right') {
    const y = previewOffsetY + pos * previewScale;
    const rx = previewOffsetX + currentRoomW * previewScale;
    return { x: rx-12, y: y-8, w: 24, h: dw*previewScale+16 };
  } else if (wall === 'bottom') {
    const x = previewOffsetX + pos * previewScale;
    const by = previewOffsetY + currentRoomH * previewScale;
    return { x: x-8, y: by-12, w: dw*previewScale+16, h: 24 };
  } else { // left
    const y = previewOffsetY + pos * previewScale;
    return { x: previewOffsetX-12, y: y-8, w: 24, h: dw*previewScale+16 };
  }
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
    const wall = nearestWall(mx, my);
    doorState.wall = wall;
    let rawPos;
    if (wall === 'top' || wall === 'bottom') {
      rawPos = (mx - previewOffsetX) / previewScale - doorState.width/2;
    } else {
      rawPos = (my - previewOffsetY) / previewScale - doorState.width/2;
    }
    doorState.pos = clampDoorPos(rawPos, wall);
    document.getElementById('door-x').value = doorState.pos.toFixed(1);
    document.getElementById('door-wall').value = doorState.wall;
    drawPreview();
  } else {
    const h = getDoorHitbox();
    e.target.style.cursor = (mx>=h.x && mx<=h.x+h.w && my>=h.y && my<=h.y+h.h) ? 'grab' : 'default';
  }
}
function onDoorMouseUp(e) {
  if (isDragging) { isDragging = false; e.target.style.cursor = 'default'; drawPreview(); document.getElementById('generate').click(); }
}

['room-width','room-depth','door-w'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', () => {
    if (id === 'door-w') doorState.width = parseFloat(el.value) || 2.5;
    drawPreview();
  });
});

setTimeout(initPreview, 50);
