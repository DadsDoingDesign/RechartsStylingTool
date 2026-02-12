# Create Desktop App with Electron

## Steps to create a standalone .app (Mac) or .exe (Windows):

### 1. Install Electron packages
```bash
npm install --save-dev electron electron-builder concurrently wait-on cross-env
```

### 2. Create electron/main.js
```javascript
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    },
    icon: path.join(__dirname, '../public/icon.png') // Optional: add an icon
  });

  // In development, load from Vite dev server
  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools(); // Remove this line for production
  } else {
    // In production, load the built files
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
```

### 3. Update package.json
Add these scripts to your package.json:

```json
{
  "main": "electron/main.js",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "electron:dev": "concurrently \"cross-env BROWSER=none npm run dev\" \"wait-on http://localhost:5173 && cross-env NODE_ENV=development electron .\"",
    "electron:build": "npm run build && electron-builder",
    "electron:build:mac": "npm run build && electron-builder --mac",
    "electron:build:win": "npm run build && electron-builder --win"
  },
  "build": {
    "appId": "com.chartsstyler.app",
    "productName": "Chart Styler",
    "files": [
      "dist/**/*",
      "electron/**/*"
    ],
    "directories": {
      "buildResources": "public"
    },
    "mac": {
      "target": "dmg",
      "icon": "public/icon.png"
    },
    "win": {
      "target": "nsis",
      "icon": "public/icon.png"
    }
  }
}
```

### 4. Create the desktop app

**For Mac (.app file):**
```bash
npm run electron:build:mac
```
Find the .app in: `dist/Chart Styler.app`

**For Windows (.exe installer):**
```bash
npm run electron:build:win
```
Find the .exe in: `dist/Chart Styler Setup.exe`

### 5. Run in development mode
```bash
npm run electron:dev
```

This creates a double-clickable application that runs without any terminal or IDE!
