/**
 * InstallPrompt コンポーネント
 * PWAインストール促進UI
 */

import { useState, useEffect } from 'preact/hooks';
import { AppButton } from './AppButton';
import { ui } from '@/i18n/ui';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

type DisplayMode = 'banner' | 'footer' | 'hidden';

interface InstallPromptProps {
  locale?: string;
}

export function InstallPrompt({ locale = 'en' }: InstallPromptProps) {
  const t = (ui as any)[locale] ?? ui.en;
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [displayMode, setDisplayMode] = useState<DisplayMode>('hidden');

  useEffect(() => {
    const handler = (e: Event) => {
      // デフォルトのインストールプロンプトを防ぐ
      e.preventDefault();

      // イベントを保存して後で使用
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // 保存された表示モードを確認
      const savedMode = localStorage.getItem('eml-viewer-install-prompt-mode') as DisplayMode | null;
      const dismissedTime = localStorage.getItem('eml-viewer-install-prompt-dismissed');

      // 1週間経過していたらリセット
      if (dismissedTime) {
        const oneWeek = 7 * 24 * 60 * 60 * 1000;
        if (Date.now() - parseInt(dismissedTime, 10) >= oneWeek) {
          localStorage.removeItem('eml-viewer-install-prompt-mode');
          localStorage.removeItem('eml-viewer-install-prompt-dismissed');
          setDisplayMode('banner');
          return;
        }
      }

      // 保存されたモードがあればそれを使用、なければbannerモード
      if (savedMode === 'footer' || savedMode === 'hidden') {
        setDisplayMode(savedMode);
      } else {
        setDisplayMode('banner');
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    // すでにインストール済みかチェック
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setDisplayMode('hidden');
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      return;
    }

    // インストールプロンプトを表示
    await deferredPrompt.prompt();

    // ユーザーの選択を待つ
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User choice: ${outcome}`);

    // プロンプトを非表示
    setDeferredPrompt(null);
    setDisplayMode('hidden');
    localStorage.setItem('eml-viewer-install-prompt-mode', 'hidden');
  };

  const handleDismissBanner = () => {
    // バナーを閉じてフッターモードに移行
    setDisplayMode('footer');
    localStorage.setItem('eml-viewer-install-prompt-mode', 'footer');
  };

  const handleDismissFooter = () => {
    // フッターも閉じて完全非表示
    setDisplayMode('hidden');
    localStorage.setItem('eml-viewer-install-prompt-mode', 'hidden');
    localStorage.setItem('eml-viewer-install-prompt-dismissed', Date.now().toString());
  };

  if (displayMode === 'hidden' || !deferredPrompt) {
    return null;
  }

  // バナーモード
  if (displayMode === 'banner') {
    return (
      <div
        style={{
          position: 'fixed',
          bottom: 'var(--space-4)',
          left: '50%',
          transform: 'translateX(-50%)',
          maxWidth: '500px',
          width: '90%',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-4)',
          boxShadow: 'var(--shadow-2)',
          zIndex: 1000,
          animation: 'slideUp 0.3s ease-out',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: '0 0 var(--space-2) 0', fontSize: 'var(--fs-3)' }}>
              {t.installHeading}
            </h3>
            <p style={{ margin: '0 0 var(--space-3) 0', fontSize: 'var(--fs-2)', color: 'var(--color-subtle)' }}>
              {t.installBody}
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <div
                style={{
                  animation: 'pulse 2s infinite',
                  borderRadius: 'var(--radius-xs)',
                }}
              >
                <AppButton
                  variant="primary"
                  onClick={handleInstall}
                >
                  {`📱 ${t.install}`}
                </AppButton>
              </div>
              <AppButton variant="ghost" onClick={handleDismissBanner}>
                {t.later}
              </AppButton>
            </div>
          </div>
          <button
            onClick={handleDismissBanner}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 'var(--fs-4)',
              color: 'var(--color-subtle)',
              padding: '0',
              lineHeight: '1',
            }}
            aria-label={t.close}
          >
            ✕
          </button>
        </div>

        <style>{`
          @keyframes slideUp {
            from {
              transform: translateX(-50%) translateY(100%);
              opacity: 0;
            }
            to {
              transform: translateX(-50%) translateY(0);
              opacity: 1;
            }
          }

          @keyframes pulse {
            0% {
              box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7);
            }
            70% {
              box-shadow: 0 0 0 10px rgba(99, 102, 241, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            * {
              animation: none !important;
            }
          }
        `}</style>
      </div>
    );
  }

  // フッターモード
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border)',
        padding: 'var(--space-3)',
        zIndex: 999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 'var(--space-2)',
      }}
    >
      <button
        onClick={handleInstall}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          background: 'none',
          border: 'none',
          color: 'var(--color-primary)',
          fontSize: 'var(--fs-2)',
          cursor: 'pointer',
          padding: 'var(--space-2)',
          borderRadius: 'var(--radius-xs)',
          transition: 'background var(--dur-fast) var(--ease)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--color-primary-alpha)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'none';
        }}
        aria-label={t.installHeading}
      >
        <span>📱</span>
        <span>{t.installHeading}</span>
      </button>
      <button
        onClick={handleDismissFooter}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: 'var(--fs-3)',
          color: 'var(--color-subtle)',
          padding: 'var(--space-2)',
          lineHeight: '1',
        }}
        aria-label={t.close}
      >
        ✕
      </button>
    </div>
  );
}
