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
  count.textContent = `Found ${configs.length} valid toilet placement${configs.length !== 1 ? 's' : ''}`;
  grid.innerHTML = '';

  configs.forEach((config, i) => {
    const card = document.createElement('div');
    card.className = 'config-card';
    card.innerHTML = `
      <canvas id="${config.id}" width="200" height="200"></canvas>
      <div class="label">Configuration ${i + 1}</div>
      <div class="label">${config.note}</div>
    `;
    grid.appendChild(card);

    // Draw the room + toilet on canvas
    setTimeout(() => drawConfig(config, roomW, roomH), 0);
  });
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
