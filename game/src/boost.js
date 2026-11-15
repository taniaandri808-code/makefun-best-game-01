export function installBoost(hooks = {}) {
  const { scene, camera, getPlayers, onShoot, onHit, container } = hooks;
  if (!scene) return;
  console.log('[Apex Boost] Boost installed successfully with hooks:', Object.keys(hooks));
  window.__apexBoost = {
    hooks,
    active: true
  };
}
