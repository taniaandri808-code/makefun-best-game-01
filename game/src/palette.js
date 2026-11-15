// The look plan, in one place. Six values and one accent hue; the lighting makes every
// shade the game needs, so no other colour appears in the code. The same six names are
// the CSS custom properties in index.html.
export const PALETTE = {
  canvas: '#cfd6de',
  surface: '#e3e7ec',
  hairline: '#9fb0c2',
  ink: '#f5f2eb',
  muted: '#a8b3c2',
  accent: '#f5b041',
};

export function shade(name) {
  return PALETTE[name];
}
