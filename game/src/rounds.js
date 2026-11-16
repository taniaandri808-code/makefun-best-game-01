/**
 * Simple round manager. Exposes start, registerKill, playerDied, tick.
 * Shows a centre banner with round number and outcome.
 */
export function createRounds(onRoundEnd) {
  let round = 0;
  let timer = 0;
  const duration = 120; // seconds per round
  let scores = { player: 0, bots: {} };
  let banner = null;

  // Create banner element.
  function makeBanner() {
    banner = document.createElement('div');
    banner.style.position = 'fixed';
    banner.style.top = '50%';
    banner.style.left = '50%';
    banner.style.transform = 'translate(-50%,-50%)';
    banner.style.padding = '20px 40px';
    banner.style.background = 'rgba(0,0,0,0.7)';
    banner.style.color = '#fff';
    banner.style.fontSize = '32px';
    banner.style.fontFamily = 'sans-serif';
    banner.style.zIndex = 1000;
    banner.style.borderRadius = '8px';
    document.body.appendChild(banner);
  }

  makeBanner();

  function showMessage(msg) {
    banner.textContent = msg;
    banner.style.display = 'block';
    setTimeout(() => (banner.style.display = 'none'), 2000);
  }

  function start(n) {
    round = n;
    timer = duration;
    showMessage(`ROUND ${round}`);
  }

  function registerKill(killer) {
    if (killer === 'player') {
      scores.player++;
    } else {
      scores.bots[killer] = (scores.bots[killer] || 0) + 1;
    }
  }

  function playerDied() {
    showMessage('ROUND LOST');
    onRoundEnd && onRoundEnd(false);
  }

  function win() {
    showMessage('ROUND WON');
    onRoundEnd && onRoundEnd(true);
  }

  function tick(dt) {
    if (timer <= 0) return;
    timer -= dt;
    if (timer <= 0) {
      win();
    }
  }

  return { start, registerKill, playerDied, tick, getScores: () => scores };
}

