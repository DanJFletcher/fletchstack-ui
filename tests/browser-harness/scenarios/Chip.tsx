import { Chip, type ChipProps } from '../../../src/components/chip/Chip';
import {
  ChipExample,
  ChipFilters,
  SelectableRemovableChip,
} from '../../../src/components/chip/stories/chip-examples';
import type { Scenario } from '../gallery/types';
import '../../../src/components/chip/chip.css';
import '../../../src/components/chip/stories/chip.stories.css';

const Playground: Scenario<ChipProps> = {};
const Composition: Scenario<ChipProps> = { render: () => <ChipExample /> };
const Filters: Scenario<ChipProps> = { render: () => <ChipFilters /> };
const Actions: Scenario<ChipProps> = { render: () => <SelectableRemovableChip /> };
const Sizes: Scenario<ChipProps> = {
  render: () => (
    <div className="chip-demo__row">
      {(['small', 'medium', 'large'] as const).map((size) => (
        <Chip key={size} size={size}>
          {size} tag
        </Chip>
      ))}
    </div>
  ),
};
const LongLabel: Scenario<ChipProps> = {
  args: {
    children: 'ALongUnbrokenContentTagThatWrapsWithinItsContainer',
    onSelect: () => {},
    selected: true,
    onRemove: () => {},
    removeLabel: 'Remove long tag',
  },
};
const Disabled: Scenario<ChipProps> = {
  render: () => (
    <>
      <Chip
        disabled
        selected
        onSelect={() => {}}
        onRemove={() => {}}
        removeLabel="Remove disabled tag"
      >
        Disabled tag
      </Chip>
      <button type="button">Next control</button>
    </>
  ),
};
const Form: Scenario<ChipProps> = {
  render: () => (
    <form action="/unexpected-chip-submit">
      <SelectableRemovableChip />
    </form>
  ),
};
const Scopes: Scenario<ChipProps> = {
  render: () => (
    <section
      data-theme="corporate"
      style={
        {
          '--fs-chip-surface': 'rgb(0, 0, 0)',
          '--fs-chip-text': 'rgb(255, 255, 255)',
        } as import('../../../src/components/chip/Chip').ChipStyle
      }
    >
      <Chip>Outer tag</Chip>
      <section data-theme="luna">
        <Chip>Nested tag</Chip>
      </section>
    </section>
  ),
};
export const component = Chip;
export const defaults: ChipProps = { children: 'Design systems' };
export const scenarios = {
  Playground,
  Composition,
  Filters,
  Actions,
  Sizes,
  LongLabel,
  Disabled,
  Form,
  Scopes,
};
