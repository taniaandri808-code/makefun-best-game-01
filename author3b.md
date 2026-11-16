In this dir author 4 new files (do NOT read existing files; write each file in one heredoc):
1. game/src/minimap.js (~130 lines): export createMinimap(container) -> {update(playerPos,playerDir,enemies)}; 160x160 canvas radar, arrow player, red enemy dots, sweep line; auto-create container if missing.
2. game/src/rounds.js (~130 lines): export createRounds(onRoundEnd) -> {start(n),registerKill(b),playerDied(),tick(dt)}; 120s timer, scores, center banner "ROUND N"/"ROUND WON"/"ROUND LOST" with inline CSS.
3. game/src/leaderboard.js (~110 lines): export createLeaderboard(container) -> {update(stats)}; right panel, 6 bots K/D sorted, player highlighted, inline CSS.
4. game/src/wire.js (~50 lines): export wire({container,hooks}) instantiating the three, tiny pub/sub, auto-run on DOMContentLoaded, tolerate missing hooks; set window.__apexExtras.
Then: node main.ts (serves :8080), regenerate screenshots/1-start.jpg,2-play.jpg,3-end.jpg (1280x720) via chrome at /root/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome headless ?shot=start|play|end&seed=1. git add -A, commit "Author minimap, rounds and leaderboard systems", git push origin main. Keep command outputs tiny.
