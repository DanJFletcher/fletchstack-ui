import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  Checkbox,
  Cluster,
  Container,
  SimpleGrid,
  Stack,
  type SimpleGridStyle,
} from '../../../index';
import './simple-grid.stories.css';

const meta = {
  id: 'components-simplegrid',
  title: 'Components/Layout/SimpleGrid',
  component: SimpleGrid,
  tags: ['autodocs'],
  args: { children: <Items /> },
  argTypes: { gap: { control: 'select', options: ['none', 'related', 'group'] } },
  parameters: {
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Passive equal-width auto-fit columns, with a 240px preferred minimum that shrinks to fit narrower parents. Related (16px default), group (24px) or no gap controls both axes. Rows grow with their tallest child; child cards own their appearance. No interactive grid role, keyboard behavior, surface, padding or viewport breakpoint. Outlines and measurement blocks are demo-only. Ordinary CSS Grid remains supported for unequal widths and spanning.',
      },
    },
  },
} satisfies Meta<typeof SimpleGrid>;
export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Supply the same six numbered consumer blocks for track and spacing comparisons.
 **/
function Items() {
  return (
    <>
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div key={item} className="simple-grid-demo-item">
          Item {item}
        </div>
      ))}
    </>
  );
}

/**
 * Compose real card content and native controls without adding layout-owned interactions.
 **/
function ProjectCards() {
  return (
    <>
      {['Website refresh', 'Navigation update', 'Project archive'].map((name) => (
        <Card key={name}>
          <CardContent>
            <CardTitle as="h3">{name}</CardTitle>
            <CardDescription>
              A clearer experience from start to finish, with content that grows as text wraps.
            </CardDescription>
            <Badge tone="info">In progress</Badge>
            <Checkbox label={`Follow ${name}`} />
            <Cluster>
              <Button>Open {name}</Button>
              <Button variant="secondary">Preview {name}</Button>
            </Cluster>
          </CardContent>
        </Card>
      ))}
    </>
  );
}

export const Playground: Story = {
  render: (args) => (
    <Stack>
      <p>
        Equal columns adapt to this parent's available width. Cards and guides supply their own
        styling.
      </p>
      <SimpleGrid {...args} data-testid="default-grid" />
    </Stack>
  ),
};
export const Reflow: Story = {
  render: () => (
    <Stack gap="group">
      {(
        [
          ['wide', 800],
          ['medium', 520],
          ['narrow', 200],
        ] as const
      ).map(([name, width]) => (
        <section key={name}>
          <h2>
            {name} parent ({width}px)
          </h2>
          <SimpleGrid
            className="simple-grid-demo-guide"
            style={{ inlineSize: width }}
            data-testid={`reflow-${name}`}
          >
            <Items />
          </SimpleGrid>
        </section>
      ))}
    </Stack>
  ),
};
export const Gaps: Story = {
  render: () => (
    <Stack gap="group">
      {(['none', 'related', 'group'] as const).map((gap) => (
        <section key={gap}>
          <h2>{gap}</h2>
          <SimpleGrid gap={gap} className="simple-grid-demo-measure" data-testid={`gap-${gap}`}>
            <Items />
          </SimpleGrid>
        </section>
      ))}
    </Stack>
  ),
};
export const Sparse: Story = {
  render: () => (
    <Stack>
      <p>Auto-fit collapses unused tracks; two items expand equally across an 800px parent.</p>
      <SimpleGrid className="simple-grid-demo-wide" data-testid="sparse-grid">
        <div className="simple-grid-demo-item">One</div>
        <div className="simple-grid-demo-item">Two</div>
      </SimpleGrid>
    </Stack>
  ),
};
export const RowHeights: Story = {
  render: () => (
    <Stack>
      <p>Each row follows its tallest item. Rows do not share a fixed height.</p>
      <SimpleGrid className="simple-grid-demo-measure" data-testid="height-grid">
        <div className="simple-grid-demo-item" style={{ minBlockSize: '80px' }}>
          Tall content
        </div>
        <div className="simple-grid-demo-item">Stretches in this row</div>
        <div className="simple-grid-demo-item">Short row</div>
        <div className="simple-grid-demo-item">Short row</div>
      </SimpleGrid>
    </Stack>
  ),
};
export const Composition: Story = {
  render: () => (
    <Container>
      <section aria-labelledby="collection-title">
        <Stack gap="group">
          <header>
            <h2 id="collection-title">Project collection</h2>
            <p>
              Container owns width, Stack separates groups, SimpleGrid owns columns, and each Card
              owns its content and surface.
            </p>
          </header>
          <SimpleGrid data-testid="project-grid">
            <ProjectCards />
          </SimpleGrid>
        </Stack>
      </section>
    </Container>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('checkbox', { name: 'Follow Website refresh' }));
    await expect(canvas.getByRole('checkbox', { name: 'Follow Website refresh' })).toBeChecked();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Open Website refresh' })).toHaveFocus();
  },
};
export const BothThemes: Story = {
  render: () => (
    <div className="theme-grid">
      {(['corporate', 'luna'] as const).map((theme) => (
        <section key={theme} data-theme={theme} className="theme-panel">
          <Stack gap="group">
            <h2>{theme}</h2>
            <p>Only the surrounding surface and child controls change color.</p>
            <SimpleGrid data-testid={`theme-${theme}`}>
              <div className="simple-grid-demo-item">One</div>
              <div className="simple-grid-demo-item">Two</div>
              <div className="simple-grid-demo-item">Three</div>
              <div className="simple-grid-demo-item">Four</div>
            </SimpleGrid>
          </Stack>
        </section>
      ))}
    </div>
  ),
};
export const Customization: Story = {
  render: () => (
    <Stack gap="group">
      <p>
        Scoped 120px preferred minimum and 24px related gap. Siblings remain independent; explicit
        nested themes reset both roles.
      </p>
      <div
        style={
          {
            '--fs-simple-grid-min-item-width': '120px',
            '--fs-space-gap-related': '24px',
          } as SimpleGridStyle
        }
      >
        <Stack>
          <SimpleGrid className="simple-grid-demo-measure" data-testid="scoped-grid">
            <Items />
          </SimpleGrid>
          <section data-theme="luna" className="simple-grid-demo-theme">
            <SimpleGrid className="simple-grid-demo-measure" data-testid="reset-grid">
              <Items />
            </SimpleGrid>
          </section>
        </Stack>
      </div>
      <SimpleGrid className="simple-grid-demo-measure" data-testid="sibling-grid">
        <Items />
      </SimpleGrid>
    </Stack>
  ),
};
export const HiddenChildren: Story = {
  render: () => (
    <SimpleGrid className="simple-grid-demo-measure" data-testid="hidden-children">
      <div className="simple-grid-demo-item">First</div>
      <div hidden>Hidden</div>
      <div className="simple-grid-demo-item">Second</div>
      <div style={{ display: 'none' }}>Not displayed</div>
      <div className="simple-grid-demo-item">Third</div>
      <div className="simple-grid-demo-item">Fourth</div>
    </SimpleGrid>
  ),
};
export const Nested: Story = {
  render: () => (
    <SimpleGrid className="simple-grid-demo-wide" gap="group" data-testid="outer-grid">
      <SimpleGrid style={{ '--fs-simple-grid-min-item-width': '100px' }} data-testid="inner-grid">
        <Items />
      </SimpleGrid>
      <div className="simple-grid-demo-item">Outer sibling</div>
    </SimpleGrid>
  ),
};
export const RightToLeft: Story = {
  render: () => (
    <Stack dir="rtl">
      <p>Columns follow writing direction while source and keyboard order stay unchanged.</p>
      <SimpleGrid className="simple-grid-demo-measure" data-testid="rtl-grid">
        <Button>First</Button>
        <Button>Second</Button>
        <Button>Third</Button>
        <Button>Fourth</Button>
      </SimpleGrid>
    </Stack>
  ),
};
export const ConsumerMargins: Story = {
  render: () => (
    <Stack>
      <p>Child margins are consumer-owned and remain in addition to grid gaps.</p>
      <SimpleGrid className="simple-grid-demo-measure" data-testid="margin-grid">
        <div className="simple-grid-demo-item" style={{ marginInline: '8px' }}>
          Margins retained
        </div>
        <div className="simple-grid-demo-item">No margins</div>
      </SimpleGrid>
    </Stack>
  ),
};
export const NarrowParents: Story = {
  render: () => (
    <Stack>
      <div className="simple-grid-demo-flex">
        <span className="simple-grid-demo-fixed">Flex</span>
        <SimpleGrid data-testid="flex-grid">
          <Items />
        </SimpleGrid>
      </div>
      <div className="simple-grid-demo-parent-grid">
        <span>Grid</span>
        <SimpleGrid data-testid="grid-grid">
          <Items />
        </SimpleGrid>
      </div>
    </Stack>
  ),
};
export const EmptyAndSingle: Story = {
  render: () => (
    <Stack>
      <p>Empty grids add no content; a single item occupies the available width.</p>
      <SimpleGrid data-testid="empty-grid" />
      <SimpleGrid className="simple-grid-demo-wide" data-testid="single-grid">
        <div className="simple-grid-demo-item">Single item</div>
      </SimpleGrid>
    </Stack>
  ),
};
export const Hidden: Story = {
  args: { hidden: true },
  render: (args) => (
    <div>
      <p>The native hidden attribute suppresses the wrapper and its children.</p>
      <SimpleGrid {...args} />
    </div>
  ),
};
