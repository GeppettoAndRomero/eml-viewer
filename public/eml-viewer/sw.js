/**
 * Service Worker
 * PWA機能: オフライン対応、キャッシュ戦略
 * 仕様: 2.2.3 Service Worker、3.2 キャッシュ戦略
 */

const CACHE_NAME = 'heic-converter-v3';
const RUNTIME_CACHE = 'heic-converter-runtime';

// キャッシュするリソース（静的アセット）
const PRECACHE_URLS = [
  '/eml-viewer/',
  '/eml-viewer/manifest.json',
  '/eml-viewer/icon-192.png',
  '/eml-viewer/icon-512.png',
];

/**
 * インストール時: 静的リソースをキャッシュ
 */
self.addEventListener('install', (event) => {
  console.log('[SW] Install event');

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Precaching static resources');
      return cache.addAll(PRECACHE_URLS);
    }).then(() => {
      // 新しいService Workerを即座にアクティブ化
      return self.skipWaiting();
    })
  );
});

/**
 * アクティベーション時: 古いキャッシュを削除
 */
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate event');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // すべてのクライアントで新しいService Workerを使用
      return self.clients.claim();
    })
  );
});

/**
 * フェッチ時: キャッシュ戦略を適用
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 同一オリジンのリクエストのみ処理
  if (url.origin !== location.origin) {
    return;
  }

  // GET以外のリクエストは無視
  if (request.method !== 'GET') {
    return;
  }

  // 静的リソース: Cache First戦略
  if (isStaticAsset(url.pathname)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // HTMLページ: Network First戦略
  if (isHTMLRequest(request)) {
    event.respondWith(networkFirst(request));
    return;
  }

  // その他: Network First戦略
  event.respondWith(networkFirst(request));
});

/**
 * 静的アセットかどうかを判定
 */
function isStaticAsset(pathname) {
  const staticExtensions = ['.css', '.js', '.wasm', '.png', '.jpg', '.jpeg', '.svg', '.woff', '.woff2', '.ttf'];
  return staticExtensions.some(ext => pathname.endsWith(ext)) || pathname === '/eml-viewer/manifest.json';
}

/**
 * HTMLリクエストかどうかを判定
 */
function isHTMLRequest(request) {
  return request.headers.get('accept')?.includes('text/html');
}

/**
 * Cache First戦略
 * キャッシュを優先、なければネットワークから取得してキャッシュ
 */
async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);

  if (cached) {
    console.log('[SW] Cache hit:', request.url);
    return cached;
  }

  console.log('[SW] Cache miss, fetching:', request.url);
  const response = await fetch(request);

  // 成功したレスポンスのみキャッシュ
  if (response.ok) {
    cache.put(request, response.clone());
  }

  return response;
}

/**
 * Network First戦略
 * ネットワークを優先、失敗したらキャッシュから取得
 */
async function networkFirst(request) {
  const cache = await caches.open(RUNTIME_CACHE);

  try {
    const response = await fetch(request);

    // 成功したレスポンスのみキャッシュ
    if (response.ok) {
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    // 全キャッシュ横断（RUNTIME だけでなく precache した '/' も対象）。
    const cached = (await cache.match(request)) || (await caches.match(request));

    if (cached) {
      return cached;
    }

    // オフラインページを返す（将来的に実装）
    throw error;
  }
}

/**
 * メッセージハンドリング（キャッシュクリアなど）
 */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      })
    );
  }
});
