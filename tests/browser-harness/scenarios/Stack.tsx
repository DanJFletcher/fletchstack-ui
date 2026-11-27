import { Button } from '../../../src/components/button/Button';
import { Checkbox } from '../../../src/components/checkbox/Checkbox';
import { Container } from '../../../src/components/container/Container';
import { FormGroup } from '../../../src/components/form-group/FormGroup';
import { Stack } from '../../../src/components/stack/Stack';
import { Textarea } from '../../../src/components/textarea/Textarea';
import { TextInput } from '../../../src/components/text-input/TextInput';
import type { StackProps, StackStyle } from '../../../src/components/stack/Stack';
import type { Scenario } from '../gallery/types';
import { useState } from 'react';
import '../../../src/components/button/button.css';
import '../../../src/components/checkbox/checkbox.css';
import '../../../src/components/container/container.css';
import '../../../src/components/form-group/form-group.css';
import '../../../src/components/stack/stack.css';
import '../../../src/components/textarea/textarea.css';
import '../../../src/components/text-input/text-input.css';
import '../../../src/components/field/field.css';
import '../../../src/components/stack/stories/stack.stories.css';

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

const Playground: Scenario<StackProps> = {
  render: (args) => (
    <div className="stack stack-demo">
      <p>Outlined boxes are measurement guides. Stack supplies no padding or border.</p>
      <Stack {...args} data-testid="default-stack" />
    </div>
  ),
};

const Gaps: Scenario<StackProps> = {
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

const Alignments: Scenario<StackProps> = {
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

const Nested: Scenario<StackProps> = {
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

const ScopedOverrides: Scenario<StackProps> = {
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

const ResponsiveGap: Scenario<StackProps> = {
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

const FormComposition: Scenario<StackProps> = {
  render: () => (
    <div className="stack-demo">
      <Container size="reading">
        <SettingsForm />
      </Container>
    </div>
  ),
};

const BothThemes: Scenario<StackProps> = {
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

const LongContent: Scenario<StackProps> = {
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

const HiddenChildren: Scenario<StackProps> = {
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

const ConsumerMargins: Scenario<StackProps> = {
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

const NarrowParents: Scenario<StackProps> = {
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

const Hidden: Scenario<StackProps> = {
  args: { hidden: true },
  render: (args) => (
    <div>
      <p>The native hidden attribute suppresses Stack and its children.</p>
      <Stack {...args} />
    </div>
  ),
};

export const component = Stack;
export const defaults: StackProps = { children: <MeasurementItems /> };
export const scenarios = {
  Playground,
  Gaps,
  Alignments,
  Nested,
  ScopedOverrides,
  ResponsiveGap,
  FormComposition,
  BothThemes,
  LongContent,
  HiddenChildren,
  ConsumerMargins,
  NarrowParents,
  Hidden,
};
