import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  Checkbox,
  Cluster,
  Container,
  Section,
  SimpleGrid,
  Stack,
  type SectionStyle,
} from '../../../index';
import './section.stories.css';

const meta = {
  id: 'components-section',
  title: 'Components/Layout/Section',
  component: Section,
  tags: ['autodocs'],
  args: { children: <TopicContent titleId="playground-title" /> },
  argTypes: {
    spacing: { control: 'select', options: ['compact', 'default', 'spacious'] },
    as: { control: 'select', options: ['section', 'div'] },
  },
  parameters: {
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Optional native page region with 32/64/96px block padding at both ends; default 64px. Container owns width/gutters, child layouts own wrapping and gaps, and parents own separation. No inline padding, surface, border, fixed height, keyboard stop, heading generation or automatic breakpoint. Associate meaningful native sections with visible headings; use as=div for visual grouping. Adjacent sections contribute both padding edges. Outlines and measurement blocks are demo-only.',
      },
    },
  },
} satisfies Meta<typeof Section>;
export default meta;
type Story = StoryObj<typeof meta>;

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

export const Playground: Story = {
  render: (args) => (
    <div className="section-demo">
      <Section {...args} data-testid="default-section" />
    </div>
  ),
};
export const SpacingPresets: Story = {
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
export const Composition: Story = {
  render: () => (
    <Section
      className="section-demo"
      aria-labelledby="composition-title"
      data-testid="composed-section"
    >
      <TopicContent titleId="composition-title" />
    </Section>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(
      canvas.getByRole('checkbox', { name: 'Notify me about component updates' }),
    );
    await expect(
      canvas.getByRole('checkbox', { name: 'Notify me about component updates' }),
    ).toBeChecked();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Get started' })).toHaveFocus();
  },
};
export const Responsive: Story = {
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
export const BothThemes: Story = {
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
export const Semantics: Story = {
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
export const ScopedOverrides: Story = {
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
export const Adjacent: Story = {
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
export const ChildMargins: Story = {
  render: () => (
    <Stack>
      <p>The child supplies 8px block margins in addition to each 64px padding edge.</p>
      <Section as="div" data-testid="margin-section">
        <div className="section-demo-marker" style={{ marginBlock: '8px' }} aria-hidden="true" />
      </Section>
    </Stack>
  ),
};
export const Nested: Story = {
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
export const NativeFocus: Story = {
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Before topic' }));
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Open project' })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Preview project' })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'After topic' })).toHaveFocus();
  },
};
export const NarrowParents: Story = {
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
export const NativeStyleOverride: Story = {
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
export const Hidden: Story = {
  args: { hidden: true },
  render: (args) => (
    <div>
      <p>The native hidden attribute suppresses the topic and its contents.</p>
      <Section {...args} />
    </div>
  ),
};
