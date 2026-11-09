import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Checkbox, FormGroup, Select, TextInput } from '../../../index';

const meta = {
  id: 'components-formgroup', title: 'Components/Forms/FormGroup', component: FormGroup, tags: ['autodocs'],
  args: { legend: 'Notification channels', description: 'Choose how you would like to hear from us.', helperText: 'You can change these later.' },
  argTypes: { orientation: { control: 'select', options: ['vertical', 'horizontal'] } },
  parameters: { docs: { description: { component: 'A native fieldset with a visible legend. Use the children render prop to link shared context, helper text, and errors to each control. Native disabled behavior, refs, form attributes, wrapping layouts, and semantic token overrides are supported. The enclosing layout owns spacing between groups.' } } },
} satisfies Meta<typeof FormGroup>;
export default meta;
type Story = StoryObj<typeof meta>;


export const Playground: Story = {
  render: args => <FormGroup {...args}>{props => <><Checkbox {...props} label="Email" name="channels" value="email" defaultChecked /><Checkbox {...props} label="SMS" name="channels" value="sms" /></>}</FormGroup>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('checkbox', { name: 'SMS' }));
    await expect(canvas.getByRole('checkbox', { name: 'SMS' })).toBeChecked();
  },
};

export const States: Story = {
  render: () => <div className="theme-grid">{(['Default', 'Error', 'Disabled'] as const).map(state => <FormGroup key={state} legend={`${state} notifications`} description="Select at least one option." error={state === 'Error' ? 'Choose at least one channel.' : ''} disabled={state === 'Disabled'}>{props => <><Checkbox {...props} label={`${state} email`} defaultChecked={state !== 'Error'} /><Checkbox {...props} label={`${state} SMS`} /></>}</FormGroup>)}</div>,
};

export const Composition: Story = {
  render: () => <div className="stack"><FormGroup legend="Delivery method" description="Choose one option.">{props => <><label><input {...props} type="radio" name="delivery" value="standard" defaultChecked /> Standard</label><label><input {...props} type="radio" name="delivery" value="express" /> Express</label></>}</FormGroup><FormGroup legend="Contact details" helperText="Use your project contact details.">{props => <><TextInput {...props} label="Full name" autoComplete="name" defaultValue="Example Person" /><TextInput {...props} label="Email address" type="email" defaultValue="test@example.com" /><Select {...props} label="Workspace"><option>Personal</option><option>Design team</option></Select></>}</FormGroup></div>,
};

export const NativeChildren: Story = {
  render: () => <div className="stack"><FormGroup legend="Contact" className="custom-form-group" style={{ '--fs-form-group-control-gap': '24px' }}><TextInput label="Project name" /><FormGroup legend="Nested settings" aria-invalid="false"><Checkbox label="Email updates" /></FormGroup></FormGroup><FormGroup legend="Empty group" /></div>,
};

export const BothThemes: Story = {
  render: () => <div className="theme-grid">{(['corporate', 'luna'] as const).map(theme => <section key={theme} data-theme={theme} className="theme-panel stack"><h2>{theme}</h2><FormGroup legend="Notifications" orientation="horizontal" helperText="You can change these later.">{props => <><Checkbox {...props} label="Email" defaultChecked /><Checkbox {...props} label="SMS" /></>}</FormGroup><FormGroup legend="Required channels" error="Choose at least one channel.">{props => <Checkbox {...props} label="Push notifications" />}</FormGroup></section>)}</div>,
};

export const Descriptions: Story = {
  render: () => <><p id="settings-context">Project settings.</p><FormGroup id="channels" legend="Notification channels" aria-describedby="settings-context" description="Choose how we contact you." helperText="Change these later." error="Choose one channel.">{props => <Checkbox {...props} label="Email" description="Product news." />}</FormGroup></>,
};
