import type { Meta, StoryObj } from "@storybook/nextjs";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";

/**
 * Image component with skeleton loading state and error fallback.
 * Wraps Next.js Image with automatic loading/error UI.
 */
const meta: Meta<typeof ImageWithFallback> = {
  title: "ui/ImageWithFallback",
  component: ImageWithFallback,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ImageWithFallback>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Successfully loaded image.
 */
export const Default: Story = {
  render: () => (
    <div className="w-96">
      <ImageWithFallback
        src="https://picsum.photos/800/600"
        alt="Sample image"
        width={800}
        height={600}
        className="w-full h-auto rounded-lg"
      />
    </div>
  ),
};

/**
 * Image with a broken source — shows the error fallback skeleton.
 */
export const ErrorState: Story = {
  render: () => (
    <div className="w-96">
      <ImageWithFallback
        src="/nonexistent-image.jpg"
        alt="Broken image"
        width={800}
        height={600}
        className="w-full h-auto rounded-lg"
        skeletonClassName="rounded-lg"
      />
    </div>
  ),
};

/**
 * Image using fill mode — parent controls dimensions.
 */
export const FillMode: Story = {
  render: () => (
    <div className="relative w-96 aspect-video">
      <ImageWithFallback
        src="https://picsum.photos/800/450"
        alt="Fill mode image"
        fill
        className="object-cover rounded-lg"
        skeletonClassName="rounded-lg"
      />
    </div>
  ),
};
