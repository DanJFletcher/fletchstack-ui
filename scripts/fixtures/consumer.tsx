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

import { Radio, type RadioProps, type RadioStyle } from 'fletchstack-ui';
import 'fletchstack-ui/radio.css';
const radioRef = createRef<HTMLInputElement>();
const radioStyle: RadioStyle = { '--fs-radio-control-size': '24px' };
const radioProps: RadioProps = { label: 'Standard', name: 'delivery', value: 'standard', style: radioStyle };
export const radio = <Radio {...radioProps} ref={radioRef} defaultChecked />;
// @ts-expect-error Radio requires a visible label.
export const missingRadioLabel = <Radio />;
// @ts-expect-error Radio always renders a native radio.
export const invalidRadioType = <Radio label="Standard" type="checkbox" />;
// @ts-expect-error The visible label owns the accessible name.
export const invalidRadioName = <Radio label="Standard" aria-label="Other" />;
// @ts-expect-error Radios have no native read-only state.
export const invalidRadioReadOnly = <Radio label="Standard" readOnly />;

import { Link, type LinkProps, type LinkStyle } from 'fletchstack-ui';
import 'fletchstack-ui/link.css';
const linkRef = createRef<HTMLAnchorElement>();
const linkStyle: LinkStyle = { '--fs-link-text': 'navy' };
const linkProps: LinkProps = { href: '/docs', children: 'Documentation', variant: 'standalone', style: linkStyle };
export const link = <Link {...linkProps} ref={linkRef} target="_blank" icon={<ExternalLinkIcon />} />;
export const unavailableLink = <Link>Unavailable documentation</Link>;
// @ts-expect-error Descriptive link content is required.
export const missingLinkContent = <Link href="/docs" />;
// @ts-expect-error Link is native navigation, not a button action.
export const invalidLinkRole = <Link href="/docs" role="button">Documentation</Link>;
// @ts-expect-error Link supports inline or standalone variants.
export const invalidLinkVariant = <Link href="/docs" variant="primary">Documentation</Link>;

import { Switch, type SwitchProps, type SwitchStyle } from 'fletchstack-ui';
import 'fletchstack-ui/switch.css';
const switchRef = createRef<HTMLInputElement>();
const switchStyle: SwitchStyle = { '--fs-switch-label-gap': '12px' };
const switchProps: SwitchProps = { label: 'Notifications', description: 'Project updates.', name: 'notifications', value: 'email', style: switchStyle };
export const setting = <Switch {...switchProps} ref={switchRef} defaultChecked />;
// @ts-expect-error A visible stable label is required.
export const missingSwitchLabel = <Switch />;
// @ts-expect-error Switch always uses its native checkbox input.
export const invalidSwitchType = <Switch label="Notifications" type="radio" />;
// @ts-expect-error Native checked state owns the exposed on/off state.
export const invalidSwitchState = <Switch label="Notifications" aria-checked="mixed" />;
// @ts-expect-error A switch has only on/off states.
export const invalidMixedSwitch = <Switch label="Notifications" indeterminate />;
// @ts-expect-error Native checkbox controls do not support read-only behavior.
export const invalidReadOnlySwitch = <Switch label="Notifications" readOnly />;

import { Spinner, type SpinnerProps, type SpinnerSize, type SpinnerStyle } from 'fletchstack-ui';
import 'fletchstack-ui/spinner.css';
const spinnerRef = createRef<HTMLSpanElement>();
const spinnerSize: SpinnerSize = 'large';
const spinnerStyle: SpinnerStyle = { '--fs-spinner-label-gap': '12px' };
const spinnerProps: SpinnerProps = { label: 'Loading projects…', size: spinnerSize, style: spinnerStyle };
export const loadingStatus = <Spinner {...spinnerProps} ref={spinnerRef} />;
export const loadingButton = <Button disabled><Spinner decorative size="small" />Saving…</Button>;
// @ts-expect-error Spinner has three approved sizes.
export const invalidSpinnerSize = <Spinner size="huge" />;
// @ts-expect-error Spinner describes unknown duration without percentage values.
export const invalidSpinnerProgress = <Spinner aria-valuenow={40} />;
// @ts-expect-error Spinner must not add a keyboard focus stop.
export const invalidSpinnerFocus = <Spinner tabIndex={0} />;
// @ts-expect-error Status text belongs in label, not arbitrary children.
export const invalidSpinnerChildren = <Spinner>Loading</Spinner>;

import { Badge, type BadgeProps, type BadgeStyle, type BadgeTone } from 'fletchstack-ui';
import 'fletchstack-ui/badge.css';
const badgeRef = createRef<HTMLSpanElement>();
const badgeTone: BadgeTone = 'success';
const badgeStyle: BadgeStyle = { '--fs-badge-padding-inline': '12px' };
const badgeProps: BadgeProps = { children: 'Published', tone: badgeTone, style: badgeStyle };
export const badge = <Badge {...badgeProps} ref={badgeRef} icon={<CheckIcon />} />;
export const count = <Badge>{0}</Badge>;
// @ts-expect-error Badge has five semantic tones.
export const invalidBadgeTone = <Badge tone="primary">New</Badge>;
// @ts-expect-error Badge is passive, with no focus stop.
export const invalidBadgeFocus = <Badge tabIndex={0}>New</Badge>;
// @ts-expect-error Consumers own live regions outside Badge.
export const invalidBadgeLive = <Badge aria-live="polite">New</Badge>;
// @ts-expect-error Use Button for actions.
export const invalidBadgeAction = <Badge onClick={() => {}}>New</Badge>;
// @ts-expect-error Badge requires visible text or a number.
export const invalidBadgeContent = <Badge><Button>Remove</Button></Badge>;

import { Separator, type SeparatorProps, type SeparatorStyle, type SeparatorOrientation } from 'fletchstack-ui';
import 'fletchstack-ui/separator.css';
const separatorRef = createRef<HTMLDivElement>();
const separatorOrientation: SeparatorOrientation = 'vertical';
const separatorStyle: SeparatorStyle = { '--fs-separator-thickness': '2px', height: '64px' };
const separatorProps: SeparatorProps = { decorative: false, orientation: separatorOrientation, style: separatorStyle };
export const separator = <Separator {...separatorProps} ref={separatorRef} aria-label="Section boundary" />;
// @ts-expect-error Separator supports horizontal and vertical orientations.
export const invalidSeparatorOrientation = <Separator orientation="diagonal" />;
// @ts-expect-error Static separators do not add focus stops.
export const invalidSeparatorFocus = <Separator tabIndex={0} />;
// @ts-expect-error Separator owns its static semantic role.
export const invalidSeparatorRole = <Separator role="slider" />;
// @ts-expect-error Separator is empty and display-only.
export const invalidSeparatorChildren = <Separator>or</Separator>;
// @ts-expect-error Use a dedicated interactive resizer for adjustable panels.
export const invalidSeparatorValue = <Separator aria-valuenow={50} />;
// @ts-expect-error Separators have no interactive handlers.
export const invalidSeparatorAction = <Separator onClick={() => {}} />;

import { Container, type ContainerProps, type ContainerStyle } from 'fletchstack-ui';
import 'fletchstack-ui/container.css';
const containerRef = createRef<HTMLDivElement>();
const containerStyle: ContainerStyle = { '--fs-container-max-width-content': '900px' };
const containerProps: ContainerProps = { size: 'reading', gutters: false, style: containerStyle, children: <p>Article content</p> };
export const container = <Container {...containerProps} ref={containerRef} id="article" />;
export const defaultContainer = <Container><Button>Save</Button></Container>;
export const wideContainer = <Container size="wide" />;
// @ts-expect-error Container has three approved width presets.
export const invalidContainerSize = <Container size="full" />;
// @ts-expect-error Gutter opt-out is boolean, not a responsive object.
export const invalidContainerGutters = <Container gutters={{ mobile: false }} />;
// @ts-expect-error Container always renders a native div.
export const invalidContainerElement = <Container as="section" />;

import { Stack, type StackProps, type StackStyle } from 'fletchstack-ui';
import 'fletchstack-ui/stack.css';
const stackRef = createRef<HTMLDivElement>();
const stackStyle: StackStyle = { '--fs-space-gap-related': '32px' };
const stackProps: StackProps = { gap: 'group', align: 'start', style: stackStyle, children: <p>Project settings</p> };
export const stack = <Stack {...stackProps} ref={stackRef} id="settings" />;
export const defaultStack = <Container><Stack><TextInput label="Project name" /><Button>Save</Button></Stack></Container>;
// @ts-expect-error Stack gap describes one of four existing relationships.
export const invalidStackGap = <Stack gap="large" />;
// @ts-expect-error Stack has four supported logical cross-axis alignments.
export const invalidStackAlignment = <Stack align="left" />;
// @ts-expect-error Stack stays vertical.
export const invalidStackDirection = <Stack direction="row" />;
// @ts-expect-error Responsive gap objects are not part of the API.
export const invalidStackResponsiveGap = <Stack gap={{ mobile: 'related' }} />;
// @ts-expect-error Stack always renders a native div.
export const invalidStackElement = <Stack as="section" />;
