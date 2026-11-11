#!/usr/bin/env bash
#
# Collects the Python device engine (scripts + native helpers) into
# desktop/resources/backend so electron-builder can copy it into the app's
# Contents/Resources/backend. The scripts resolve their own bin/ relative to
# themselves, so they must travel together.
set -euo pipefail
cd "$(dirname "$0")/.."

REPO=".."
DST="resources/backend"
rm -rf "$DST"
mkdir -p "$DST/bin"

# Python scripts: three live at the repo root, card_assets.py lives here.
for f in aircard_backend.py aircard.py apply_card_skin.py; do
  cp "$REPO/$f" "$DST/$f"
done
cp card_assets.py "$DST/card_assets.py"

# Native helpers.
cp bin/device_helper bin/airtraffic_host "$DST/bin/"
chmod +x "$DST/bin/"*

echo "Staged backend -> $DST"
ls "$DST" "$DST/bin"
