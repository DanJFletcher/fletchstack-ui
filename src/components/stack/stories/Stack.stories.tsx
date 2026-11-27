import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import {
  Button,
  Checkbox,
  Container,
  FormGroup,
  Stack,
  Textarea,
  TextInput,
  type StackStyle,
} from '../../../index';
import './stack.stories.css';

const meta = {
  id: 'components-stack',
  title: 'Components/Layout/Stack',
  component: Stack,
  tags: ['autodocs'],
  args: {
    children: (
      <>
        <div className="stack-demo-item">One</div>
        <div className="stack-demo-item">Two</div>
        <div className="stack-demo-item">Three</div>
      </>
    ),
  },
  argTypes: {
    gap: { control: 'select', options: ['none', 'related', 'group', 'section'] },
    align: { control: 'select', options: ['stretch', 'start', 'center', 'end'] },
  },
  parameters: {
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Optional column flexbox for participating direct children, with related/group/section gaps using existing semantic variables directly, plus none. Logical cross-axis alignment preserves DOM and keyboard order. No padding, surface, border, fixed height, child-margin reset or clipping. Fields remain composed children. Responsive gaps are consumer CSS; Stack never becomes horizontal. Dashed outlines and measurement boxes are demonstration styles only.',
      },
    },
  },
} satisfies Meta<typeof Stack>;
export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Demonstrate direct participating children without inserting spacer nodes.
 **/
function MeasurementItems() {
  return (
    <>
      <div className="stack-demo-item">One</div>
      <div className="stack-demo-item">Two</div>
      <div className="stack-demo-item">Three</div>
    </>
  );
}

/**
 * Compose intact fields with native form submission and a consumer-owned status message.
 **/
function SettingsForm() {
  const [saved, setSaved] = useState(false);

  return (
    <form
      aria-label="Project settings"
      onSubmit={(event) => {
        event.preventDefault();
        setSaved(true);
      }}
    >
      <Stack gap="group">
        <header>
          <h2 className="stack-demo-copy">Project settings</h2>
          <p className="stack-demo-copy">
            Manage the name, description and notifications for your project.
          </p>
        </header>
        <TextInput
          label="Project name"
          name="project"
          defaultValue="Website refresh"
          helperText="Use a short, descriptive name."
          required
        />
        <Textarea
          label="Description"
          name="description"
          defaultValue="A clearer experience for everyone."
          helperText="Describe the goals of your project."
        />
        <FormGroup legend="Notifications" description="Choose how you would like to hear from us.">
          <Checkbox label="Email updates" name="email" defaultChecked />
        </FormGroup>
        <Stack align="start">
          <Button type="submit">Save changes</Button>
          <Button type="reset" variant="secondary">
            Reset form
          </Button>
        </Stack>
        {saved && (
          <p role="status" className="stack-demo-copy">
            Project settings saved.
          </p>
        )}
      </Stack>
    </form>
  );
}

export const Playground: Story = {
  render: (args) => (
    <div className="stack stack-demo">
      <p>Outlined boxes are measurement guides. Stack supplies no padding or border.</p>
      <Stack {...args} data-testid="default-stack" />
    </div>
  ),
};
export const Gaps: Story = {
  render: () => (
    <div className="theme-grid stack-demo">
      {(['none', 'related', 'group', 'section'] as const).map((gap) => (
        <section key={gap} className="stack">
          <h2>{gap}</h2>
          <Stack gap={gap} data-testid={`gap-${gap}`}>
            <MeasurementItems />
          </Stack>
        </section>
      ))}
    </div>
  ),
};
export const Alignments: Story = {
  render: () => (
    <div className="theme-grid stack-demo">
      {(['stretch', 'start', 'center', 'end'] as const).map((align) => (
        <section key={align} className="stack">
          <h2>{align}</h2>
          <Stack
            align={align}
            className="stack-demo-outline stack-align-box"
            data-testid={`align-${align}`}
          >
            <div className="stack-demo-item">One</div>
            <div className="stack-demo-item" style={{ inlineSize: '120px' }}>
              Two
            </div>
            <div className="stack-demo-item">Three</div>
          </Stack>
        </section>
      ))}
    </div>
  ),
};
export const Nested: Story = {
  render: () => (
    <div className="stack-demo">
      <p>
        Outer group relationships use 24px; inner related relationships use 16px. Guides are
        demonstration only.
      </p>
      <Stack gap="group" data-testid="outer-stack">
        <Stack data-testid="inner-stack">
          <MeasurementItems />
        </Stack>
        <div className="stack-demo-item">Outer sibling</div>
      </Stack>
    </div>
  ),
};
export const ScopedOverrides: Story = {
  render: () => (
    <div className="stack stack-demo">
      <p>
        Only the related role is overridden. Group remains independent; explicit nested themes reset
        roles.
      </p>
      <div className="stack" style={{ '--fs-space-gap-related': '32px' } as StackStyle}>
        <Stack data-testid="scoped-stack">
          <MeasurementItems />
        </Stack>
        <Stack gap="group" data-testid="independent-stack">
          <MeasurementItems />
        </Stack>
        <section data-theme="luna" className="theme-panel">
          <Stack data-testid="reset-stack">
            <MeasurementItems />
          </Stack>
        </section>
      </div>
      <Stack data-testid="sibling-stack">
        <MeasurementItems />
      </Stack>
    </div>
  ),
};
export const ResponsiveGap: Story = {
  render: () => (
    <div className="stack-demo">
      <p>
        Consumer CSS changes the section role to 32px at or below 600px; it is 64px above. Stack
        stays vertical.
      </p>
      <Stack gap="section" className="stack-responsive" data-testid="responsive-stack">
        <MeasurementItems />
      </Stack>
    </div>
  ),
};
export const FormComposition: Story = {
  render: () => (
    <div className="stack-demo">
      <Container size="reading">
        <SettingsForm />
      </Container>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.clear(canvas.getByRole('textbox', { name: 'Project name' }));
    await userEvent.type(
      canvas.getByRole('textbox', { name: 'Project name' }),
      'A simpler project',
    );
    await userEvent.click(canvas.getByRole('button', { name: 'Save changes' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('Project settings saved.');
    await expect(canvas.getByRole('textbox', { name: 'Project name' })).toHaveValue(
      'A simpler project',
    );
  },
};
export const BothThemes: Story = {
  render: () => (
    <div className="theme-grid stack-demo">
      {(['corporate', 'luna'] as const).map((theme) => (
        <section key={theme} data-theme={theme} className="theme-panel">
          <Stack gap="group">
            <h2 className="stack-demo-copy">{theme}</h2>
            <p className="stack-demo-copy">
              The surrounding theme supplies color. Stack stays transparent.
            </p>
            <Container gutters={false}>
              <SettingsForm />
            </Container>
          </Stack>
        </section>
      ))}
    </div>
  ),
};
export const LongContent: Story = {
  render: () => (
    <div className="stack-demo">
      <Container size="reading">
        <Stack data-testid="long-stack">
          <h2 className="stack-demo-copy">Project settings</h2>
          <p className="stack-demo-copy">
            Manage the details of your project, including descriptive names, clear navigation and
            notification preferences. Text wraps and children grow while Stack stays vertical.
          </p>
          <p className="stack-demo-copy">
            WorkspaceSettingsForEverySharedProjectAndEveryConnectedNotificationChannel
          </p>
          <Button>Review settings</Button>
        </Stack>
      </Container>
    </div>
  ),
};
export const HiddenChildren: Story = {
  render: () => (
    <div className="stack-demo">
      <p>
        Hidden and display:none children reserve no gap. A visibility:hidden item would still
        participate.
      </p>
      <Stack data-testid="hidden-children">
        <div className="stack-demo-item">First</div>
        <div hidden className="stack-demo-item">
          Hidden
        </div>
        <div style={{ display: 'none' }} className="stack-demo-item">
          Not displayed
        </div>
        <div className="stack-demo-item">Last</div>
      </Stack>
    </div>
  ),
};
export const ConsumerMargins: Story = {
  render: () => (
    <div className="stack-demo">
      <p>
        The first child owns an 8px bottom margin, so visible separation is the 16px gap plus 8px.
      </p>
      <Stack data-testid="margin-stack">
        <div className="stack-demo-item" style={{ marginBlockEnd: '8px' }}>
          First
        </div>
        <div className="stack-demo-item">Second</div>
      </Stack>
    </div>
  ),
};
export const NarrowParents: Story = {
  render: () => (
    <div className="stack stack-demo">
      <p>The parent owns its 240px width and 80px sibling. Each Stack can shrink.</p>
      <div className="stack-demo-narrow stack-demo-flex">
        <span className="stack-demo-fixed">Flex</span>
        <Stack data-testid="flex-stack">
          <div className="stack-demo-item">One</div>
          <div className="stack-demo-item">Two</div>
        </Stack>
      </div>
      <div className="stack-demo-narrow stack-demo-grid">
        <span>Grid</span>
        <Stack data-testid="grid-stack">
          <div className="stack-demo-item">One</div>
          <div className="stack-demo-item">Two</div>
        </Stack>
      </div>
    </div>
  ),
};
export const Hidden: Story = {
  args: { hidden: true },
  render: (args) => (
    <div>
      <p>The native hidden attribute suppresses Stack and its children.</p>
      <Stack {...args} />
    </div>
  ),
};
