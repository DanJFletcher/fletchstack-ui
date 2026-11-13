import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Rating } from '../Rating';
import { ControlledRating, RatingExample, RatingForm } from './rating-examples';
import './rating.stories.css';

const meta = { id: 'components-rating', title: 'Components/Content/Rating', component: Rating, tags: ['autodocs'], args: { value: 4.5, showValue: true }, parameters: { a11y: { test: 'error' }, docs: { description: { component: 'A fractional named-image summary or a visibly labeled native radio group. Whole or half steps use stable clipped artwork, native arrow/Tab behavior, native validation and form submission. Reduced motion needs no alternative: Rating changes immediately. See docs/rating.md for value boundaries and customization.' } } } } satisfies Meta<typeof Rating>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Composition: Story = { render: () => <RatingExample />, play: async ({ canvasElement }) => {
  // The disabled and required groups also contain this option; target the interactive named field.
  const group = within(canvasElement).getByRole('group', { name: 'Your rating' });
  within(group).getByRole('radio', { name: '3 out of 5 stars' }).focus();
  await expect(within(group).getByRole('radio', { name: '3 out of 5 stars' })).toHaveFocus();
} };
export const Input: Story = { render: () => <RatingForm step={1} /> };
export const HalfStepInput: Story = { render: () => <RatingForm />, play: async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await userEvent.click(canvas.getByRole('radio', { name: '3.5 out of 5 stars' }));
  await userEvent.click(canvas.getByRole('button', { name: 'Submit rating' }));
  await expect(canvas.getByLabelText('Submitted rating')).toHaveTextContent('3.5');
} };
export const Required: Story = { args: { mode: 'input', label: 'Required rating', value: 0, required: true, error: 'Choose a rating.', showValue: false } };
export const Disabled: Story = { args: { mode: 'input', label: 'Closed survey', value: 4, disabled: true } };
export const Controlled: Story = { render: () => <ControlledRating /> };
export const Symbols: Story = { render: () => <div className="rating-demo__list">{(['star', 'heart', 'thumbs'] as const).map(symbol => <Rating key={symbol} symbol={symbol} label={symbol} value={3.5} showValue />)}</div> };
export const Sizes: Story = { render: () => <div className="rating-demo__list">{(['sm', 'md', 'lg'] as const).map(size => <Rating key={size} size={size} label={size} value={4.5} />)}</div> };
export const Localized: Story = { args: { mode: 'input', label: 'Avis sur le service', value: 3.5, step: 0.5, symbol: 'heart', getRatingLabel: (value, max) => `${value} cœurs sur ${max}`, formatValue: (value, max) => `${value.toLocaleString('fr')} sur ${max}` } };
export const TenPointScale: Story = { args: { mode: 'input', label: 'Detailed rating', max: 10, value: 6.5, step: 0.5, size: 'sm' } };
export const Luna: Story = { ...Playground, globals: { theme: 'luna' } };
