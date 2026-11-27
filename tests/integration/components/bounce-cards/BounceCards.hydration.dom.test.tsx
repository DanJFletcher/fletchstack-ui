// @vitest-environment jsdom
import '../../../support/dom';
import '../../../support/bounce-platform';
import { render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { BounceCards } from '../../../../src/components/bounce-cards/BounceCards';
import { bounceContracts } from '../../../support/bounce-contracts';
import { bounceGeometryContracts } from '../../../support/bounce-geometry-contracts';

describe('Hydrated BounceCards', () =>
  bounceContracts((element) => {
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
describe('BounceCards geometry', bounceGeometryContracts);
it('renders deterministic native photo actions on the server', () => {
  const element = (
    <BounceCards
      images={[{ id: 'one', src: 'data:image/png,photo', alt: 'A landscape' }]}
      onCardClick={() => undefined}
    />
  );
  expect(renderToString(element)).toBe(renderToString(element));
  expect(renderToString(element)).toContain('type="button"');
});
