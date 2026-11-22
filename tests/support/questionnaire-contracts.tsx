import { createRef, type ReactElement } from 'react';
import { act, fireEvent, screen } from '@testing-library/react';
import type { RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { Questionnaire } from '../../src/components/questionnaire/Questionnaire';
import type { QuestionnaireProps } from '../../src/components/questionnaire/types';
import { finalQuestion, multipleQuestion, questionnaireDraft, questionnaireItems, singleQuestion, textQuestion } from './questionnaire-fixtures';

type Mount = (element: ReactElement) => RenderResult;
/**
 * Build a public questionnaire with synthetic defaults and independently replaceable consumer callbacks.
 **/
function fixture(props: Partial<QuestionnaireProps> = {}) {
  return <Questionnaire items={questionnaireItems} onSubmit={() => {}} {...props} />;
}
/**
 * Check observable form behavior through both client mounting and server hydration.
 **/
export function questionnaireContracts(mount: Mount) {
  it('forwards its native form reference, naming and attributes', () => {
    // arrange
    const given = createRef<HTMLFormElement>();
    // act
    mount(fixture({ ref: given, id: 'planning', className: 'custom', 'aria-label': 'Plan work' } as Partial<QuestionnaireProps>));
    // assert
    expect(given.current).toBe(screen.getByRole('form', { name: 'Plan work' }));
    expect(given.current).toHaveAttribute('id', 'planning');
    expect(given.current).toHaveClass('custom', 'fs-questionnaire');
  });
  it('uses an external label without adding a competing accessible name', () => {
    // arrange
    // act
    mount(<><h2 id="name">Project planning</h2>{fixture({ 'aria-labelledby': 'name' })}</>);
    // assert
    expect(screen.getByRole('form', { name: 'Project planning' })).not.toHaveAttribute('aria-label');
  });
  it('keeps inactive questions out of the accessibility tree', () => {
    // arrange
    // act
    mount(fixture());
    // assert
    expect(screen.getByRole('group', { name: 'Choose a feature' })).toBeVisible();
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Previous' })).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Question 1 of 3');
  });
  it('does not advance when a single option is chosen', async () => {
    // arrange
    const user = userEvent.setup(); mount(fixture());
    // act
    await user.click(screen.getByRole('radio', { name: 'Alpha' }));
    // assert
    expect(screen.getByRole('radio', { name: 'Alpha' })).toBeChecked();
    expect(screen.getByRole('status')).toHaveTextContent('Question 1 of 3');
  });
  it('clears an exclusive option when nonblank custom text is entered', async () => {
    // arrange
    const user = userEvent.setup(); mount(fixture({ defaultAnswers: questionnaireDraft }));
    // act
    await user.type(screen.getByRole('textbox', { name: 'Other feature' }), '  history  ');
    // assert
    expect(screen.getByRole('radio', { name: 'Alpha' })).not.toBeChecked();
    expect(screen.getByRole('textbox')).toHaveValue('  history  ');
  });
  it('clears exclusive custom text when an option is selected', async () => {
    // arrange
    const user = userEvent.setup(); mount(fixture({ defaultAnswers: { feature: { kind: 'choice', values: [], other: 'history' } } }));
    // act
    await user.click(screen.getByRole('radio', { name: 'Beta' }));
    // assert
    expect(screen.getByRole('textbox')).toHaveValue('');
    expect(screen.getByRole('radio', { name: 'Beta' })).toBeChecked();
  });
  it('does not clear an option merely by focusing the custom field', async () => {
    // arrange
    const user = userEvent.setup(); mount(fixture({ defaultAnswers: questionnaireDraft }));
    // act
    await user.click(screen.getByRole('textbox'));
    // assert
    expect(screen.getByRole('radio', { name: 'Alpha' })).toBeChecked();
  });
  it('accumulates custom text alongside multiple choices in the normalized submission', async () => {
    // arrange
    const user = userEvent.setup(); const submit = vi.fn();
    mount(fixture({ items: [multipleQuestion], defaultAnswers: { updates: { kind: 'choice', values: ['p'] } }, onSubmit: submit }));
    await user.click(screen.getByRole('checkbox', { name: 'Decisions' }));
    await user.type(screen.getByRole('textbox'), '  context  ');
    // act
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    // assert
    expect(submit).toHaveBeenCalledWith({ updates: { kind: 'choice', values: ['p', 'd'], other: 'context' } });
  });
  it('clears a multiple choice when its checked control is activated again', async () => {
    // arrange
    const user = userEvent.setup(); mount(fixture({ items: [multipleQuestion], defaultAnswers: { updates: { kind: 'choice', values: ['p'] } } }));
    // act
    await user.click(screen.getByRole('checkbox', { name: 'Progress' }));
    // assert
    expect(screen.getByRole('checkbox', { name: 'Progress' })).not.toBeChecked();
  });
  it('validates the current question and focuses its first enabled answer', async () => {
    // arrange
    const user = userEvent.setup(); mount(fixture());
    // act
    await user.click(screen.getByRole('button', { name: 'Next' }));
    // assert
    expect(screen.getByRole('alert')).toHaveTextContent('Choose or enter an answer to continue.');
    expect(screen.getByRole('radio', { name: 'Alpha' })).toHaveFocus();
  });
  it('revalidates a displayed error as the answer changes', async () => {
    // arrange
    const user = userEvent.setup(); mount(fixture()); await user.click(screen.getByRole('button', { name: 'Next' }));
    // act
    await user.click(screen.getByRole('radio', { name: 'Alpha' }));
    // assert
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
  it('retains drafts when returning to an earlier question', async () => {
    // arrange
    const user = userEvent.setup(); mount(fixture({ defaultAnswers: questionnaireDraft })); await user.click(screen.getByRole('button', { name: 'Next' }));
    // act
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    // assert
    expect(screen.getByRole('radio', { name: 'Alpha' })).toBeChecked();
    expect(screen.getByRole('group')).toHaveFocus();
  });
  it('requires an optional question to be answered or explicitly skipped', async () => {
    // arrange
    const user = userEvent.setup(); mount(fixture({ items: [multipleQuestion] }));
    // act
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    // assert
    expect(screen.getByRole('alert')).toHaveTextContent('Answer this question or select Skip.');
  });
  it('records an explicit skip and clears the prior optional answer', async () => {
    // arrange
    const user = userEvent.setup(); const submit = vi.fn(); mount(fixture({ items: [multipleQuestion], defaultAnswers: questionnaireDraft, onSubmit: submit }));
    await user.click(screen.getByRole('button', { name: 'Skip' }));
    expect(submit).not.toHaveBeenCalled();
    // act
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    // assert
    expect(submit).toHaveBeenCalledWith({ updates: { kind: 'skipped' } });
  });
  it('advances after a nonfinal explicit skip', async () => {
    // arrange
    const user = userEvent.setup(); mount(fixture({ defaultValue: 'updates' }));
    // act
    await user.click(screen.getByRole('button', { name: 'Skip' }));
    // assert
    expect(screen.getByRole('group', { name: 'When to begin?' })).toHaveFocus();
  });
  it('replaces a skipped answer when the user enters a new choice', async () => {
    // arrange
    const user = userEvent.setup(); const submit = vi.fn(); mount(fixture({ items: [multipleQuestion], defaultAnswers: { updates: { kind: 'skipped' } }, onSubmit: submit }));
    await user.click(screen.getByRole('checkbox', { name: 'Progress' }));
    // act
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    // assert
    expect(submit).toHaveBeenCalledWith({ updates: { kind: 'choice', values: ['p'] } });
  });
  it('validates the complete flow before submitting a resumed final question', async () => {
    // arrange
    const user = userEvent.setup(); const submit = vi.fn(); mount(fixture({ defaultValue: 'when', defaultAnswers: { when: { kind: 'choice', values: ['now'] } }, onSubmit: submit }));
    // act
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    // assert
    expect(screen.getByRole('radio', { name: 'Alpha' })).toHaveFocus();
    expect(screen.getByRole('alert')).toBeVisible();
    expect(submit).not.toHaveBeenCalled();
  });
  it('only blocks Next for application errors on the current question', async () => {
    // arrange
    const user = userEvent.setup(); mount(fixture({ defaultAnswers: questionnaireDraft, validate: () => ({ when: 'Choose later.' }) }));
    // act
    await user.click(screen.getByRole('button', { name: 'Next' }));
    // assert
    expect(screen.getByRole('group', { name: 'Choose updates' })).toBeVisible();
  });
  it('exposes application validation on the current text answer', async () => {
    // arrange
    const user = userEvent.setup(); mount(fixture({ items: [textQuestion], defaultAnswers: { feedback: { kind: 'text', value: 'short' } }, validate: () => ({ feedback: 'Please describe the change.' }) }));
    // act
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    // assert
    expect(screen.getByRole('textbox')).toHaveFocus();
    expect(screen.getByRole('alert')).toHaveTextContent('Please describe the change.');
  });
  it('keeps controlled answers authoritative until the parent accepts a request', async () => {
    // arrange
    const user = userEvent.setup(); const change = vi.fn(); mount(fixture({ answers: {}, onAnswersChange: change }));
    // act
    await user.click(screen.getByRole('radio', { name: 'Alpha' }));
    // assert
    expect(change).toHaveBeenCalledWith({ feature: { kind: 'choice', values: ['a'] } });
    expect(screen.getByRole('radio', { name: 'Alpha' })).not.toBeChecked();
  });
  it('does not move controlled navigation until the parent accepts its requested ID', async () => {
    // arrange
    const user = userEvent.setup(); const change = vi.fn(); const view = mount(fixture({ value: 'feature', defaultAnswers: questionnaireDraft, onValueChange: change }));
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(change).toHaveBeenCalledWith('updates');
    expect(screen.getByRole('group', { name: 'Choose a feature' })).toBeVisible();
    // act
    view.rerender(fixture({ value: 'updates', defaultAnswers: questionnaireDraft, onValueChange: change }));
    // assert
    expect(screen.getByRole('group', { name: 'Choose updates' })).toHaveFocus();
  });
  it('preserves the active ID and draft when items reorder', () => {
    // arrange
    const view = mount(fixture({ defaultValue: 'updates', defaultAnswers: questionnaireDraft }));
    // act
    view.rerender(fixture({ items: [multipleQuestion, finalQuestion, singleQuestion] }));
    // assert
    expect(screen.getByRole('status')).toHaveTextContent('Question 1 of 3');
    expect(screen.getByRole('checkbox', { name: 'Progress' })).toBeChecked();
  });
  it('uses the former position when the active question is removed', () => {
    // arrange
    const view = mount(fixture({ defaultValue: 'updates' }));
    // act
    view.rerender(fixture({ items: [singleQuestion, finalQuestion] }));
    // assert
    expect(screen.getByRole('group', { name: 'When to begin?' })).toHaveFocus();
  });
  it('renders a noninteractive empty state when all questions are removed', () => {
    // arrange
    const view = mount(fixture());
    // act
    view.rerender(fixture({ items: [], labels: { empty: 'Nothing to answer.' } }));
    // assert
    expect(screen.getByText('Nothing to answer.')).toBeVisible();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
  it('ignores later changes to mount defaults', () => {
    // arrange
    const view = mount(fixture({ defaultAnswers: questionnaireDraft }));
    // act
    view.rerender(fixture({ defaultValue: 'when', defaultAnswers: { feature: { kind: 'choice', values: ['b'] } } }));
    // assert
    expect(screen.getByRole('radio', { name: 'Alpha' })).toBeChecked();
  });
  it('restores original defaults through the native reset method', async () => {
    // arrange
    const user = userEvent.setup(); mount(fixture({ defaultAnswers: questionnaireDraft })); await user.click(screen.getByRole('radio', { name: 'Beta' })); await user.click(screen.getByRole('button', { name: 'Next' }));
    // act
    act(() => screen.getByRole<HTMLFormElement>('form').reset());
    // assert
    expect(screen.getByRole('radio', { name: 'Alpha' })).toBeChecked();
  });
  it('honors a consumer cancellation of reset', async () => {
    // arrange
    const user = userEvent.setup(); mount(fixture({ defaultAnswers: questionnaireDraft, onReset: event => event.preventDefault() })); await user.click(screen.getByRole('radio', { name: 'Beta' }));
    // act
    act(() => screen.getByRole<HTMLFormElement>('form').reset());
    // assert
    expect(screen.getByRole('radio', { name: 'Beta' })).toBeChecked();
  });
  it('requests controlled reset without overriding either controlled slice', () => {
    // arrange
    const answers = vi.fn(); const value = vi.fn(); mount(fixture({ answers: questionnaireDraft, value: 'when', defaultValue: 'feature', onAnswersChange: answers, onValueChange: value }));
    // act
    act(() => screen.getByRole<HTMLFormElement>('form').reset());
    // assert
    expect(answers).toHaveBeenCalledWith({});
    expect(value).toHaveBeenCalledWith('feature');
    expect(screen.getByRole('group', { name: 'When to begin?' })).toBeVisible();
  });
  it('submits an exact complete payload after explicit navigation', async () => {
    // arrange
    const user = userEvent.setup(); const submit = vi.fn(); mount(fixture({ defaultAnswers: questionnaireDraft, defaultValue: 'when', onSubmit: submit }));
    // act
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    // assert
    expect(submit).toHaveBeenCalledWith({ feature: { kind: 'choice', values: ['a'] }, updates: { kind: 'choice', values: ['p', 'd'] }, when: { kind: 'choice', values: ['now'] } });
  });
  it('locks controls and ignores repeated submission while a save is pending', async () => {
    // arrange
    let resolve!: () => void; const submit = vi.fn(() => new Promise<void>(finish => { resolve = finish; }));
    mount(fixture({ defaultValue: 'when', defaultAnswers: questionnaireDraft, onSubmit: submit }));
    const form = screen.getByRole<HTMLFormElement>('form'); fireEvent.submit(form);
    // act
    fireEvent.submit(form);
    // assert
    expect(submit).toHaveBeenCalledTimes(1);
    expect(form).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('radio', { name: 'Now' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Submitting...' })).toBeDisabled();
    await act(async () => resolve());
  });
  it('guards synchronous reentrant submit callbacks', async () => {
    // arrange
    const submit = vi.fn(() => { fireEvent.submit(screen.getByRole('form')); });
    mount(fixture({ items: [finalQuestion], defaultAnswers: questionnaireDraft, onSubmit: submit }));
    // act
    await act(async () => { fireEvent.submit(screen.getByRole('form')); });
    // assert
    expect(submit).toHaveBeenCalledTimes(1);
  });
  it('prevents native reset while persistence is pending', async () => {
    // arrange
    let resolve!: () => void; const reset = vi.fn(); mount(fixture({ defaultValue: 'when', defaultAnswers: questionnaireDraft, onReset: reset, onSubmit: () => new Promise<void>(finish => { resolve = finish; }) }));
    fireEvent.submit(screen.getByRole('form'));
    // act
    act(() => screen.getByRole<HTMLFormElement>('form').reset());
    // assert
    expect(reset.mock.calls[0]![0].defaultPrevented).toBe(true);
    expect(screen.getByRole('group', { name: 'When to begin?' })).toBeVisible();
    await act(async () => resolve());
  });
  it.each([false, true])('keeps drafts after a failed save and permits an explicit retry (async=%s)', async asynchronous => {
    // arrange
    const user = userEvent.setup(); const submit = vi.fn().mockImplementationOnce(() => { if (asynchronous) { return Promise.reject(new Error('private secret')); } throw new Error('private secret'); }).mockResolvedValue(undefined);
    mount(fixture({ items: [finalQuestion], defaultAnswers: questionnaireDraft, onSubmit: submit })); await user.click(screen.getByRole('button', { name: 'Submit' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Unable to save your answers. Please try again.');
    expect(screen.queryByText('private secret')).not.toBeInTheDocument();
    // act
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    // assert
    expect(submit).toHaveBeenCalledTimes(2);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Now' })).toBeChecked();
  });
  it.each([false, true])('ignores completion after unmount (reject=%s)', async reject => {
    // arrange
    let finish!: () => void; const view = mount(fixture({ items: [finalQuestion], defaultAnswers: questionnaireDraft, onSubmit: () => new Promise<void>((resolve, fail) => { finish = reject ? () => fail(new Error('obsolete')) : resolve; }) }));
    fireEvent.submit(screen.getByRole('form')); view.unmount();
    // act
    await act(async () => finish());
    // assert
    expect(screen.queryByRole('form')).not.toBeInTheDocument();
  });
  it('uses instance-specific IDs and native radio names', () => {
    // arrange
    // act
    mount(<>{fixture({ 'aria-label': 'First' })}{fixture({ 'aria-label': 'Second' })}</>);
    // assert
    const radios = screen.getAllByRole('radio', { name: 'Alpha' });
    expect(radios[0]!.id).not.toBe(radios[1]!.id);
    expect(radios[0]!.getAttribute('name')).not.toBe(radios[1]!.getAttribute('name'));
  });
  it('activates an enabled option through a scoped letter shortcut', async () => {
    // arrange
    const user = userEvent.setup(); mount(fixture({ shortcuts: 'letters' })); screen.getByRole('radio', { name: 'Alpha' }).focus();
    // act
    await user.keyboard('b');
    // assert
    expect(screen.getByRole('radio', { name: 'Beta' })).toHaveFocus();
    expect(screen.getByRole('radio', { name: 'Beta' })).toBeChecked();
  });
  it('pauses shortcuts during text entry', async () => {
    // arrange
    const user = userEvent.setup(); mount(fixture({ shortcuts: 'numbers' }));
    // act
    await user.type(screen.getByRole('textbox'), '1');
    // assert
    expect(screen.getByRole('textbox')).toHaveValue('1');
    expect(screen.getByRole('radio', { name: 'Alpha' })).not.toBeChecked();
  });
  it.each([{ key: 'a', ctrlKey: true }, { key: 'a', metaKey: true }, { key: 'a', altKey: true }, { key: 'a', repeat: true }, { key: 'a', isComposing: true }, { key: 'z' }])('leaves excluded shortcut events untouched: %j', event => {
    // arrange
    mount(fixture({ shortcuts: 'letters' })); const input = screen.getByRole('radio', { name: 'Alpha' });
    // act
    const result = fireEvent.keyDown(input, event);
    // assert
    expect(result).toBe(true);
    expect(input).not.toBeChecked();
  });
  it('honors a consumer key handler that prevents a shortcut', () => {
    // arrange
    const handler = vi.fn(event => event.preventDefault()); mount(fixture({ shortcuts: 'letters', onKeyDown: handler }));
    // act
    fireEvent.keyDown(screen.getByRole('radio', { name: 'Alpha' }), { key: 'a' });
    // assert
    expect(handler).toHaveBeenCalledOnce();
    expect(screen.getByRole('radio', { name: 'Alpha' })).not.toBeChecked();
  });
  it('does not activate shortcuts by default', () => {
    // arrange
    mount(fixture());
    // act
    fireEvent.keyDown(screen.getByRole('radio', { name: 'Alpha' }), { key: 'a' });
    // assert
    expect(screen.getByRole('radio', { name: 'Alpha' })).not.toBeChecked();
  });
  it('renders single-line text-only questions with consumer labels', async () => {
    // arrange
    const user = userEvent.setup(); const submit = vi.fn(); mount(fixture({ items: [{ id: 'name', type: 'text', title: 'Your name', input: { label: 'Name', placeholder: 'Name here' } }], onSubmit: submit }));
    await user.type(screen.getByRole('textbox', { name: 'Name' }), '  Example  ');
    // act
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    // assert
    expect(submit).toHaveBeenCalledWith({ name: { kind: 'text', value: 'Example' } });
  });
  it('clearing a custom single answer leaves the question unanswered', async () => {
    // arrange
    const user = userEvent.setup(); mount(fixture({ defaultAnswers: { feature: { kind: 'choice', values: [], other: 'history' } } }));
    await user.clear(screen.getByRole('textbox'));
    // act
    await user.click(screen.getByRole('button', { name: 'Next' }));
    // assert
    expect(screen.getByRole('alert')).toBeVisible();
  });
  it('clearing a text-only draft leaves the question unanswered', async () => {
    // arrange
    const user = userEvent.setup(); mount(fixture({ items: [textQuestion], defaultAnswers: { feedback: { kind: 'text', value: 'feedback' } } }));
    await user.clear(screen.getByRole('textbox'));
    // act
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    // assert
    expect(screen.getByRole('alert')).toBeVisible();
  });
  it('focuses custom-only questions when validation fails', async () => {
    // arrange
    const user = userEvent.setup(); mount(fixture({ items: [{ id: 'other', type: 'single', title: 'Your idea', options: [], other: { label: 'Idea' } }] }));
    // act
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    // assert
    expect(screen.getByRole('textbox', { name: 'Idea' })).toHaveFocus();
  });
  it('waits for controlled navigation before focusing an earlier invalid answer', async () => {
    // arrange
    const user = userEvent.setup(); const change = vi.fn(); const view = mount(fixture({ value: 'when', onValueChange: change, defaultAnswers: { when: { kind: 'choice', values: ['now'] } } }));
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    expect(change).toHaveBeenCalledWith('feature');
    expect(screen.getByRole('button', { name: 'Submit' })).toHaveFocus();
    // act
    view.rerender(fixture({ value: 'feature', onValueChange: change }));
    // assert
    expect(screen.getByRole('radio', { name: 'Alpha' })).toHaveFocus();
  });
  it('toggles a multiple choice through a numeric shortcut without advancing', () => {
    // arrange
    mount(fixture({ items: [multipleQuestion], shortcuts: 'numbers' }));
    // act
    fireEvent.keyDown(screen.getByRole('checkbox', { name: 'Progress' }), { key: '2' });
    // assert
    expect(screen.getByRole('checkbox', { name: 'Decisions' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Decisions' })).toHaveFocus();
  });
  it('does not prevent keys in the empty state without an active fieldset', () => {
    // arrange
    mount(fixture({ items: [], shortcuts: 'letters' }));
    // act
    const result = fireEvent.keyDown(screen.getByRole('form'), { key: 'a' });
    // assert
    expect(result).toBe(true);
  });
  it('never submits an empty questionnaire through a native submit event', () => {
    // arrange
    const submit = vi.fn(); mount(fixture({ items: [], onSubmit: submit }));
    // act
    fireEvent.submit(screen.getByRole('form'));
    // assert
    expect(submit).not.toHaveBeenCalled();
  });
  it('honors a native capture handler that cancels submission', () => {
    // arrange
    const submit = vi.fn(); mount(fixture({ items: [finalQuestion], defaultAnswers: questionnaireDraft, onSubmit: submit, onSubmitCapture: event => event.preventDefault() }));
    // act
    fireEvent.submit(screen.getByRole('form'));
    // assert
    expect(submit).not.toHaveBeenCalled();
  });
  it('ignores choice shortcuts while a save is in flight', async () => {
    // arrange
    let resolve!: () => void; const changes = vi.fn(); mount(fixture({ items: [finalQuestion], defaultAnswers: questionnaireDraft, shortcuts: 'letters', onAnswersChange: changes, onSubmit: () => new Promise<void>(finish => { resolve = finish; }) }));
    fireEvent.submit(screen.getByRole('form'));
    // act
    fireEvent.keyDown(screen.getByRole('form'), { key: 'b' });
    // assert
    expect(changes).not.toHaveBeenCalled();
    await act(async () => resolve());
  });
  it('allows custom text input to keep its newline when shortcuts are enabled', async () => {
    // arrange
    const user = userEvent.setup(); mount(fixture({ items: [textQuestion], shortcuts: 'letters' }));
    // act
    await user.type(screen.getByRole('textbox'), 'a{Enter}b');
    // assert
    expect(screen.getByRole('textbox')).toHaveValue('a\nb');
  });

  it('leaves choices beyond the letter shortcut range accessible without a hint', () => {
    // arrange
    const options = Array.from({ length: 27 }, (_, index) => ({ value: String(index), label: `Choice ${index}` }));
    mount(fixture({ items: [{ id: 'many', type: 'single', title: 'Many choices', options }], shortcuts: 'letters' }));
    // act
    const result = fireEvent.keyDown(screen.getByRole('radio', { name: 'Choice 26' }), { key: '?' });
    // assert
    expect(result).toBe(true);
    expect(screen.getByRole('radio', { name: 'Choice 26' })).not.toBeChecked();
    expect(screen.getByRole('radio', { name: 'Choice 26' }).closest('label')).not.toHaveTextContent('AA');
  });
  it('keeps scoped shortcuts inactive in a contenteditable descendant', () => {
    // arrange
    mount(fixture({ shortcuts: 'letters' })); const editable = document.createElement('span'); editable.setAttribute('contenteditable', 'true'); screen.getByRole('group').append(editable);
    // act
    const result = fireEvent.keyDown(editable, { key: 'a' });
    // assert
    expect(result).toBe(true);
    expect(screen.getByRole('radio', { name: 'Alpha' })).not.toBeChecked();
  });

  it.each([{ defaultValue: 'updates' }, { value: 'updates' }])('keeps the replacement question active when surviving items later reorder: %j', navigation => {
    // arrange
    const view = mount(fixture(navigation));
    view.rerender(fixture({ ...navigation, items: [singleQuestion, finalQuestion] }));
    // act
    view.rerender(fixture({ ...navigation, items: [finalQuestion, singleQuestion] }));
    // assert
    expect(screen.getByRole('group', { name: 'When to begin?' })).toBeVisible();
    expect(screen.getByRole('status')).toHaveTextContent('Question 1 of 2');
  });

}
