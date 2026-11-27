import { createRef, useState, type ReactElement } from 'react';
import { act, fireEvent, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Rating, type RatingProps } from '../../src/components/rating/Rating';
import { validateRating } from '../../src/components/rating/rating-policy';

/**
 * Apply the public display and native form contract to independent client and hydration boundaries.
 **/
export function ratingContracts(mount: (element: ReactElement) => unknown) {
  describe('Rating', () => {
    it('defaults to one named display image without controls', () => {
      // arrange
      // act
      mount(<Rating />);
      // assert
      expect(screen.getByRole('img', { name: '0 out of 5 stars' })).toBeVisible();
      expect(screen.queryByRole('radio')).not.toBeInTheDocument();
    });
    it('exposes fractional scores without duplicating visible text to assistive technology', () => {
      // arrange
      // act
      mount(<Rating label="Customer rating" value={4.5} showValue size="lg" />);
      // assert
      expect(screen.getByRole('img', { name: '4.5 out of 5 stars' })).toBeVisible();
      expect(screen.getByText('4.5 / 5')).toHaveAttribute('aria-hidden', 'true');
      expect(screen.getByText('Customer rating')).toBeVisible();
    });
    it.each(['star', 'heart', 'thumbs'] as const)('localizes the %s display image', (symbol) => {
      // arrange
      const getRatingLabel = (value: number, max: number, kind: string) =>
        `${value} sur ${max}: ${kind}`;
      // act
      mount(
        <Rating
          symbol={symbol}
          defaultValue={2.5}
          max={3}
          getRatingLabel={getRatingLabel}
          formatValue={() => 'Deux et demi'}
          showValue
        />,
      );
      // assert
      expect(screen.getByRole('img', { name: `2.5 sur 3: ${symbol}` })).toBeVisible();
      expect(screen.getByText('Deux et demi')).toBeVisible();
    });
    it.each([
      { symbol: 'heart', name: '3 out of 5 hearts' },
      { symbol: 'thumbs', name: '3 out of 5 thumbs up' },
    ] as const)('names $symbol choices', ({ symbol, name }) => {
      // arrange
      // act
      mount(<Rating mode="input" label="Review" symbol={symbol} defaultValue={3} />);
      // assert
      expect(screen.getByRole('radio', { name })).toBeChecked();
    });
    it('renders ten half-step choices in a named native fieldset', () => {
      // arrange
      // act
      mount(
        <Rating mode="input" label="Review" step={0.5} defaultValue={3.5} name="score" showValue />,
      );
      // assert
      expect(screen.getByRole('group', { name: 'Review' }).tagName).toBe('FIELDSET');
      expect(screen.getAllByRole('radio')).toHaveLength(10);
      expect(screen.getByRole('radio', { name: '3.5 out of 5 stars' })).toBeChecked();
      expect(screen.getByText('3.5 / 5')).not.toHaveAttribute('aria-hidden');
    });
    it('commits an uncontrolled native choice', async () => {
      // arrange
      const user = userEvent.setup();
      mount(<Rating mode="input" label="Review" defaultValue={2} />);
      // act
      await user.click(screen.getByRole('radio', { name: '4 out of 5 stars' }));
      // assert
      expect(screen.getByRole('radio', { name: '4 out of 5 stars' })).toBeChecked();
    });
    it('notifies the parent with the numeric selected value', async () => {
      // arrange
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      mount(<Rating mode="input" label="Review" step={0.5} onValueChange={onValueChange} />);
      // act
      await user.click(screen.getByRole('radio', { name: '3.5 out of 5 stars' }));
      // assert
      expect(onValueChange).toHaveBeenCalledExactlyOnceWith(3.5);
    });
    it('keeps a controlled value authoritative', async () => {
      // arrange
      const user = userEvent.setup();
      mount(<Rating mode="input" label="Review" value={2} onValueChange={() => {}} />);
      // act
      await user.click(screen.getByRole('radio', { name: '4 out of 5 stars' }));
      // assert
      expect(screen.getByRole('radio', { name: '2 out of 5 stars' })).toBeChecked();
    });
    it('accepts controlled parent updates', async () => {
      // arrange
      const user = userEvent.setup();
      mount(<Controlled />);
      // act
      await user.click(screen.getByRole('radio', { name: '4 out of 5 stars' }));
      // assert
      expect(screen.getByRole('radio', { name: '4 out of 5 stars' })).toBeChecked();
    });
    it('submits a half-step numeric value under the supplied name', () => {
      // arrange
      mount(
        <form aria-label="Review form">
          <Rating mode="input" label="Review" name="score" defaultValue={3.5} step={0.5} />
        </form>,
      );
      // act
      const result = new FormData(screen.getByRole('form') as HTMLFormElement).get('score');
      // assert
      expect(result).toBe('3.5');
    });
    it('leaves unanswered required fields invalid', () => {
      // arrange
      mount(
        <form>
          <Rating mode="input" label="Review" name="score" required />
        </form>,
      );
      // act
      const result = (screen.getAllByRole('radio')[0] as HTMLInputElement).checkValidity();
      // assert
      expect(result).toBe(false);
      expect(
        screen.getAllByRole('radio').filter((input) => (input as HTMLInputElement).checked),
      ).toHaveLength(0);
    });
    it('associates description and error with the group and choices', () => {
      // arrange
      // act
      mount(
        <Rating
          mode="input"
          label="Review"
          id="review"
          description="Choose one score"
          error="Choose a rating"
          aria-describedby="context"
        />,
      );
      // assert
      expect(screen.getByRole('group')).toHaveAttribute(
        'aria-describedby',
        'context review-description review-error',
      );
      expect(screen.getByRole('group')).toHaveAttribute('aria-invalid', 'true');
      expect(screen.getAllByRole('radio')[0]).toHaveAccessibleDescription(
        'Choose one score Choose a rating',
      );
    });
    it('honors explicit invalid state', () => {
      // arrange
      // act
      mount(<Rating mode="input" label="Review" invalid />);
      // assert
      expect(screen.getByRole('group')).toHaveAttribute('aria-invalid', 'true');
    });
    it('preserves native aria-invalid when no custom invalid state is supplied', () => {
      // arrange
      // act
      mount(<Rating mode="input" label="Review" aria-invalid="grammar" />);
      // assert
      expect(screen.getByRole('group')).toHaveAttribute('aria-invalid', 'grammar');
    });
    it('retains a disabled score and prevents changes', async () => {
      // arrange
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      mount(
        <Rating
          mode="input"
          label="Closed"
          value={4}
          onValueChange={onValueChange}
          disabled
          showValue
        />,
      );
      // act
      await user.click(screen.getByRole('radio', { name: '2 out of 5 stars' }));
      // assert
      expect(screen.getByRole('radio', { name: '4 out of 5 stars' })).toBeChecked();
      expect(onValueChange).not.toHaveBeenCalled();
      expect(screen.getByText('4 / 5')).toBeVisible();
    });
    it('isolates unnamed native groups', () => {
      // arrange
      // act
      mount(
        <>
          <Rating mode="input" label="First" />
          <Rating mode="input" label="Second" />
        </>,
      );
      // assert
      const first = within(screen.getByRole('group', { name: 'First' })).getAllByRole('radio')[0];
      const second = within(screen.getByRole('group', { name: 'Second' })).getAllByRole('radio')[0];
      expect(first!.getAttribute('name')).not.toBe(second!.getAttribute('name'));
    });
    it('forwards root refs and native hidden semantics', () => {
      // arrange
      const ref = createRef<HTMLDivElement>();
      // act
      mount(
        <Rating
          ref={ref}
          className="custom"
          hidden
          data-testid="rating"
          style={{ '--fs-rating-fill': 'orange' }}
        />,
      );
      // assert
      expect(ref.current).toBe(screen.getByTestId('rating'));
      expect(ref.current).toHaveClass('custom');
      expect(ref.current).not.toBeVisible();
    });
    it('localizes radio accessible names', () => {
      // arrange
      // act
      mount(<Rating mode="input" label="Avis" getRatingLabel={(value) => `${value} étoiles`} />);
      // assert
      expect(screen.getByRole('radio', { name: '3 étoiles' })).toBeVisible();
    });
    it('resets uncontrolled selection to its mount default', async () => {
      // arrange
      const user = userEvent.setup();
      mount(
        <form aria-label="Review form">
          <Rating mode="input" label="Review" defaultValue={2} showValue />
          <button type="reset">Reset</button>
        </form>,
      );
      await user.click(screen.getByRole('radio', { name: '4 out of 5 stars' }));
      // act
      await user.click(screen.getByRole('button', { name: 'Reset' }));
      // assert
      expect(screen.getByRole('radio', { name: '2 out of 5 stars' })).toBeChecked();
      expect(screen.getByText('2 / 5')).toBeVisible();
    });
    it('honors canceled native reset', async () => {
      // arrange
      mount(
        <form aria-label="Review form" onReset={(event) => event.preventDefault()}>
          <Rating mode="input" label="Review" defaultValue={2} />
        </form>,
      );
      fireEvent.click(screen.getByRole('radio', { name: '4 out of 5 stars' }));
      // act: dispatch the cancelable native reset boundary.
      await act(async () => {
        fireEvent.reset(screen.getByRole('form'));
      });
      // assert
      expect(screen.getByRole('radio', { name: '4 out of 5 stars' })).toBeChecked();
    });
    it('preserves controlled state on native reset', async () => {
      // arrange
      const user = userEvent.setup();
      mount(
        <form>
          <Rating mode="input" label="Review" value={4} defaultValue={2} />
          <button type="reset">Reset</button>
        </form>,
      );
      // act
      await user.click(screen.getByRole('button', { name: 'Reset' }));
      // assert
      expect(screen.getByRole('radio', { name: '4 out of 5 stars' })).toBeChecked();
    });
    it('associates native inputs with an external form', () => {
      // arrange
      mount(
        <>
          <form id="external" aria-label="External" />
          <Rating mode="input" label="Review" form="external" name="score" defaultValue={3} />
        </>,
      );
      // act
      const result = new FormData(screen.getByRole('form') as HTMLFormElement).get('score');
      // assert
      expect(result).toBe('3');
    });
  });
  invalidRatingContracts();
}

/**
 * Exercise parent-controlled selection through the same callback consumers receive.
 **/
function Controlled() {
  const [value, setValue] = useState(2);
  return <Rating mode="input" label="Review" value={value} onValueChange={setValue} />;
}

/**
 * Check documented runtime boundaries independently of rendering error recovery.
 **/
function invalidRatingContracts() {
  it.each([
    { props: { max: 0 }, value: 0, message: 'Rating max' },
    { props: { max: 11 }, value: 0, message: 'Rating max' },
    { props: { max: 2.5 }, value: 0, message: 'Rating max' },
    { props: { step: 0.25 }, value: 0, message: 'Rating step' },
    { props: {}, value: NaN, message: 'Rating value' },
    { props: {}, value: -1, message: 'Rating value' },
    { props: {}, value: 6, message: 'Rating value' },
    { props: { mode: 'input', label: '' }, value: 0, message: 'visible label' },
    { props: { mode: 'input' }, value: 0, message: 'visible label' },
    { props: { mode: 'input', label: 'Review' }, value: 2.5, message: 'match step' },
  ])('rejects $props with score $value', ({ props, value, message }) => {
    // arrange
    const given = props as RatingProps;
    // act
    const result = () => validateRating(given, value);
    // assert
    expect(result).toThrow(message);
  });
}
