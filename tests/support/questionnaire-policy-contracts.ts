import { expect, it, vi } from 'vitest';
import { checkItems } from '../../src/components/questionnaire/definitions';
import { answerSnapshot, normalizeAnswer, validateAnswers } from '../../src/components/questionnaire/validation';
import { answerText, chooseAnswer, copyAnswers, displayedValues, readAnswer, replaceAnswer, writeAnswer } from '../../src/components/questionnaire/answers';
import { shortcutLabel } from '../../src/components/questionnaire/shortcuts';
import { questionnaireLabels } from '../../src/components/questionnaire/labels';
import type { QuestionnaireAnswer, QuestionnaireItem } from '../../src/components/questionnaire/types';
import { finalQuestion, multipleQuestion, questionnaireItems, singleQuestion, textQuestion } from './questionnaire-fixtures';

/**
 * Verify definition and snapshot rules against explicit contract examples in both independent test projects.
 **/
export function questionnairePolicyContracts() {
  it('normalizes the complete payload without unknown IDs, obsolete choices or surrounding whitespace', () => {
    // arrange
    const given = { feature: { kind: 'choice', values: [], other: '  history search  ' }, updates: { kind: 'choice', values: ['d', 'gone', 'p', 'd', 'disabled'], other: '  more context  ' }, when: { kind: 'choice', values: ['now'] }, gone: { kind: 'skipped' } } as const;

    // act
    const result = answerSnapshot(questionnaireItems, given);

    // assert
    expect(result).toEqual({ feature: { kind: 'choice', values: [], other: 'history search' }, updates: { kind: 'choice', values: ['p', 'd'], other: 'more context' }, when: { kind: 'choice', values: ['now'] } });
  });
  it('trims text and preserves explicit skips in a fresh snapshot', () => {
    // arrange
    const given = { feedback: { kind: 'text', value: '  useful feedback  ' }, updates: { kind: 'skipped' } } as const;

    // act
    const result = answerSnapshot([textQuestion, multipleQuestion], given);

    // assert
    expect(result).toEqual({ feedback: { kind: 'text', value: 'useful feedback' }, updates: { kind: 'skipped' } });
  });
  const invalid: [QuestionnaireItem, QuestionnaireAnswer | undefined, string | undefined][] = [
    [singleQuestion, undefined, undefined], [singleQuestion, { kind: 'skipped' }, undefined],
    [textQuestion, { kind: 'choice', values: ['a'] }, 'Enter a valid text answer for this question.'],
    [singleQuestion, { kind: 'text', value: 'Alpha' }, 'Choose a valid answer for this question.'],
    [singleQuestion, { kind: 'choice', values: ['a', 'b'] }, 'Choose one option or enter a custom answer, not both.'],
    [singleQuestion, { kind: 'choice', values: ['a'], other: 'custom' }, 'Choose one option or enter a custom answer, not both.'],
    [finalQuestion, { kind: 'choice', values: [], other: 'custom' }, 'Custom answers are not available for this question.'],
    [singleQuestion, { kind: 'choice', values: [], other: 'a'.repeat(21) }, 'Use no more than 20 characters.'],
    [textQuestion, { kind: 'text', value: 'a'.repeat(21) }, 'Use no more than 20 characters.'],
    [textQuestion, { kind: 'text', value: '   ' }, undefined],
    [singleQuestion, { kind: 'choice', values: ['gone', 'disabled'] }, 'Choose one option or enter a custom answer, not both.'],
    [singleQuestion, { kind: 'choice', values: ['disabled'] }, undefined],
    [multipleQuestion, { kind: 'choice', values: [], other: '   ' }, undefined],
  ];
  it.each(invalid)('rejects incompatible, unanswered or overlong supplied answers: %j %j', (item, answer, expected) => {
    // arrange
    // act
    const result = normalizeAnswer(item, answer);

    // assert
    expect(result.answer).toBeUndefined();
    expect(result.error).toBe(expected);
  });
  it('accepts unrestricted text when no length limit is configured', () => {
    // arrange
    const item: QuestionnaireItem = { id: 'text', type: 'text', title: 'Notes', input: { label: 'Notes' } };

    // act
    const result = normalizeAnswer(item, { kind: 'text', value: 'notes' });

    // assert
    expect(result.answer).toEqual({ kind: 'text', value: 'notes' });
  });
  it('omits whitespace-only custom text beside a valid selection', () => {
    // arrange
    // act
    const result = normalizeAnswer(singleQuestion, { kind: 'choice', values: ['a'], other: ' ' });

    // assert
    expect(result.answer).toEqual({ kind: 'choice', values: ['a'] });
  });
  it('does not invoke application validation before built-in rules pass', () => {
    // arrange
    const validate = vi.fn(() => ({}));

    // act
    const result = validateAnswers({ items: questionnaireItems, answers: {}, labels: questionnaireLabels, validate }, ['feature']);

    // assert
    expect(result).toEqual({ feature: 'Choose or enter an answer to continue.' });
    expect(validate).not.toHaveBeenCalled();
  });
  it('requires explicit skip for an unanswered optional question', () => {
    // arrange
    // act
    const result = validateAnswers({ items: questionnaireItems, answers: {}, labels: questionnaireLabels, validate: undefined }, ['updates']);

    // assert
    expect(result).toEqual({ updates: 'Answer this question or select Skip.' });
  });
  it('limits custom errors to the requested scope and ignores blank or unknown IDs', () => {
    // arrange
    const options = { items: questionnaireItems, answers: { feature: { kind: 'choice', values: ['a'] } } as const, labels: questionnaireLabels, validate: () => ({ feature: 'Custom failure', updates: 'Later issue', unknown: 'Ignored' }) };

    // act
    const result = validateAnswers(options, ['feature']);

    // assert
    expect(result).toEqual({ feature: 'Custom failure' });
  });
  it('ignores empty custom messages', () => {
    // arrange
    // act
    const result = validateAnswers({ items: [singleQuestion], answers: { feature: { kind: 'choice', values: ['a'] } }, labels: questionnaireLabels, validate: () => ({ feature: '   ' }) }, ['feature']);

    // assert
    expect(result).toEqual({});
  });
  it('does not invent a draft from prototype property names', () => {
    // arrange
    // act
    const result = readAnswer({}, 'constructor');

    // assert
    expect(result).toBeUndefined();
  });
  it('preserves opaque IDs without changing an object prototype', () => {
    // arrange
    // act
    const result = replaceAnswer({}, '__proto__', { kind: 'text', value: 'safe' });

    // assert
    expect(readAnswer(result, '__proto__')).toEqual({ kind: 'text', value: 'safe' });
    expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
  });
  it('copies drafts without retaining consumer choice-array references', () => {
    // arrange
    const given = { feature: { kind: 'choice', values: ['a'] }, text: { kind: 'text', value: 'draft' }, skipped: { kind: 'skipped' }, absent: undefined } as const;

    // act
    const result = copyAnswers(given);

    // assert
    expect(result).toEqual(given);
    expect(result['feature']).not.toBe(given.feature);
    expect(result['text']).not.toBe(given.text);
  });
  it('leaves malformed exclusive drafts visually unselected', () => {
    // arrange
    // act
    const result = displayedValues(singleQuestion as Exclude<QuestionnaireItem, { type: 'text' }>, { kind: 'choice', values: ['a', 'b'] });

    // assert
    expect(result).toEqual([]);
  });
  it('clears the answer key after the final multiple choice is removed', () => {
    // arrange
    // act
    const result = chooseAnswer(multipleQuestion as Exclude<QuestionnaireItem, { type: 'text' }>, { kind: 'choice', values: ['p'] }, 'p');

    // assert
    expect(result).toBeUndefined();
  });
  it('retains custom multiple-choice text after removing its last option', () => {
    // arrange
    // act
    const result = chooseAnswer(multipleQuestion as Exclude<QuestionnaireItem, { type: 'text' }>, { kind: 'choice', values: ['p'], other: 'context' }, 'p');

    // assert
    expect(result).toEqual({ kind: 'choice', values: [], other: 'context' });
  });
  it('preserves whitespace drafts until submission normalization', () => {
    // arrange
    // act
    const result = writeAnswer(singleQuestion, { kind: 'choice', values: ['a'] }, '  ');

    // assert
    expect(result).toEqual({ kind: 'choice', values: ['a'], other: '  ' });
  });
  it('reads unanswered and choice-without-custom-text drafts as empty', () => {
    // arrange
    // act
    const result = [answerText(undefined), answerText({ kind: 'choice', values: ['a'] })];

    // assert
    expect(result).toEqual(['', '']);
  });
  it('caps shortcut hints without assigning an extra key', () => {
    // arrange
    // act
    const result = [shortcutLabel('none', 0), shortcutLabel('letters', 25), shortcutLabel('letters', 26), shortcutLabel('numbers', 8), shortcutLabel('numbers', 9)];

    // assert
    expect(result).toEqual([undefined, 'Z', undefined, '9', undefined]);
  });
  const badItems: [readonly QuestionnaireItem[], string][] = [
    [[{ ...singleQuestion, id: '' }], 'question IDs'], [[singleQuestion, singleQuestion], 'question IDs'],
    [[{ ...singleQuestion, title: ' ' }], 'visible title'],
    [[{ id: 'q', type: 'single', title: 'Q', options: [{ value: 'a', label: 'A' }, { value: 'a', label: 'B' }] }], 'option values'],
    [[{ id: 'q', type: 'single', title: 'Q', options: [{ value: '', label: 'A' }] }], 'option values'],
    [[{ id: 'q', type: 'single', title: 'Q', options: [{ value: 'a', label: ' ' }] }], 'visible labels'],
    [[{ id: 'q', type: 'single', title: 'Q', options: [] }], 'enabled option'],
    [[{ id: 'q', type: 'single', title: 'Q', options: [], other: { label: 'Other', maxLength: 0 } }], 'usable custom-answer'],
    [[{ id: 'q', type: 'text', title: 'Q', input: { label: ' ' } }], 'visible label'],
    [[{ id: 'q', type: 'text', title: 'Q', input: { label: 'Input', maxLength: -1 } }], 'nonnegative integer'],
    [[{ id: 'q', type: 'text', title: 'Q', input: { label: 'Input', maxLength: 1.5 } }], 'nonnegative integer'],
  ];
  it.each(badItems)('reports malformed definitions clearly: %j', (items, expected) => {
    // arrange
    // act
    const act = () => checkItems(items);

    // assert
    expect(act).toThrow(expected);
  });
  it('accepts empty questionnaires and exclusively custom choice questions', () => {
    // arrange
    // act
    const result = [checkItems([]), checkItems([{ id: 'q', type: 'single', title: 'Q', options: [], other: { label: 'Other' } }])];

    // assert
    expect(result).toEqual([undefined, undefined]);
  });
}
