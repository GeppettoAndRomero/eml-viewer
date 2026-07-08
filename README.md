# eml-viewer

Open a saved `.eml` email file in your browser and read its headers, body and
attachments, entirely on your device. Files are never uploaded. Open source, works
offline (PWA).

Part of [runlocally](https://runlocally.app) — small tools that run locally on your device.

## How it works

[`postal-mime`](https://github.com/postalsys/postal-mime) parses the RFC 822 / MIME
structure of the `.eml` file — headers, plain-text and HTML bodies, attachments — in
the browser. It decodes MIME encoded-word headers and non-UTF-8 charsets (including
Shift_JIS and ISO-2022-JP) using the browser's native `TextDecoder`.

The HTML body is untrusted, so it is sanitized with
[DOMPurify](https://github.com/cure53/DOMPurify) and then rendered inside a sandboxed
`<iframe srcdoc>` with neither `allow-scripts` nor `allow-same-origin`. On top of
DOMPurify's own script/handler stripping, every image, background and style reference
that does not resolve to a `data:` URI or a same-message `cid:` attachment is removed
before the message is ever rendered — so no remote request (including a tracking
pixel) can fire from the message body. Attachments download individually via
`Blob` + an object URL.

The whole pipeline runs client-side; there is no server component, so a file has no
path off the device.

## Features

- Headers: From / To / Cc / Subject / Date
- HTML or plain-text body (HTML sanitized, rendered sandboxed; switch between both when both exist)
- Attachment list with per-file download
- Correct MIME encoded-word and Shift_JIS / ISO-2022-JP decoding for Japanese mail
- `.eml` only (RFC 822) — `.msg` (Outlook's binary format) is out of scope
- Works offline (PWA), installable

## Develop

```bash
npm install
npm run dev      # dev server
npm run build    # type-check + production build to dist/
```

Stack: Astro + Preact + TypeScript. Parsing and sanitization run on the main thread
(no Worker needed — a single email is small).

## Browser support

Works in current Chrome, Edge, Firefox and Safari. Relies on the browser's native
`TextDecoder` supporting the WHATWG Encoding Standard's legacy charsets
(Shift_JIS, ISO-2022-JP), which all evergreen browsers implement.

## License

[MIT](./LICENSE). Built and maintained by Geppetto. Some code is written with AI
assistance; all review and decisions are the maintainer's.
