import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { BrandIcon } from './brand-icon';

const light = '<svg data-testid="light"></svg>';
const dark = '<svg data-testid="dark"></svg>';

describe('BrandIcon', () => {
  it('renders a single icon when there is no dark variant', () => {
    const { container } = render(<BrandIcon icon={{ light }} className="size-4" />);
    const spans = container.querySelectorAll('span');
    expect(spans).toHaveLength(1);
    expect(spans[0]).toHaveClass('block', 'size-4');
    expect(spans[0]).not.toHaveClass('dark:hidden');
    expect(spans[0].innerHTML).toBe(light);
  });

  it('renders both variants and switches between them with CSS', () => {
    const { container } = render(<BrandIcon icon={{ light, dark }} />);
    const [lightSpan, darkSpan] = container.querySelectorAll('span');
    expect(lightSpan).toHaveClass('block', 'dark:hidden');
    expect(lightSpan.innerHTML).toBe(light);
    expect(darkSpan).toHaveClass('hidden', 'dark:block');
    expect(darkSpan.innerHTML).toBe(dark);
  });
});
