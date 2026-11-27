import { useState } from 'react';
import { Badge } from '../../../src/components/badge/Badge';
import { Button } from '../../../src/components/button/Button';
import { CheckIcon } from '../../../src/components/icon/named/CheckIcon';
import { Icon } from '../../../src/components/icon/Icon';
import type { BadgeProps } from '../../../src/components/badge/Badge';
import type { Scenario } from '../gallery/types';
import '../../../src/components/badge/badge.css';
import '../../../src/components/button/button.css';
import '../../../src/components/icon/icon.css';

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

const Tones: Scenario<BadgeProps> = { render: () => <ToneExamples /> };

const Count: Scenario<BadgeProps> = { render: () => <InboxExample /> };

const Customization: Scenario<BadgeProps> = {
  args: {
    tone: 'success',
    children: 'Published',
    icon: <CheckIcon />,
    className: 'custom-badge',
    style: { '--fs-badge-padding-inline': '12px', '--fs-badge-icon-size': '16px' },
  },
};

const LongLabel: Scenario<BadgeProps> = {
  args: {
    tone: 'warning',
    children: 'WaitingForApprovalFromEverySharedWorkspaceInThisProject',
    icon: <CheckIcon />,
  },
};

const Hidden: Scenario<BadgeProps> = {
  args: { hidden: true },
  render: (args) => (
    <div>
      <p>The native hidden attribute suppresses this badge.</p>
      <Badge {...args} />
    </div>
  ),
};

const PassiveSemantics: Scenario<BadgeProps> = {
  render: () => (
    <Badge
      {...({
        role: 'button',
        tabIndex: 0,
        'aria-live': 'polite',
        onClick: 'ignored',
        title: 'Imported status',
      } as unknown as BadgeProps)}
    >
      Imported status
    </Badge>
  ),
};

export const component = Badge;
export const defaults: BadgeProps = { children: 'Draft' };
export const scenarios = { Tones, LongLabel, Count, Customization, Hidden, PassiveSemantics };
