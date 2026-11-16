/**
 * Leaderboard UI – displays top 6 bots sorted by K/D and highlights player.
 */
export function createLeaderboard(container) {
  if (!container) {
    container = document.createElement('div');
    document.body.appendChild(container);
  }
  container.style.position = 'fixed';
  container.style.right = '10px';
  container.style.top = '10px';
  container.style.width = '200px';
  container.style.background = 'rgba(0,0,0,0.6)';
  container.style.color = '#fff';
  container.style.fontFamily = 'sans-serif';
  container.style.padding = '10px';
  container.style.borderRadius = '6px';
  container.innerHTML = '<h3 style="margin:0 0 5px 0;font-size:16px;">Leaderboard</h3><ul id="lb-list" style="list-style:none;margin:0;padding:0;font-size:14px;line-height:1.4"></ul>';
  const list = container.querySelector('#lb-list');

  function update(stats) {
    // stats = [{name, kills, deaths}] – include player entry with name "player".
    const sorted = [...stats].sort((a, b) => b.kills / Math.max(1, b.deaths) - a.kills / Math.max(1, a.deaths));
    list.innerHTML = '';
    sorted.slice(0, 6).forEach(entry => {
      const li = document.createElement('li');
      li.textContent = `${entry.name}: ${entry.kills}/${entry.deaths}`;
      if (entry.name === 'player') {
        li.style.color = '#0f0';
        li.style.fontWeight = 'bold';
      }
      list.appendChild(li);
    });
  }

  return { update };
}

