import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

const theme = create({
  base: 'light',

  // Brand
  brandTitle: 'George Yiakoumi',
  brandUrl: 'https://georgeyiakoumi.com',
  brandImage: '/gy-logo.svg',
  brandTarget: '_blank',

  // UI
  appBg: '#fafafa',
  appContentBg: '#ffffff',
  appBorderColor: '#e4e4e7',
  appBorderRadius: 8,

  // Toolbar
  barBg: '#ffffff',
  barTextColor: '#71717a',
  barSelectedColor: '#09090b',
  barHoverColor: '#09090b',

  // Text
  textColor: '#09090b',
  textMutedColor: '#71717a',
  textInverseColor: '#fafafa',

  // Form
  inputBg: '#ffffff',
  inputBorder: '#e4e4e7',
  inputTextColor: '#09090b',
  inputBorderRadius: 6,

  // Colors
  colorPrimary: '#09090b',
  colorSecondary: '#3b82f6',

  // Typography
  fontBase: '"Inter", system-ui, -apple-system, sans-serif',
  fontCode: '"JetBrains Mono", "Fira Code", monospace',
});

addons.setConfig({
  theme,
});
