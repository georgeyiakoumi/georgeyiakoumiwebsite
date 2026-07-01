import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ImageWithFallback } from './image-with-fallback';

// Mock next/image to render a standard img element
vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => {
    const { fill, priority, fetchPriority, blurDataURL, placeholder, ...rest } = props;
    return <img data-fill={fill} data-priority={priority} {...rest} />;
  },
}));

describe('ImageWithFallback', () => {
  const defaultProps = {
    src: '/test.jpg',
    alt: 'Test image',
    width: 800,
    height: 600,
  };

  it('should render the image with correct props', () => {
    render(<ImageWithFallback {...defaultProps} />);
    const img = screen.getByRole('img', { name: /test image/i });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/test.jpg');
  });

  it('should show skeleton overlay while loading', () => {
    render(<ImageWithFallback {...defaultProps} />);
    const wrapper = screen.getByRole('img', { name: /test image/i }).closest('span');
    expect(wrapper).not.toBeNull();
    const skeletonEl = wrapper?.querySelector('[data-slot="skeleton"]');
    expect(skeletonEl).not.toBeNull();
  });

  it('should hide skeleton after image loads', () => {
    render(<ImageWithFallback {...defaultProps} />);
    const img = screen.getByRole('img', { name: /test image/i });

    fireEvent.load(img);

    const wrapper = img.closest('span');
    const skeletonEl = wrapper?.querySelector('[data-slot="skeleton"]');
    expect(skeletonEl).toBeNull();
  });

  it('should show error state on image error', () => {
    render(<ImageWithFallback {...defaultProps} />);
    const img = screen.getByRole('img', { name: /test image/i });

    fireEvent.error(img);

    // Image should be removed, skeleton should remain without animation
    const wrapper = img.closest('span') || document.body;
    const skeletonEl = wrapper.querySelector('[data-slot="skeleton"]');
    expect(skeletonEl).not.toBeNull();
    expect(skeletonEl).toHaveClass('animate-none');
  });

  it('should skip skeleton for priority images', () => {
    render(<ImageWithFallback {...defaultProps} priority />);
    const img = screen.getByRole('img', { name: /test image/i });
    const wrapper = img.closest('span');
    const skeletonEl = wrapper?.querySelector('[data-slot="skeleton"]');
    expect(skeletonEl).toBeNull();
  });

  it('should pass through additional props', () => {
    render(
      <ImageWithFallback {...defaultProps} data-testid="custom" draggable={false} />
    );
    const img = screen.getByTestId('custom');
    expect(img).toHaveAttribute('draggable', 'false');
  });

  it('should call onLoad callback', () => {
    const handleLoad = vi.fn();
    render(<ImageWithFallback {...defaultProps} onLoad={handleLoad} />);
    const img = screen.getByRole('img', { name: /test image/i });

    fireEvent.load(img);

    expect(handleLoad).toHaveBeenCalledTimes(1);
  });

  it('should call onError callback', () => {
    const handleError = vi.fn();
    render(<ImageWithFallback {...defaultProps} onError={handleError} />);
    const img = screen.getByRole('img', { name: /test image/i });

    fireEvent.error(img);

    expect(handleError).toHaveBeenCalledTimes(1);
  });

  it('should render in fill mode when fill prop is provided', () => {
    render(
      <div style={{ position: 'relative', width: 200, height: 200 }}>
        <ImageWithFallback src="/test.jpg" alt="Fill image" fill />
      </div>
    );
    const img = screen.getByRole('img', { name: /fill image/i });
    expect(img).toHaveAttribute('data-fill', 'true');
  });
});
