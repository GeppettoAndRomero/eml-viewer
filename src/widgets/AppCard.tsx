/**
 * AppCard コンポーネント
 * 仕様: 5.5.3 カード/セクション
 */

import type { ComponentChildren } from 'preact';

interface AppCardProps {
  title?: string;
  description?: string;
  children: ComponentChildren;
  className?: string;
}

export function AppCard({ title, description, children, className = '' }: AppCardProps) {
  return (
    <div class={`app-card ${className}`}>
      {(title || description) && (
        <div class="app-card__header">
          {title && <h3 class="app-card__title">{title}</h3>}
          {description && <p class="app-card__description">{description}</p>}
        </div>
      )}
      {children}
    </div>
  );
}
