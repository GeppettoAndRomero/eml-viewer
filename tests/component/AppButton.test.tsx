// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/preact';
import { AppButton } from '@/widgets/AppButton';

describe('AppButton', () => {
  it('renders its label and variant class', () => {
    render(<AppButton variant="secondary">Go</AppButton>);
    const btn = screen.getByRole('button', { name: 'Go' });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveClass('app-button--secondary');
  });

  it('applies the aria-label when provided', () => {
    render(<AppButton ariaLabel="Convert now">X</AppButton>);
    expect(screen.getByRole('button', { name: 'Convert now' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<AppButton onClick={onClick}>Tap</AppButton>);
    fireEvent.click(screen.getByRole('button', { name: 'Tap' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('renders a disabled button when disabled (browser suppresses the click)', () => {
    render(
      <AppButton onClick={vi.fn()} disabled>
        Nope
      </AppButton>
    );
    // The component sets the native `disabled` attribute; the browser is what
    // suppresses clicks. jsdom's fireEvent bypasses that native behaviour, so we
    // assert the disabled state rather than simulating a no-op click.
    expect(screen.getByRole('button', { name: 'Nope' })).toBeDisabled();
  });
});
