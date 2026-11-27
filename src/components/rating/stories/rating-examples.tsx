import { useState } from 'react';
import { Rating, type RatingSymbol } from '../Rating';

/**
 * Submit real native values and demonstrate native reset without reconstructing form state.
 **/
export function RatingForm({
  step = 0.5,
  symbol = 'star',
}: {
  step?: 1 | 0.5;
  symbol?: RatingSymbol;
}) {
  const [submitted, setSubmitted] = useState('Not submitted');
  return (
    <form
      className="rating-demo__form"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(String(new FormData(event.currentTarget).get('rating')));
      }}
    >
      <button type="button">Before rating</button>
      <Rating
        mode="input"
        label="Your rating"
        name="rating"
        defaultValue={3}
        step={step}
        symbol={symbol}
        showValue
        description="Use arrow keys to choose a rating."
      />
      <button type="submit">Submit rating</button>
      <button type="reset">Reset rating</button>
      <output aria-label="Submitted rating">{submitted}</output>
    </form>
  );
}

/**
 * Keep controlled selection in the parent, including an explicit external update.
 **/
export function ControlledRating() {
  const [value, setValue] = useState(2);
  return (
    <>
      <Rating
        mode="input"
        label="Controlled rating"
        value={value}
        onValueChange={setValue}
        showValue
      />
      <button type="button" onClick={() => setValue(5)}>
        Give five stars
      </button>
    </>
  );
}

/**
 * Recreate the review summaries and three input states from the one-page design.
 **/
export function RatingExample() {
  return (
    <div className="rating-demo">
      <p>fletchstack-ui / Content</p>
      <h1>Rating</h1>
      <div className="rating-demo__themes">
        {(['corporate', 'luna'] as const).map((theme) => (
          <section key={theme} data-theme={theme} className="rating-demo__panel">
            <h2>{theme === 'corporate' ? 'Corporate' : 'Luna'}</h2>
            <h3>Customer rating</h3>
            <Rating value={4.5} size="lg" showValue style={{ '--fs-rating-size-lg': '64px' }} />
          </section>
        ))}
      </div>
      <div className="rating-demo__states">
        <section className="rating-demo__panel">
          <Rating mode="input" label="Your rating" defaultValue={3} size="lg" showValue />
        </section>
        <section className="rating-demo__panel">
          <Rating mode="input" label="Required" size="lg" required error="Choose a rating." />
        </section>
        <section className="rating-demo__panel">
          <Rating mode="input" label="Closed survey" value={4} size="lg" disabled showValue />
        </section>
      </div>
    </div>
  );
}
