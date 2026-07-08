/**
 * AppField コンポーネント
 * 仕様: 5.5.2 入力（TextField）
 */

import type { JSX } from 'preact';
import { ui } from '@/i18n/ui';

interface AppFieldProps {
  label: string;
  id: string;
  type?: 'text' | 'number' | 'email' | 'password';
  value: string | number;
  onChange: (value: string | number) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helpText?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  locale?: string;
}

export function AppField({
  label,
  id,
  type = 'text',
  value,
  onChange,
  required = false,
  disabled = false,
  error,
  helpText,
  placeholder,
  min,
  max,
  step,
  locale = 'en',
}: AppFieldProps) {
  const t = (ui as any)[locale] ?? ui.en;
  const handleInput = (e: JSX.TargetedEvent<HTMLInputElement>) => {
    const target = e.currentTarget;
    if (type === 'number') {
      onChange(target.valueAsNumber || 0);
    } else {
      onChange(target.value);
    }
  };

  return (
    <div class={`app-field ${error ? 'app-field--error' : ''}`}>
      <label class="app-field__label" for={id}>
        {label}
        {required && <span class="app-field__required">{t.required}</span>}
      </label>

      <input
        id={id}
        type={type}
        class="app-field__input"
        value={value}
        onInput={handleInput}
        disabled={disabled}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : helpText ? `${id}-help` : undefined}
      />

      {error && (
        <div id={`${id}-error`} class="app-field__error" role="alert">
          <span aria-hidden="true">⚠</span>
          {error}
        </div>
      )}

      {helpText && !error && (
        <div id={`${id}-help`} class="app-field__help">
          {helpText}
        </div>
      )}
    </div>
  );
}
