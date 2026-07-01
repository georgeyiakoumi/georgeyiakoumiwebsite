import type { Meta, StoryObj } from "@storybook/nextjs";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNavigation,
} from "@/components/ui/carousel";

/**
 * A carousel with motion and swipe built using Embla.
 * Supports peek (mobile) and fade (desktop) variants via ResponsiveCarousel,
 * or standalone usage with inline/overlay navigation.
 */
const meta: Meta<typeof Carousel> = {
  title: "ui/Carousel",
  component: Carousel,
  tags: ["autodocs"],
  argTypes: {
    fade: {
      control: "boolean",
      description: "Enable fade transition instead of slide",
    },
    navigation: {
      control: "select",
      options: [undefined, "inline", "overlay"],
      description: "Navigation variant",
    },
  },
  args: {
    className: "w-full max-w-xs",
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Carousel>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Default carousel with inline navigation below.
 */
export const Default: Story = {
  render: (args) => (
    <Carousel {...args} navigation="inline">
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} index={index}>
            <div className="bg-card flex aspect-square items-center justify-center rounded border p-6">
              <span className="text-4xl font-semibold">{index + 1}</span>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  ),
};

/**
 * Carousel with overlay navigation (pill in top-right corner).
 */
export const Overlay: Story = {
  render: (args) => (
    <Carousel {...args} navigation="overlay" className="relative w-full max-w-xs">
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} index={index}>
            <div className="bg-card flex aspect-square items-center justify-center rounded border p-6">
              <span className="text-4xl font-semibold">{index + 1}</span>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  ),
};

/**
 * Carousel with fade transition enabled.
 */
export const Fade: Story = {
  render: (args) => (
    <Carousel {...args} fade navigation="overlay" className="relative w-full max-w-xs">
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} index={index}>
            <div className="bg-card flex aspect-square items-center justify-center rounded border p-6">
              <span className="text-4xl font-semibold">{index + 1}</span>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  ),
};
