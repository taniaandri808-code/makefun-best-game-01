// Apex Terminal: An original tactical map with two lanes (Warehouse & Courtyard),
// central connectors, bomb sites A & B, and cover geometry.
import * as THREE from 'three';
import { PALETTE } from './palette.js';

export function createWorld(scene) {
  const group = new THREE.Group();
  scene.add(group);

  const materials = {
    floor: new THREE.MeshStandardMaterial({ color: new THREE.Color('#c9cdd2'), roughness: 0.88, metalness: 0.05 }),
    wall: new THREE.MeshStandardMaterial({ color: new THREE.Color('#e0e4e8'), roughness: 0.82, metalness: 0.05 }),
    center: new THREE.MeshStandardMaterial({ color: new THREE.Color('#eef0f2'), roughness: 0.8, metalness: 0.05 }),
    warehouse: new THREE.MeshStandardMaterial({ color: new THREE.Color('#dfe6ea'), roughness: 0.82, metalness: 0.05 }),
    courtyard: new THREE.MeshStandardMaterial({ color: new THREE.Color('#e8eef2'), roughness: 0.82, metalness: 0.05 }),
    hairline: new THREE.MeshStandardMaterial({ color: new THREE.Color('#b8c6d4'), roughness: 0.75, metalness: 0.05 }),
    accent: new THREE.MeshStandardMaterial({ color: new THREE.Color(PALETTE.accent), roughness: 0.5, metalness: 0.1 }),
  };

  const colliders = [];
  const shootables = [];
  const bombSites = [];

  function box(width, height, depth, x, y, z, material, isShootable = true) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), materials[material]);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    const box3 = new THREE.Box3().setFromObject(mesh);
    colliders.push(box3);
    if (isShootable) shootables.push(mesh);
    return mesh;
  }

  // Arena: 30m wide, 36m deep, 5m walls
  // Floor
  box(32, 0.4, 38, 0, -0.2, 0, 'floor', false);
  // Outer Walls
  box(0.4, 5, 38, -16, 2.5, 0, 'wall');
  box(0.4, 5, 38, 16, 2.5, 0, 'wall');
  box(32, 5, 0.4, 0, 2.5, -19, 'wall');
  box(32, 5, 0.4, 0, 2.5, 19, 'wall');

  // Center divider wall / building creating two main lanes (Left: Warehouse, Right: Courtyard)
  box(1.5, 4, 18, 0, 2, 0, 'center');

  // Cross connector window/doorway
  // Left Lane covers (Warehouse)
  box(3, 1.2, 1.5, -9, 0.6, -6, 'warehouse');
  box(1.5, 2.2, 1.5, -12, 1.1, -12, 'warehouse');
  box(2, 0.8, 2, -7, 0.4, 6, 'warehouse');
  box(2, 1.4, 1.2, -10, 0.7, 10, 'warehouse');

  // Right Lane covers (Courtyard Trench)
  box(3, 1.2, 1.5, 9, 0.6, -6, 'courtyard');
  box(1.5, 2.2, 1.5, 12, 1.1, -12, 'courtyard');
  box(2, 0.8, 2, 7, 0.4, 6, 'courtyard');
  box(2, 1.4, 1.2, 10, 0.7, 10, 'courtyard');

  // Bomb Site A (Back Left Warehouse)
  const siteAMesh = box(5, 0.05, 5, -10, 0.02, -14, 'accent', false);
  siteAMesh.userData = { bombSite: 'A' };
  bombSites.push({ id: 'A', center: new THREE.Vector3(-10, 0, -14), mesh: siteAMesh });

  // Bomb Site B (Back Right Courtyard)
  const siteBMesh = box(5, 0.05, 5, 10, 0.02, -14, 'accent', false);
  siteBMesh.userData = { bombSite: 'B' };
  bombSites.push({ id: 'B', center: new THREE.Vector3(10, 0, -14), mesh: siteBMesh });

  // Spawns
  const playerSpawn = new THREE.Vector3(0, 0, 15);
  const botSpawns = [
    new THREE.Vector3(-10, 0, -14),
    new THREE.Vector3(10, 0, -14),
    new THREE.Vector3(-6, 0, -10),
    new THREE.Vector3(6, 0, -10),
  ];

  // Lighting (Brighter, high visibility)
  const sky = new THREE.HemisphereLight(new THREE.Color('#dfeaf5'), new THREE.Color('#2d2620'), 2.6);
  scene.add(sky);

  const key = new THREE.DirectionalLight(new THREE.Color('#fffaf0'), 4.0);
  key.position.set(14, 24, 12);
  key.target.position.set(0, 0, 0);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.left = -20;
  key.shadow.camera.right = 20;
  key.shadow.camera.top = 20;
  key.shadow.camera.bottom = -20;
  key.shadow.camera.far = 60;
  key.shadow.bias = -0.0005;
  scene.add(key, key.target);

  const fill = new THREE.DirectionalLight(new THREE.Color('#94a8c4'), 1.8);
  fill.position.set(-14, 16, 14);
  scene.add(fill);

  return { colliders, shootables, bombSites, playerSpawn, botSpawns, group };
}
