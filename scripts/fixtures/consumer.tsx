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

import { Cluster, type ClusterProps, type ClusterStyle } from 'fletchstack-ui';
import 'fletchstack-ui/cluster.css';
const clusterRef = createRef<HTMLDivElement>();
const clusterStyle: ClusterStyle = { '--fs-space-gap-actions': '24px' };
const clusterProps: ClusterProps = { gap: 'related', align: 'baseline', justify: 'end', style: clusterStyle, children: <Button>Save</Button> };
export const cluster = <Cluster {...clusterProps} ref={clusterRef} id="actions" />;
export const composedCluster = <Container><Stack><Cluster><Button>Save</Button><Button>Preview</Button></Cluster></Stack></Container>;
// @ts-expect-error Cluster gap maps to three supported relationships.
export const invalidClusterGap = <Cluster gap="section" />;
// @ts-expect-error Cluster has no stretch alignment.
export const invalidClusterAlignment = <Cluster align="stretch" />;
// @ts-expect-error Cluster does not distribute equal-width spaces.
export const invalidClusterJustify = <Cluster justify="space-between" />;
// @ts-expect-error Cluster always uses wrapping rows.
export const invalidClusterDirection = <Cluster direction="column" />;
// @ts-expect-error Consumers use scoped CSS instead of breakpoint objects.
export const invalidClusterResponsiveGap = <Cluster gap={{ mobile: 'actions' }} />;
// @ts-expect-error Cluster always renders a div.
export const invalidClusterElement = <Cluster as="nav" />;

import { SimpleGrid, type SimpleGridProps, type SimpleGridStyle } from 'fletchstack-ui';
import 'fletchstack-ui/simple-grid.css';
const simpleGridRef = createRef<HTMLDivElement>();
const simpleGridStyle: SimpleGridStyle = { '--fs-simple-grid-min-item-width': '180px', '--fs-space-gap-related': '24px' };
const simpleGridProps: SimpleGridProps = { gap: 'group', style: simpleGridStyle, children: <Button>Open project</Button> };
export const simpleGrid = <SimpleGrid {...simpleGridProps} ref={simpleGridRef} aria-label="Projects" />;
export const composedSimpleGrid = <Container><Stack><SimpleGrid><Button>First</Button><Button>Second</Button></SimpleGrid></Stack></Container>;
// @ts-expect-error SimpleGrid supports only the documented gap relationships.
export const invalidSimpleGridGap = <SimpleGrid gap="actions" />;
// @ts-expect-error SimpleGrid has no fixed column-count API.
export const invalidSimpleGridColumns = <SimpleGrid columns={3} />;
// @ts-expect-error Consumers use scoped CSS rather than breakpoint objects.
export const invalidSimpleGridResponsiveGap = <SimpleGrid gap={{ mobile: 'related' }} />;
// @ts-expect-error SimpleGrid always renders a div.
export const invalidSimpleGridElement = <SimpleGrid as="section" />;

import { AspectRatio, type AspectRatioProps, type AspectRatioStyle } from 'fletchstack-ui';
import 'fletchstack-ui/aspect-ratio.css';
const aspectRatioRef = createRef<HTMLDivElement>();
const aspectRatioStyle: AspectRatioStyle = { aspectRatio: '4 / 3', '--fs-space-gap-related': '24px' };
const aspectRatioProps: AspectRatioProps = { ratio: 3 / 4, style: aspectRatioStyle, children: <img alt="Project landscape" /> };
export const aspectRatio = <AspectRatio {...aspectRatioProps} ref={aspectRatioRef} aria-describedby="caption" />;
export const composedAspectRatio = <SimpleGrid><AspectRatio ratio={1}><img alt="Project artwork" /></AspectRatio></SimpleGrid>;
// @ts-expect-error Ratio is numeric width divided by height.
export const invalidAspectRatioString = <AspectRatio ratio="16:9" />;
// @ts-expect-error Fitting belongs to the media child.
export const invalidAspectRatioFit = <AspectRatio fit="cover" />;
// @ts-expect-error AspectRatio has no polymorphic API.
export const invalidAspectRatioElement = <AspectRatio as="figure" />;
// @ts-expect-error Responsive ratio objects are outside the API.
export const invalidAspectRatioResponsive = <AspectRatio ratio={{ mobile: 1 }} />;
// @ts-expect-error AspectRatio owns its content layer; use children for media.
export const invalidAspectRatioRawContent = <AspectRatio dangerouslySetInnerHTML={{ __html: '<img alt="Artwork" />' }} />;

import { Section, type SectionProps, type SectionStyle } from 'fletchstack-ui';
import 'fletchstack-ui/section.css';
import { Heading, Text, type HeadingProps, type HeadingStyle, type TextProps, type TextStyle } from 'fletchstack-ui';
import 'fletchstack-ui/typography.css';
const headingRef = createRef<HTMLHeadingElement>();
const headingStyle: HeadingStyle = { '--fs-typography-heading-font-page': '2.5rem' };
const headingProps: HeadingProps = { as: 'h1', size: 'page', style: headingStyle, children: 'Project settings' };
export const contentHeading = <Heading {...headingProps} ref={headingRef} />;
const paragraphRef = createRef<HTMLParagraphElement>();
const spanRef = createRef<HTMLSpanElement>();
const textStyle: TextStyle = { '--fs-typography-text-font-body': '1.125rem' };
const textProps: TextProps = { size: 'body', tone: 'muted', style: textStyle, children: 'Manage your workspace.' };
export const contentText = <Text {...textProps} ref={paragraphRef} />;
export const inlineText = <Text as="span" ref={spanRef}>Updated yesterday</Text>;
// @ts-expect-error Heading semantics are native heading levels, independent of visual size.
export const invalidHeadingElement = <Heading as="p" />;
// @ts-expect-error Visual size is a named content role, not a semantic heading level.
export const invalidHeadingSize = <Heading size="h1" />;
// @ts-expect-error Inline content is a span; Text does not replace Link.
export const invalidTextElement = <Text as="a" href="/projects" />;
// @ts-expect-error Text tones are default and muted.
export const invalidTextTone = <Text tone="danger" />;
const sectionRef = createRef<HTMLElement>();
const sectionStyle: SectionStyle = { '--fs-section-padding-default': '32px', paddingInline: 0 };
const sectionProps: SectionProps = { spacing: 'spacious', as: 'section', style: sectionStyle, children: <h2 id="topic-heading">Project topic</h2> };
export const section = <Section {...sectionProps} ref={sectionRef} aria-labelledby="topic-heading" />;
export const visualSection = <Section as="div" spacing="compact" ref={sectionRef}><Container><Stack><SimpleGrid><Button>Open project</Button></SimpleGrid></Stack></Container></Section>;
// @ts-expect-error Section supports only compact, default and spacious presets.
export const invalidSectionSpacing = <Section spacing="none" />;
// @ts-expect-error Section has only section and div native wrappers.
export const invalidSectionElement = <Section as="article" />;
// @ts-expect-error Responsive decisions belong to scoped CSS.
export const invalidSectionResponsive = <Section spacing={{ mobile: 'compact' }} />;
// @ts-expect-error Inline gutters belong to Container.
export const invalidSectionGutters = <Section gutters />;

import { ButtonGroup, type ButtonGroupProps, type ButtonGroupStyle } from 'fletchstack-ui';
import 'fletchstack-ui/button-group.css';
const actionGroupRef = createRef<HTMLDivElement>();
const actionGroupStyle: ButtonGroupStyle = { '--fs-space-gap-actions': '20px' };
const actionGroupProps: ButtonGroupProps = { 'aria-label': 'Page actions', appearance: 'joined', orientation: 'horizontal', align: 'end', fullWidth: true, equalWidth: true, style: actionGroupStyle };
export const actionsGroup = <ButtonGroup {...actionGroupProps} ref={actionGroupRef}><Button type="submit" form="editor">Publish</Button></ButtonGroup>;
export const visibleActions = <ButtonGroup aria-labelledby="actions-heading"><Button>Preview</Button></ButtonGroup>;
// @ts-expect-error A group requires an accessible name.
export const unnamedActions = <ButtonGroup><Button>Save</Button></ButtonGroup>;
// @ts-expect-error Joined is an appearance, not a Button variant.
export const invalidGroupVariant = <ButtonGroup aria-label="Actions" variant="joined" />;
// @ts-expect-error A group is not an interactive toolbar.
export const invalidGroupRole = <ButtonGroup aria-label="Actions" role="toolbar" />;

import { CodeBlock, type CodeBlockProps, type CodeBlockStyle } from 'fletchstack-ui';
import 'fletchstack-ui/code-block.css';
const codeBlockRef = createRef<HTMLDivElement>();
const codeBlockStyle: CodeBlockStyle = { '--fs-code-block-inset': '24px' };
const codeBlockProps: CodeBlockProps = { children: 'const ready = true;', filename: 'settings.ts', language: 'TypeScript', wrap: true, style: codeBlockStyle };
export const sourceExample = <CodeBlock highlight {...codeBlockProps} ref={codeBlockRef} />;
export const plainSource = <CodeBlock copyable={false} label="Install command">npm install fletchstack-ui</CodeBlock>;
// @ts-expect-error Source must be a literal string, not authored React markup.
export const invalidCodeChildren = <CodeBlock><strong>source</strong></CodeBlock>;
// @ts-expect-error Raw HTML injection is outside the contract.
export const invalidCodeHtml = <CodeBlock dangerouslySetInnerHTML={{ __html: 'source' }}>source</CodeBlock>;
// @ts-expect-error Source is required.
export const missingCodeSource = <CodeBlock />;

import { Avatar, type AvatarProps, type AvatarStyle, type AvatarSize, type AvatarShape } from 'fletchstack-ui';
import 'fletchstack-ui/avatar.css';
const avatarSize: AvatarSize = 'xlarge';
const avatarShape: AvatarShape = 'rounded';
const avatarStyle: AvatarStyle = { '--fs-avatar-background': 'navy' };
const avatarProps: AvatarProps = { name: 'Maya Chen', size: avatarSize, shape: avatarShape, style: avatarStyle };
export const avatar = <Avatar {...avatarProps} ref={createRef<HTMLSpanElement>()} />;
// @ts-expect-error Avatar is passive; the surrounding action owns focus.
export const invalidAvatarFocus = <Avatar name="Maya Chen" tabIndex={0} />;
// @ts-expect-error Avatar owns image semantics.
export const invalidAvatarRole = <Avatar name="Maya Chen" role="button" />;
// @ts-expect-error Avatar has no activation handlers.
export const invalidAvatarAction = <Avatar name="Maya Chen" onClick={() => {}} />;
// @ts-expect-error Avatar does not render arbitrary content.
export const invalidAvatarChildren = <Avatar>content</Avatar>;

import { AvatarGroup, type AvatarGroupMember, type AvatarGroupProps, type AvatarGroupStyle } from 'fletchstack-ui';
import 'fletchstack-ui/avatar-group.css';
const groupMember: AvatarGroupMember = { id: 'editor-1', name: 'Alex Example' };
const avatarGroupStyle: AvatarGroupStyle = { '--fs-avatar-group-overlap': '4px' };
const avatarGroupProps: AvatarGroupProps = { label: 'Editors', members: [groupMember], maxVisible: 0, size: 'large', style: avatarGroupStyle };
export const avatarGroup = <AvatarGroup {...avatarGroupProps} ref={createRef<HTMLDivElement>()} />;
// @ts-expect-error The group requires an accessible label.
export const unnamedAvatarGroup = <AvatarGroup members={[]} />;
// @ts-expect-error Group members require stable keys.
export const unkeyedAvatarGroup = <AvatarGroup label="Editors" members={[{ name: 'Alex Example' }]} />;
// @ts-expect-error The group owns its content.
export const invalidAvatarGroupChildren = <AvatarGroup label="Editors" members={[]}>Content</AvatarGroup>;

import { MultiSelect, type MultiSelectOption, type MultiSelectProps } from 'fletchstack-ui';
import 'fletchstack-ui/multi-select.css';
const multiSelectOptions: readonly MultiSelectOption[] = [{ value: 'react', label: 'React' }];
const multiSelectProps: MultiSelectProps = { label: 'Topics', options: multiSelectOptions, onValueChange: values => values.join(',') };
export const multiSelect = <MultiSelect {...multiSelectProps} ref={createRef<HTMLInputElement>()} style={{ '--fs-multi-select-radius': '8px' }} />;
// @ts-expect-error Selection owns the input value; native onChange would confuse query and selection.
export const invalidMultiSelectChange = <MultiSelect {...multiSelectProps} onChange={() => {}} />;
// @ts-expect-error The composite owns the accessible name.
export const invalidMultiSelectName = <MultiSelect {...multiSelectProps} aria-label="Another name" />;
// @ts-expect-error Multiple selections are strings, not a scalar input value.
export const invalidMultiSelectValue = <MultiSelect {...multiSelectProps} value="react" />;

import { Chip, type ChipProps } from 'fletchstack-ui';
import 'fletchstack-ui/chip.css';
const chipProps: ChipProps = { children: 'Design', selected: false, onSelect: selected => String(selected), onRemove: () => {}, removeLabel: 'Remove Design' };
export const chip = <Chip {...chipProps} ref={createRef<HTMLSpanElement>()} style={{ '--fs-chip-radius': '4px' }} />;
// @ts-expect-error Controlled selection requires a callback.
export const invalidChipSelection = <Chip selected>Design</Chip>;
// @ts-expect-error Selection callbacks require an explicit selected state.
export const invalidChipCallback = <Chip onSelect={() => {}}>Design</Chip>;
// @ts-expect-error Removal requires a localized accessible name.
export const invalidChipRemoval = <Chip onRemove={() => {}}>Design</Chip>;
// @ts-expect-error A removal label must have a matching action.
export const invalidChipLabel = <Chip removeLabel="Remove Design">Design</Chip>;

import { Accordion, type AccordionItem, type AccordionProps } from 'fletchstack-ui';
import 'fletchstack-ui/accordion.css';
const accordionItems: readonly AccordionItem[] = [{ id: 'invite', title: 'Invite', content: <a href="#settings">Team settings</a> }];
const accordionProps: AccordionProps = { items: accordionItems, multiple: true, headingLevel: 2, panelMotion: 'expand', openItems: ['invite'], onOpenItemsChange: ids => ids.join(',') };
export const accordion = <Accordion {...accordionProps} ref={createRef<HTMLDivElement>()} style={{ '--fs-motion-duration-standard': '200ms' }} />;
// @ts-expect-error Headings are HTML levels, not arbitrary strings.
export const invalidAccordionHeading = <Accordion items={accordionItems} headingLevel={7} />;
// @ts-expect-error Expansion uses arrays of stable IDs.
export const invalidAccordionOpen = <Accordion items={accordionItems} openItems="invite" />;
// @ts-expect-error Items own the rendered content.
export const invalidAccordionChildren = <Accordion items={accordionItems}>Override</Accordion>;

import { Rating, type RatingProps } from 'fletchstack-ui';
import 'fletchstack-ui/rating.css';
const ratingProps: RatingProps = { mode: 'input', label: 'Review', step: 0.5, defaultValue: 3.5, name: 'rating' };
export const rating = <Rating {...ratingProps} ref={createRef<HTMLDivElement>()} style={{ '--fs-rating-fill': 'gold' }} />;
// @ts-expect-error Input rating requires a visible label.
export const invalidRatingLabel = <Rating mode="input" />;
// @ts-expect-error Rating only supports whole and half steps.
export const invalidRatingStep = <Rating step={0.25} />;

import { Combobox, type ComboboxProps, type ComboboxOption } from 'fletchstack-ui';
import 'fletchstack-ui/combobox.css';
const regionOptions: ComboboxOption[] = [{ value: 'gb', label: 'United Kingdom' }];
const comboboxProps: ComboboxProps = { label: 'Region', options: regionOptions, defaultValue: 'gb', name: 'region' };
export const combobox = <Combobox {...comboboxProps} ref={createRef<HTMLInputElement>()} style={{ '--fs-text-input-radius': '8px' }} />;
// @ts-expect-error Combobox requires a visible label.
export const missingComboboxLabel = <Combobox options={regionOptions} />;
// @ts-expect-error A single selection is a string, never an array.
export const invalidComboboxValue = <Combobox {...comboboxProps} value={['gb']} />;

import { Table, createTableColumn, type TableColumn, type TableProps } from 'fletchstack-ui';
import 'fletchstack-ui/table.css';
interface UsageRow { id: string; seats: number; updated: Date }
const usageColumn = createTableColumn<UsageRow>();
const usageColumns: TableColumn<UsageRow>[] = [
  usageColumn({ id: 'seats', header: 'Seats', accessor: 'seats', cell: ({ row, value }) => `${row.id}: ${value.toFixed(0)}` }),
  usageColumn({ id: 'date', header: 'Updated', accessor: row => row.updated, cell: ({ value }) => value.toISOString() }),
  usageColumn({ id: 'doubled', header: 'Doubled', accessor: row => row.seats * 2, cell: ({ value }) => value.toFixed(2) }),
];
const usageRows: UsageRow[] = [{ id: 'team', seats: 24, updated: new Date('2026-11-12') }];
const tableProps: TableProps<UsageRow> = { rows: usageRows, columns: usageColumns, getRowKey: row => row.id, caption: 'Usage', classNames: { bodyRow: ({ row, selected }) => selected ? row.id : 'ordinary' }, styles: { cell: ({ row }) => ({ fontWeight: row.seats > 10 ? 700 : 400 }) } };
export const table = <Table {...tableProps} style={{ '--fs-table-padding': '16px' }} />;
export const inferredTable = <Table rows={usageRows} columns={[{ id: 'seats', header: 'Seats', accessor: row => row.seats, cell: ({ row }) => row.id }]} getRowKey={row => row.id} aria-label="Usage" />;
// @ts-expect-error Property accessors must name a field on UsageRow.
usageColumn({ id: 'bad', header: 'Bad', accessor: 'missing' });
// @ts-expect-error A numeric accessor infers a numeric renderer value.
usageColumn({ id: 'bad', header: 'Bad', accessor: 'seats', cell: ({ value }) => value.toUpperCase() });
// @ts-expect-error Computed accessor rows retain UsageRow inference.
usageColumn({ id: 'bad', header: 'Bad', accessor: row => row.missing });
// @ts-expect-error Computed Date values retain their type in renderers.
usageColumn({ id: 'bad', header: 'Bad', accessor: row => row.updated, cell: ({ value }) => value.toFixed(2) });
// @ts-expect-error Table requires an accessible label or caption.
export const unnamedTable = <Table rows={usageRows} columns={usageColumns} getRowKey={row => row.id} />;
// @ts-expect-error Row context in direct columns is inferred from rows.
export const badCellRow = <Table rows={usageRows} columns={[{ id: 'bad', header: 'Bad', cell: ({ row }) => row.missing }]} getRowKey={row => row.id} caption="Bad" />;

// @ts-expect-error Direct renderer annotations cannot narrow an unknown accessor value unsafely.
export const unsafeDirectColumn: TableColumn<UsageRow> = { id: 'unsafe', header: 'Unsafe', accessor: 'id', cell: ({ value }: { value: number }) => value.toFixed(2) };

import { Callout, type CalloutProps, type CalloutTone, type CalloutStyle } from 'fletchstack-ui';
import 'fletchstack-ui/callout.css';
const calloutTone: CalloutTone = 'warning';
const calloutStyle: CalloutStyle = { '--fs-callout-radius': '8px' };
const calloutProps: CalloutProps = { tone: calloutTone, title: <strong>Review publishing</strong>, role: 'note', children: 'Two pages need approval.', style: calloutStyle };
export const callout = <Callout {...calloutProps} ref={createRef<HTMLDivElement>()} icon={<Icon><path d="M12 3v18" /></Icon>} action={<Button>Review pages</Button>} />;
// @ts-expect-error Callout roles are explicitly chosen message semantics.
export const invalidCalloutRole = <Callout role="button">Message</Callout>;
// @ts-expect-error Callout tones use error rather than danger.
export const invalidCalloutTone = <Callout tone="danger">Message</Callout>;

import { Menu, type MenuProps, type MenuStyle, type MenuItem, type MenuActionItem, type MenuLinkItem, type MenuSubmenuItem, type MenuDividerItem, type MenuSelectEvent } from 'fletchstack-ui';
import 'fletchstack-ui/menu.css';
const menuAction: MenuActionItem = { type: 'item', id: 'rename', label: 'Rename', onSelect: (event: MenuSelectEvent) => event.preventDefault() };
const menuLink: MenuLinkItem = { type: 'item', id: 'guide', label: 'Guide', href: '#guide' };
const menuBranch: MenuSubmenuItem = { type: 'submenu', id: 'export', label: 'Export', items: [menuAction, menuLink] };
const menuDivider: MenuDividerItem = { type: 'divider', id: 'divider' };
const menuItems: MenuItem[] = [menuAction, menuBranch, menuDivider, menuLink];
const menuStyle: MenuStyle = { '--fs-menu-radius': '8px' };
const menuProps: MenuProps = { triggerLabel: 'Project actions', menuLabel: 'Project actions', items: menuItems, style: menuStyle };
export const menu = <Menu {...menuProps} ref={createRef<HTMLDivElement>()} />;
// @ts-expect-error Submenu entries require children.
export const invalidMenuBranch: MenuItem = { type: 'submenu', id: 'invalid', label: 'Invalid' };
// @ts-expect-error Leaf actions require an action handler or href.
export const invalidMenuLeaf: MenuItem = { type: 'item', id: 'invalid', label: 'Invalid' };
// @ts-expect-error Menus require a distinct accessible name for their panel.
export const unnamedMenu = <Menu triggerLabel="Actions" items={menuItems} />;

import { Breadcrumbs, type BreadcrumbsProps, type BreadcrumbsStyle, type BreadcrumbItem, type BreadcrumbAncestor, type BreadcrumbCurrent } from 'fletchstack-ui';
import 'fletchstack-ui/breadcrumbs.css';
const breadcrumbAncestor: BreadcrumbAncestor = { label: 'Home', href: '/home' };
const breadcrumbCurrent: BreadcrumbCurrent = { label: 'Settings', current: true };
const breadcrumbItems: BreadcrumbItem[] = [breadcrumbAncestor, breadcrumbCurrent];
const breadcrumbsStyle: BreadcrumbsStyle = { '--fs-breadcrumbs-gap': '12px' };
const breadcrumbsProps: BreadcrumbsProps = { items: breadcrumbItems, collapseAt: '48rem', 'aria-label': 'Project breadcrumb', style: breadcrumbsStyle };
export const breadcrumbs = <Breadcrumbs {...breadcrumbsProps} ref={createRef<HTMLElement>()} />;
// @ts-expect-error Ancestor items need a destination.
export const invalidBreadcrumbAncestor: BreadcrumbItem = { label: 'Home' };
// @ts-expect-error Current pages are plain text rather than links.
export const invalidBreadcrumbCurrent: BreadcrumbItem = { label: 'Settings', current: true, href: '/settings' };

import { Navbar, type NavbarProps, type NavbarStyle, type NavbarItemProps, type NavbarBrandProps, type NavbarMobilePlacement } from 'fletchstack-ui';
import 'fletchstack-ui/navbar.css';
const navbarStyle: NavbarStyle = { '--fs-navbar-gap': '16px' };
const navbarBrand: NavbarBrandProps = { children: <a href="/">Home</a> };
const navbarItem: NavbarItemProps = { children: <button type="button">Theme</button>, mobilePlacement: undefined };
const navbarDestinations: { href: string; label: string; mobilePlacement?: NavbarMobilePlacement }[] = [{ href: '/docs', label: 'Docs' }, { href: '/support', label: 'Support', mobilePlacement: 'bar' }];
const navbarProps: NavbarProps = { 'aria-label': 'Primary', defaultOpen: true, menuLabel: 'Browse', style: navbarStyle, children: <><Navbar.Brand {...navbarBrand} /><Navbar.Item {...navbarItem} />{navbarDestinations.map(({ href, label, mobilePlacement }) => <Navbar.Item key={href} mobilePlacement={mobilePlacement}><a href={href}>{label}</a></Navbar.Item>)}</> };
export const navbar = <Navbar {...navbarProps} ref={createRef<HTMLElement>()} />;
// @ts-expect-error Placement is an explicit bar or menu choice.
export const invalidNavbarPlacement = <Navbar.Item mobilePlacement="sidebar">Docs</Navbar.Item>;

import { BottomNavigation, AppShell, AppContent, HomeIcon, InboxIcon, HelpIcon, type BottomNavigationProps, type BottomNavigationItemProps, type BottomNavigationStyle, type AppShellProps, type AppShellStyle, type AppContentProps, type AppContentStyle } from 'fletchstack-ui';
import 'fletchstack-ui/bottom-navigation.css';
import 'fletchstack-ui/app-shell.css';
import 'fletchstack-ui/app-content.css';
const bottomStyle: BottomNavigationStyle = { '--fs-bottom-navigation-safe-area-inset': '0px' };
const bottomItem: BottomNavigationItemProps = { children: <a href="/help"><HelpIcon />Help</a> };
const bottomProps: BottomNavigationProps = { 'aria-label': 'Primary', style: bottomStyle, children: <BottomNavigation.Item {...bottomItem} /> };
const shellStyle: AppShellStyle = { '--fs-surface': 'white' };
const shellProps: AppShellProps = { height: 'parent', style: shellStyle, children: 'Page' };
const contentStyle: AppContentStyle = { padding: 16 };
const contentProps: AppContentProps = { as: 'div', style: contentStyle, children: 'Page' };
export const applicationShell = <AppShell {...shellProps} ref={createRef<HTMLDivElement>()}><AppContent {...contentProps} ref={createRef<HTMLElement>()} /><BottomNavigation {...bottomProps} ref={createRef<HTMLElement>()} /><HomeIcon /><InboxIcon /></AppShell>;
// @ts-expect-error Navigation requires an accessible name.
export const unnamedBottomNavigation = <BottomNavigation><BottomNavigation.Item><a href="/">Home</a></BottomNavigation.Item></BottomNavigation>;
// @ts-expect-error Each destination accepts one element.
export const multipleBottomLinks = <BottomNavigation.Item><a href="/">Home</a><a href="/help">Help</a></BottomNavigation.Item>;

import { Tabs, type TabsProps, type TabsItem, type TabsStyle } from 'fletchstack-ui';
import 'fletchstack-ui/tabs.css';
const tabsItems: readonly TabsItem[] = [{ id: 'overview', label: 'Overview', content: <p>Overview content</p> }, { id: 'activity', label: 'Activity', content: <p>Activity content</p>, disabled: false }];
const tabsStyle: TabsStyle = { '--fs-tabs-indicator-width': '4px' };
const tabsProps: TabsProps = { label: 'Workspace', items: tabsItems, defaultValue: 'overview', style: tabsStyle };
export const workspaceTabs = <Tabs {...tabsProps} ref={createRef<HTMLDivElement>()} />;
export const controlledTabs = <Tabs label="Controlled workspace" items={tabsItems} value="activity" onValueChange={(id: string) => console.log(id)} variant="pills" orientation="vertical" activationMode="manual" fullWidth />;
// @ts-expect-error A tablist needs an accessible label.
export const unnamedTabs = <Tabs items={tabsItems} />;
// @ts-expect-error Variants are line or pills.
export const invalidTabsVariant = <Tabs label="Workspace" items={tabsItems} variant="boxed" />;
// @ts-expect-error Tabs uses item-driven content.
export const invalidTabsChildren = <Tabs label="Workspace" items={tabsItems}>Content</Tabs>;
