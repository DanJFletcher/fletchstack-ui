import { createRef } from 'react';
import { Button, type ButtonProps } from 'fletchstack-ui';
import 'fletchstack-ui/styles.css';
import 'fletchstack-ui/tokens.css';
import 'fletchstack-ui/button.css';
import { Select, type SelectProps } from 'fletchstack-ui';
import 'fletchstack-ui/select.css';
import { TextInput, type TextInputProps } from 'fletchstack-ui';
import 'fletchstack-ui/text-input.css';
import { Checkbox, type CheckboxProps } from 'fletchstack-ui';
import 'fletchstack-ui/checkbox.css';

const checkboxRef = createRef<HTMLInputElement>();
const checkboxProps: CheckboxProps = { label: 'Email updates', name: 'channels', value: 'email', description: 'Receive product news.', wrapperStyle: { '--fs-checkbox-control-size': '24px' } };
export const checkbox = <Checkbox {...checkboxProps} ref={checkboxRef} defaultChecked />;
// @ts-expect-error Checkbox always renders a native checkbox.
export const invalidCheckboxType = <Checkbox label="Email" type="radio" />;
// @ts-expect-error Native mixed state owns aria-checked.
export const invalidCheckboxState = <Checkbox label="Email" aria-checked="mixed" />;
// @ts-expect-error Visible label text owns the accessible name.
export const invalidCheckboxName = <Checkbox label="Email" aria-label="Hidden name" />;

const inputRef = createRef<HTMLInputElement>();
const inputProps: TextInputProps = { label: 'Website', prefix: 'https://', helperText: 'Enter a domain.', wrapperStyle: { '--fs-text-input-radius': '8px' } };
export const textInput = <TextInput {...inputProps} ref={inputRef} defaultValue="example.com" />;
// @ts-expect-error TextInput excludes non-textual controls.
export const invalidTextInputType = <TextInput label="Enabled" type="checkbox" />;
// @ts-expect-error Size selects geometry rather than character width.
export const invalidTextInputSize = <TextInput label="Project" size={20} />;

const selectRef = createRef<HTMLSelectElement>();
const selectProps: SelectProps = { label: 'Workspace', name: 'workspace', helperText: 'Choose a workspace.', style: { '--fs-select-radius': '8px' } };
export const select = <Select {...selectProps} ref={selectRef}><option value="personal">Personal</option></Select>;
// @ts-expect-error Select is a single-choice field.
export const invalidMultiple = <Select label="Workspace" multiple />;
// @ts-expect-error Select size describes geometry, not native listbox rows.
export const invalidSelectSize = <Select label="Workspace" size={4} />;

const ref = createRef<HTMLButtonElement>();
const props: ButtonProps = { type: 'submit', variant: 'secondary', size: 'large', style: { '--fs-button-radius': '8px' } };
export const example = <Button {...props} ref={ref} onClick={event => event.currentTarget.focus()}>Save</Button>;
// @ts-expect-error Unsupported variants must remain a public type error.
export const invalid = <Button variant="destructive">Delete</Button>;

import { Icon, MoonIcon, SunIcon, CheckIcon, CloseIcon, ChevronDownIcon, ArrowRightIcon, PlusIcon, ExternalLinkIcon, type IconProps, type NamedIconProps } from 'fletchstack-ui';
import 'fletchstack-ui/icon.css';

const svgRef = createRef<SVGSVGElement>();
const iconProps: IconProps = { label: 'Custom', viewBox: '0 0 32 32', size: 'small', style: { '--fs-icon-size-small': '18px' } };
const namedProps: NamedIconProps = { size: 'large', label: 'Night mode' };
export const customIcon = <Icon {...iconProps} ref={svgRef}><path fill="currentColor" stroke="none" d="M4 4h24v24H4Z" /></Icon>;
export const iconButton = <Button aria-label="Switch to night mode"><MoonIcon /></Button>;
export const icons = <><MoonIcon {...namedProps} ref={svgRef} /><SunIcon /><CheckIcon /><CloseIcon /><ChevronDownIcon /><ArrowRightIcon /><PlusIcon /><ExternalLinkIcon /></>;
// @ts-expect-error Named artwork owns its coordinate space.
export const invalidNamedViewBox = <MoonIcon viewBox="0 0 99 99" />;
// @ts-expect-error Named artwork cannot be replaced through children.
export const invalidNamedChildren = <MoonIcon><path /></MoonIcon>;
// @ts-expect-error Labels own the naming contract.
export const conflictingIconName = <Icon aria-label="Hidden API" />;
// @ts-expect-error Icons do not own keyboard focus.
export const focusableIcon = <Icon tabIndex={0} />;
// @ts-expect-error Semantic dimensions own the icon size.
export const rawIconWidth = <Icon width={100} />;

import { FormGroup, type FormGroupProps, type FormGroupControlProps, type FormGroupStyle } from 'fletchstack-ui';
import 'fletchstack-ui/form-group.css';
const groupRef = createRef<HTMLFieldSetElement>();
const groupStyle: FormGroupStyle = { '--fs-form-group-control-gap': '24px' };
const groupProps: FormGroupProps = { legend: 'Notifications', style: groupStyle, orientation: 'horizontal' };
export const formGroup = <FormGroup {...groupProps} ref={groupRef}>{(controlProps: FormGroupControlProps) => <Checkbox {...controlProps} label="Email" />}</FormGroup>;
// @ts-expect-error FormGroup requires its visible legend.
export const invalidGroup = <FormGroup />;
// @ts-expect-error Orientation is a supported layout choice.
export const invalidGroupOrientation = <FormGroup legend="Contact" orientation="diagonal" />;

import { Field, FieldLabel, FieldDescription, FieldError, type FieldProps, type FieldControlProps, type FieldStyle, type FieldLabelProps, type FieldMessageProps } from 'fletchstack-ui';
import 'fletchstack-ui/field.css';
const fieldRef = createRef<HTMLDivElement>();
const fieldStyle: FieldStyle = { '--fs-field-gap': '12px' };
const fieldProps: FieldProps = { label: 'Notes', style: fieldStyle, children: (control: FieldControlProps) => <textarea {...control} /> };
export const field = <Field {...fieldProps} ref={fieldRef} />;
const labelRef = createRef<HTMLLabelElement>();
const messageRef = createRef<HTMLSpanElement>();
const labelProps: FieldLabelProps = { htmlFor: 'project-name', children: 'Project name' };
const messageProps: FieldMessageProps = { as: 'span', id: 'project-hint', children: 'Use a short name.' };
export const fieldAtoms = <><FieldLabel {...labelProps} ref={labelRef} /><FieldDescription {...messageProps} ref={messageRef} /><FieldError as="span" ref={messageRef}>Enter a name.</FieldError></>;
// @ts-expect-error A field label must target its native control.
export const invalidFieldLabel = <FieldLabel>Name</FieldLabel>;
// @ts-expect-error Field needs a render prop that receives the accessibility relationships.
export const invalidFieldChildren = <Field label="Notes"><textarea /></Field>;
// @ts-expect-error Message semantics are restricted to paragraph or inline text.
export const invalidFieldMessage = <FieldError as="button">Error</FieldError>;

import { Textarea, type TextareaProps, type TextareaStyle } from 'fletchstack-ui';
import 'fletchstack-ui/textarea.css';
const textareaRef = createRef<HTMLTextAreaElement>();
const textareaStyle: TextareaStyle = { '--fs-textarea-minimum-height': '200px', resize: 'vertical' };
const textareaProps: TextareaProps = { label: 'Description', defaultValue: 'First\nSecond', maxLength: 200, showCount: true, style: textareaStyle };
export const textarea = <Textarea {...textareaProps} ref={textareaRef} />;
// @ts-expect-error Textarea requires a visible label.
export const invalidTextareaLabel = <Textarea />;
// @ts-expect-error Textarea values are strings.
export const invalidTextareaValue = <Textarea label="Description" value={42} />;
// @ts-expect-error Use value/defaultValue instead of textarea children.
export const invalidTextareaChildren = <Textarea label="Description">Content</Textarea>;
