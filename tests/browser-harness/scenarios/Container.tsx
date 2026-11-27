import { Button } from '../../../src/components/button/Button';
import { Card } from '../../../src/components/card/Card';
import { CardContent } from '../../../src/components/card/Card';
import { CardHeader } from '../../../src/components/card/Card';
import { CardTitle } from '../../../src/components/card/Card';
import { Container } from '../../../src/components/container/Container';
import { TextInput } from '../../../src/components/text-input/TextInput';
import { type ContainerStyle } from '../../../src/components/container/Container';
import type { ContainerProps } from '../../../src/components/container/Container';
import type { Scenario } from '../gallery/types';
import '../../../src/components/button/button.css';
import '../../../src/components/card/card.css';
import '../../../src/components/container/container.css';
import '../../../src/components/text-input/text-input.css';
import '../../../src/components/field/field.css';
import '../../../src/components/container/stories/container.stories.css';

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

const Playground: Scenario<ContainerProps> = {
  render: (args) => (
    <div className="stack container-guide">
      <p>Dashed outline: demonstration guide, not a Container border.</p>
      <Container {...args} />
    </div>
  ),
};

const WidthPresets: Scenario<ContainerProps> = {
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

const ResponsiveGutters: Scenario<ContainerProps> = {
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

const WithoutGutters: Scenario<ContainerProps> = {
  render: () => (
    <div className="stack container-inset container-guide">
      <p>This parent already supplies inset. Container adds no second gutter.</p>
      <Container gutters={false} data-testid="without-gutters">
        <ProjectContent />
      </Container>
    </div>
  ),
};

const Nesting: Scenario<ContainerProps> = {
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

const TokenOverrides: Scenario<ContainerProps> = {
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

const Composition: Scenario<ContainerProps> = {
  render: () => (
    <section aria-label="Project settings">
      <Container>
        <ProjectContent />
      </Container>
    </section>
  ),
};

const BothThemes: Scenario<ContainerProps> = {
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

const NarrowParents: Scenario<ContainerProps> = {
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

const Hidden: Scenario<ContainerProps> = {
  args: { hidden: true },
  render: (args) => (
    <div>
      <p>The native hidden attribute suppresses the complete layout wrapper.</p>
      <Container {...args} />
    </div>
  ),
};

export const component = Container;
export const defaults: ContainerProps = {
  children: <p>Content fills its parent up to the selected maximum width.</p>,
};
export const scenarios = {
  WidthPresets,
  ResponsiveGutters,
  WithoutGutters,
  Composition,
  Playground,
  Nesting,
  TokenOverrides,
  NarrowParents,
  BothThemes,
  Hidden,
};
