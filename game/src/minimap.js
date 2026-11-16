/**
 * Minimap component – a 160×160 radar showing player direction and enemies.
 * Exported function `createMinimap(container)` returns an object with an
 * `update(playerPos, playerDir, enemies)` method.
 */
export function createMinimap(container) {
  // Ensure a container element exists.
  if (!container) {
    container = document.createElement('div');
    document.body.appendChild(container);
  }

  // Create and style the canvas.
  const canvas = document.createElement('canvas');
  canvas.width = 160;
  canvas.height = 160;
  canvas.style.border = '1px solid #555';
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  // Pre‑computed centre.
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const radius = Math.min(cx, cy) - 4;

  // Helper to draw a line from centre at a given angle.
  function drawSweep(angle) {
    const len = radius;
    const x = cx + len * Math.cos(angle);
    const y = cy + len * Math.sin(angle);
    ctx.strokeStyle = 'rgba(0,255,0,0.3)';
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  // Public update method.
  function update(playerPos, playerDir, enemies) {
    // Clear.
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Radar background.
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Outer circle.
    ctx.strokeStyle = '#555';
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Sweep line (rotates with player direction).
    const sweepRad = (playerDir * Math.PI) / 180;
    drawSweep(sweepRad);

    // Player arrow.
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(sweepRad);
    ctx.fillStyle = '#0f0';
    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.lineTo(4, 8);
    ctx.lineTo(-4, 8);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Enemies – red dots relative to player position.
    ctx.fillStyle = '#f00';
    enemies.forEach(e => {
      const dx = e.x - playerPos.x;
      const dy = e.y - playerPos.y;
      // Scale to radar radius (assuming world units up to 200).
      const scale = radius / 200;
      const ex = cx + dx * scale;
      const ey = cy + dy * scale;
      if (ex >= 0 && ex <= canvas.width && ey >= 0 && ey <= canvas.height) {
        ctx.beginPath();
        ctx.arc(ex, ey, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }

  return { update };
}

