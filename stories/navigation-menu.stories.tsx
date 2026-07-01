import type { Meta, StoryObj } from "@storybook/nextjs";
import { User, Briefcase, Mail, Linkedin, Github } from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

/**
 * A collection of links for navigating websites. Supports both horizontal and vertical orientations
 * with custom positioning and responsive visibility controls.
 */
const meta = {
  title: "ui/NavigationMenu",
  component: NavigationMenu,
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "radio",
      options: ["horizontal", "vertical"],
      description: "Menu orientation",
    },
    viewport: {
      control: "boolean",
      description: "Show viewport indicator",
    },
  },
  args: {
    orientation: "horizontal",
    viewport: true,
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof NavigationMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default horizontal navigation menu.
 */
export const Default: Story = {
  render: (args) => (
    <NavigationMenu {...args}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            Overview
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            Documentation
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-96 p-2">
              <li>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  API Reference
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Getting Started
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Guides
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            className={navigationMenuTriggerStyle()}
            href="https://www.google.com"
            target="_blank"
          >
            External
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};

/**
 * Vertical navigation menu with icons, suitable for sidebar navigation.
 * Labels are hidden on mobile and shown on desktop.
 */
export const Vertical: Story = {
  args: {
    orientation: "vertical",
  },
  render: (args) => (
    <NavigationMenu {...args}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <a href="/">
              <User className="size-4" />
              <span>About</span>
            </a>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <a href="/projects">
              <Briefcase className="size-4" />
              <span>Projects</span>
            </a>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <a href="https://linkedin.com/in/georgeyiakoumi" target="_blank" rel="noopener noreferrer">
              <Linkedin className="size-4" />
              <span>LinkedIn</span>
            </a>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <a href="https://github.com/georgeyiakoumi" target="_blank" rel="noopener noreferrer">
              <Github className="size-4" />
              <span>GitHub</span>
            </a>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};
