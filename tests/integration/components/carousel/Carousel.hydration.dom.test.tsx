// @vitest-environment jsdom
import '../../../support/dom';
import '../../../support/carousel-platform';
import { render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Carousel } from '../../../../src/components/carousel/Carousel';
import { carouselContracts } from '../../../support/carousel-contracts';
import { carouselPolicyContracts } from '../../../support/carousel-policy-contracts';

describe('Hydrated Carousel', () =>
  carouselContracts((element) => {
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
describe('Carousel policy', carouselPolicyContracts);
it('includes only the chosen slide in initial server accessibility', () => {
  const markup = renderToString(
    <Carousel
      label="Stories"
      defaultIndex={1}
      slides={[
        { id: 'first', content: 'First' },
        { id: 'second', content: 'Second' },
      ]}
    />,
  );
  expect(markup).toContain('aria-label="2 of 2" aria-hidden="false"');
});
