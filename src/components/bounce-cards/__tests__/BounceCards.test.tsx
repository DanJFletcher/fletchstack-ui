// @vitest-environment jsdom
import '../../../../tests/support/dom';
import '../../../../tests/support/bounce-platform';
import { render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { BounceCards } from '../BounceCards';
import { bounceContracts } from '../../../../tests/support/bounce-contracts';
import { bounceGeometryContracts } from '../../../../tests/support/bounce-geometry-contracts';

describe('BounceCards', () => bounceContracts(render));
describe('BounceCards geometry', bounceGeometryContracts);
it('renders usable photo semantics before browser measurements', () => {
  // arrange
  const element = (
    <BounceCards images={[{ id: 'one', src: 'data:image/png,photo', alt: 'A landscape' }]} />
  );
  // act
  const result = renderToString(element);
  // assert
  expect(result).toContain('alt="A landscape"');
});
