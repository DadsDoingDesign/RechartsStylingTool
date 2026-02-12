/**
 * Selects colors evenly distributed from a palette
 * @param {string[]} palette - Array of color hex codes
 * @param {number} count - Number of colors to select
 * @returns {number[]} Array of indices pointing to evenly distributed colors
 */
export function getEvenlyDistributedColorIndices(palette, count) {
  if (!palette || palette.length === 0) return [];
  if (count <= 0) return [];
  if (count === 1) return [0];
  if (count >= palette.length) {
    // If we need more colors than available, return all indices
    return Array.from({ length: palette.length }, (_, i) => i);
  }

  const indices = [];
  const step = palette.length / count;
  
  for (let i = 0; i < count; i++) {
    // Calculate evenly spaced index
    const index = Math.floor(i * step);
    indices.push(index);
  }
  
  return indices;
}

/**
 * Gets the actual colors from a palette using indices
 * @param {string[]} palette - Array of color hex codes
 * @param {number[]} indices - Array of indices
 * @returns {string[]} Array of color hex codes
 */
export function getColorsFromIndices(palette, indices) {
  return indices.map(index => palette[index] || palette[0]);
}

/**
 * Gets evenly distributed colors from a palette
 * @param {string[]} palette - Array of color hex codes
 * @param {number} count - Number of colors to select
 * @returns {string[]} Array of evenly distributed color hex codes
 */
export function getEvenlyDistributedColors(palette, count) {
  const indices = getEvenlyDistributedColorIndices(palette, count);
  return getColorsFromIndices(palette, indices);
}
