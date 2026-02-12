# Data Color Picker - Charts Color Generator

A modern web application for generating visually-equidistant color schemes for data visualizations, charts, and dashboards. Built with React and using perceptually uniform color interpolation.

## Features

### 🎨 Four Generation Modes

1. **Palette Generator** - Create multi-hue palettes for categorical data
   - Perfect for pie charts, bar charts, and maps
   - Customize start and end colors
   - Generate 2-20 visually distinct colors

2. **Single Hue Scale** - Sequential color scales for single variables
   - Ideal for heatmaps and choropleth maps
   - Control brightness and color intensity
   - Transition to gray or white endpoints

3. **Divergent Scale** - Bipolar color scales with neutral midpoint
   - Great for political maps, temperature data
   - Customize midpoint color properties
   - Smooth transition from one extreme to another

4. **Random Palette** - Quick random color generation
   - Uses golden ratio for optimal hue distribution
   - Perfect for prototyping and inspiration
   - One-click regeneration

### ✨ Key Features

- **Perceptually Uniform Colors** - Uses LAB color space for true visual equidistance
- **Live Preview** - See changes in real-time
- **Easy Export** - Copy HEX values or download as SVG
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Modern UI** - Clean, intuitive interface built with Tailwind CSS

## Technology Stack

- **React 18** - Modern UI framework
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **chroma.js** - Advanced color manipulation and interpolation
- **Lucide React** - Beautiful icons

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## How It Works

The app uses **perceptually uniform color spaces** (LAB/LCH) instead of RGB for color interpolation. This ensures that:

- Colors are visually equidistant (not just mathematically)
- No muddy middle colors in gradients
- Better contrast and distinguishability
- Accessible color choices for data visualization

## Usage Tips

### Palette Generator
- Choose very different endpoint colors (warm vs cool, bright vs dark)
- Don't be afraid to adjust brand colors slightly for better results
- Hue matters more than exact saturation/brightness for brand recognition

### Single Hue Scale
- Set Color Intensity to 0% for gray endpoint
- Set Brightness to 100% and Intensity to 0% for white endpoint
- Darker colors typically represent higher values

### Divergent Scale
- Keep Color Intensity low when endpoints are very different
- Use odd numbers of steps to have a clear midpoint
- Best for showing transitions through a neutral middle value

### Random Palette
- Click "Generate" multiple times to explore options
- Use as starting point, then fine-tune in Palette mode
- Great for discovering unexpected color combinations

## License

MIT

## Acknowledgments

Inspired by [LearnUI Design's Data Color Picker](https://www.learnui.design/tools/data-color-picker.html)
