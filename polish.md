You are finalizing the browser FPS game "Apex Terminal" in this directory for the make.fun best-game-01 bounty. The game already works (three.js 0.187.0 vendored, ES modules, no build step, `node serve.ts` then open http://localhost:8080). Your tasks:

1. Play-test via the staging screenshots: run `node main.ts` (it builds out/ and serves), then take screenshots at http://localhost:8080/?shot=start&seed=1, ?shot=play&seed=1 and ?shot=end&seed=1 using the Playwright chrome at /root/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome (headless, 1280x720), saving as screenshots/1-start.jpg, screenshots/2-play.jpg, screenshots/3-end.jpg. Look at them: the game must be BRIGHT and readable (light palette already applied — do NOT darken), bots visible, HUD visible.
2. Make 2-3 small gameplay improvements that a judge will notice in the screenshots and first 30 seconds of play, e.g.: hit markers / damage numbers on hit, a round intro banner ("ROUND 1 — SEARCH & DESTROY"), killfeed in the corner, crosshair hit feedback, or clearer win/lose screen. Keep code style consistent (small ES modules under game/src/).
3. Do NOT break anything: keep vendored vendor/three byte-for-byte, keep the ?shot staging working, keep the bright palette.
4. Commit every change with clear messages and push to origin main (git push). The repo must end with all changes pushed.

Report: what you changed, the final commit sha, and confirmation the 3 screenshots were regenerated.
