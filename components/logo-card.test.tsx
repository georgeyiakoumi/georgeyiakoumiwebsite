import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LogoCard } from './logo-card';

const tallIcon = '<svg viewBox="0 0 54 80" aria-hidden="true" focusable="false"></svg>';

describe('LogoCard', () => {
  it('renders brand icons in a square card regardless of the logo proportions', () => {
    render(<LogoCard data={{ id: 1, name: 'Figma', icon: { light: tallIcon } }} />);
    expect(screen.getByRole('img', { name: 'Logo for Figma' })).toHaveClass('aspect-square');
  });

  it('leaves uploaded logos (e.g. company wordmarks) at their own proportions', () => {
    render(
      <LogoCard
        data={{ id: 2, name: 'Acme', image: { url: 'https://res.cloudinary.com/georgeyiakoumi/image/upload/v1/acme.png', ext: '.png' } }}
      />
    );
    expect(screen.getByRole('img', { name: 'Logo for Acme' })).not.toHaveClass('aspect-square');
  });
});
