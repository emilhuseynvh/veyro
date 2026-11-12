// MilliNet participant badge. The network ships a `document.write`-based
// loader, which cannot run inside React's hydrated tree, so it is isolated in
// a tiny iframe: the exact snippet runs untouched and the page markup still
// carries it. Badge image is 200x103.
const SRC_DOC = `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0;overflow:hidden;background:transparent}img{display:block}</style></head><body><!--MilliNet --><script type="text/javascript" src="https://millinet.az/banner.js?id=786"></script></body></html>`;

export function MilliNetBadge() {
  return (
    <iframe
      title="MilliNet"
      srcDoc={SRC_DOC}
      width={200}
      height={103}
      loading="lazy"
      scrolling="no"
      style={{ border: 0, width: 200, height: 103 }}
    />
  );
}
