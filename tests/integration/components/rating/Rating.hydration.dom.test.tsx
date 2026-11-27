// @vitest-environment jsdom
import '../../../support/dom';
import { describe } from 'vitest';
import { render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { ratingContracts } from '../../../support/rating-contracts';

describe('server hydration', () =>
  ratingContracts((element) => {
    const container = document.createElement('div');
    container.innerHTML = renderToString(element);
    document.body.appendChild(container);
    return render(element, {
      container,
      hydrate: true,
      onRecoverableError: (error) => {
        throw error;
      },
    });
  }));

import { expect, it } from 'vitest';
import { Rating } from '../../../../src/components/rating/Rating';

it('exposes a single selected native half-step before hydration', () => {
  const result = renderToString(
    <Rating mode="input" label="Review" name="score" value={3.5} step={0.5} />,
  );
  expect(result.match(/type="radio"/g)).toHaveLength(10);
  expect(result.match(/checked=""/g)).toHaveLength(1);
  expect(result).toContain('aria-label="3.5 out of 5 stars"');
});
