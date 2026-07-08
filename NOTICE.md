# Third-party notices

The source code in this repository is licensed under the [MIT License](./LICENSE).
This tool has no third-party components under a copyleft license. Two runtime
dependencies carry their own permissive license and are recorded here.

## postal-mime — MIT No Attribution (MIT-0)

- **Package:** [`postal-mime`](https://www.npmjs.com/package/postal-mime)
- **License:** MIT-0 (MIT No Attribution) — copyright Andris Reinman.
- **What it does here:** parses the `.eml` file's RFC 822 / MIME structure (headers,
  bodies, attachments) in the browser.
- **Modifications:** none. Used unmodified as an npm dependency.

## DOMPurify — used under the Apache License 2.0

- **Package:** [`DOMPurify`](https://github.com/cure53/DOMPurify) — copyright Cure53
  and other contributors.
- **License:** dual-licensed (Apache License 2.0 OR Mozilla Public License 2.0); this
  project uses it under the **Apache License 2.0**, reproduced in full in
  `node_modules/dompurify/LICENSE` and at
  <https://www.apache.org/licenses/LICENSE-2.0>.
- **What it does here:** sanitizes the email's HTML body before it is handed to the
  sandboxed `<iframe>` renderer.
- **Modifications:** none. Used unmodified as an npm dependency, configured at call
  sites (`src/utils/emlEngine.ts`) via its public hook/config API — no changes to its
  own source.

Other dependencies — Astro, Preact, and @astrojs/preact — are distributed under the
MIT License.
