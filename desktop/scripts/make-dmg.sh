#!/usr/bin/env bash
#
# Builds the installer DMG with the branded "drag to Applications" window.
#
# electron-builder makes APFS images on Apple silicon, and Finder ignores the
# background picture in those. This script builds an HFS+ image instead and
# lets Finder itself write the window layout, so the background always shows.
#
# Usage (after `npx electron-builder --mac dir --universal`):
#   bash scripts/make-dmg.sh [path/to/Veyro.app] [output.dmg]
set -euo pipefail

cd "$(dirname "$0")/.."
APP="${1:-release/mac-universal/Veyro.app}"
OUT="${2:-release/Veyro.dmg}"
VOL="Veyro"
WIN_W=540
WIN_H=380
ICON=112

[ -d "$APP" ] || { echo "App not found: $APP"; exit 1; }

WORK="$(mktemp -d)"
STAGE="$WORK/stage"
RW="$WORK/rw.dmg"
trap 'hdiutil detach "/Volumes/$VOL" -force >/dev/null 2>&1 || true; rm -rf "$WORK"' EXIT

echo "==> Staging"
mkdir -p "$STAGE/.background"
ditto "$APP" "$STAGE/Veyro.app"
ln -s /Applications "$STAGE/Applications"
# One multi-resolution TIFF so the background is sharp on Retina screens.
tiffutil -cathidpicheck build/background.png build/background@2x.png \
  -out "$STAGE/.background/background.tiff" >/dev/null

echo "==> Creating read-write HFS+ image"
hdiutil detach "/Volumes/$VOL" -force >/dev/null 2>&1 || true
SIZE_MB=$(( $(du -sm "$STAGE" | cut -f1) + 60 ))
hdiutil create -quiet -srcfolder "$STAGE" -volname "$VOL" -fs HFS+ \
  -format UDRW -size "${SIZE_MB}m" "$RW"
hdiutil attach -quiet -readwrite -noverify -noautoopen "$RW"

echo "==> Laying out the window with Finder"
osascript <<EOF
tell application "Finder"
  tell disk "$VOL"
    open
    set current view of container window to icon view
    set toolbar visible of container window to false
    set statusbar visible of container window to false
    set the bounds of container window to {200, 120, 200 + $WIN_W, 120 + $WIN_H + 28}
    set opts to the icon view options of container window
    set arrangement of opts to not arranged
    set icon size of opts to $ICON
    set text size of opts to 13
    set background picture of opts to file ".background:background.tiff"
    set position of item "Veyro.app" of container window to {140, 235}
    set position of item "Applications" of container window to {400, 235}
    close
    open
    update without registering applications
    delay 2
    close
  end tell
end tell
EOF

sync
sleep 1
hdiutil detach -quiet "/Volumes/$VOL"

echo "==> Compressing"
rm -f "$OUT"
hdiutil convert -quiet "$RW" -format UDZO -imagekey zlib-level=9 -o "$OUT"
echo "Done: $OUT ($(du -h "$OUT" | cut -f1))"
