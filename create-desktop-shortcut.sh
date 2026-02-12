#!/bin/bash

# Get the absolute path to the project directory
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
DESKTOP_DIR="$HOME/Desktop"
APP_NAME="Chart Styler"

echo "Creating desktop shortcut for Chart Styler..."

# Create an AppleScript application
cat > "$DESKTOP_DIR/$APP_NAME.app.applescript" << EOF
#!/usr/bin/osascript

tell application "Terminal"
    activate
    do script "cd '$PROJECT_DIR' && ./start-app.command"
end tell
EOF

# Compile the AppleScript into an application
osacompile -o "$DESKTOP_DIR/$APP_NAME.app" "$DESKTOP_DIR/$APP_NAME.app.applescript"

# Clean up temporary file
rm "$DESKTOP_DIR/$APP_NAME.app.applescript"

# Make the app executable
chmod +x "$DESKTOP_DIR/$APP_NAME.app/Contents/MacOS/applet"

echo "✅ Success! 'Chart Styler' has been added to your Desktop!"
echo "Double-click 'Chart Styler' on your Desktop to launch the app."
