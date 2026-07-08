import type { ToolContent } from './types';
import { en } from './en';
import { ja } from './ja';
import { zh } from './zh';
import { de } from './de';
import { es } from './es';

export const SITE = 'https://runlocally.app';
export const SLUG = 'eml-viewer';
export const REPO = 'https://github.com/GeppettoAndRomero/eml-viewer';

/**
 * 公開済みコンテンツを持つロケールのみを列挙する。
 * 新言語は competitor-grounded な content (`<locale>.ts`) を用意してから、ここに追加する。
 * （hreflang は本リストから自動生成されるため、未完成言語をここに足さないこと＝薄いページ/重複の防止）
 */
export const CONTENT: Record<string, ToolContent> = {
  en,
  ja,
  zh,
  de,
  es,
};

export const LOCALES = Object.keys(CONTENT);

/** ロケールの公開 URL（slug-first）。en は /<slug>/、他は /<slug>/<locale>/。 */
export function localePath(locale: string): string {
  return locale === 'en' ? `${SITE}/${SLUG}/` : `${SITE}/${SLUG}/${locale}/`;
}

/** 公開済み全ロケール + x-default(=en) の hreflang alternates。 */
export function hreflangs(): { hreflang: string; href: string }[] {
  const alts = LOCALES.map((l) => ({ hreflang: CONTENT[l].htmlLang, href: localePath(l) }));
  alts.push({ hreflang: 'x-default', href: localePath('en') });
  return alts;
}
