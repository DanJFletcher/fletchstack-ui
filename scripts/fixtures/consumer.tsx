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
