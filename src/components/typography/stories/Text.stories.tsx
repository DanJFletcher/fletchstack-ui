import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Heading, Link, Stack, Text, type TextStyle } from '../../../index';
import './typography.stories.css';

const meta = {
  id: 'components-text', title: 'Components/Typography/Text', component: Text, tags: ['autodocs'],
  args: { children: 'Choose which updates arrive in your inbox.', as: 'p', size: 'body', tone: 'default' },
  argTypes: { as: { control: 'select', options: ['p', 'span'] }, size: { control: 'select', options: ['lead', 'body', 'small'] }, tone: { control: 'select', options: ['default', 'muted'] } },
  parameters: { a11y: { test: 'error' }, docs: { description: { component: 'Paragraph or inline span with lead/body/small sizes (1.125/1/0.875rem), 1.5 line height and default/muted tones. Defaults to p/body/default. No margins, truncation, width constraint, surface, live region or keyboard behavior. Use spans inside paragraphs, Link for navigation and native strong/em for emphasis. Parents own spacing. Muted text retains AA contrast in both themes.' } } },
} satisfies Meta<typeof Text>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Sizes: Story = { render: () => <Stack>{(['lead', 'body', 'small'] as const).map(size => <Text key={size} size={size} data-testid={`text-${size}`}>{size}: Choose which updates arrive in your inbox.</Text>)}</Stack> };
export const Tones: Story = { render: () => <Stack><Text>Manage your workspace.</Text><Text tone="muted">Updated yesterday.</Text></Stack> };
export const Inline: Story = {
  render: () => <Text data-testid="inline-paragraph">Review <Text as="span" tone="muted" data-testid="inline-copy">your workspace preferences</Text> and <strong>save changes</strong>. Read our <Link href="#inline-note">delivery guidance</Link>.<Text as="span" id="inline-note"> Preferences apply to this workspace.</Text></Text>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByTestId('inline-copy').tagName).toBe('SPAN');
    await expect(canvas.getByTestId('inline-paragraph').querySelector('p')).toBeNull();
    await expect(canvas.getByRole('link', { name: 'delivery guidance' })).toBeVisible();
  },
};
export const BothThemes: Story = { render: () => <div className="theme-grid">{(['corporate', 'luna'] as const).map(theme => <section key={theme} data-theme={theme} className="theme-panel" aria-label={`${theme} content`}><Stack><Heading>Project settings</Heading><Text size="lead">Manage your workspace.</Text><Text>Choose which updates arrive in your inbox.</Text><Text tone="muted" size="small">Updated yesterday</Text></Stack></section>)}</div> };
export const ScopedOverrides: Story = { render: () => <Stack><div style={{ '--fs-typography-text-font-body': '1.25rem', '--fs-typography-text-line-height': 2 } as TextStyle}><Text data-testid="outer-text">Scoped body text</Text><div data-theme="luna" className="theme-panel"><Text data-testid="reset-text">Nested theme body</Text></div></div><Text data-testid="sibling-text">Unaffected sibling</Text><Text size="small" data-testid="small-text">Independent small text</Text></Stack> };
export const LongContent: Story = { render: () => <div className="typography-demo-narrow"><Stack><Text size="lead">Readable content grows vertically and wraps as its parent becomes narrow.</Text><Text>UnbrokenIdentifierWithoutNaturalBreakOpportunities012345678901234567890123456789</Text><Text size="small" tone="muted">Supporting content remains visible when text is enlarged.</Text></Stack></div> };
export const Hidden: Story = { args: { hidden: true } };
