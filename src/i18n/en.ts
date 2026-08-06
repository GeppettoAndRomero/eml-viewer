import type { ToolContent } from './types';

export const en: ToolContent = {
  htmlLang: 'en',

  meta: {
    title: 'EML Viewer — Open .eml Email Files in Your Browser, No Upload | runlocally',
    description:
      'Open a saved .eml email file in your browser and read its headers, body and attachments. The file is read on your device and never uploaded. Remote images and styles in the body are never loaded. Handles Shift_JIS and ISO-2022-JP Japanese mail correctly. Open source, works offline.',
    ogTitle: 'EML Viewer — Open .eml Email Files in Your Browser, No Upload',
    ogDescription:
      'Read a .eml file — headers, body and attachments — entirely in your browser. Nothing is uploaded, and no remote content in the message is fetched. Open source, works offline.',
  },

  hero: {
    h1: 'EML Viewer',
    tagline:
      'Open a saved .eml email file and read its headers, body and attachments in your browser. Nothing is uploaded.',
  },

  intro: {
    h2: 'Read a .eml file in your browser',
    paras: [
      'A .eml file is a single email saved to disk — forwarded evidence, an HR or legal notice, an invoice, a receipt. This tool opens it and shows the From/To/Cc/Subject/Date headers, the message body, and a list of attachments you can download individually. The file is read on your device; it is never sent anywhere.',
      'It handles both plain-text and HTML email bodies, and correctly decodes MIME encoded-word headers and non-UTF-8 charsets — including Shift_JIS and ISO-2022-JP, which is how most Japanese mail from that era and many Japanese corporate mail systems still encode messages today.',
      'Only .eml (the RFC 822 text format most mail clients export to) is supported. Outlook\'s .msg format is a different, binary structure and is not handled here.',
    ],
  },

  privacy: {
    h2: 'Why your email stays on your device',
    lead: 'An email is private correspondence. Privacy here is structural, not a promise — there is no upload step because there is no server to send it to:',
    points: [
      'The file is read and parsed entirely in your browser.',
      'The HTML body is rendered inside a sandboxed frame with scripts disabled, after the markup is sanitized.',
      'Remote images, background images and stylesheets referenced in the body are stripped before rendering, so nothing in the message can call home — including tracking pixels.',
      'The page is served as static files and makes no request that carries your data.',
      'The source is open and anyone can read it (MIT).',
      'It works offline, which is only possible because nothing leaves the device.',
    ],
    note: "If you want to check for yourself, open your browser's Network panel while you open a file — no request carries its contents, and no request goes out for anything referenced inside the message body.",
    sourceLinkText: 'Read the source.',
  },

  howto: {
    h2: 'How to use it',
    steps: [
      {
        h3: 'Open a file',
        p: 'Click to choose a .eml file, or drop it anywhere on the page. The file is read locally.',
      },
      {
        h3: 'Read the message',
        p: 'Headers, body and attachments appear immediately. If both an HTML and a plain-text version exist, switch between them.',
      },
      {
        h3: 'Download attachments',
        p: 'Each attachment has its own download button, so you can save just the file you need.',
      },
    ],
  },

  faqHeading: 'FAQ',
  faq: [
    {
      q: 'Is my email uploaded anywhere?',
      a: "No. The file is read and parsed entirely in your browser. There is no server component, so its contents have no path off your device. The source is open and you can confirm this in your browser's Network panel.",
    },
    {
      q: 'Does it load images or trackers from the message?',
      a: 'No. Any image, background or style in the HTML body that points to a remote location is removed before the message is displayed, and the body is rendered in a sandboxed frame with scripts disabled. Only images embedded directly in the message (inline attachments) are shown.',
    },
    {
      q: 'Does it handle Japanese email correctly?',
      a: 'Yes. Headers encoded as MIME encoded-words (for example =?ISO-2022-JP?B?...?=) and bodies sent as Shift_JIS or ISO-2022-JP are decoded correctly, rather than showing garbled characters (mojibake).',
    },
    {
      q: 'Does it support .msg files?',
      a: 'No, only .eml. Outlook\'s .msg format is a different binary structure (OLE/Compound File Binary) and is not supported by this tool.',
    },
    {
      q: 'Can I edit or reply to the email?',
      a: 'No. This is a read-only viewer for inspecting a saved email; it does not edit, send or modify the file.',
    },
    {
      q: 'Does it work offline?',
      a: 'Yes. It is a PWA. After the first visit it is cached, so it opens without a network connection. You can also install it to your home screen.',
    },
  ],

  footer: {
    openSourceLabel: 'Open source (MIT)',
    partOf: 'part of',
    brandTail: '— small tools that run locally on your device.',
    colophon:
      "Built and maintained by Geppetto. Some code is written with AI assistance; all review and decisions are the maintainer's.",
    securityText: 'Security',
  },

  related: {
    h2: 'Related tools',
    blogLinkText: 'Read the technical notes',
  },
};
