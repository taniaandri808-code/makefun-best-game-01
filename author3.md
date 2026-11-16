Author NEW gameplay modules for the browser FPS "Apex Terminal" in this directory. HARD RULE: do NOT open or read any existing game source file (game/src/*.js, game/index.html, main.ts). Write everything below yourself as brand-new files, all code typed by you:

1. game/src/minimap.js — ~140 lines: export function createMinimap(container) returning an object with update(playerPos, playerDir, enemies, mapSize). It renders a canvas radar (160x160) top-left: player as arrow, enemies as red dots when within range, grid lines, sweep animation. Pure DOM/canvas, self-contained, defensive (if container missing, create one appended to body).

2. game/src/rounds.js — ~140 lines: export function createRounds(onRoundEnd) — round state machine: start(n), registerKill(byPlayer), playerDied(), timer countdown 120s per round, score tracking (player vs bots), emits DOM banner "ROUND N", "ROUND WON 5-3" / "ROUND LOST" center-screen with CSS you author inline (bright, readable, matches a light tactical UI).

3. game/src/leaderboard.js — ~120 lines: export function createLeaderboard(container) — right-side panel listing 6 bot names with kill/death tallies, update(stats[]) re-renders rows, sorted by kills, player highlighted. Author the CSS inline.

4. game/src/wire.js — ~60 lines: export function wire({container, hooks}) that instantiates minimap+rounds+leaderboard, wires them together with a tiny pub/sub (on(event,fn), emit(event,data)), and tolerates missing hooks (no-ops). Also expose window.__apexExtras for debugging.

5. Verify: run `node main.ts`, load the page with headless chrome (/root/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome), confirm no console errors, and that the radar/leaderboard/round banner appear (they self-initialize through your own bootstrap: wire() must auto-run on DOMContentLoaded even without other modules). Regenerate screenshots/1-start.jpg, 2-play.jpg, 3-end.jpg (1280x720).

6. `git add -A && git commit -m "Author minimap, rounds and leaderboard systems" && git push origin main`.

Report commit sha and wc -l of the new files.
