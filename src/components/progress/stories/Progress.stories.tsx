import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Progress } from '../Progress';
import {
  ProgressControlled,
  ProgressExample,
  ProgressOverrides,
  ProgressSizes,
} from './progress-examples';

const meta = {
  id: 'components-progress',
  title: 'Components/Feedback/Progress',
  component: Progress,
  tags: ['autodocs'],
  args: { value: 33, label: 'Upload progress' },
  parameters: {
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Passive task completion with value/max, optional visible label and percentage text, small/medium/large thicknesses and scoped semantic overrides. Omit value or supply null for indeterminate work. Values clamp to 0..max; invalid max falls back to100. The root is an accessible progressbar with a forwarded HTMLDivElement ref and native props. aria-label or aria-labelledby can name an unlabeled bar. No timer, live region, focus stop or task management is installed. Unknown progress remains readable when reduced motion stops movement. Import tokens.css plus progress.css, or styles.css. See docs/progress.md for usage and types.',
      },
    },
  },
} satisfies Meta<typeof Progress>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Composition: Story = { render: () => <ProgressExample /> };
export const WithValue: Story = { args: { value: 56, showValue: true } };
export const Indeterminate: Story = {
  args: { value: null, label: 'Preparing files', showValue: true },
};
export const Controlled: Story = {
  render: () => <ProgressControlled />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Advance upload' }));
    await expect(canvas.getByRole('progressbar', { name: 'Upload progress' })).toHaveAttribute(
      'aria-valuenow',
      '50',
    );
    await expect(canvas.getByRole('slider', { name: 'Upload percentage' })).toHaveValue('50');
  },
};
export const CustomMax: Story = {
  args: { value: 3, max: 8, label: 'Files uploaded', showValue: true },
};
export const CustomValueLabel: Story = {
  args: {
    value: 3,
    max: 8,
    label: 'Files uploaded',
    showValue: true,
    getValueLabel: (value, max) => `${value} of ${max} files`,
  },
};
export const States: Story = {
  render: () => (
    <div className="stack">
      <Progress value={0} label="Not started" showValue />
      <Progress value={100} label="Complete" showValue />
    </div>
  ),
};
export const Sizes: Story = { render: () => <ProgressSizes /> };
export const Customization: Story = { render: () => <ProgressOverrides /> };
export const Rtl: Story = { args: { dir: 'rtl', value: 56, label: 'تقدم الرفع', showValue: true } };
export const LongLabel: Story = {
  args: {
    label: 'Preparing all workspace project documents for a complete export',
    showValue: true,
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 280 }}>
        <Story />
      </div>
    ),
  ],
};
export const Hidden: Story = { args: { hidden: true } };
