/**
 * takes in a hex color and a number, and returns a new hex
 * color that is a tint of the original color (ligthens the color)
 *
 * @param opts - options
 * @param opts.hexColor - the hex color to tint
 * @param opts.percentage - the percentage to tint the color (e.g: 0.1 for 10%)
 */
export const calculateTint = (opts: {
  hexColor: string;
  percentage: number;
}) => {
  const r = parseInt(opts.hexColor.slice(1, 3), 16);
  const g = parseInt(opts.hexColor.slice(3, 5), 16);
  const b = parseInt(opts.hexColor.slice(5, 7), 16);

  const tintR = Math.round(Math.min(255, r + (255 - r) * opts.percentage));
  const tintG = Math.round(Math.min(255, g + (255 - g) * opts.percentage));
  const tintB = Math.round(Math.min(255, b + (255 - b) * opts.percentage));

  return (
    "#" +
    [tintR, tintG, tintB].map((x) => x.toString(16).padStart(2, "0")).join("")
  );
};

/**
 * takes in a hex color and a number, and returns a new hex
 * color that is a shade of the original color (darkens the color)
 *
 * @param opts - options
 * @param opts.hexColor - the hex color to shade
 * @param opts.percentage - the percentage to shade the color (e.g: 0.1 for 10%)
 */
export const calculateShade = (opts: {
  hexColor: string;
  percentage: number;
}) => {
  const r = parseInt(opts.hexColor.slice(1, 3), 16);
  const g = parseInt(opts.hexColor.slice(3, 5), 16);
  const b = parseInt(opts.hexColor.slice(5, 7), 16);

  const shadeR = Math.round(Math.max(0, r - r * opts.percentage));
  const shadeG = Math.round(Math.max(0, g - g * opts.percentage));
  const shadeB = Math.round(Math.max(0, b - b * opts.percentage));

  return (
    "#" +
    [shadeR, shadeG, shadeB]
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("")
  );
};
