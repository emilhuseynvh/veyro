#!/usr/bin/env bash
#
# Fetches a self-contained, relocatable Python (python-build-standalone, arm64)
# into desktop/vendor/python. This gets bundled into the app so users never need
# system python3 or the Xcode command line tools. Run once before `npm run dist`
# (stage-backend.sh errors out if vendor/python is missing).
set -euo pipefail
cd "$(dirname "$0")/.."

VERSION="cpython-3.12.16+20261110"
URL="https://github.com/astral-sh/python-build-standalone/releases/download/20261110/${VERSION}-aarch64-apple-darwin-install_only.tar.gz"
DST="vendor/python"

if [ -x "$DST/bin/python3" ]; then
  echo "vendor/python already present; skipping."
  exit 0
fi

mkdir -p vendor
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
echo "==> Downloading $VERSION"
curl -sL -o "$TMP/py.tar.gz" "$URL"
tar -xzf "$TMP/py.tar.gz" -C "$TMP"
rm -rf "$DST"
mv "$TMP/python" "$DST"

echo "==> Slimming"
LIB="$DST/lib/python3.12"
rm -rf "$LIB/test" "$LIB/idlelib" "$LIB/turtledemo" "$LIB/tkinter" \
       "$LIB/lib2to3" "$LIB/ensurepip" "$LIB/distutils" \
       "$DST/share" "$DST/include" 2>/dev/null || true
rm -f "$DST/lib/libpython3.12.a" 2>/dev/null || true
rm -f "$LIB/lib-dynload/_tkinter"*.so 2>/dev/null || true
rm -rf "$LIB/site-packages/pip" "$LIB/site-packages/pip-"*.dist-info \
       "$LIB/site-packages/README.txt" 2>/dev/null || true
for b in pip pip3 pip3.12 idle3 idle3.12 2to3 2to3-3.12 pydoc3 pydoc3.12; do
  rm -f "$DST/bin/$b"
done
find "$DST" -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true

echo "Done: $(du -sh "$DST" | cut -f1) at $DST"
