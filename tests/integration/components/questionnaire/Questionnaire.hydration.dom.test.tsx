// @vitest-environment jsdom
import '../../../support/dom';
import { render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { questionnaireContracts } from '../../../support/questionnaire-contracts';
import { questionnairePolicyContracts } from '../../../support/questionnaire-policy-contracts';
questionnaireContracts((element) => {
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
});
questionnairePolicyContracts();

import { expect, it } from 'vitest';
import { Questionnaire } from '../../../../src/components/questionnaire/Questionnaire';
it('exposes the initial native controls before hydration', () => {
  // arrange
  // act
  const result = renderToString(
    <Questionnaire
      items={[
        {
          id: 'one',
          type: 'single',
          title: 'Direction',
          options: [{ value: 'build', label: 'Build' }],
        },
      ]}
      defaultAnswers={{ one: { kind: 'choice', values: ['build'] } }}
      onSubmit={() => {}}
    />,
  );
  // assert
  expect(result).toContain('type="radio"');
  expect(result).toContain('checked=""');
  expect(result).toContain('Question 1 of 1');
});
