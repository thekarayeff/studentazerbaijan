const CACHE_NAME = "gradex-static-v5";

// Relative yollar GitHub Pages subpath-larında da stabil işləyir.
const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./uomg.html",
  "./kesr.html",
  "./dim.html",
  "./css/style.css",
  "./script.js",
  "./gp.js",
  "./kesr.js",
  "./dim.js",
  "./ads.json",
  "./manifest.json",
  "./img/icon-192.png",
  "./img/icon-180.png",
  "./img/university.jpg",
  "./img/fail.jpg",
  "./img/semester.jpg",
  "./img/dim.jpg",
  "./img/join.jpg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).catch(() => caches.match("./index.html"));
    })
  );
});
