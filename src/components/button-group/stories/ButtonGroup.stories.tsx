import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import {
  Button,
  ButtonGroup,
  Container,
  Heading,
  Stack,
  Text,
  type ButtonGroupStyle,
} from '../../../index';
import './button-group.stories.css';

/**
 * Return direct native action components for layout demonstrations.
 **/
function actions() {
  return ['Save draft', 'Preview', 'Publish'].map((label) => <Button key={label}>{label}</Button>);
}

const meta = {
  id: 'components-button-group',
  title: 'Components/Actions/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
  args: {
    'aria-label': 'Page actions',
    children: actions(),
    appearance: 'separated',
    orientation: 'horizontal',
    align: 'start',
    wrap: true,
    fullWidth: false,
    equalWidth: false,
    disabled: false,
  },
  argTypes: {
    appearance: { control: 'select', options: ['separated', 'joined'] },
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    align: { control: 'select', options: ['start', 'center', 'end'] },
    size: { control: 'select', options: ['small', 'medium', 'large'] },
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost'] },
    children: { control: false },
  },
  parameters: {
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'A named group of direct Button actions. Requires aria-label or aria-labelledby; prefer a visible heading. Defaults: horizontal, separated, wrapping, start aligned. Reuses action gaps and Button geometry, without surface or outer padding. Each Button remains a native Tab stop; this is not a toolbar or selection group. Child size/variant override group defaults; group disabled always wins. Joined groups ignore wrap. equalWidth divides each row equally, including the final row; vertical joins stretch to maintain shared edges. Native hidden and omitted Buttons retain correct corners; use hidden rather than arbitrary display:none CSS. Load button.css and button-group.css with tokens, or combined styles. Use Cluster for general wrapping content.',
      },
    },
  },
} satisfies Meta<typeof ButtonGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Joined: Story = { args: { appearance: 'joined', variant: 'secondary' } };
export const VerticalJoins: Story = {
  args: { appearance: 'joined', orientation: 'vertical', variant: 'secondary' },
};
export const Wrapping: Story = {
  render: () => (
    <Stack>
      <Text>Same actions, different parent widths. Outlines belong to demonstration parents.</Text>
      <div className="button-group-demo-wide">
        <ButtonGroup aria-label="Wide actions" variant="secondary">
          {actions()}
        </ButtonGroup>
      </div>
      <div className="button-group-demo-narrow">
        <ButtonGroup aria-label="Narrow actions" variant="secondary">
          {actions()}
        </ButtonGroup>
      </div>
      <div className="button-group-demo-narrow">
        <ButtonGroup aria-label="Unwrapped actions" wrap={false} variant="secondary">
          {actions()}
        </ButtonGroup>
      </div>
    </Stack>
  ),
};
export const Widths: Story = {
  render: () => (
    <Stack>
      {[
        { fullWidth: false, equalWidth: false, name: 'Intrinsic' },
        { fullWidth: true, equalWidth: false, name: 'Full width' },
        { fullWidth: true, equalWidth: true, name: 'Equal width' },
      ].map((props) => (
        <div className="button-group-demo-wide" key={props.name}>
          <ButtonGroup
            aria-label={props.name}
            fullWidth={props.fullWidth}
            equalWidth={props.equalWidth}
            variant="secondary"
          >
            {actions()}
          </ButtonGroup>
        </div>
      ))}
      <div className="button-group-demo-last-row">
        <ButtonGroup aria-label="Equal wrapped rows" fullWidth equalWidth variant="secondary">
          {['One', 'Two', 'Three', 'Four', 'Five'].map((label) => (
            <Button key={label}>{label}</Button>
          ))}
        </ButtonGroup>
      </div>
      <div className="button-group-demo-wide">
        <ButtonGroup
          aria-label="Equal column"
          orientation="vertical"
          fullWidth
          equalWidth
          variant="secondary"
        >
          {actions()}
        </ButtonGroup>
      </div>
    </Stack>
  ),
};
export const Alignments: Story = {
  render: () => (
    <Stack>
      {(['horizontal', 'vertical'] as const).flatMap((orientation) =>
        (['start', 'center', 'end'] as const).map((align) => (
          <div key={`${orientation}-${align}`} className="button-group-demo-wide">
            <ButtonGroup
              aria-label={`${orientation} ${align}`}
              orientation={orientation}
              align={align}
              fullWidth
              variant="secondary"
            >
              {actions()}
            </ButtonGroup>
          </div>
        )),
      )}
    </Stack>
  ),
};
export const ChildOverrides: Story = {
  render: () => (
    <ButtonGroup aria-label="Default and custom actions" size="large" variant="secondary">
      <Button>Inherited</Button>
      <Button size="small" variant="ghost">
        Explicit
      </Button>
      <Button disabled>Unavailable</Button>
    </ButtonGroup>
  ),
};
export const DisabledActions: Story = {
  args: { appearance: 'joined', disabled: true },
  render: (args) => (
    <Stack>
      <ButtonGroup {...args}>
        <Button disabled={false}>Save draft</Button>
        <Button>Preview</Button>
        <Button disabled>Publish</Button>
      </ButtonGroup>
      <ButtonGroup aria-label="Independently disabled actions">
        <Button>Save</Button>
        <Button disabled>Delete</Button>
      </ButtonGroup>
    </Stack>
  ),
};
export const VisibleLabel: Story = {
  render: () => (
    <Stack>
      <Heading id="document-actions">Document actions</Heading>
      <ButtonGroup aria-labelledby="document-actions" variant="secondary">
        {actions()}
      </ButtonGroup>
    </Stack>
  ),
};
export const BothThemes: Story = {
  render: () => (
    <div className="theme-grid">
      {(['corporate', 'luna'] as const).map((theme) => (
        <section key={theme} data-theme={theme} className="theme-panel">
          <Stack>
            <Heading>{theme} actions</Heading>
            <ButtonGroup aria-label={`${theme} separated actions`} variant="secondary">
              {actions()}
            </ButtonGroup>
            <ButtonGroup
              aria-label={`${theme} joined actions`}
              appearance="joined"
              variant="secondary"
            >
              {actions()}
            </ButtonGroup>
          </Stack>
        </section>
      ))}
    </div>
  ),
};
export const JoinedFocus: Story = {
  args: { appearance: 'joined', variant: 'secondary' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Save draft' }));
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Preview' })).toHaveFocus();
  },
};
export const RTL: Story = {
  render: () => (
    <div dir="rtl">
      <ButtonGroup aria-label="RTL actions" appearance="joined" variant="secondary">
        {actions()}
      </ButtonGroup>
    </div>
  ),
};
export const HiddenEdges: Story = { render: () => <HiddenActions /> };
export const Composition: Story = { render: () => <Editor /> };
export const ScopedGap: Story = {
  render: () => (
    <Stack>
      <div style={{ '--fs-space-gap-actions': '20px' } as ButtonGroupStyle}>
        <ButtonGroup aria-label="Scoped actions">{actions()}</ButtonGroup>
        <div data-theme="luna" className="theme-panel">
          <ButtonGroup aria-label="Reset actions">{actions()}</ButtonGroup>
        </div>
      </div>
      <ButtonGroup aria-label="Sibling actions">{actions()}</ButtonGroup>
    </Stack>
  ),
};
export const LongLabels: Story = {
  render: () => (
    <Container>
      <Stack>
        <Heading>Workspace publishing actions</Heading>
        <ButtonGroup aria-label="Long separated labels" variant="secondary">
          <Button>Save a draft for the international editorial team</Button>
          <Button>Preview pending changes before publishing</Button>
          <Button>Publish workspace announcement</Button>
        </ButtonGroup>
        <ButtonGroup
          aria-label="Long joined labels"
          appearance="joined"
          variant="secondary"
          fullWidth
          equalWidth
        >
          <Button>Save the latest draft</Button>
          <Button>Preview changes</Button>
          <Button>Publish announcement</Button>
        </ButtonGroup>
      </Stack>
    </Container>
  ),
};
export const Hidden: Story = { args: { hidden: true } };

/**
 * Toggle hidden edge and interior actions to demonstrate live seam recalculation.
 **/
function HiddenActions() {
  const [showEdges, setShowEdges] = useState(false);

  return (
    <Stack>
      <Button onClick={() => setShowEdges(!showEdges)}>Toggle edge actions</Button>
      {(['horizontal', 'vertical'] as const).map((orientation) => (
        <ButtonGroup
          key={orientation}
          aria-label={`Hidden ${orientation} edges`}
          appearance="joined"
          orientation={orientation}
          variant="secondary"
        >
          <Button hidden={!showEdges}>First</Button>
          <Button>Copy</Button>
          <Button hidden>Hidden middle</Button>
          <Button>Export</Button>
          <Button hidden={!showEdges}>Last</Button>
          {showEdges && <Button>Optional</Button>}
        </ButtonGroup>
      ))}
      <ButtonGroup aria-label="Single visible action" appearance="joined" variant="secondary">
        <Button hidden>Before</Button>
        <Button>Only action</Button>
        <Button hidden>After</Button>
      </ButtonGroup>
    </Stack>
  );
}

/**
 * Exercise action handlers and external native submit/reset form association.
 **/
function Editor() {
  const [status, setStatus] = useState('No action yet');

  return (
    <Container size="reading">
      <Stack>
        <Heading as="h1" size="page">
          Publish article
        </Heading>
        <form
          id="article"
          onSubmit={(event) => {
            event.preventDefault();
            setStatus('Published');
          }}
          onReset={() => setStatus('Reset')}
        >
          <label htmlFor="article-title">Article title</label>
          <input id="article-title" name="title" defaultValue="Draft article" />
        </form>
        <Heading id="editor-actions">Article actions</Heading>
        <ButtonGroup aria-labelledby="editor-actions" variant="secondary">
          <Button onClick={() => setStatus('Draft saved')}>Save draft</Button>
          <Button onClick={() => setStatus('Preview opened')}>Preview</Button>
          <Button variant="primary" type="submit" form="article">
            Publish
          </Button>
          <Button type="reset" form="article">
            Reset
          </Button>
        </ButtonGroup>
        <Text role="status">{status}</Text>
      </Stack>
    </Container>
  );
}
