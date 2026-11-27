// @vitest-environment jsdom
import '../../../../tests/support/dom';
import '../../../../tests/support/tooltip-platform';
import { render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Tooltip } from '../Tooltip';
import { tooltipContracts } from '../../../../tests/support/tooltip-contracts';

import { tooltipPositionContracts } from '../../../../tests/support/tooltip-position-contracts';

describe('focus-safe placement', tooltipPositionContracts);
describe('Tooltip', () => tooltipContracts(render));
it('rejects a Fragment that cannot receive the description relationship', () => {
  // arrange
  const element = (
    <Tooltip content="Help">
      <>
        <button>Help</button>
      </>
    </Tooltip>
  );

  // act
  const act = () => renderToString(element);

  // assert
  expect(act).toThrow('Tooltip requires one trigger element, not a Fragment.');
});
