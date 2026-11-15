export const EXTRA_WEAPONS = [
  { id: 'smg', name: 'Vector SMG', damage: 18, rpm: 900, mag: 30, spread: 0.06, price: 1200 },
  { id: 'shotgun', name: 'Pump Shotgun', damage: 12, pellets: 8, rpm: 90, mag: 8, spread: 0.09, price: 1500 },
  { id: 'dmr', name: 'Scout DMR', damage: 55, rpm: 220, mag: 15, spread: 0.01, price: 2000 }
];

export class WeaponSwitcher {
  constructor(initialWeapons = EXTRA_WEAPONS) {
    this.weapons = initialWeapons;
    this.currentIndex = 0;
    this.currentWeapon = this.weapons[0];
    this.ammo = this.currentWeapon.mag;
    this.reserveAmmo = this.currentWeapon.mag * 3;
    this.reloading = false;
    this.reloadTimer = 0;
    this.lastShotTime = 0;
  }

  switchWeapon(index) {
    if (index >= 0 && index < this.weapons.length) {
      this.currentIndex = index;
      this.currentWeapon = this.weapons[this.currentIndex];
      this.ammo = this.currentWeapon.mag;
      this.reserveAmmo = this.currentWeapon.mag * 3;
      this.reloading = false;
    }
  }

  nextWeapon() {
    this.currentIndex = (this.currentIndex + 1) % this.weapons.length;
    this.switchWeapon(this.currentIndex);
    return this.currentWeapon;
  }

  canShoot(now) {
    if (this.reloading) return false;
    const interval = 60 / this.currentWeapon.rpm;
    return (now - this.lastShotTime) >= interval;
  }

  shoot(now) {
    if (!this.canShoot(now)) return false;
    if (this.ammo <= 0) {
      this.reload();
      return false;
    }
    this.ammo--;
    this.lastShotTime = now;
    return true;
  }

  reload() {
    if (this.reloading || this.reserveAmmo <= 0 || this.ammo >= this.currentWeapon.mag) return;
    this.reloading = true;
    this.reloadTimer = 2.0;
  }

  update(dt) {
    if (this.reloading) {
      this.reloadTimer -= dt;
      if (this.reloadTimer <= 0) {
        this.reloading = false;
        const needed = this.currentWeapon.mag - this.ammo;
        const toAdd = Math.min(needed, this.reserveAmmo);
        this.ammo += toAdd;
        this.reserveAmmo -= toAdd;
      }
    }
  }
}

export function createWeaponSwitcher() {
  return new WeaponSwitcher();
}
