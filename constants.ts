
export const WAVE_CHARS = ['*','x','$','#','@', '#', '$', 'x', '*'];
export const BG_CHARS = ["0", "1"];

export const COLOR_MAP: { [key: string]: string } = {
  // Wave characters with a heat-map like color progression
  "@": "text-yellow-300",
  "#": "text-yellow-400",
  "$": "text-orange-400",
  "x": "text-red-500",
  "*": "text-red-600",

  // Background characters are dimmer
  "0": "text-slate-600",
  "1": "text-slate-600",
};
