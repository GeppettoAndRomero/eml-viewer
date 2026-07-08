/**
 * ThemeToggle コンポーネント
 * ライト/ダークモード切り替え
 */

import { useState, useEffect } from 'preact/hooks';
import { ui } from '@/i18n/ui';

const THEME_STORAGE_KEY = 'runlocally-theme';

type Theme = 'light' | 'dark' | 'auto';

/**
 * システムのカラースキーム設定を取得
 */
function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * 保存されたテーマ設定を読み込み
 */
function loadTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'auto') {
      return stored;
    }
  } catch (error) {
    console.error('テーマ設定の読み込みに失敗しました:', error);
  }
  return 'light';
}

/**
 * テーマ設定を保存
 */
function saveTheme(theme: Theme): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    console.error('テーマ設定の保存に失敗しました:', error);
  }
}

/**
 * HTMLにテーマ属性を適用
 */
function applyTheme(theme: Theme): void {
  const actualTheme = theme === 'auto' ? getSystemTheme() : theme;
  document.documentElement.setAttribute('data-theme', actualTheme);
}

interface ThemeToggleProps {
  locale?: string;
}

export function ThemeToggle({ locale = 'en' }: ThemeToggleProps) {
  const t = (ui as any)[locale] ?? ui.en;
  const [theme, setTheme] = useState<Theme>('light');

  // 初期化: 保存されたテーマを読み込んで適用
  useEffect(() => {
    const savedTheme = loadTheme();
    setTheme(savedTheme);
    applyTheme(savedTheme);

    // システム設定の変更を監視
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'auto') {
        applyTheme('auto');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // テーマ切り替え
  const toggleTheme = () => {
    const currentActualTheme = theme === 'auto' ? getSystemTheme() : theme;
    const nextTheme: Theme = currentActualTheme === 'dark' ? 'light' : 'dark';

    setTheme(nextTheme);
    saveTheme(nextTheme);
    applyTheme(nextTheme);
  };

  // 現在の実際のテーマを取得（autoの場合はシステムテーマ）
  const actualTheme = theme === 'auto' ? getSystemTheme() : theme;
  const icon = actualTheme === 'dark' ? '☀️' : '🌙';
  const label = actualTheme === 'dark' ? t.themeToLight : t.themeToDark;

  return (
    <button
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className="theme-toggle"
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        fontSize: 'var(--fs-2)',
        cursor: 'pointer',
        padding: 'var(--space-2) var(--space-3)',
        borderRadius: 'var(--radius-sm)',
        transition: 'all var(--dur-mid) var(--ease)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        fontWeight: 500,
        color: 'var(--color-text)',
        minHeight: '40px',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--color-bg)';
        e.currentTarget.style.borderColor = 'var(--color-primary)';
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'var(--color-surface)';
        e.currentTarget.style.borderColor = 'var(--color-border)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>{icon}</span>
      <span className="theme-toggle__text">{t.themeLabel}</span>
    </button>
  );
}
