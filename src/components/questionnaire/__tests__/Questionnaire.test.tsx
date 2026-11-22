// @vitest-environment jsdom
import '../../../../tests/support/dom';
import { render } from '@testing-library/react';
import { questionnaireContracts } from '../../../../tests/support/questionnaire-contracts';
import { questionnairePolicyContracts } from '../../../../tests/support/questionnaire-policy-contracts';
questionnaireContracts(render);
questionnairePolicyContracts();

import { expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import { Questionnaire } from '../Questionnaire';
it('server renders an empty questionnaire without submission controls', () => {
  // arrange
  // act
  const result = renderToString(<Questionnaire items={[]} onSubmit={() => {}} />);
  // assert
  expect(result).toContain('No questions to answer.');
  expect(result).not.toContain('<button');
});
