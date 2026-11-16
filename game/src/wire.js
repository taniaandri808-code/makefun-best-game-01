/**
 * Tiny wiring / pub‑sub that auto‑instantiates minimap, rounds and leaderboard.
 * Exposes `wire({container, hooks})` which returns an object with the three
 * components and a simple `emit(event, data)` / `on(event, fn)` API.
 */
import { createMinimap } from './minimap.js';
import { createRounds } from './rounds.js';
import { createLeaderboard } from './leaderboard.js';

export function wire({ container, hooks = {} } = {}) {
  const events = {};
  const on = (e, fn) => {
    (events[e] = events[e] || []).push(fn);
  };
  const emit = (e, data) => {
    (events[e] || []).forEach(fn => fn(data));
  };

  // Instantiate components, tolerating missing hooks.
  const minimap = createMinimap(container);
  const rounds = createRounds(hooks.onRoundEnd);
  const leaderboard = createLeaderboard(container);

  // Example wiring: on round tick, update UI.
  on('tick', dt => rounds.tick(dt));
  on('kill', killer => rounds.registerKill(killer));
  on('playerPos', ({ pos, dir, enemies }) => minimap.update(pos, dir, enemies));
  on('stats', stats => leaderboard.update(stats));

  // Auto‑run on DOM ready.
  const init = () => {
    // expose for debugging.
    window.__apexExtras = { minimap, rounds, leaderboard, on, emit };
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { minimap, rounds, leaderboard, on, emit };
}

