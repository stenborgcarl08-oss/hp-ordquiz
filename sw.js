/* sw.js — Service Worker för HP Ordquiz
   Cachar appens filer vid installation så att quizet fungerar offline
   och kan köras som en installerad PWA på mobil och dator. */

/* Versionsnummer i cachenamnet: när vi ändrar filer nedan och bumpar
   siffran tar aktiveringssteget bort den gamla cachen automatiskt */
const CACHE_NAME = "hp-ordquiz-v5";

/* Alla filer appen behöver för att fungera offline.
   Relativa vägar gör att samma manifest fungerar oavsett om sidan
   ligger i rotdomän eller i en undermapp (t.ex. GitHub Pages) */
const ASSETS = [
  "./",
  "./index.html",
  "./css/style.css",
  "./js/app.js",
  "./js/questions.js",
  "./manifest.json",
  "./icons/icon.svg",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png"
];

/* install — laddas första gången användaren besöker sidan.
   waitUntil() gör att webbläsaren väntar med att aktivera
   tills alla filer har cachats. */
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

/* activate — städar bort gamla cacher när en ny version rullas ut,
   så att användaren inte får en blandning av gamla och nya filer */
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys
        .filter(key => key !== CACHE_NAME)
        .map(key => caches.delete(key))
    ))
  );
  self.clients.claim();
});

/* fetch — fångar alla nätverksanrop och svarar från cachen om filen
   finns där. Om filen inte finns cachad hämtas den från nätet som
   vanligt. Vi rör bara GET-anrop för att inte störa eventuella POST. */
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
