import { Checkbox } from '../../../src/components/checkbox/Checkbox';
import { Field } from '../../../src/components/field/Field';
import { FieldDescription } from '../../../src/components/field/FieldPrimitives';
import { FieldError } from '../../../src/components/field/FieldPrimitives';
import { FieldLabel } from '../../../src/components/field/FieldPrimitives';
import { TextInput } from '../../../src/components/text-input/TextInput';
import type { FieldProps } from '../../../src/components/field/Field';
import type { Scenario } from '../gallery/types';
import '../../../src/components/field/field.css';
import '../../../src/components/icon/icon.css';
import '../../../src/components/checkbox/checkbox.css';
import '../../../src/components/text-input/text-input.css';

const Playground: Scenario<FieldProps> = { render: (args) => <Field {...args} /> };

const States: Scenario<FieldProps> = {
  render: () => (
    <div className="theme-grid">
      <Field label="Default">{(props) => <input {...props} />}</Field>
      <Field label="Error" helperText="Use a short name." error="Enter a project name.">
        {(props) => <input {...props} />}
      </Field>
      <Field label="Disabled">
        {(props) => <input {...props} disabled defaultValue="Unavailable" />}
      </Field>
      <Field label="Read-only" aria-invalid={false}>
        {(props) => <input {...props} readOnly defaultValue="Project" />}
      </Field>
      <Field label="Hidden" hidden>
        {(props) => <input {...props} />}
      </Field>
    </div>
  ),
};

const StandalonePrimitives: Scenario<FieldProps> = {
  render: () => (
    <div className="stack">
      <FieldLabel htmlFor="standalone-name">Project name</FieldLabel>
      <input
        id="standalone-name"
        aria-describedby="standalone-help standalone-error"
        aria-invalid="true"
      />
      <FieldDescription id="standalone-help">Use a short name.</FieldDescription>
      <FieldError id="standalone-error">Enter a project name.</FieldError>
    </div>
  ),
};

const Customization: Scenario<FieldProps> = {
  render: () => (
    <Field
      id="custom-name"
      label="Project name"
      helperText="Custom hint."
      error="Enter a project name."
      className="custom-field"
      classNames={{ label: 'custom-label', helper: 'custom-hint', error: 'custom-error' }}
      style={{ '--fs-field-gap': '24px' }}
    >
      {(props) => <input {...props} />}
    </Field>
  ),
};

const BothThemes: Scenario<FieldProps> = {
  render: () => (
    <div className="theme-grid">
      {(['corporate', 'luna'] as const).map((theme) => (
        <section key={theme} className="theme-panel stack" data-theme={theme}>
          <h2>{theme}</h2>
          <Field label="Notes" helperText="A short project summary." error="Enter a summary.">
            {(props) => (
              <textarea
                {...props}
                rows={3}
                style={{ font: 'inherit', color: 'inherit', background: 'transparent' }}
              />
            )}
          </Field>
          <TextInput
            label="Project name"
            defaultValue="Website refresh"
            helperText="Existing component composition."
          />
          <Checkbox label="Email" description="Existing inline description." />
        </section>
      ))}
    </div>
  ),
};

const InlineMessages: Scenario<FieldProps> = {
  render: () => (
    <div className="stack">
      <FieldLabel htmlFor="inline-email" className="inline-label">
        <input
          id="inline-email"
          type="checkbox"
          aria-describedby="inline-help inline-error"
          aria-invalid="true"
        />{' '}
        Email{' '}
        <FieldDescription as="span" id="inline-help" className="inline-help">
          Product news.
        </FieldDescription>
      </FieldLabel>
      <FieldError as="span" id="inline-error" className="inline-error">
        Choose a channel.
      </FieldError>
    </div>
  ),
};

const LongLabels: Scenario<FieldProps> = {
  render: () => (
    <Field
      label="Enter a short summary that describes the project and its shared components"
      helperText="Descriptions remain associated and wrap with enlarged text in narrow containers."
      error="Enter the summary before continuing."
    >
      {(props) => (
        <textarea
          {...props}
          rows={3}
          style={{ font: 'inherit', color: 'inherit', background: 'transparent' }}
        />
      )}
    </Field>
  ),
};

export const component = Field;
export const defaults: FieldProps = {
  label: 'Notes',
  helperText: 'A short project summary.',
  children: (props) => (
    <textarea
      {...props}
      name="notes"
      rows={3}
      style={{ font: 'inherit', color: 'inherit', background: 'transparent' }}
    />
  ),
};
export const scenarios = {
  LongLabels,
  States,
  BothThemes,
  StandalonePrimitives,
  InlineMessages,
  Customization,
  Playground,
};
