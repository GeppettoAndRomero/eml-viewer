# Security Policy

`eml-viewer` runs entirely in your browser. There is no server component and no
account system, so the emails you open are never uploaded.

An `.eml` file is one of the more dangerous kinds of untrusted content to render: the
HTML body is attacker-controllable by whoever sent (or forged) the message. We take
that seriously — the body is sanitized (DOMPurify) and rendered inside a sandboxed
`<iframe>` with neither `allow-scripts` nor `allow-same-origin`, and every image,
background or style reference that is not a `data:` URI or a same-message `cid:`
attachment is stripped before rendering, so nothing in the message body can make a
network request. We also care about supply-chain issues in dependencies, service
worker caching bugs, or anything that could cause a file to leave your device.

## Reporting a vulnerability

Please report suspected vulnerabilities privately, not in a public issue:

- Email: **security@runlocally.app**
- Or use GitHub's private vulnerability reporting (Security → Report a vulnerability).

Include what you found, steps to reproduce, and the impact you expect. We aim to
acknowledge within a few days. Please give us a reasonable window to ship a fix
before public disclosure.

## Scope

In scope:

- This repository's source and the deployed site.
- The `.eml` parsing and HTML-sanitization pipeline, the sandboxed body renderer, the
  service worker, and the PWA manifest.
- Anything that could execute script from a message body, fetch a remote resource
  referenced in a message, or send message/attachment data off the device.

Out of scope:

- Findings that require a compromised device or a malicious browser extension.
- Missing hardening headers that have no concrete exploit.

Thank you for helping keep users safe.
