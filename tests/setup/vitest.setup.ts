import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';

// vitest's jsdom can ship a non-functional opaque-origin localStorage; install a
// small in-memory Storage so storage-backed code (settings, ETA metrics) is
// deterministic. Harmless in the Node unit env (where nothing uses it).
function installMemoryStorage(target: Record<string, unknown>) {
  const store = new Map<string, string>();
  const storage: Storage = {
    get length() {
      return store.size;
    },
    clear: () => store.clear(),
    getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
    key: (i: number) => Array.from(store.keys())[i] ?? null,
    removeItem: (k: string) => void store.delete(k),
    setItem: (k: string, v: string) => void store.set(k, String(v)),
  };
  try {
    Object.defineProperty(target, 'localStorage', { value: storage, configurable: true });
  } catch {
    (target as { localStorage?: Storage }).localStorage = storage;
  }
}

installMemoryStorage(globalThis as unknown as Record<string, unknown>);
if (typeof window !== 'undefined') {
  installMemoryStorage(window as unknown as Record<string, unknown>);
}

// Unmount Preact trees between component tests. Loaded lazily so this stays
// usable in the Node-environment unit tests (no document there).
afterEach(async () => {
  if (typeof document !== 'undefined') {
    const { cleanup } = await import('@testing-library/preact');
    cleanup();
  }
});
