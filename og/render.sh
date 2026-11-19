#!/bin/sh
# Render the 1200x630 link-preview images with headless Chrome (macOS path).
# Re-run after changing og/*.html, the wheel's contents, or either site's styles.
set -e
cd "$(dirname "$0")"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
render() {
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --allow-file-access-from-files \
    --window-size=1200,630 --virtual-time-budget=2000 --screenshot="$2" "file://$PWD/$1" 2>/dev/null
  echo "wrote $2"
}
render wheel.html ../public/og.png
render cvegen.html ../cvegen/public/og.png
