import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Container,
  TextInput,
  type ContainerStyle,
} from '../../../index';
import './container.stories.css';

const meta = {
  id: 'components-container',
  title: 'Components/Layout/Container',
  component: Container,
  tags: ['autodocs'],
  args: { children: <p>Content fills its parent up to the selected maximum width.</p> },
  argTypes: {
    size: { control: 'select', options: ['reading', 'content', 'wide'] },
    gutters: { control: 'boolean' },
  },
  parameters: {
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Optional centered border-box page widths: reading 720px, content 1120px (default), wide 1440px. Gutters are 16px below 600px viewport width and 24px from 600px. Parents own vertical spacing and section semantics; children own layout and overflow handling. No surface, vertical padding, focus stop, or automatic stacking. Reading is a width preset, not guaranteed text measure. Dashed guides are demonstration styles only; the preview supplies surrounding spacing.',
      },
    },
  },
} satisfies Meta<typeof Container>;
export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Compose existing components while ordinary child wrappers supply their layout.
 **/
function ProjectContent() {
  return (
    <div className="container-content">
      <div>
        <h2>Project overview</h2>
        <p>Everything you need to move your project forward.</p>
      </div>
      <div className="container-grid">
        <Card>
          <CardHeader>
            <CardTitle as="h3">Project details</CardTitle>
          </CardHeader>
          <CardContent>
            <TextInput
              label="Project name"
              defaultValue="Website refresh"
              helperText="Use a short, descriptive name."
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle as="h3">Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Choose clear navigation and readable content for every screen.</p>
          </CardContent>
        </Card>
      </div>
      <div className="actions">
        <Button>Save changes</Button>
        <Button variant="secondary">Cancel</Button>
      </div>
    </div>
  );
}

export const Playground: Story = {
  render: (args) => (
    <div className="stack container-guide">
      <p>Dashed outline: demonstration guide, not a Container border.</p>
      <Container {...args} />
    </div>
  ),
};
export const WidthPresets: Story = {
  render: () => (
    <div className="stack">
      <p>
        Dashed outlines show outer boxes including gutters. Reading does not guarantee optimal text
        line length.
      </p>
      {(['reading', 'content', 'wide'] as const).map((size) => (
        <section key={size} className="stack container-guide">
          <h2>{size}</h2>
          <Container size={size} data-testid={`preset-${size}`}>
            <p>The maximum is a limit, not a fixed width.</p>
          </Container>
        </section>
      ))}
    </div>
  ),
};
export const ResponsiveGutters: Story = {
  render: () => (
    <div className="stack container-guide">
      <p>
        Resize the viewport: gutters are 16px below 600px and 24px from 600px. The preview owns
        surrounding space.
      </p>
      <Container data-testid="responsive-container">
        <div className="container-content">
          <h2>Project overview</h2>
          <p>Content wraps naturally while the border-box width includes gutters.</p>
        </div>
      </Container>
    </div>
  ),
};
export const WithoutGutters: Story = {
  render: () => (
    <div className="stack container-inset container-guide">
      <p>This parent already supplies inset. Container adds no second gutter.</p>
      <Container gutters={false} data-testid="without-gutters">
        <ProjectContent />
      </Container>
    </div>
  ),
};
export const Nesting: Story = {
  render: () => (
    <div className="stack container-guide">
      <p>
        Only the outer Container supplies gutters. The inner reading preset retains its own maximum
        and centering.
      </p>
      <Container data-testid="outer-container">
        <div className="stack">
          <h2>Project overview</h2>
          <Container size="reading" gutters={false} data-testid="inner-container">
            <p>A nested reading region without doubled inline padding.</p>
          </Container>
        </div>
      </Container>
    </div>
  ),
};
export const TokenOverrides: Story = {
  render: () => (
    <div className="stack">
      <p>
        Scoped maximum/gutter overrides inherit; explicit nested themes restore defaults. Guides
        belong to this demo.
      </p>
      <div
        className="stack container-guide"
        style={
          {
            '--fs-container-max-width-content': '800px',
            '--fs-container-gutter-small': '8px',
            '--fs-container-gutter-large': '32px',
          } as ContainerStyle
        }
      >
        <Container data-testid="scoped-container">
          <p>800px maximum with scoped gutters.</p>
        </Container>
        <section data-theme="luna" className="theme-panel container-guide">
          <Container data-testid="reset-container">
            <p>Nested Luna resets maximum and gutters.</p>
          </Container>
        </section>
      </div>
      <div className="container-guide">
        <Container data-testid="sibling-container">
          <p>Sibling keeps its theme defaults.</p>
        </Container>
      </div>
    </div>
  ),
};
export const Composition: Story = {
  render: () => (
    <section aria-label="Project settings">
      <Container>
        <ProjectContent />
      </Container>
    </section>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.clear(canvas.getByRole('textbox', { name: 'Project name' }));
    await userEvent.type(
      canvas.getByRole('textbox', { name: 'Project name' }),
      'A simpler experience',
    );
    await expect(canvas.getByRole('textbox', { name: 'Project name' })).toHaveValue(
      'A simpler experience',
    );
    await userEvent.click(canvas.getByRole('button', { name: 'Save changes' }));
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Cancel' })).toHaveFocus();
  },
};
export const BothThemes: Story = {
  render: () => (
    <div className="theme-grid">
      {(['corporate', 'luna'] as const).map((theme) => (
        <section key={theme} data-theme={theme} className="theme-panel stack container-guide">
          <h2>{theme}</h2>
          <p>Theme supplies color; Container supplies no surface. Dashed lines are guides.</p>
          <Container>
            <ProjectContent />
          </Container>
        </section>
      ))}
    </div>
  ),
};
export const NarrowParents: Story = {
  render: () => (
    <div className="stack">
      <p>A fixed 80px sibling and a shrinking Container share each 240px flex/grid parent.</p>
      <div className="container-narrow container-flex">
        <span className="container-fixed">Flex</span>
        <Container data-testid="flex-container">
          <p>Narrow content</p>
        </Container>
      </div>
      <div className="container-narrow container-parent-grid">
        <span>Grid</span>
        <Container data-testid="grid-container">
          <p>Narrow content</p>
        </Container>
      </div>
    </div>
  ),
};
export const Hidden: Story = {
  args: { hidden: true },
  render: (args) => (
    <div>
      <p>The native hidden attribute suppresses the complete layout wrapper.</p>
      <Container {...args} />
    </div>
  ),
};
