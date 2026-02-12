#!/bin/bash
cd "$(dirname "$0")"
echo "Starting Chart Styler..."
open http://localhost:5173
npm run dev
