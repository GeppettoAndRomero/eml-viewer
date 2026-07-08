/**
 * AppButton コンポーネント
 * 仕様: 5.5.1 ボタン
 */

import type { JSX } from 'preact';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface AppButtonProps {
  variant?: ButtonVariant;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: (e: JSX.TargetedMouseEvent<HTMLButtonElement>) => void;
  children: JSX.Element | string;
  ariaLabel?: string;
  className?: string;
}

export function AppButton({
  variant = 'primary',
  type = 'button',
  disabled = false,
  onClick,
  children,
  ariaLabel,
  className = '',
}: AppButtonProps) {
  return (
    <button
      type={type}
      class={`app-button app-button--${variant} ${className}`}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
