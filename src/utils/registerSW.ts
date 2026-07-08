/**
 * Service Worker Registration
 * PWA機能: Service Workerの登録と管理
 */

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  // Service Workerがサポートされているか確認
  if (!('serviceWorker' in navigator)) {
    console.log('Service Worker is not supported');
    return null;
  }

  try {
    // Service Workerを登録（/eml-viewer/sw.js, scope=/eml-viewer/）。
    // scope がツールの全 locale ページ（/eml-viewer/, /eml-viewer/ja/ …）を被覆する。
    const registration = await navigator.serviceWorker.register('/eml-viewer/sw.js', {
      scope: '/eml-viewer/',
    });

    console.log('Service Worker registered:', registration);

    // 更新をチェック
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      console.log('Service Worker update found');

      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // 新しいService Workerがインストールされた
            console.log('New Service Worker installed');

            // ユーザーに更新を通知（オプション）
            if (confirm('新しいバージョンが利用可能です。ページを再読み込みしますか？')) {
              newWorker.postMessage({ type: 'SKIP_WAITING' });
              window.location.reload();
            }
          }
        });
      }
    });

    // ページ読み込み時に更新をチェック
    registration.update();

    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
}

/**
 * Service Workerを解除（開発時のデバッグ用）
 */
export async function unregisterServiceWorker(): Promise<boolean> {
  if (!('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      const result = await registration.unregister();
      console.log('Service Worker unregistered:', result);
      return result;
    }
    return false;
  } catch (error) {
    console.error('Service Worker unregistration failed:', error);
    return false;
  }
}

/**
 * キャッシュをクリア
 */
export async function clearCache(): Promise<void> {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration && registration.active) {
      registration.active.postMessage({ type: 'CLEAR_CACHE' });
      console.log('Cache clear message sent to Service Worker');
    }

    // ブラウザのキャッシュもクリア
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
      console.log('All caches cleared');
    }
  } catch (error) {
    console.error('Cache clear failed:', error);
  }
}
