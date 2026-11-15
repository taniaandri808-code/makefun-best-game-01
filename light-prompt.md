The game still renders nearly black in screenshots. Diagnose and FIX the actual lighting pipeline:

1. Open game/src/world.js (and wherever lights are created). Ensure lights are added to the scene BEFORE the first render, intensities actually take effect (e.g. hemi ~1.5-2.5, directional ~2-3, renderer.toneMappingExposure raised if tone mapping is on), and materials use MeshLambertMaterial/MeshStandardMaterial (not MeshBasicMaterial with dark colors).
2. Pick a genuinely light palette: light concrete floor (0xb8b8b0 range), pale walls (0xd8d4c8), warm accent (0xe8a33d). The sky/background should be a light color, not near-black. Fog if used must be light-colored.
3. Verify: the scene background, floor, and most walls must appear LIGHT in the ?shot=start screenshot. If a shadow setting darkens everything, soften it.
4. Also find which referenced asset 404s (check game/index.html and all module imports against files present in game/) and fix it.
5. Do NOT touch vendor/three, no build step, keep everything working.

Change only what is needed. List what you changed.
