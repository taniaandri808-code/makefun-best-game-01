Continue the interrupted work in this directory. Files game/src/grenade.js, game/src/weapons-extra.js, game/src/effects.js, game/src/boost.js, game/src/bootstrap-hook.js were already written by you and main.ts was rewritten. Do not re-read or rewrite their content; just finish:

1. Verify the game loads: run `node main.ts` (serves on 8080), check page console for errors via the headless chrome at /root/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome, regenerate the three screenshots (?shot=start|play|end&seed=1, 1280x720) into screenshots/. Fix small bugs if the console shows any (edit only your new files).
2. `git add -A`, commit with message "Author grenade, extra weapons, effects systems and orchestrator", push to origin main.
3. Report the commit sha and total new lines written (wc -l on your new files).
