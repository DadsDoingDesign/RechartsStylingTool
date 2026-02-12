# Recharts Styling Studio

A professional chart customization tool for designing beautiful, export-ready [Recharts](https://recharts.org/) charts with complete control over styling. Built with React, Tailwind CSS, and Recharts.

## Features

### 📊 Six Chart Types

- **Bar Chart** — standard grouped bars
- **Stacked Bar Chart** — stacked series comparison
- **Line Chart** — with customizable dot shapes, line types, and stroke width
- **Area Chart** — stacked areas with fill opacity control
- **Pie Chart** — with percentage labels and per-slice colors
- **Waterfall Chart** — configurable sales/costs with auto-calculated totals

### 🎛️ Nine Style Control Tabs

| Tab | What you can customize |
|-----|----------------------|
| **Chart Type** | Select chart type, manage data series (add/remove/rename/toggle visibility), configure waterfall parameters |
| **Colors** | Color palette (up to 10), background color, Tailwind color presets & custom shade builder, color palette import, even distribution toggle, per-series color assignment |
| **Dimensions** | Chart width, height, and margin (top/right/bottom/left) |
| **Typography** | Font family (9 options), font size, font weight, text color |
| **Grid & Axes** | Grid visibility, color, dash pattern, opacity; axis color and width |
| **Elements** | Line type (linear/monotone/natural/step), stroke width, fill opacity, bar roundness, dot radius & shape |
| **Legend** | Visibility, horizontal/vertical alignment, icon type (9 options), spacing/margin |
| **Tooltip** | Visibility, background, border, opacity; hover cursor fill color and opacity |
| **Animation** | Duration and easing function |

### 🎨 Color System

- **Manual Color Picker** — hex input with visual picker for each palette slot
- **Tailwind Color Presets** — one-click curated palettes from Tailwind's color system
- **Custom Tailwind Shade Builder** — pick individual shades across color families to build a palette
- **Color Palette Import** — paste hex/RGB/JSON, upload a file, or import from a previously generated palette
- **Even Distribution** — automatically assigns palette colors to maximize visual distinction between series
- **Per-Series Assignment** — manually map any palette color to any data series
- **Tailwind Class Export** — auto-generates `text-`, `bg-`, and `border-` utility classes for your palette

### 📂 Custom Data Input

- **Paste** CSV or JSON directly into the app
- **Upload** CSV, JSON, or Excel (`.xlsx` / `.xls`) files
- Context-aware format examples for each chart type (standard, pie, waterfall)

### 💾 Save & Load Configurations

- Save named configurations to browser localStorage
- Load, rename, update, overwrite, or delete saved configs
- Loaded config name carries through to export filenames

### 📤 Export Options

- **JSON** — full configuration object for programmatic use
- **React** — ready-to-use Recharts component code (includes custom dot renderers when needed)
- **CSS Variables** — complete set of `--chart-*` custom properties for theming
- **SVG Download** — export the live preview chart directly as an SVG file
- Copy to clipboard or download as a file

### 👁️ Live Preview

- Sticky chart preview that stays visible while you adjust settings
- Real-time updates as you change any style control

## Technology Stack

- **React 18** — UI framework
- **Recharts** — composable charting library
- **Vite** — build tool and dev server
- **Tailwind CSS** — utility-first styling
- **chroma.js** — color manipulation (waterfall chart contrast, color utilities)
- **SheetJS (xlsx)** — Excel file parsing
- **Lucide React** — icons

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## License

MIT
