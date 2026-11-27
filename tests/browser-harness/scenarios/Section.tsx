import { Button } from '../../../src/components/button/Button';
import { Card } from '../../../src/components/card/Card';
import { CardContent } from '../../../src/components/card/Card';
import { CardDescription } from '../../../src/components/card/Card';
import { CardTitle } from '../../../src/components/card/Card';
import { Checkbox } from '../../../src/components/checkbox/Checkbox';
import { Cluster } from '../../../src/components/cluster/Cluster';
import { Container } from '../../../src/components/container/Container';
import { Section } from '../../../src/components/section/Section';
import { SimpleGrid } from '../../../src/components/simple-grid/SimpleGrid';
import { Stack } from '../../../src/components/stack/Stack';
import { type SectionStyle } from '../../../src/components/section/Section';
import type { SectionProps } from '../../../src/components/section/Section';
import type { Scenario } from '../gallery/types';
import '../../../src/components/button/button.css';
import '../../../src/components/card/card.css';
import '../../../src/components/checkbox/checkbox.css';
import '../../../src/components/cluster/cluster.css';
import '../../../src/components/container/container.css';
import '../../../src/components/section/section.css';
import '../../../src/components/simple-grid/simple-grid.css';
import '../../../src/components/stack/stack.css';
import '../../../src/components/field/field.css';
import '../../../src/components/icon/icon.css';
import '../../../src/components/section/stories/section.stories.css';

/**
 * Compose a meaningful topic using independent width, child layout and native control components.
 **/
function TopicContent({ titleId }: { titleId: string }) {
  return (
    <Container>
      <Stack gap="group">
        <header className="section-demo-heading">
          <h2 id={titleId} className="section-demo-copy">
            Built for your next project
          </h2>
          <p className="section-demo-copy">Accessible components with thoughtful defaults.</p>
        </header>
        <SimpleGrid>
          {['Foundations', 'Components', 'Page layouts'].map((name) => (
            <Card key={name}>
              <CardContent>
                <CardTitle as="h3">{name}</CardTitle>
                <CardDescription>
                  One system. Room to create clear and accessible interfaces.
                </CardDescription>
                <Button>Explore {name}</Button>
              </CardContent>
            </Card>
          ))}
        </SimpleGrid>
        <Cluster>
          <Checkbox label="Notify me about component updates" />
          <Button>Get started</Button>
        </Cluster>
      </Stack>
    </Container>
  );
}

/**
 * Supply a decorative 20px block solely for exact padding measurements.
 **/
function Marker() {
  return <div className="section-demo-marker" aria-hidden="true" />;
}

const SpacingPresets: Scenario<SectionProps> = {
  render: () => (
    <Stack gap="group" className="section-demo">
      {(['compact', 'default', 'spacious'] as const).map((spacing) => (
        <div key={spacing}>
          <h2>{spacing} padding</h2>
          <Section
            as="div"
            spacing={spacing}
            className="section-demo-guide"
            data-testid={`spacing-${spacing}`}
          >
            <Marker />
          </Section>
        </div>
      ))}
    </Stack>
  ),
};

const Composition: Scenario<SectionProps> = {
  render: () => (
    <Section
      className="section-demo"
      aria-labelledby="composition-title"
      data-testid="composed-section"
    >
      <TopicContent titleId="composition-title" />
    </Section>
  ),
};

const Responsive: Scenario<SectionProps> = {
  render: () => (
    <Stack gap="group" className="section-demo">
      <p className="section-demo-copy">
        Only this example changes the default padding role to 32px at or below 600px. The unmodified
        section stays 64px.
      </p>
      <Section
        className="section-demo-responsive section-demo-guide"
        aria-labelledby="responsive-title"
        data-testid="responsive-section"
      >
        <TopicContent titleId="responsive-title" />
      </Section>
      <Section as="div" data-testid="unmodified-section">
        <Marker />
      </Section>
    </Stack>
  ),
};

const BothThemes: Scenario<SectionProps> = {
  render: () => (
    <div className="theme-grid section-demo">
      {(['corporate', 'luna'] as const).map((theme) => (
        <div key={theme} data-theme={theme} className="theme-panel">
          <h2 id={`${theme}-label`}>{theme}</h2>
          <Section
            aria-labelledby={`${theme}-label ${theme}-title`}
            className="section-demo-guide"
            data-testid={`theme-${theme}`}
          >
            <Container>
              <Stack>
                <h3 id={`${theme}-title`} className="section-demo-copy">
                  Built for your next project
                </h3>
                <p className="section-demo-copy">One system. Room to create.</p>
              </Stack>
            </Container>
          </Section>
        </div>
      ))}
    </div>
  ),
};

const Semantics: Scenario<SectionProps> = {
  render: () => (
    <Stack gap="group" className="section-demo">
      <Section aria-labelledby="semantic-title" data-testid="semantic-section">
        <h2 id="semantic-title" className="section-demo-copy">
          A meaningful topic
        </h2>
        <p className="section-demo-copy">
          The consumer supplies this visible heading and its association.
        </p>
      </Section>
      <Section as="div" data-testid="visual-section">
        <h2 className="section-demo-copy">Visual grouping</h2>
        <p className="section-demo-copy">
          No artificial region label or keyboard behavior is added.
        </p>
      </Section>
    </Stack>
  ),
};

const ScopedOverrides: Scenario<SectionProps> = {
  render: () => (
    <Stack gap="group">
      <p>
        Only the selected padding role changes. Sibling gaps, other presets and theme boundaries
        remain independent.
      </p>
      <div style={{ '--fs-section-padding-default': '80px' } as SectionStyle}>
        <Section as="div" data-testid="scoped-section">
          <Marker />
        </Section>
        <Section as="div" spacing="compact" data-testid="independent-preset">
          <Marker />
        </Section>
        <div data-theme="luna">
          <Section as="div" data-testid="reset-section">
            <Marker />
          </Section>
        </div>
      </div>
      <Section as="div" data-testid="sibling-section">
        <Marker />
      </Section>
      <Section
        as="div"
        style={{ '--fs-layout-section-gap': '12px' }}
        data-testid="gap-independent-section"
      >
        <Marker />
      </Section>
    </Stack>
  ),
};

const Adjacent: Scenario<SectionProps> = {
  render: () => (
    <Stack gap="group">
      <p>
        With no parent gap, adjacent default sections contribute 128px between content edges. Guides
        are demo outlines.
      </p>
      <div>
        <Section as="div" className="section-demo-guide" data-testid="adjacent-first">
          <Marker />
        </Section>
        <Section as="div" className="section-demo-guide" data-testid="adjacent-second">
          <Marker />
        </Section>
      </div>
    </Stack>
  ),
};

const ChildMargins: Scenario<SectionProps> = {
  render: () => (
    <Stack>
      <p>The child supplies 8px block margins in addition to each 64px padding edge.</p>
      <Section as="div" data-testid="margin-section">
        <div className="section-demo-marker" style={{ marginBlock: '8px' }} aria-hidden="true" />
      </Section>
    </Stack>
  ),
};

const Nested: Scenario<SectionProps> = {
  render: () => (
    <Stack>
      <p>
        Nested compact wrappers each own 32px padding. Prefer Stack when inner content only needs
        sibling gaps.
      </p>
      <Section
        as="div"
        spacing="compact"
        className="section-demo-guide"
        data-testid="outer-section"
      >
        <Marker />
        <Section
          as="div"
          spacing="compact"
          className="section-demo-guide"
          data-testid="inner-section"
        >
          <Marker />
        </Section>
      </Section>
    </Stack>
  ),
};

const NativeFocus: Scenario<SectionProps> = {
  render: () => (
    <Stack className="section-demo">
      <Button>Before topic</Button>
      <Section aria-labelledby="focus-title" data-testid="focus-section">
        <Container>
          <Stack>
            <h2 id="focus-title" className="section-demo-copy">
              Explore the project
            </h2>
            <Button>Open project</Button>
            <Button variant="secondary">Preview project</Button>
          </Stack>
        </Container>
      </Section>
      <Button>After topic</Button>
    </Stack>
  ),
};

const NarrowParents: Scenario<SectionProps> = {
  render: () => (
    <Stack>
      <div className="section-demo-flex">
        <span className="section-demo-fixed">Flex</span>
        <Section as="div" style={{ flex: 1 }} data-testid="flex-section">
          <Marker />
        </Section>
      </div>
      <div className="section-demo-grid">
        <span>Grid</span>
        <Section as="div" data-testid="grid-section">
          <Marker />
        </Section>
      </div>
    </Stack>
  ),
};

const NativeStyleOverride: Scenario<SectionProps> = {
  render: () => (
    <Stack>
      <p>Native style overrides the selected preset; Section still adds no inline padding.</p>
      <Section
        as="div"
        spacing="spacious"
        style={{ paddingBlock: '12px' }}
        data-testid="style-section"
      >
        <Marker />
      </Section>
    </Stack>
  ),
};

const Hidden: Scenario<SectionProps> = {
  args: { hidden: true },
  render: (args) => (
    <div>
      <p>The native hidden attribute suppresses the topic and its contents.</p>
      <Section {...args} />
    </div>
  ),
};

export const component = Section;
export const defaults: SectionProps = { children: <TopicContent titleId="playground-title" /> };
export const scenarios = {
  SpacingPresets,
  Responsive,
  Composition,
  Semantics,
  ScopedOverrides,
  Adjacent,
  ChildMargins,
  Nested,
  NativeFocus,
  BothThemes,
  NarrowParents,
  NativeStyleOverride,
  Hidden,
};
