import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Badge, Button, CheckIcon, Icon } from '../../../index';

const meta = {
  id: 'components-badge',
  title: 'Components/Feedback/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: { children: 'Draft' },
  argTypes: {
    tone: { control: 'select', options: ['neutral', 'info', 'success', 'warning', 'danger'] },
    icon: { control: false },
  },
  parameters: {
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Passive status, category, and exact-count pills. Visible text conveys meaning independently of color; optional artwork is decorative. No interaction, keyboard stop, or automatic live announcement. Use Button for removable tags. Consumers own surrounding labels and any necessary live region. Text wraps and grows at enlarged sizes.',
      },
    },
  },
} satisfies Meta<typeof Badge>;
export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Present the five semantic tones with meaningful visible labels.
 **/
function ToneExamples() {
  return (
    <div className="actions">
      <Badge>Draft</Badge>
      <Badge tone="info">New</Badge>
      <Badge tone="success" icon={<CheckIcon />}>
        Published
      </Badge>
      <Badge
        tone="warning"
        icon={
          <Icon>
            <path d="m12 3 10 18H2Z" />
            <path d="M12 9v4m0 3v1" />
          </Icon>
        }
      >
        Pending
      </Badge>
      <Badge
        tone="danger"
        icon={
          <Icon>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v6m0 3v1" />
          </Icon>
        }
      >
        Failed
      </Badge>
    </div>
  );
}

/**
 * Let the parent supply count context and decide when an update needs announcing.
 **/
function InboxExample() {
  const [count, setCount] = useState(12);

  return (
    <section className="stack" aria-label="Inbox example">
      <Button onClick={() => setCount((value) => value + 1)}>Receive message</Button>
      <p role="status" aria-live="polite" aria-atomic="true">
        Unread messages: <Badge>{count}</Badge>
      </p>
      <Button variant="secondary" onClick={() => setCount(0)}>
        Mark all read
      </Button>
    </section>
  );
}

export const Playground: Story = {};
export const Tones: Story = { render: () => <ToneExamples /> };
export const InContext: Story = {
  render: () => (
    <div className="stack">
      <p>
        Project overview <Badge tone="info">New</Badge>
      </p>
      <p>
        Release notes{' '}
        <Badge tone="success" icon={<CheckIcon />}>
          Published
        </Badge>
      </p>
      <p>
        Inbox <Badge>{12}</Badge>
      </p>
    </div>
  ),
};
export const Count: Story = {
  render: () => <InboxExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('status')).toHaveTextContent('Unread messages: 12');
    await userEvent.click(canvas.getByRole('button', { name: 'Receive message' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('Unread messages: 13');
    await userEvent.click(canvas.getByRole('button', { name: 'Mark all read' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('Unread messages: 0');
  },
};
export const BothThemes: Story = {
  render: () => (
    <div className="theme-grid">
      {(['corporate', 'luna'] as const).map((theme) => (
        <section key={theme} data-theme={theme} className="theme-panel stack">
          <h2>{theme}</h2>
          <ToneExamples />
          <p>
            Inbox <Badge>{12}</Badge>
          </p>
        </section>
      ))}
    </div>
  ),
};
export const Customization: Story = {
  args: {
    tone: 'success',
    children: 'Published',
    icon: <CheckIcon />,
    className: 'custom-badge',
    style: { '--fs-badge-padding-inline': '12px', '--fs-badge-icon-size': '16px' },
  },
};
export const LongLabel: Story = {
  args: {
    tone: 'warning',
    children: 'WaitingForApprovalFromEverySharedWorkspaceInThisProject',
    icon: <CheckIcon />,
  },
};
export const Hidden: Story = {
  args: { hidden: true },
  render: (args) => (
    <div>
      <p>The native hidden attribute suppresses this badge.</p>
      <Badge {...args} />
    </div>
  ),
};

export const PassiveSemantics: Story = {
  render: () => (
    <Badge
      {...({
        role: 'button',
        tabIndex: 0,
        'aria-live': 'polite',
        onClick: 'ignored',
        title: 'Imported status',
      } as unknown as import('../Badge').BadgeProps)}
    >
      Imported status
    </Badge>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Badge ignores interactive and live-region overrides from untyped integrations, while preserving native descriptive attributes.',
      },
    },
  },
};
