import { Badge } from '../../../src/components/badge/Badge';
import { Button } from '../../../src/components/button/Button';
import { Card } from '../../../src/components/card/Card';
import { CardContent } from '../../../src/components/card/Card';
import { CardDescription } from '../../../src/components/card/Card';
import { CardTitle } from '../../../src/components/card/Card';
import { Checkbox } from '../../../src/components/checkbox/Checkbox';
import { Cluster } from '../../../src/components/cluster/Cluster';
import { Container } from '../../../src/components/container/Container';
import { SimpleGrid } from '../../../src/components/simple-grid/SimpleGrid';
import { Stack } from '../../../src/components/stack/Stack';
import { type SimpleGridStyle } from '../../../src/components/simple-grid/SimpleGrid';
import type { SimpleGridProps } from '../../../src/components/simple-grid/SimpleGrid';
import type { Scenario } from '../gallery/types';
import '../../../src/components/badge/badge.css';
import '../../../src/components/button/button.css';
import '../../../src/components/card/card.css';
import '../../../src/components/checkbox/checkbox.css';
import '../../../src/components/cluster/cluster.css';
import '../../../src/components/container/container.css';
import '../../../src/components/simple-grid/simple-grid.css';
import '../../../src/components/stack/stack.css';
import '../../../src/components/field/field.css';
import '../../../src/components/icon/icon.css';
import '../../../src/components/simple-grid/stories/simple-grid.stories.css';

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

const Reflow: Scenario<SimpleGridProps> = {
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

const Gaps: Scenario<SimpleGridProps> = {
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

const Sparse: Scenario<SimpleGridProps> = {
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

const RowHeights: Scenario<SimpleGridProps> = {
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

const Composition: Scenario<SimpleGridProps> = {
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
};

const BothThemes: Scenario<SimpleGridProps> = {
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

const Customization: Scenario<SimpleGridProps> = {
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

const HiddenChildren: Scenario<SimpleGridProps> = {
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

const Nested: Scenario<SimpleGridProps> = {
  render: () => (
    <SimpleGrid className="simple-grid-demo-wide" gap="group" data-testid="outer-grid">
      <SimpleGrid style={{ '--fs-simple-grid-min-item-width': '100px' }} data-testid="inner-grid">
        <Items />
      </SimpleGrid>
      <div className="simple-grid-demo-item">Outer sibling</div>
    </SimpleGrid>
  ),
};

const RightToLeft: Scenario<SimpleGridProps> = {
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

const ConsumerMargins: Scenario<SimpleGridProps> = {
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

const NarrowParents: Scenario<SimpleGridProps> = {
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

const EmptyAndSingle: Scenario<SimpleGridProps> = {
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

const Hidden: Scenario<SimpleGridProps> = {
  args: { hidden: true },
  render: (args) => (
    <div>
      <p>The native hidden attribute suppresses the wrapper and its children.</p>
      <SimpleGrid {...args} />
    </div>
  ),
};

export const component = SimpleGrid;
export const defaults: SimpleGridProps = { children: <Items /> };
export const scenarios = {
  Reflow,
  Gaps,
  Composition,
  Sparse,
  EmptyAndSingle,
  RowHeights,
  Customization,
  HiddenChildren,
  Nested,
  RightToLeft,
  BothThemes,
  ConsumerMargins,
  NarrowParents,
  Hidden,
};
