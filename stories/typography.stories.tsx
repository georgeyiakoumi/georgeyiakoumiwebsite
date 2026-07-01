import type { Meta, StoryObj } from "@storybook/nextjs";
import { Typography } from "@/components/ui/typography";

/**
 * The Typography component renders all text elements with consistent styling.
 * Use the `variant` prop to select the style and `as` to override the HTML element.
 */
const meta: Meta<typeof Typography> = {
  title: "ui/Typography",
  component: Typography,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "display", "h1", "h2", "h3", "h4", "h5", "h6",
        "p", "lead", "large", "small", "muted",
        "figcaption", "blockquote", "overline", "code",
      ],
    },
    align: {
      control: "select",
      options: ["left", "center", "right"],
    },
    as: {
      control: "select",
      options: ["h1", "h2", "h3", "h4", "h5", "h6", "p", "span", "div", "figcaption", "blockquote", "code"],
    },
  },
  args: {
    children: "The quick brown fox jumps over the lazy dog",
    variant: "p",
  },
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Typography>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Display: Story = {
  args: { variant: "display", children: "Display heading" },
};

export const Heading1: Story = {
  args: { variant: "h1", children: "Heading 1" },
};

export const Heading2: Story = {
  args: { variant: "h2", children: "Heading 2" },
};

export const Heading3: Story = {
  args: { variant: "h3", children: "Heading 3" },
};

export const Lead: Story = {
  args: { variant: "lead", children: "Lead text for introductory paragraphs" },
};

export const Muted: Story = {
  args: { variant: "muted", children: "Muted helper text" },
};

export const Overline: Story = {
  args: { variant: "overline", children: "Overline label" },
};

export const Blockquote: Story = {
  args: { variant: "blockquote", children: "A well-designed product built on the wrong assumption is still the wrong product." },
};

export const Code: Story = {
  args: { variant: "code", children: "const x = 42;" },
};

export const Figcaption: Story = {
  args: { variant: "figcaption", children: "Early moodboards and sketches, establishing the brand direction" },
};

/**
 * All variants displayed together for comparison.
 */
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4 max-w-2xl">
      <Typography variant="display">Display</Typography>
      <Typography variant="h1">Heading 1</Typography>
      <Typography variant="h2">Heading 2</Typography>
      <Typography variant="h3">Heading 3</Typography>
      <Typography variant="h4">Heading 4</Typography>
      <Typography variant="h5">Heading 5</Typography>
      <Typography variant="h6">Heading 6</Typography>
      <Typography variant="p">Paragraph — the default variant for body text with comfortable line height.</Typography>
      <Typography variant="lead">Lead text for introductions</Typography>
      <Typography variant="large">Large text</Typography>
      <Typography variant="small">Small text</Typography>
      <Typography variant="muted">Muted helper text</Typography>
      <Typography variant="overline">Overline label</Typography>
      <Typography variant="blockquote">Blockquote text</Typography>
      <Typography variant="code">inline code</Typography>
      <Typography variant="figcaption">Figcaption text</Typography>
    </div>
  ),
};
