import { createRef } from 'react';
import { Button, type ButtonProps } from 'fletchstack-ui';
import 'fletchstack-ui/styles.css';
import 'fletchstack-ui/tokens.css';
import 'fletchstack-ui/button.css';

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
