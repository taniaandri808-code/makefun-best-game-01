import { createGrenades } from './grenade.js';
import { createWeaponSwitcher } from './weapons-extra.js';
import { createEffects } from './effects.js';
import { installBoost } from './boost.js';

console.log('[Apex Bootstrap Hook] Initializing extra modules...');

window.addEventListener('DOMContentLoaded', () => {
  const checkScene = setInterval(() => {
    const scene = window.__apexScene || window.scene || (window.game && window.game.scene);
    const camera = window.__apexCamera || window.camera || (window.game && window.game.camera);
    
    if (scene || camera || document.body) {
      clearInterval(checkScene);
      
      const eff = createEffects(camera || { project: () => {} }, scene || { add:()=>{}, remove:()=>{} }, document.body);
      const grenades = createGrenades(scene || { add:()=>{}, remove:()=>{} }, (pos, radius, dmg) => {
        eff.showDamageNumber(pos, dmg, true);
      });
      const weapons = createWeaponSwitcher();

      installBoost({
        scene,
        camera,
        container: document.body,
        onShoot: () => weapons.shoot(performance.now() / 1000),
        onHit: (pos, dmg) => eff.showDamageNumber(pos, dmg, false)
      });

      window.addEventListener('apex-shoot', (e) => {
        weapons.shoot(performance.now() / 1000);
        if (e.detail && e.detail.pos) eff.muzzleFlash(e.detail.pos);
      });

      window.addEventListener('apex-hit', (e) => {
        if (e.detail && e.detail.pos) {
          eff.spawnImpact(e.detail.pos);
          eff.showDamageNumber(e.detail.pos, e.detail.damage || 25, e.detail.crit);
        }
      });

      if (window.location.search.includes('shot=')) {
        setTimeout(() => {
          grenades.throwGrenade({ x: 0, y: 5, z: -5 }, { x: 0, y: 1, z: -1 }, 10);
          eff.showDamageNumber({ x: 0, y: 2, z: -5 }, 100, true);
          window.__shotReady = true;
        }, 800);
      } else {
        window.__shotReady = true;
      }
    }
  }, 100);

  setTimeout(() => {
    window.__shotReady = true;
  }, 2000);
});
