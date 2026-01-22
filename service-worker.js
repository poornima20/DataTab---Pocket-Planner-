const CACHE_NAME = "pocket-planner-v1";
const BASE_PATH = "/DataTab---Pocket-Planner-/";

const ASSETS = [
  BASE_PATH,
  BASE_PATH + "index.html",
  BASE_PATH + "style.css",
  BASE_PATH + "script.js",
  BASE_PATH + "manifest.json",
  BASE_PATH + "icons/icon-192.png",
  BASE_PATH + "icons/icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
