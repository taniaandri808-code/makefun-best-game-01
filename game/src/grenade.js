import * as THREE from '../vendor/three/three.module.min.js';

export class GrenadeSystem {
  constructor(scene, onDamageRadius) {
    this.scene = scene;
    this.onDamageRadius = onDamageRadius || (() => {});
    this.grenades = [];
    this.explosions = [];
  }

  throwGrenade(pos, dir, power = 15) {
    const group = new THREE.Group();
    const geometry = new THREE.SphereGeometry(0.2, 8, 8);
    const material = new THREE.MeshStandardMaterial({ color: 0x334433, roughness: 0.4 });
    const mesh = new THREE.Mesh(geometry, material);
    group.add(mesh);

    const lightGeo = new THREE.SphereGeometry(0.08, 6, 6);
    const lightMat = new THREE.MeshBasicMaterial({ color: 0xff3300 });
    const fuseMesh = new THREE.Mesh(lightGeo, lightMat);
    fuseMesh.position.set(0, 0.2, 0);
    group.add(fuseMesh);

    group.position.copy(pos);
    this.scene.add(group);

    const velocity = new THREE.Vector3(dir.x, dir.y + 0.3, dir.z).normalize().multiplyScalar(power);

    this.grenades.push({
      group,
      fuseMesh,
      velocity,
      age: 0,
      maxAge: 2.5,
    });
  }

  update(dt) {
    for (let i = this.grenades.length - 1; i >= 0; i--) {
      const g = this.grenades[i];
      g.age += dt;

      if (g.fuseMesh) {
        const flash = Math.sin(g.age * 15) > 0;
        g.fuseMesh.material.color.setHex(flash ? 0xff0000 : 0xffff00);
      }

      g.velocity.y -= 9.8 * dt;
      g.group.position.addScaledVector(g.velocity, dt);

      if (g.group.position.y <= 0.2) {
        g.group.position.y = 0.2;
        g.velocity.y = -g.velocity.y * 0.4;
        g.velocity.x *= 0.7;
        g.velocity.z *= 0.7;
      }

      if (g.age >= g.maxAge) {
        this.explode(g.group.position);
        this.scene.remove(g.group);
        this.grenades.splice(i, 1);
      }
    }

    for (let i = this.explosions.length - 1; i >= 0; i--) {
      const exp = this.explosions[i];
      exp.age += dt;
      const progress = exp.age / exp.duration;
      if (progress >= 1) {
        this.scene.remove(exp.mesh);
        this.explosions.splice(i, 1);
      } else {
        const scale = 1 + progress * 4;
        exp.mesh.scale.set(scale, scale, scale);
        exp.mesh.material.opacity = 1 - progress;
      }
    }
  }

  explode(pos) {
    const geo = new THREE.SphereGeometry(1.5, 12, 12);
    const mat = new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true, opacity: 0.9 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(pos);
    this.scene.add(mesh);

    this.explosions.push({
      mesh,
      age: 0,
      duration: 0.4,
    });

    this.onDamageRadius(pos, 5.0, 75);
  }
}

export function createGrenades(scene, onDamageRadius) {
  return new GrenadeSystem(scene, onDamageRadius);
}
