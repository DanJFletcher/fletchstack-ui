import {
  BounceCardsDemo,
  BounceCardsExample,
  BounceCardsOverrides,
  DenseBounceCards,
  naturePhotos,
  ReorderedBounceCards,
} from '../../../src/components/bounce-cards/stories/bounce-cards-examples';
import { BounceCards } from '../../../src/components/bounce-cards/BounceCards';
import type { BounceCardsProps } from '../../../src/components/bounce-cards/types';
import type { Scenario } from '../gallery/types';
import '../../../src/components/bounce-cards/bounce-cards.css';
import '../../../src/components/bounce-cards/stories/bounce-cards.stories.css';

const Playground: Scenario<Partial<BounceCardsProps>> = {};
const Composition = { render: () => <BounceCardsExample /> };
const Passive = { render: () => <BounceCards images={naturePhotos} /> };
const Dense = { render: () => <DenseBounceCards /> };
const Overrides = { render: () => <BounceCardsOverrides /> };
const Reordered = { render: () => <ReorderedBounceCards /> };
const Failed = {
  render: () => (
    <BounceCards
      images={[
        { id: 'failed', src: 'data:image/png;base64,invalid', alt: 'Unavailable photograph' },
      ]}
    />
  ),
};
export const component = BounceCardsDemo;
export const defaults = {};
export const scenarios = { Playground, Composition, Passive, Dense, Overrides, Reordered, Failed };
