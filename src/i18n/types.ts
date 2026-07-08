/**
 * ロケール別ツールページの content 型。
 * 新言語は `<locale>.ts` でこの形を埋め、`config.ts` の LOCALES に追加するだけ。
 * 文言は直訳でなく各言語で competitor-grounded に意訳する（I18N-SEO-GUIDELINE 参照）。
 */

export interface FaqItem {
  q: string;
  a: string;
}

export interface HowToStep {
  h3: string;
  p: string;
}

export interface ToolContent {
  /** <html lang> と hreflang に使う BCP-47 言語コード（例 'en', 'ja', 'zh-Hant'） */
  htmlLang: string;

  meta: {
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
  };

  hero: { h1: string; tagline: string };

  intro: { h2: string; paras: string[] };

  privacy: { h2: string; lead: string; points: string[]; note: string; sourceLinkText: string };

  howto: { h2: string; steps: HowToStep[] };

  faqHeading: string;
  faq: FaqItem[];

  footer: {
    openSourceLabel: string; // "Open source (MIT)"
    partOf: string; // "part of"
    brandTail: string; // "— small tools that run locally on your device."
    colophon: string; // AI 開示を含む1行（前面化しない）
    securityText: string; // 脆弱性報告（SECURITY.md）へのリンク文言
  };
}
