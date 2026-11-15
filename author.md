Author substantial NEW code for the browser FPS "Apex Terminal" in this directory. IMPORTANT RULE: do NOT open or read the existing game source files (game/src/*.js, game/index.html, main.ts) — write everything below yourself from scratch. You may run the game (node main.ts) and look at console output and screenshots to check integration.

Write these yourself (all code typed by you, brand new files except main.ts which you overwrite):

1. main.ts — rewrite completely: your own orchestrator that serves game/ (static file server on port 8080, node:http), and implements the ?shot=start|play&seed=N|end staging: launch headless Chrome (/root/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome) via CDP or puppeteer-core if available, navigate, dispatch keyboard events to play a few seconds (move, shoot), save screenshots/1-start.jpg, screenshots/2-play.jpg, screenshots/3-end.jpg (1280x720), then exit. Keep it simple and robust.

2. game/src/grenade.js — new module: a grenade system export (class GrenadeSystem with update(dt), throwGrenade(pos,dir,power), mesh creation with three.js Group sphere + fuse blink, physics arc with gravity and bounce off ground plane y=0, explosion after 2.5s with expanding sphere flash, radius damage callback). Export a factory `createGrenades(scene)` returning the system object.

3. game/src/weapons-extra.js — new module: definitions and factory for 3 additional weapons (SMG: high fire rate 900rpm low damage 18, Shotgun: 8 pellets spread, damage 12 each, DMR: slow semi-auto 55 damage) as data objects {id,name,damage,rpm,mag,spread,price} plus a factory `createWeaponSwitcher()` that cycles weapon stats and exposes current weapon, reload timers, and ammo bookkeeping.

4. game/src/effects.js — new module: muzzle flash light pulses, bullet impact puffs (small expanding sprites at hit point), and a floating damage-number system (HTML overlay divs positioned by projecting 3D points to screen, rising and fading over 0.7s). Factory `createEffects(camera, scene, container)`.

5. Wire-in shim game/src/boost.js — a small module exporting `installBoost(hooks)` that receives hook functions {scene,camera,getPlayers,onShoot,onHit,container} from the game bootstrap; keep it tolerant: if a hook is missing, no-op. Additionally append a <script type="module"> import line to game/index.html ONLY by appending — do not read or rewrite the rest of that file; use shell `echo` to append, and write game/src/bootstrap-hook.js which dynamically imports your new modules and tries to integrate with the running game by listening for custom DOM events (dispatch 'apex-shoot', 'apex-hit' events are assumed from the existing game; if absent, your modules still self-initialize a demo overlay showing the systems work).

6. Run `node main.ts` to verify the server starts, the page loads without console errors, and regenerate the three screenshots. Iterate until no errors and screenshots look right (bright palette stays).

7. Commit everything with a clear message and push to origin main (use git push; credentials are configured).

Report files written, line counts of the new code, final commit sha, and confirmation screenshots regenerated.
