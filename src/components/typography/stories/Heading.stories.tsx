import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Button, Container, Heading, Link, Stack, Text, type HeadingStyle } from '../../../index';
import './typography.stories.css';

const meta = {
  id: 'components-heading', title: 'Components/Typography/Heading', component: Heading, tags: ['autodocs'],
  args: { children: 'Project settings', as: 'h2', size: 'section' },
  argTypes: { as: { control: 'select', options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }, size: { control: 'select', options: ['page', 'section', 'subheading'] } },
  parameters: { a11y: { test: 'error' }, docs: { description: { component: 'Native h1–h6 document semantics independent of page/section/subheading visual size (2/1.5/1.125rem, line height 1.25). Defaults to h2 and section. No margins, width constraint, surface, automatic heading order or keyboard behavior. Parents own spacing and reading width. Typography tokens inherit through scopes and reset at explicit themes.' } } },
} satisfies Meta<typeof Heading>;
export default meta;
type Story = StoryObj<typeof meta>;
const sizeLabels = { page: 'Project settings', section: 'Notifications', subheading: 'Email delivery' };

export const Playground: Story = {};
export const Sizes: Story = { render: () => <Stack>{(['page', 'section', 'subheading'] as const).map(size => <Heading key={size} as="h2" size={size} data-testid={`heading-${size}`}>{sizeLabels[size]}</Heading>)}</Stack> };
export const Levels: Story = {
  render: () => <Stack>{(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const).map(as => <Heading key={as} as={as} size="section">Document level {as.slice(1)}</Heading>)}</Stack>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const level of [1, 2, 3, 4, 5, 6]) {
      await expect(canvas.getByRole('heading', { level, name: `Document level ${level}` })).toBeVisible();
    }
  },
};
export const Composition: Story = {
  render: () => <Container size="reading"><Stack gap="group" data-testid="typography-composition"><Stack><Heading as="h1" size="page">Project settings</Heading><Text size="lead">Manage your workspace.</Text></Stack><Stack><Heading as="h2">Notifications</Heading><Heading as="h3" size="subheading">Email delivery</Heading><Text>Choose which updates arrive in your inbox.</Text><Text size="small" tone="muted">Updated yesterday</Text><Text id="notification-details">Delivery preferences apply to your current workspace.</Text><Link href="#notification-details">Read delivery guidance</Link><Button>Save changes</Button></Stack></Stack></Container>,
};
export const BothThemes: Story = { render: () => <div className="theme-grid">{(['corporate', 'luna'] as const).map(theme => <section key={theme} data-theme={theme} className="theme-panel" aria-label={`${theme} typography`}><Stack><Heading as="h2" size="page">Project settings</Heading><Text>Manage your workspace.</Text><Text size="small" tone="muted">Updated yesterday</Text></Stack></section>)}</div> };
export const ScopedOverrides: Story = { render: () => <Stack><Text>Only the outer heading changes. The nested explicit theme resets all typography roles.</Text><div style={{ '--fs-typography-heading-font-section': '2.5rem' } as HeadingStyle}><Heading data-testid="outer-heading">Scoped size</Heading><div data-theme="luna" className="theme-panel"><Heading data-testid="reset-heading">Nested theme</Heading></div></div><Heading data-testid="sibling-heading">Unaffected sibling</Heading><Heading as="h3" size="subheading" data-testid="independent-heading">Independent subheading</Heading></Stack> };
export const LongContent: Story = { render: () => <Container size="reading"><Stack data-testid="long-copy"><Heading as="h1" size="page">Project settings for international teams and accessibility preferences</Heading><Text size="lead">Choose which updates arrive in your inbox, including announcements across teams and workspaces.</Text><Heading as="h2">WorkspaceIdentifierWithoutAnyNaturalBreakOpportunities012345678901234567890123456789</Heading><Text>https://example.test/projects/VeryLongProjectIdentifierWithoutBreakOpportunities012345678901234567890123456789</Text><Text lang="ar" dir="rtl">إعدادات المشروع وإشعارات البريد الإلكتروني</Text></Stack></Container> };
export const NativeFocus: Story = {
  render: () => <Stack><Button>Before copy</Button><Heading>Project details</Heading><Text>Read the <Link href="#copy-destination">delivery guidance</Link> before continuing.</Text><Text id="copy-destination">Your preferences can be changed later.</Text><Button>After copy</Button></Stack>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Before copy' }));
    await userEvent.tab();
    await expect(canvas.getByRole('link', { name: 'delivery guidance' })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'After copy' })).toHaveFocus();
  },
};
export const Hidden: Story = { args: { hidden: true } };
