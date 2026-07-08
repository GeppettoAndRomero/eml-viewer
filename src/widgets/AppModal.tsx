/**
 * AppModal コンポーネント
 * 汎用モーダルウィンドウ
 */

import { useEffect } from 'preact/hooks';
import type { ComponentChildren } from 'preact';
import { ui } from '@/i18n/ui';

interface AppModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ComponentChildren;
  locale?: string;
}

export function AppModal({ isOpen, onClose, title, children, locale = 'en' }: AppModalProps) {
  const t = (ui as any)[locale] ?? ui.en;
  // ESCキーでクローズ
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // モーダルが開いている時はボディのスクロールを無効化
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 'var(--space-4)',
        animation: 'fadeIn 0.2s ease',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--color-bg)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-2)',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          animation: 'slideUp 0.3s ease',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 'var(--space-5)',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          <h2 style={{ margin: 0, fontSize: 'var(--fs-4)', fontWeight: 600 }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 'var(--fs-5)',
              cursor: 'pointer',
              color: 'var(--color-subtle)',
              padding: 'var(--space-2)',
              borderRadius: 'var(--radius-sm)',
              transition: 'background var(--dur-fast) var(--ease)',
              lineHeight: 1,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--color-surface)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'none';
            }}
            aria-label={t.close}
          >
            ×
          </button>
        </div>

        {/* コンテンツ */}
        <div style={{ padding: 'var(--space-5)' }}>
          {children}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
