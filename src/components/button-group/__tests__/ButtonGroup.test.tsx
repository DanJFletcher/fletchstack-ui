// @vitest-environment jsdom
import '../../../../tests/support/dom';
import { render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { createRef } from 'react';
import userEvent from '@testing-library/user-event';
import { Button } from '../../button/Button';
import { ButtonGroup, type ButtonGroupProps, type ButtonGroupStyle } from '../ButtonGroup';

it('applies group defaults while explicit child choices win', () => {
  // arrange
  const given = <ButtonGroup aria-label="Page actions" size="large" variant="secondary"><Button>Save draft</Button><Button size="small" variant="ghost">Preview</Button></ButtonGroup>;

  // act
  render(given);

  // assert
  expect(screen.getByRole('button', { name: 'Save draft' })).toHaveClass('fs-button--large', 'fs-button--secondary');
  expect(screen.getByRole('button', { name: 'Preview' })).toHaveClass('fs-button--small', 'fs-button--ghost');
});

it('uses a visible heading as its accessible group name and preserves a native ref', () => {
  // arrange
  const ref = createRef<HTMLDivElement>();
  const style: ButtonGroupStyle = { '--fs-space-gap-actions': '20px' };
  const given = <><h2 id="actions">Document actions</h2><ButtonGroup aria-labelledby="actions" aria-label="Fallback" id="group" ref={ref} className="consumer" style={style}><Button>Save</Button></ButtonGroup></>;

  // act
  render(given);

  // assert
  expect(ref.current).toBe(screen.getByRole('group', { name: 'Document actions' }));
  expect(ref.current).toHaveAttribute('id', 'group');
  expect(ref.current).toHaveClass('consumer', 'fs-button-group--separated', 'fs-button-group--horizontal', 'fs-button-group--align-start', 'fs-button-group--wrap');
  expect(ref.current).not.toHaveAttribute('tabindex');
  expect(ref.current?.style.getPropertyValue('--fs-space-gap-actions')).toBe('20px');
});

it.each([false, true])('combines group disabled=%s with child disabled without allowing re-enabling', disabled => {
  // arrange
  const given = <ButtonGroup aria-label="Actions" disabled={disabled}><Button disabled={false}>Save</Button><Button disabled>Delete</Button></ButtonGroup>;

  // act
  render(given);

  // assert
  expect(screen.getByRole('button', { name: 'Save' })).toHaveProperty('disabled', disabled);
  expect(screen.getByRole('button', { name: 'Delete' })).toBeDisabled();
});

it('preserves Button defaults when group defaults are omitted', () => {
  // arrange
  const given = <ButtonGroup aria-label="Actions"><Button>Save</Button></ButtonGroup>;

  // act
  render(given);

  // assert
  expect(screen.getByRole('button', { name: 'Save' })).toHaveClass('fs-button--primary', 'fs-button--medium');
  expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute('type', 'button');
});

it('forwards explicit layout choices without leaking component-only attributes', () => {
  // arrange
  const given = <ButtonGroup aria-label="Actions" appearance="joined" orientation="vertical" align="end" wrap={false} fullWidth equalWidth disabled><Button>Save</Button></ButtonGroup>;

  // act
  render(given);

  // assert
  expect(screen.getByRole('group')).toHaveClass('fs-button-group--joined', 'fs-button-group--vertical', 'fs-button-group--align-end', 'fs-button-group--full-width', 'fs-button-group--equal-width');
  expect(screen.getByRole('group')).not.toHaveClass('fs-button-group--wrap');
  expect(screen.getByRole('group')).not.toHaveAttribute('disabled');
  expect(screen.getByRole('group')).not.toHaveAttribute('appearance');
});

it('preserves callback refs, object refs, event handlers and native form association', async () => {
  // arrange
  const user = userEvent.setup();
  const clicked = vi.fn();
  const callback = vi.fn();
  const ref = createRef<HTMLButtonElement>();
  render(<><form id="editor" /><ButtonGroup aria-label="Actions"><Button ref={ref} type="submit" form="editor" name="intent" value="publish" onClick={event => { event.preventDefault(); clicked(); }}>Publish</Button><Button ref={callback}>Preview</Button></ButtonGroup></>);

  // act
  await user.click(screen.getByRole('button', { name: 'Publish' }));

  // assert
  expect(clicked).toHaveBeenCalledOnce();
  expect(ref.current).toBe(screen.getByRole('button', { name: 'Publish' }));
  expect(ref.current).toHaveAttribute('form', 'editor');
  expect(ref.current).toHaveAttribute('name', 'intent');
  expect(ref.current).toHaveAttribute('value', 'publish');
  expect(callback).toHaveBeenCalledWith(screen.getByRole('button', { name: 'Preview' }));
});

it('preserves native reset behavior with real composed Buttons', async () => {
  // arrange
  const user = userEvent.setup();
  render(<form><input aria-label="Title" defaultValue="Draft" /><ButtonGroup aria-label="Actions"><Button type="reset">Reset</Button></ButtonGroup></form>);
  await user.type(screen.getByRole('textbox'), ' changed');

  // act
  await user.click(screen.getByRole('button', { name: 'Reset' }));

  // assert
  expect(screen.getByRole('textbox')).toHaveValue('Draft');
});

it('preserves hidden and conditionally omitted actions through updates', () => {
  // arrange
  const { rerender } = render(<ButtonGroup aria-label="Actions">{false}{null}<Button hidden>Hidden</Button><Button>Save</Button></ButtonGroup>);

  // act
  rerender(<ButtonGroup aria-label="Actions">{undefined}{true}<Button>Shown</Button></ButtonGroup>);

  // assert
  expect(screen.queryByRole('button', { name: 'Save' })).not.toBeInTheDocument();
  expect(screen.getAllByRole('button')).toHaveLength(1);
  expect(screen.getByRole('button', { name: 'Shown' })).toBeVisible();
});

it('allows empty groups during conditional rendering', () => {
  // arrange
  const given = <ButtonGroup aria-label="Pending actions" />;

  // act
  render(given);

  // assert
  expect(screen.getByRole('group', { name: 'Pending actions' })).toBeEmptyDOMElement();
});

it.each([{ 'aria-label': '' }, { 'aria-label': '   ' }, {}, { 'aria-labelledby': '' }])('rejects empty or missing group names %j', name => {
  // arrange
  const props = name as ButtonGroupProps;

  // act
  const act = () => render(<ButtonGroup {...props}><Button>Save</Button></ButtonGroup>);

  // assert
  expect(act).toThrow('ButtonGroup requires aria-label or aria-labelledby.');
});

it.each([<span key="span">Unsupported</span>, <>Fragment</>, 'Text', 4])('rejects unsupported child %j', child => {
  // arrange
  const given = <ButtonGroup aria-label="Actions">{child}</ButtonGroup>;

  // act
  const act = () => render(given);

  // assert
  expect(act).toThrow('ButtonGroup supports direct Button children only.');
});

it('leaves a standalone Button unchanged next to group defaults', () => {
  // arrange
  const given = <><ButtonGroup aria-label="Actions" size="large" variant="secondary" disabled><Button>Grouped</Button></ButtonGroup><Button>Standalone</Button></>;

  // act
  render(given);

  // assert
  expect(screen.getByRole('button', { name: 'Standalone' })).toHaveClass('fs-button--primary', 'fs-button--medium');
  expect(screen.getByRole('button', { name: 'Standalone' })).toBeEnabled();
  expect(screen.getByRole('button', { name: 'Standalone' })).toHaveAttribute('type', 'button');
});
