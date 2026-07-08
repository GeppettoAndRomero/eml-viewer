import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';

// https://astro.build/config
export default defineConfig({
  integrations: [preact()],
  output: 'static',
  // slug-first 名前空間: ツールを runlocally.app/eml-viewer/ 配下に「物理配置」する
  // （src/pages/eml-viewer/ + public/eml-viewer/）。base は使わない（base は URL に
  // prefix を付けるが dist を入れ子化せず、ルート配信の Pages と不整合になるため）。
  // バンドルアセットも /eml-viewer/_assets/ に隔離し hub/他ツールと無衝突にする。
  build: {
    inlineStylesheets: 'auto',
    assets: 'eml-viewer/_assets',
  },
  vite: {
    resolve: {
      alias: {
        '@': '/src'
      }
    },
    build: {
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['preact', 'preact/hooks'],
            // Email parsing (postal-mime, MIT-0) and HTML sanitization (DOMPurify,
            // Apache-2.0) are only needed once a file is opened; keep them in their
            // own chunk so they stay off the initial page-load path.
            'eml-engine': ['postal-mime', 'dompurify']
          }
        }
      }
    }
  },
  compressHTML: true,
  scopedStyleStrategy: 'class'
});
