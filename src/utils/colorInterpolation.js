import chroma from 'chroma-js';

/**
 * Generate visually equidistant colors using perceptual color space (LAB)
 */
export function generatePalette(startColor, endColor, steps, saturation = 1, lightness = 1) {
  try {
    // Use LAB color space for perceptually uniform interpolation
    let scale = chroma.scale([startColor, endColor])
      .mode('lab')
      .colors(steps);
    
    // Apply saturation and lightness adjustments
    if (saturation !== 1 || lightness !== 1) {
      scale = scale.map(color => {
        const c = chroma(color);
        const hsl = c.hsl();
        return chroma.hsl(
          hsl[0] || 0,
          Math.max(0, Math.min(1, (hsl[1] || 0) * saturation)),
          Math.max(0, Math.min(1, (hsl[2] || 0.5) * lightness))
        ).hex();
      });
    }
    
    return scale;
  } catch (error) {
    console.error('Error generating palette:', error);
    return [];
  }
}

/**
 * Generate single hue scale with saturation and lightness controls
 */
export function generateSingleHueScale(baseColor, steps, saturation = 1, lightness = 1) {
  try {
    const base = chroma(baseColor);
    const baseHsl = base.hsl();
    
    // Adjust base color with saturation
    const adjustedBase = chroma.hsl(
      baseHsl[0] || 0,
      Math.max(0, Math.min(1, (baseHsl[1] || 0) * saturation)),
      baseHsl[2] || 0.5
    );
    
    // Create endpoint based on lightness
    let endColor;
    if (lightness >= 0.99 && saturation <= 0.01) {
      // Transition to white
      endColor = chroma('#ffffff');
    } else if (saturation <= 0.01) {
      // Transition to gray
      const grayValue = Math.round(lightness * 255);
      endColor = chroma(`rgb(${grayValue},${grayValue},${grayValue})`);
    } else {
      // Adjust saturation and lightness
      endColor = chroma.hsl(
        baseHsl[0] || 0,
        Math.max(0, Math.min(1, (baseHsl[1] || 0) * saturation * 0.3)),
        Math.max(0, Math.min(1, lightness * 0.9))
      );
    }
    
    return chroma.scale([adjustedBase, endColor])
      .mode('lab')
      .colors(steps);
  } catch (error) {
    console.error('Error generating single hue scale:', error);
    return [];
  }
}

/**
 * Generate divergent color scale with customizable midpoint
 */
export function generateDivergentScale(
  startColor, 
  endColor, 
  steps, 
  saturation = 1,
  lightness = 1,
  midpointSaturation = 0.1,
  midpointLightness = 0.9
) {
  try {
    // Adjust start and end colors
    const adjustStart = chroma(startColor);
    const adjustEnd = chroma(endColor);
    const startHsl = adjustStart.hsl();
    const endHsl = adjustEnd.hsl();
    
    const adjustedStart = chroma.hsl(
      startHsl[0] || 0,
      Math.max(0, Math.min(1, (startHsl[1] || 0) * saturation)),
      Math.max(0, Math.min(1, (startHsl[2] || 0.5) * lightness))
    );
    
    const adjustedEnd = chroma.hsl(
      endHsl[0] || 0,
      Math.max(0, Math.min(1, (endHsl[1] || 0) * saturation)),
      Math.max(0, Math.min(1, (endHsl[2] || 0.5) * lightness))
    );
    
    // Create midpoint color
    const grayValue = Math.round(midpointLightness * 255);
    let midpoint;
    
    if (midpointSaturation <= 0.01) {
      midpoint = chroma(`rgb(${grayValue},${grayValue},${grayValue})`);
    } else {
      // Blend the two hues for midpoint
      const blended = chroma.mix(adjustedStart, adjustedEnd, 0.5, 'lab');
      const hsl = blended.hsl();
      
      midpoint = chroma.hsl(
        hsl[0] || 0,
        Math.max(0, Math.min(1, (hsl[1] || 0) * midpointSaturation)),
        Math.max(0, Math.min(1, midpointLightness))
      );
    }
    
    // Generate colors in two halves
    const halfSteps = Math.ceil(steps / 2);
    const firstHalf = chroma.scale([adjustedStart, midpoint])
      .mode('lab')
      .colors(halfSteps);
    
    const secondHalf = chroma.scale([midpoint, adjustedEnd])
      .mode('lab')
      .colors(halfSteps);
    
    // Combine and remove duplicate midpoint
    const combined = [...firstHalf.slice(0, -1), ...secondHalf];
    
    // Adjust to exact step count
    if (combined.length > steps) {
      return combined.slice(0, steps);
    } else if (combined.length < steps) {
      return chroma.scale([adjustedStart, midpoint, adjustedEnd])
        .mode('lab')
        .colors(steps);
    }
    
    return combined;
  } catch (error) {
    console.error('Error generating divergent scale:', error);
    return [];
  }
}

/**
 * Generate random palette with visually distinct colors
 */
export function generateRandomPalette(steps, saturation = 0.65, lightness = 0.55) {
  const hues = [];
  const goldenRatio = 0.618033988749895;
  let hue = Math.random();
  
  // Generate evenly distributed hues using golden ratio
  for (let i = 0; i < steps; i++) {
    hues.push(hue);
    hue += goldenRatio;
    hue %= 1.0;
  }
  
  // Convert hues to colors with controlled saturation and lightness
  return hues.map(h => {
    // Add slight variation around the target values
    const s = Math.max(0.1, Math.min(1, saturation + (Math.random() - 0.5) * 0.2));
    const l = Math.max(0.2, Math.min(0.8, lightness + (Math.random() - 0.5) * 0.15));
    return chroma.hsl(h * 360, s, l).hex();
  });
}

/**
 * Export colors as SVG
 */
export function exportAsSVG(colors, width = 800, height = 100) {
  const swatchWidth = width / colors.length;
  
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;
  
  colors.forEach((color, index) => {
    const x = index * swatchWidth;
    svg += `<rect x="${x}" y="0" width="${swatchWidth}" height="${height}" fill="${color}"/>`;
  });
  
  svg += '</svg>';
  return svg;
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}
