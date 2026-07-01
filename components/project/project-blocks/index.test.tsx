import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

// Mock next/dynamic to eagerly resolve the lazy component
vi.mock('next/dynamic', () => ({
  __esModule: true,
  default: (importFn: () => Promise<any>) => {
    const React = require('react');
    const Lazy = React.lazy(importFn);
    return function DynamicMock(props: any) {
      return React.createElement(React.Suspense, { fallback: null }, React.createElement(Lazy, props));
    };
  },
}));

import { ProjectBlockRenderer } from './index';

// Mock all block components to isolate the renderer logic
vi.mock('./rich-text-block', () => ({
  RichTextBlock: ({ block }: any) => <div data-testid="rich-text-block">{block.id}</div>,
}));
vi.mock('./image-block', () => ({
  ImageBlock: ({ block }: any) => <div data-testid="image-block">{block.id}</div>,
}));
vi.mock('./carousel-block', () => ({
  CarouselBlock: ({ block }: any) => <div data-testid="carousel-block">{block.id}</div>,
}));
vi.mock('./video-block', () => ({
  VideoBlock: ({ block }: any) => <div data-testid="video-block">{block.id}</div>,
}));
vi.mock('./comparison-slider-block', () => ({
  ComparisonSliderBlock: ({ block }: any) => <div data-testid="comparison-slider-block">{block.id}</div>,
}));
vi.mock('@/components/legacy/comparison-slider-block', () => ({
  ComparisonSliderBlock: ({ block }: any) => <div data-testid="legacy-comparison-slider-block">{block.id}</div>,
}));
vi.mock('./stats/index', () => ({
  StatsBlock: ({ block }: any) => <div data-testid="stats-block">{block.id}</div>,
}));
vi.mock('./code-block', () => ({
  CodeBlock: ({ block }: any) => <div data-testid="code-block">{block.id}</div>,
}));
vi.mock('./lottie-block', () => ({
  LottieBlock: ({ block }: any) => <div data-testid="lottie-block">{block.id}</div>,
}));
vi.mock('./figma-embed-block', () => ({
  FigmaEmbedBlock: ({ block }: any) => <div data-testid="figma-embed-block">{block.id}</div>,
}));

describe('ProjectBlockRenderer', () => {
  it('returns null for empty blocks', () => {
    const { container } = render(<ProjectBlockRenderer blocks={[]} projectTitle="Test" />);
    expect(container.innerHTML).toBe('');
  });

  it('renders rich-text block', () => {
    render(<ProjectBlockRenderer blocks={[{ __component: 'project-blocks.rich-text', id: 1 } as any]} projectTitle="Test" />);
    expect(screen.getByTestId('rich-text-block')).toBeInTheDocument();
  });

  it('renders image block', () => {
    render(<ProjectBlockRenderer blocks={[{ __component: 'project-blocks.image', id: 2 } as any]} projectTitle="Test" />);
    expect(screen.getByTestId('image-block')).toBeInTheDocument();
  });

  it('renders carousel block', () => {
    render(<ProjectBlockRenderer blocks={[{ __component: 'project-blocks.carousel', id: 3 } as any]} projectTitle="Test" />);
    expect(screen.getByTestId('carousel-block')).toBeInTheDocument();
  });

  it('renders video block', () => {
    render(<ProjectBlockRenderer blocks={[{ __component: 'project-blocks.video', id: 4 } as any]} projectTitle="Test" />);
    expect(screen.getByTestId('video-block')).toBeInTheDocument();
  });

  it('renders comparison-slider block', () => {
    render(<ProjectBlockRenderer blocks={[{ __component: 'project-blocks.comparison-slider', id: 5, legacy: false } as any]} projectTitle="Test" />);
    expect(screen.getByTestId('comparison-slider-block')).toBeInTheDocument();
  });

  it('renders legacy comparison-slider block when legacy flag is true', () => {
    render(<ProjectBlockRenderer blocks={[{ __component: 'project-blocks.comparison-slider', id: 6, legacy: true } as any]} projectTitle="Test" />);
    expect(screen.getByTestId('legacy-comparison-slider-block')).toBeInTheDocument();
  });

  it('renders stats block', async () => {
    render(<ProjectBlockRenderer blocks={[{ __component: 'project-blocks.stats', id: 7 } as any]} projectTitle="Test" />);
    await waitFor(() => expect(screen.getByTestId('stats-block')).toBeInTheDocument());
  });

  it('renders code-block', () => {
    render(<ProjectBlockRenderer blocks={[{ __component: 'project-blocks.code-block', id: 8 } as any]} projectTitle="Test" />);
    expect(screen.getByTestId('code-block')).toBeInTheDocument();
  });

  it('renders lottie block', async () => {
    render(<ProjectBlockRenderer blocks={[{ __component: 'project-blocks.lottie', id: 9 } as any]} projectTitle="Test" />);
    await waitFor(() => expect(screen.getByTestId('lottie-block')).toBeInTheDocument());
  });

  it('renders figma-embed block', () => {
    render(<ProjectBlockRenderer blocks={[{ __component: 'project-blocks.figma-embed', id: 10 } as any]} projectTitle="Test" />);
    expect(screen.getByTestId('figma-embed-block')).toBeInTheDocument();
  });

  it('returns null for unknown block types', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { container } = render(<ProjectBlockRenderer blocks={[{ __component: 'project-blocks.unknown', id: 99 } as any]} projectTitle="Test" />);
    expect(container.innerHTML).toBe('');
    expect(consoleSpy).toHaveBeenCalledWith('Unknown block type: project-blocks.unknown');
    consoleSpy.mockRestore();
  });

  it('renders multiple blocks in order', async () => {
    render(
      <ProjectBlockRenderer
        blocks={[
          { __component: 'project-blocks.rich-text', id: 1 } as any,
          { __component: 'project-blocks.image', id: 2 } as any,
          { __component: 'project-blocks.stats', id: 3 } as any,
        ]}
        projectTitle="Test"
      />
    );
    expect(screen.getByTestId('rich-text-block')).toBeInTheDocument();
    expect(screen.getByTestId('image-block')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByTestId('stats-block')).toBeInTheDocument());
  });
});
