const CACHE = "livre-moi-v2";
const PRECACHE = ["/offline.html"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  // Ne jamais servir la navigation HTML depuis le cache (évite un refresh bloqué / figé)
  if (event.request.mode === "navigate" || url.pathname === "/" || url.pathname === "/recherche") {
    event.respondWith(
      fetch(event.request).catch(() => caches.match("/offline.html")),
    );
    return;
  }

  event.respondWith(
    fetch(event.request).catch(async () => {
      const cached = await caches.match(event.request);
      return cached || caches.match("/offline.html");
    }),
  );
});
