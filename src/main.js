import { findAccessible } from './engine/rrFinder.js';
import { ftToCmAndRound, inchToCm } from './engine/utilRR.js';

const app = document.getElementById('app');

app.innerHTML = `
  <header>
    <h1>adaRR</h1>
    <p>ADA-Compliant Restroom Layout Planner</p>
  </header>

  <div class="step-container">
    <h2 class="step-title">1. Enter Room Dimensions</h2>
    <div class="input-group">
      <label>
        Width (feet)
        <input type="number" id="room-width" value="10" min="4" max="20" step="0.5">
      </label>
      <label>
        Depth (feet)
        <input type="number" id="room-depth" value="8" min="4" max="20" step="0.5">
      </label>
      <label>
        Door X (feet)
        <input type="number" id="door-x" value="3" min="0" max="20" step="0.5">
      </label>
      <label>
        Door Width (feet)
        <input type="number" id="door-w" value="2.5" min="2" max="4" step="0.5">
      </label>
    </div>
    <button id="generate">Generate Configurations</button>
  </div>

  <div class="step-container" id="results-section" style="display:none">
    <h2 class="step-title">2. Valid Configurations</h2>
    <p id="results-count"></p>
    <div class="configs-grid" id="configs-grid"></div>
  </div>
`;

document.getElementById('generate').addEventListener('click', () => {
  const width = parseFloat(document.getElementById('room-width').value);
  const depth = parseFloat(document.getElementById('room-depth').value);
  const doorX = parseFloat(document.getElementById('door-x').value);
  const doorW = parseFloat(document.getElementById('door-w').value);

  const room = {
    x: width,
    y: depth,
    door: {
      pos1: { x: doorX, y: 0 },
      pos2: { x: doorX + doorW, y: 0 }
    }
  };

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
}

/**
 * Draw an architectural plan view of the restroom configuration.
 * 
 * Coordinate system from engine:
 * - Origin (0,0) is top-left corner of room
 * - X increases rightward, Y increases downward
 * - toilet.loc.x/y = centerline point ON the wall (in CM, no offset)
 * - toilet.loc.distFromWall = 1.5ft (18") from wall to centerline
 * - canvasOffset is only applied to door coordinates
 * 
 * Rotations:
 * - 0 (firstHorz): toilet on TOP wall (y=0), extends DOWN into room
 * - 90 (firstVert): toilet on RIGHT wall (x=roomW), extends LEFT into room
 * - 180 (secondHorz): toilet on BOTTOM wall (y=roomH), extends UP into room
 * - 270 (secondVert): toilet on LEFT wall (x=0), extends RIGHT into room
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

  // Convert engine output back to feet
  const canvasOffset = config.canvasOffset; // in CM
  const doorP1xFt = (config.door.pos1.x - canvasOffset) / 30.48;
  const doorP1yFt = (config.door.pos1.y - canvasOffset) / 30.48;
  const doorP2xFt = (config.door.pos2.x - canvasOffset) / 30.48;
  const doorP2yFt = (config.door.pos2.y - canvasOffset) / 30.48;

  // Toilet loc (NO canvasOffset — raw engine coords in CM)
  const locXft = config.toilet.loc.x / 30.48;
  const locYft = config.toilet.loc.y / 30.48;
  const distFromWallFt = config.toilet.loc.distFromWall / 30.48; // 1.5ft (18")

  // Toilet physical dimensions
  const toiletWidthFt = 23 / 12; // 23 inches ≈ 1.92ft
  const toiletDepthFt = 28 / 12; // 28 inches ≈ 2.33ft
  const tankDepthFt = 8 / 12;    // 8 inches
  const bowlDepthFt = toiletDepthFt - tankDepthFt;

  let svg = `<svg viewBox="0 0 ${svgW} ${svgH}" width="${svgW}" height="${svgH}" class="config-svg" xmlns="http://www.w3.org/2000/svg">`;

  // Wall hatching pattern
  svg += `<defs>
    <pattern id="wall-hatch-${config.id}" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="4" stroke="#94a3b8" stroke-width="0.5"/>
    </pattern>
  </defs>`;

  // Room floor
  svg += `<rect x="${toX(0)}" y="${toY(0)}" width="${toW(roomW)}" height="${toW(roomH)}" fill="#fafbfc" stroke="#334155" stroke-width="2.5"/>`;

  // Walls (thick)
  const wallThickness = 3;
  // Top wall (with gap for door)
  svg += `<line x1="${toX(0)}" y1="${toY(0)}" x2="${toX(doorP1xFt)}" y2="${toY(0)}" stroke="#334155" stroke-width="${wallThickness}"/>`;
  svg += `<line x1="${toX(doorP2xFt)}" y1="${toY(0)}" x2="${toX(roomW)}" y2="${toY(0)}" stroke="#334155" stroke-width="${wallThickness}"/>`;
  // Other walls
  svg += `<line x1="${toX(roomW)}" y1="${toY(0)}" x2="${toX(roomW)}" y2="${toY(roomH)}" stroke="#334155" stroke-width="${wallThickness}"/>`;
  svg += `<line x1="${toX(0)}" y1="${toY(roomH)}" x2="${toX(roomW)}" y2="${toY(roomH)}" stroke="#334155" stroke-width="${wallThickness}"/>`;
  svg += `<line x1="${toX(0)}" y1="${toY(0)}" x2="${toX(0)}" y2="${toY(roomH)}" stroke="#334155" stroke-width="${wallThickness}"/>`;

  // Door with swing arc (architectural convention)
  const doorWidthFt = doorP2xFt - doorP1xFt;
  // Door leaf (arc shows swing direction — into room)
  svg += `<path d="M ${toX(doorP1xFt)} ${toY(0)} A ${toW(doorWidthFt)} ${toW(doorWidthFt)} 0 0 1 ${toX(doorP1xFt)} ${toY(doorWidthFt)}" 
    fill="none" stroke="#334155" stroke-width="1"/>`;
  // Door panel line (from hinge to open position)
  svg += `<line x1="${toX(doorP1xFt)}" y1="${toY(0)}" x2="${toX(doorP1xFt)}" y2="${toY(doorWidthFt)}" stroke="#334155" stroke-width="1.5"/>`;

  // TOILET — architectural plan symbol
  // The loc point is the centerline ON the wall. The toilet extends perpendicular INTO the room.
  // distFromWall (1.5ft/18") is the distance from the wall face to the toilet centerline axis.
  
  let tankX, tankY, tankW, tankH, bowlCX, bowlCY, bowlRX, bowlRY, seatCX, seatCY, seatRX, seatRY;
  
  if (config.rotation === 0) {
    // TOP wall: loc is at (locX, 0), toilet extends downward (+Y)
    // Tank flat against top wall
    tankX = locXft - toiletWidthFt / 2;
    tankY = 0;
    tankW = toiletWidthFt;
    tankH = tankDepthFt;
    // Bowl below tank
    bowlCX = locXft;
    bowlCY = tankDepthFt + bowlDepthFt / 2;
    bowlRX = toiletWidthFt / 2;
    bowlRY = bowlDepthFt / 2;
    seatCX = locXft;
    seatCY = bowlCY;
    seatRX = bowlRX * 0.6;
    seatRY = bowlRY * 0.7;
  } else if (config.rotation === 90) {
    // RIGHT wall: loc is at (roomW, locY), toilet extends leftward (-X)
    tankX = roomW - tankDepthFt;
    tankY = locYft - toiletWidthFt / 2;
    tankW = tankDepthFt;
    tankH = toiletWidthFt;
    bowlCX = roomW - tankDepthFt - bowlDepthFt / 2;
    bowlCY = locYft;
    bowlRX = bowlDepthFt / 2;
    bowlRY = toiletWidthFt / 2;
    seatCX = bowlCX;
    seatCY = locYft;
    seatRX = bowlRX * 0.7;
    seatRY = bowlRY * 0.6;
  } else if (config.rotation === 180) {
    // BOTTOM wall: loc is at (locX, roomH), toilet extends upward (-Y)
    tankX = locXft - toiletWidthFt / 2;
    tankY = roomH - tankDepthFt;
    tankW = toiletWidthFt;
    tankH = tankDepthFt;
    bowlCX = locXft;
    bowlCY = roomH - tankDepthFt - bowlDepthFt / 2;
    bowlRX = toiletWidthFt / 2;
    bowlRY = bowlDepthFt / 2;
    seatCX = locXft;
    seatCY = bowlCY;
    seatRX = bowlRX * 0.6;
    seatRY = bowlRY * 0.7;
  } else {
    // LEFT wall (270): loc is at (0, locY), toilet extends rightward (+X)
    tankX = 0;
    tankY = locYft - toiletWidthFt / 2;
    tankW = tankDepthFt;
    tankH = toiletWidthFt;
    bowlCX = tankDepthFt + bowlDepthFt / 2;
    bowlCY = locYft;
    bowlRX = bowlDepthFt / 2;
    bowlRY = toiletWidthFt / 2;
    seatCX = bowlCX;
    seatCY = locYft;
    seatRX = bowlRX * 0.7;
    seatRY = bowlRY * 0.6;
  }

  svg += `<g class="toilet-fixture">`;
  // Tank (rectangle with slight rounding)
  svg += `<rect x="${toX(tankX)}" y="${toY(tankY)}" width="${toW(tankW)}" height="${toW(tankH)}" 
    fill="#e2e8f0" stroke="#475569" stroke-width="1.5" rx="1.5"/>`;
  // Bowl (ellipse)
  svg += `<ellipse cx="${toX(bowlCX)}" cy="${toY(bowlCY)}" rx="${toW(bowlRX)}" ry="${toW(bowlRY)}" 
    fill="#f8fafc" stroke="#475569" stroke-width="1.5"/>`;
  // Seat opening (inner ellipse)
  svg += `<ellipse cx="${toX(seatCX)}" cy="${toY(seatCY)}" rx="${toW(seatRX)}" ry="${toW(seatRY)}" 
    fill="none" stroke="#94a3b8" stroke-width="0.75"/>`;
  svg += `</g>`;

  // Centerline indicator (small cross at loc point)
  svg += `<line x1="${toX(locXft)-3}" y1="${toY(locYft)}" x2="${toX(locXft)+3}" y2="${toY(locYft)}" stroke="#dc2626" stroke-width="0.75"/>`;
  svg += `<line x1="${toX(locXft)}" y1="${toY(locYft)-3}" x2="${toX(locXft)}" y2="${toY(locYft)+3}" stroke="#dc2626" stroke-width="0.75"/>`;

  // Dimension label
  svg += `<text x="${svgW/2}" y="${svgH - 3}" text-anchor="middle" font-size="9" fill="#64748B" font-family="Inter, sans-serif">${roomW}' × ${roomH}'</text>`;

  svg += `</svg>`;
  container.innerHTML = svg;
}

function drawConfig(config, roomW, roomH) {
  const canvas = document.getElementById(config.id);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const scale = 180 / Math.max(roomW, roomH);
  const offsetX = 10, offsetY = 10;

  // Draw room
  ctx.strokeStyle = '#64748B';
  ctx.lineWidth = 2;
  ctx.strokeRect(offsetX, offsetY, roomW * scale, roomH * scale);

  // Draw door
  ctx.strokeStyle = '#93c5fd';
  ctx.lineWidth = 4;
  const door = config.door;
  ctx.beginPath();
  ctx.moveTo(offsetX + (door.pos1.x - config.canvasOffset) / 30.48 * scale,
             offsetY + (door.pos1.y - config.canvasOffset) / 30.48 * scale);
  ctx.lineTo(offsetX + (door.pos2.x - config.canvasOffset) / 30.48 * scale,
             offsetY + (door.pos2.y - config.canvasOffset) / 30.48 * scale);
  ctx.stroke();

  // Draw toilet bounding box
  ctx.fillStyle = 'rgba(37, 99, 235, 0.15)';
  ctx.strokeStyle = '#2563EB';
  ctx.lineWidth = 1;
  const tx = offsetX + (config.toilet.loc.x - config.canvasOffset) / 30.48 * scale;
  const ty = offsetY + (config.toilet.loc.y - config.canvasOffset) / 30.48 * scale;
  const tw = config.toilet.bound.w / 30.48 * scale;
  const th = config.toilet.bound.h / 30.48 * scale;
  ctx.fillRect(tx - tw/2, ty, tw, th);
  ctx.strokeRect(tx - tw/2, ty, tw, th);

  // Toilet indicator dot
  ctx.beginPath();
  ctx.arc(tx, ty, 4, 0, Math.PI * 2);
  ctx.fillStyle = '#2563EB';
  ctx.fill();
}
