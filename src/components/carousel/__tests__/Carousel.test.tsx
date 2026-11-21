// @vitest-environment jsdom
import '../../../../tests/support/dom';
import '../../../../tests/support/carousel-platform';
import { render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Carousel } from '../Carousel';
import { carouselContracts } from '../../../../tests/support/carousel-contracts';
import { carouselPolicyContracts } from '../../../../tests/support/carousel-policy-contracts';

describe('Carousel', () => carouselContracts(render));
describe('Carousel policy', carouselPolicyContracts);
it('renders stable named slides before browser effects run', () => {
  // arrange
  const element = <Carousel label="Stories" slides={[{ id: 'first', content: 'First' }]} />;
  // act
  const result = renderToString(element);
  // assert
  expect(result).toContain('aria-roledescription="carousel"');
});
