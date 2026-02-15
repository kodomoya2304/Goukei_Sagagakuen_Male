// キャッシュのバージョン名

const CACHE_NAME = "v1";



// オフラインで使うためにキャッシュしておくファイル一覧

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./Goukei_icon.png",
  "./style.css",
  "./script.js"
];



// Service Worker のインストール時に実行される。FILES_TO_CACHE に書いたファイルをキャッシュに保存する。

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting(); // すぐに新しい SW を有効化
});



// 新しいバージョンの SW が有効になったときに実行される。古いキャッシュを削除して整理する。

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim(); // すぐに新しい SW を適用
});



// すべてのリクエストを横取りして処理する。キャッシュにあればキャッシュを返し、なければネットから取得する。

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});