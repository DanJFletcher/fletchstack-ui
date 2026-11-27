import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import {
  Badge,
  Button,
  Cluster,
  Container,
  Stack,
  TextInput,
  type ClusterStyle,
} from '../../../index';
import './cluster.stories.css';

const meta = {
  id: 'components-cluster',
  title: 'Components/Layout/Cluster',
  component: Cluster,
  tags: ['autodocs'],
  args: {
    children: (
      <>
        <Button>Save changes</Button>
        <Button variant="secondary">Preview</Button>
        <Button variant="secondary">Cancel</Button>
      </>
    ),
  },
  argTypes: {
    gap: { control: 'select', options: ['none', 'actions', 'related'] },
    align: { control: 'select', options: ['start', 'center', 'end', 'baseline'] },
    justify: { control: 'select', options: ['start', 'center', 'end'] },
  },
  parameters: {
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Passive intrinsic wrapping rows using actions (12px default), related (16px), or no gap on both axes. Align items within each row and justify rows with logical start/end. No surface, padding, equal-width growth, toolbar role, focus management or viewport breakpoint. Children retain their semantics, supported text wrapping and margins. Outlines and measurement blocks are demonstration guides only.',
      },
    },
  },
} satisfies Meta<typeof Cluster>;
export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Render identical native actions so wrapping can be compared at different parent widths.
 **/
function Actions() {
  return (
    <>
      <Button>Save changes</Button>
      <Button variant="secondary">Preview</Button>
      <Button variant="secondary">Cancel</Button>
    </>
  );
}

/**
 * Supply consumer-owned measurement blocks with predictable intrinsic sizes.
 **/
function MeasureItems() {
  return (
    <>
      <div className="cluster-demo-box">One</div>
      <div className="cluster-demo-box">Two</div>
      <div className="cluster-demo-box">Three</div>
    </>
  );
}

/**
 * Keep save feedback and interaction state in the consumer composition.
 **/
function ProjectActions() {
  const [saved, setSaved] = useState(false);

  return (
    <Stack>
      <Cluster data-testid="project-actions">
        <Button onClick={() => setSaved(true)}>Save changes</Button>
        <Button variant="secondary">Preview</Button>
        <Button variant="secondary">Cancel</Button>
        <Badge tone="info">New</Badge>
      </Cluster>
      {saved && (
        <p role="status" className="cluster-demo-copy">
          Project changes saved.
        </p>
      )}
    </Stack>
  );
}

export const Playground: Story = {
  render: (args) => (
    <div className="stack cluster-demo">
      <p>Cluster supplies no border or padding; children keep their own appearance.</p>
      <Cluster {...args} data-testid="default-cluster" />
    </div>
  ),
};
export const Gaps: Story = {
  render: () => (
    <div className="theme-grid">
      {(['none', 'actions', 'related'] as const).map((gap) => (
        <section key={gap} className="stack">
          <h2>{gap}</h2>
          <Cluster gap={gap} className="cluster-demo-measure" data-testid={`gap-${gap}`}>
            <MeasureItems />
          </Cluster>
        </section>
      ))}
    </div>
  ),
};
export const Wrapping: Story = {
  render: () => (
    <Stack gap="group">
      <p>Same actions, same viewport. Dashed outlines are guides; only parent width changes.</p>
      <section>
        <h2>Wide parent</h2>
        <Cluster className="cluster-demo-wide cluster-demo-outline" data-testid="wrap-wide">
          <Actions />
        </Cluster>
      </section>
      <section>
        <h2>Narrow parent</h2>
        <Cluster className="cluster-demo-narrow cluster-demo-outline" data-testid="wrap-narrow">
          <Actions />
        </Cluster>
      </section>
    </Stack>
  ),
};
export const Alignments: Story = {
  render: () => (
    <div className="theme-grid">
      {(['start', 'center', 'end'] as const).map((align) => (
        <section key={align} className="stack">
          <h2>{align}</h2>
          <Cluster
            align={align}
            className="cluster-demo-row cluster-demo-outline"
            data-testid={`align-${align}`}
          >
            <div className="cluster-demo-box" />
            <div className="cluster-demo-box" style={{ blockSize: '48px' }} />
            <div className="cluster-demo-box" style={{ blockSize: '16px' }} />
          </Cluster>
        </section>
      ))}
    </div>
  ),
};
export const Baseline: Story = {
  render: () => (
    <Stack>
      <p>Mixed text sizes share a baseline. Zero-sized inline markers only measure the demo.</p>
      <Cluster align="baseline" data-testid="baseline-cluster">
        <span style={{ fontSize: '.875rem' }}>
          Label
          <span
            className="cluster-baseline-marker"
            data-testid="baseline-small"
            aria-hidden="true"
          />
        </span>
        <span style={{ fontSize: '2rem' }}>
          Title
          <span
            className="cluster-baseline-marker"
            data-testid="baseline-large"
            aria-hidden="true"
          />
        </span>
        <span>
          Note
          <span
            className="cluster-baseline-marker"
            data-testid="baseline-medium"
            aria-hidden="true"
          />
        </span>
      </Cluster>
    </Stack>
  ),
};
export const Justification: Story = {
  render: () => (
    <div className="theme-grid">
      {(['start', 'center', 'end'] as const).map((justify) => (
        <section key={justify} className="stack">
          <h2>{justify}</h2>
          <Cluster
            justify={justify}
            className="cluster-demo-justify cluster-demo-outline"
            data-testid={`justify-${justify}`}
          >
            <MeasureItems />
          </Cluster>
        </section>
      ))}
    </div>
  ),
};
export const Composition: Story = {
  render: () => (
    <div className="cluster-demo">
      <Container size="reading">
        <section aria-label="Project overview">
          <Stack gap="group">
            <header>
              <h2 className="cluster-demo-copy">Project overview</h2>
              <p className="cluster-demo-copy">Manage the details and share a clearer project.</p>
            </header>
            <TextInput label="Project name" defaultValue="Website refresh" />
            <ProjectActions />
          </Stack>
        </section>
      </Container>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Save changes' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('Project changes saved.');
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Preview' })).toHaveFocus();
  },
};
export const BothThemes: Story = {
  render: () => (
    <div className="theme-grid cluster-demo">
      {(['corporate', 'luna'] as const).map((theme) => (
        <section key={theme} data-theme={theme} className="theme-panel">
          <Stack gap="group">
            <h2 className="cluster-demo-copy">{theme}</h2>
            <p className="cluster-demo-copy">
              The theme supplies color. Cluster stays transparent with the same gaps and wrapping.
            </p>
            <Container gutters={false}>
              <ProjectActions />
            </Container>
          </Stack>
        </section>
      ))}
    </div>
  ),
};
export const Badges: Story = {
  render: () => (
    <Cluster>
      <Badge>Draft</Badge>
      <Badge tone="info">New</Badge>
      <Badge tone="success">Published</Badge>
      <Badge tone="warning">Pending</Badge>
      <Badge tone="danger">Failed</Badge>
    </Cluster>
  ),
};
export const LongLabels: Story = {
  render: () => (
    <Container size="reading">
      <Cluster data-testid="long-cluster">
        <Button>Save every change to this shared workspace and publish the project</Button>
        <Button variant="secondary">Preview the latest navigation and content updates</Button>
      </Cluster>
    </Container>
  ),
};
export const HiddenChildren: Story = {
  render: () => (
    <Cluster data-testid="hidden-children">
      <Button>First</Button>
      <Button hidden>Hidden</Button>
      <Button style={{ display: 'none' }}>Not displayed</Button>
      <Button variant="secondary">Last</Button>
    </Cluster>
  ),
};
export const Nested: Story = {
  render: () => (
    <Cluster gap="related" data-testid="outer-cluster">
      <Cluster data-testid="inner-cluster">
        <Button>Open</Button>
        <Button variant="secondary">Duplicate</Button>
      </Cluster>
      <Badge>Draft</Badge>
    </Cluster>
  ),
};
export const ScopedOverrides: Story = {
  render: () => (
    <Stack>
      <p>
        Only the actions role changes. Related remains independent, and explicit nested themes reset
        roles.
      </p>
      <div className="stack" style={{ '--fs-space-gap-actions': '24px' } as ClusterStyle}>
        <Cluster className="cluster-demo-measure" data-testid="scoped-cluster">
          <MeasureItems />
        </Cluster>
        <Cluster gap="related" className="cluster-demo-measure" data-testid="independent-cluster">
          <MeasureItems />
        </Cluster>
        <section data-theme="luna" className="theme-panel">
          <Cluster className="cluster-demo-measure" data-testid="reset-cluster">
            <MeasureItems />
          </Cluster>
        </section>
      </div>
      <Cluster className="cluster-demo-measure" data-testid="sibling-cluster">
        <MeasureItems />
      </Cluster>
    </Stack>
  ),
};
export const RightToLeft: Story = {
  render: () => (
    <Stack dir="rtl">
      <p>البداية والنهاية تتبعان اتجاه الكتابة.</p>
      <Cluster className="cluster-demo-narrow" data-testid="rtl-cluster">
        <Actions />
      </Cluster>
    </Stack>
  ),
};
export const ConsumerMargins: Story = {
  render: () => (
    <Stack>
      <p>The first box supplies an 8px inline-end margin in addition to the 12px actions gap.</p>
      <Cluster data-testid="margin-cluster">
        <div className="cluster-demo-box" style={{ marginInlineEnd: '8px' }}>
          First
        </div>
        <div className="cluster-demo-box">Second</div>
      </Cluster>
    </Stack>
  ),
};
export const ResponsiveGap: Story = {
  render: () => (
    <Stack>
      <p>
        Consumer CSS overrides the actions role to 24px at or below 600px. Cluster still uses
        wrapping rows.
      </p>
      <Cluster className="cluster-responsive cluster-demo-measure" data-testid="responsive-cluster">
        <MeasureItems />
      </Cluster>
    </Stack>
  ),
};
export const NarrowParents: Story = {
  render: () => (
    <Stack>
      <div className="cluster-demo-flex">
        <span className="cluster-demo-fixed">Flex</span>
        <Cluster data-testid="flex-cluster">
          <Button>Open</Button>
          <Button>Close</Button>
        </Cluster>
      </div>
      <div className="cluster-demo-grid">
        <span>Grid</span>
        <Cluster data-testid="grid-cluster">
          <Button>Open</Button>
          <Button>Close</Button>
        </Cluster>
      </div>
    </Stack>
  ),
};
export const Hidden: Story = {
  args: { hidden: true },
  render: (args) => (
    <div>
      <p>The native hidden attribute suppresses Cluster and its children.</p>
      <Cluster {...args} />
    </div>
  ),
};
