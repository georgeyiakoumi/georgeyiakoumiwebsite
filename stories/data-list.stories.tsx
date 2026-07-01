import type { Meta, StoryObj } from "@storybook/nextjs";
import { DataList } from "@/components/ui/data-list";
import { Badge } from "@/components/ui/badge";

/**
 * A compound component for rendering label-value pairs as a definition list.
 * Supports horizontal and vertical orientations, tooltips, wrap layout, and button values.
 */
const meta: Meta<typeof DataList> = {
  title: "ui/DataList",
  component: DataList,
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
  },
  args: {
    orientation: "horizontal",
  },
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof DataList>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Horizontal layout — labels on the left, values on the right.
 */
export const Horizontal: Story = {
  render: (args) => (
    <DataList {...args}>
      <DataList.Item>
        <DataList.Label label="Client" />
        <DataList.Value>Acme Corp</DataList.Value>
      </DataList.Item>
      <DataList.Item>
        <DataList.Label label="Role" />
        <DataList.Value>Product Designer</DataList.Value>
      </DataList.Item>
      <DataList.Item>
        <DataList.Label label="Duration" />
        <DataList.Value>6 months</DataList.Value>
      </DataList.Item>
    </DataList>
  ),
};

/**
 * Vertical layout — labels stacked above values.
 */
export const Vertical: Story = {
  args: { orientation: "vertical" },
  render: (args) => (
    <DataList {...args}>
      <DataList.Item>
        <DataList.Label label="Client" />
        <DataList.Value>Acme Corp</DataList.Value>
      </DataList.Item>
      <DataList.Item>
        <DataList.Label label="Role" />
        <DataList.Value>Product Designer</DataList.Value>
      </DataList.Item>
      <DataList.Item>
        <DataList.Label label="Duration" />
        <DataList.Value>6 months</DataList.Value>
      </DataList.Item>
    </DataList>
  ),
};

/**
 * Labels with tooltip help icons.
 */
export const WithTooltips: Story = {
  render: (args) => (
    <DataList {...args}>
      <DataList.Item>
        <DataList.Label label="Team" tooltip="People involved in this project" />
        <DataList.Value>4 designers, 2 engineers</DataList.Value>
      </DataList.Item>
      <DataList.Item>
        <DataList.Label label="Impact" tooltip="Measured outcomes after launch" />
        <DataList.Value>42% increase in conversion</DataList.Value>
      </DataList.Item>
    </DataList>
  ),
};

/**
 * Values with wrap layout for badge-style content.
 */
export const WrapLayout: Story = {
  render: (args) => (
    <DataList {...args}>
      <DataList.Item>
        <DataList.Label label="Tools" />
        <DataList.Value layout="wrap">
          <Badge variant="secondary">Figma</Badge>
          <Badge variant="secondary">Next.js</Badge>
          <Badge variant="secondary">TypeScript</Badge>
          <Badge variant="secondary">Tailwind</Badge>
          <Badge variant="secondary">Storybook</Badge>
        </DataList.Value>
      </DataList.Item>
    </DataList>
  ),
};

/**
 * Button values for link-style actions.
 */
export const WithButtons: Story = {
  render: (args) => (
    <DataList {...args}>
      <DataList.Item>
        <DataList.Label label="Links" />
        <DataList.Value layout="wrap">
          <DataList.Button href="https://example.com">Website</DataList.Button>
          <DataList.Button href="https://github.com">GitHub</DataList.Button>
        </DataList.Value>
      </DataList.Item>
    </DataList>
  ),
};
