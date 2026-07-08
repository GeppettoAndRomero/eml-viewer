/**
 * GlobalDropZone コンポーネント
 * サイト全体でファイルのドラッグ&ドロップを受け付ける
 */

import { useState, useEffect } from 'preact/hooks';
import { ui } from '@/i18n/ui';

interface GlobalDropZoneProps {
  locale?: string;
}

export function GlobalDropZone({ locale = 'en' }: GlobalDropZoneProps) {
  const t = (ui as any)[locale] ?? ui.en;
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileCount, setFileCount] = useState(0);

  useEffect(() => {
    let dragCounter = 0;

    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      dragCounter++;
      if (dragCounter === 1) {
        setIsDragging(true);
      }
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      dragCounter--;
      if (dragCounter === 0) {
        setIsDragging(false);
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      dragCounter = 0;
      setIsDragging(false);

      const files = Array.from(e.dataTransfer?.files || []);
      if (files.length > 0) {
        // 処理中状態に移行
        setIsProcessing(true);
        setFileCount(files.length);

        // カスタムイベントを発火してファイルを送信
        window.dispatchEvent(
          new CustomEvent('filesDropped', { detail: files })
        );
      }
    };

    // ファイル処理完了イベントを受信
    const handleFilesProcessed = () => {
      setIsProcessing(false);
      setFileCount(0);
    };

    // クリップボードからのペーストを処理
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      const files: File[] = [];
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        // ファイルのみ対象（テキストは除外）
        if (item.kind === 'file') {
          const file = item.getAsFile();
          if (file) {
            files.push(file);
          }
        }
      }

      if (files.length > 0) {
        e.preventDefault();

        // 処理中状態に移行
        setIsProcessing(true);
        setFileCount(files.length);

        // 既存のドロップと同じフローに流す
        window.dispatchEvent(
          new CustomEvent('filesDropped', { detail: files })
        );
      }
    };

    // bodyにイベントリスナーを追加
    document.body.addEventListener('dragenter', handleDragEnter);
    document.body.addEventListener('dragleave', handleDragLeave);
    document.body.addEventListener('dragover', handleDragOver);
    document.body.addEventListener('drop', handleDrop);
    window.addEventListener('filesProcessed', handleFilesProcessed);
    document.addEventListener('paste', handlePaste);

    return () => {
      document.body.removeEventListener('dragenter', handleDragEnter);
      document.body.removeEventListener('dragleave', handleDragLeave);
      document.body.removeEventListener('dragover', handleDragOver);
      document.body.removeEventListener('drop', handleDrop);
      window.removeEventListener('filesProcessed', handleFilesProcessed);
      document.removeEventListener('paste', handlePaste);
    };
  }, []);

  // ドラッグ中でも処理中でもない場合は非表示
  if (!isDragging && !isProcessing) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'var(--color-primary-alpha)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        animation: 'fadeIn 0.2s ease',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-4)',
          padding: 'var(--space-6)',
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-md)',
          border: '3px dashed var(--color-primary)',
          boxShadow: 'var(--shadow-2)',
        }}
      >
        {isProcessing ? (
          <>
            <div style={{ fontSize: '4rem', lineHeight: 1, animation: 'spin 1s linear infinite' }}>⏳</div>
            <div
              style={{
                fontSize: 'var(--fs-4)',
                fontWeight: 600,
                color: 'var(--color-text)',
                textAlign: 'center',
              }}
            >
              {t.dzProcessing.replace('{count}', String(fileCount))}
            </div>
            <div
              style={{
                fontSize: 'var(--fs-2)',
                color: 'var(--color-subtle)',
                textAlign: 'center',
              }}
            >
              {t.dzPleaseWait}
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: '4rem', lineHeight: 1 }}>📁</div>
            <div
              style={{
                fontSize: 'var(--fs-4)',
                fontWeight: 600,
                color: 'var(--color-text)',
                textAlign: 'center',
              }}
            >
              {t.dzDropTitle}
            </div>
            <div
              style={{
                fontSize: 'var(--fs-2)',
                color: 'var(--color-subtle)',
                textAlign: 'center',
              }}
            >
              {t.dzDropSub}
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
