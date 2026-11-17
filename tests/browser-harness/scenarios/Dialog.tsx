import { Dialog } from '../../../src/components/dialog/Dialog';
import { DeferredDialog, DialogDemo, DialogExample, DialogOverrides, NestedDialog, type DialogDemoProps } from '../../../src/components/dialog/stories/dialog-examples';
import type { Scenario } from '../gallery/types';
import '../../../src/components/dialog/dialog.css';
import '../../../src/components/dialog/stories/dialog.stories.css';

const Playground: Scenario<DialogDemoProps> = { render: args => <DialogDemo {...args} /> };
const Composition: Scenario<DialogDemoProps> = { render: () => <DialogExample /> };
const Deferred: Scenario<DialogDemoProps> = { render: () => <DeferredDialog /> };
const Overrides: Scenario<DialogDemoProps> = { render: () => <DialogOverrides /> };
const Nested: Scenario<DialogDemoProps> = { render: () => <NestedDialog /> };
export const component = Dialog;
export const defaults = {};
export const scenarios = { Playground, Composition, Deferred, Overrides, Nested };

import '../../../src/components/button/button.css';
import '../../../src/components/icon/icon.css';
import '../../../src/components/field/field.css';
import '../../../src/components/text-input/text-input.css';
import '../../../src/components/link/link.css';
