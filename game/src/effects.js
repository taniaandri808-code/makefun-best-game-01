import * as THREE from '../vendor/three/three.module.min.js';

export class EffectsSystem {
  constructor(camera, scene, container) {
    this.camera = camera;
    this.scene = scene;
    this.container = container || document.body;
    this.puffs = [];
    this.damageNumbers = [];

    this.overlay = document.getElementById('apex-effects-overlay');
    if (!this.overlay) {
      this.overlay = document.createElement('div');
      this.overlay.id = 'apex-effects-overlay';
      this.overlay.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;overflow:hidden;z-index:9999;font-family:monospace;';
      this.container.appendChild(this.overlay);
    }
  }

  muzzleFlash(muzzlePos) {
    const light = new THREE.PointLight(0xffaa22, 3, 4);
    light.position.copy(muzzlePos);
    this.scene.add(light);
    setTimeout(() => {
      this.scene.remove(light);
    }, 50);
  }

  spawnImpact(pos) {
    const geo = new THREE.SphereGeometry(0.1, 6, 6);
    const mat = new THREE.MeshBasicMaterial({ color: 0xffff00, transparent: true, opacity: 1.0 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(pos);
    this.scene.add(mesh);

    this.puffs.push({
      mesh,
      age: 0,
      duration: 0.3
    });
  }

  showDamageNumber(pos, amount, isCrit = false) {
    const el = document.createElement('div');
    el.textContent = (isCrit ? 'CRIT! ' : '') + Math.round(amount);
    el.style.cssText = `position:absolute;color:${isCrit ? '#ff3333' : '#ffff33'};font-weight:bold;font-size:${isCrit ? '20px' : '14px'};text-shadow:1px 1px 2px #000;transition:transform 0.7s ease-out, opacity 0.7s ease-out;`;
    this.overlay.appendChild(el);

    this.damageNumbers.push({
      el,
      pos: pos && typeof pos.clone === 'function' ? pos.clone() : new THREE.Vector3(pos?.x || 0, pos?.y || 0, pos?.z || 0),
      age: 0,
      duration: 0.7
    });
  }

  update(dt) {
    for (let i = this.puffs.length - 1; i >= 0; i--) {
      const p = this.puffs[i];
      p.age += dt;
      const progress = p.age / p.duration;
      if (progress >= 1) {
        this.scene.remove(p.mesh);
        this.puffs.splice(i, 1);
      } else {
        const s = 1 + progress * 2;
        p.mesh.scale.set(s, s, s);
        p.mesh.material.opacity = 1 - progress;
      }
    }

    const widthHalf = window.innerWidth / 2;
    const heightHalf = window.innerHeight / 2;

    for (let i = this.damageNumbers.length - 1; i >= 0; i--) {
      const dn = this.damageNumbers[i];
      dn.age += dt;
      if (dn.age >= dn.duration) {
        dn.el.remove();
        this.damageNumbers.splice(i, 1);
        continue;
      }

      const tempV = dn.pos.clone();
      tempV.y += dn.age * 0.8;
      tempV.project(this.camera);

      if (tempV.z > 1) {
        dn.el.style.display = 'none';
        continue;
      }
      dn.el.style.display = 'block';

      const x = (tempV.x * widthHalf) + widthHalf;
      const y = -(tempV.y * heightHalf) + heightHalf;

      const opacity = 1 - (dn.age / dn.duration);
      dn.el.style.transform = `translate(${x}px, ${y}px) scale(${1 + dn.age * 0.5})`;
      dn.el.style.opacity = opacity;
    }
  }
}

export function createEffects(camera, scene, container) {
  return new EffectsSystem(camera, scene, container);
}
