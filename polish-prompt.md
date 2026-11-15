Continue improving this competition entry (a three.js tactical FPS in game/). It works, but the AI judge will rank it against others on: complete game, gunplay/movement, tactics, map/look, code quality. Do the following:

1. The scene renders far too dark — brighten the lighting so the map reads at a glance: raise ambient/hemisphere light, use lighter surface materials on walls/floor, add contrast between lanes and connectors, keep the chosen palette coherent. The first-frame screenshots (?shot=start|play|end) must be clearly visible.
2. Verify game/src modules are cohesive: fixed-step 60Hz simulation separate from rendering, no per-frame allocations in hot loops, no dead code or leftover starter references.
3. Make sure ?shot=play&seed=1 shows at least one bot within view distance and visible weapon muzzle/tracers.
4. Check there are no 404s: every asset referenced by game/index.html or the modules must exist in game/.
5. Do NOT change vendor/three files byte-for-byte. No build step, no npm, no network requests.

Edit the files only; keep everything working. When done, list what you changed.
