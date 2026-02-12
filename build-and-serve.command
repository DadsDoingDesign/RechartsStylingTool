#!/bin/bash
cd "$(dirname "$0")"

echo "Building Chart Styler for production..."
npm run build

echo "Installing simple server (one-time only)..."
npm install -g serve

echo "Starting Chart Styler..."
open http://localhost:3000
serve -s dist -l 3000
