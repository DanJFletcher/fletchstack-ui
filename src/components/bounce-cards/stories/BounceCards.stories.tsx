import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { BounceCards } from '../BounceCards';
import {
  BounceCardsDemo,
  BounceCardsExample,
  BounceCardsOverrides,
  DenseBounceCards,
  naturePhotos,
  ReplayBounceCards,
  ReorderedBounceCards,
} from './bounce-cards-examples';
import docs from '../../../../docs/bounce-cards.md?raw';
import './bounce-cards.stories.css';

const meta = {
  id: 'components-bounce-cards',
  title: 'Components/Media/BounceCards',
  component: BounceCards,
  tags: ['autodocs'],
  args: { images: naturePhotos },
  render: (args) => <BounceCardsDemo {...args} />,
  argTypes: {
    images: { control: false },
    positions: { control: false },
    onCardClick: { control: false },
    bounciness: { control: { type: 'range', min: 0, max: 1, step: 0.1 } },
  },
  parameters: { a11y: { test: 'error' }, docs: { description: { component: docs } } },
} satisfies Meta<typeof BounceCards>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Composition: Story = { render: () => <BounceCardsExample /> };
export const KeyboardActions: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement),
      photo = canvas.getByRole('button', { name: 'White lilies with red stamens' });
    photo.focus();
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByRole('status', { name: 'Selected photograph' })).toHaveTextContent(
      'White lilies with red stamens',
    );
    await expect(photo).toHaveFocus();
  },
};
export const ReplayEntrance: Story = { render: () => <ReplayBounceCards /> };
export const PassivePhotographs: Story = { render: () => <BounceCards images={naturePhotos} /> };
export const CurvedFan: Story = { args: { arc: 48, rotation: 16 } };
export const NoPointerExpansion: Story = { args: { enableHover: false } };
export const NoShadow: Story = { args: { shadow: false } };
export const NoBounce: Story = { args: { bounciness: 0, animationDelay: 0, animationStagger: 0 } };
export const CustomPositions: Story = {
  args: {
    images: naturePhotos.slice(0, 3),
    positions: [
      { x: -140, y: 20, rotation: -12 },
      { x: 0, y: -20 },
      { x: 140, y: 20, rotation: 12 },
    ],
  },
};
export const Narrow: Story = {
  render: () => (
    <div className="bounce-demo__narrow">
      <BounceCardsDemo />
    </div>
  ),
};
export const DenseGrid: Story = { render: () => <DenseBounceCards /> };
export const ReorderedImages: Story = { render: () => <ReorderedBounceCards /> };
export const ScopedOverrides: Story = { render: () => <BounceCardsOverrides /> };
export const SinglePhotograph: Story = { args: { images: naturePhotos.slice(0, 1) } };
export const FailedPhotograph: Story = {
  args: {
    images: [
      { id: 'failed', src: 'data:image/png;base64,invalid', alt: 'Unavailable project photograph' },
    ],
  },
};
export const Empty: Story = {
  args: { images: [], emptyMessage: 'No photographs in this collection.' },
};
