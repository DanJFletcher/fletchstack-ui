import { Button } from '../../../src/components/button/Button';
import { MoonIcon } from '../../../src/components/icon/named/MoonIcon';
import type { ButtonProps } from '../../../src/components/button/Button';
import type { Scenario } from '../gallery/types';
import { useState } from 'react';
import '../../../src/components/button/button.css';
import '../../../src/components/icon/icon.css';

/**
 * Keep native form outcomes visible without navigating the preview.
 **/
function FormExample() {
  const [status, setStatus] = useState('No submission');

  return (
    <form
      className="stack"
      onSubmit={(event) => {
        event.preventDefault();
        setStatus('Submitted');
      }}
      onReset={() => setStatus('Reset')}
    >
      <div className="actions">
        <Button>Ordinary action</Button>
        <Button type="submit">Submit changes</Button>
        <Button type="reset" variant="secondary">
          Reset changes
        </Button>
      </div>
      <output aria-live="polite">{status}</output>
    </form>
  );
}

const Playground: Scenario<ButtonProps> = {};

const InteractionStates: Scenario<ButtonProps> = {
  render: () => (
    <div className="stack">
      <h1>Explore each state</h1>
      <p>
        Hover for feedback, press and hold for active styling, then use Tab for the visible focus
        ring. Switch the toolbar to compare themes. Disabled controls ignore activation.
      </p>
      <div className="actions">
        <Button>Primary action</Button>
        <Button variant="secondary">Secondary action</Button>
        <Button variant="ghost">Ghost action</Button>
        <Button disabled>Disabled action</Button>
      </div>
    </div>
  ),
};

const VariantsAndSizes: Scenario<ButtonProps> = {
  render: () => (
    <div className="stack">
      <header>
        <h1>One action. Two atmospheres.</h1>
        <p>
          Choose emphasis by purpose. Each size grows with its label; wrappers supply the spacing.
        </p>
      </header>
      {(['primary', 'secondary', 'ghost'] as const).map((variant) => (
        <section key={variant}>
          <h2>{variant}</h2>
          <div className="actions">
            {(['small', 'medium', 'large'] as const).map((size) => (
              <Button key={size} variant={variant} size={size}>
                {size} action
              </Button>
            ))}
          </div>
        </section>
      ))}
    </div>
  ),
};

const Composition: Scenario<ButtonProps> = {
  render: () => (
    <div className="stack">
      <h1>Make room for the next step</h1>
      <p>A parent flex wrapper supplies the gap. Icons are children, not a special Button API.</p>
      <div className="actions">
        <Button>
          <MoonIcon />
          <span>Save changes</span>
        </Button>
        <Button variant="secondary">Cancel</Button>
        <Button variant="ghost">Learn more</Button>
        <Button variant="secondary" aria-label="Switch to night mode">
          <MoonIcon />
        </Button>
      </div>
    </div>
  ),
};

const NativeForm: Scenario<ButtonProps> = {
  render: () => <FormExample />,
};

const LongLabels: Scenario<ButtonProps> = {
  render: () => (
    <div className="stack narrow">
      <h2>Room to grow</h2>
      <Button>
        <MoonIcon />
        <span>Save all changes and return to your account settings</span>
      </Button>
      <Button variant="secondary">ReviewYourAccountPreferencesBeforeContinuing</Button>
      <Button size="small" variant="ghost">
        Read more about how these settings work
      </Button>
    </div>
  ),
};

const LunaVariants: Scenario<ButtonProps> = { ...VariantsAndSizes, theme: 'luna' };

const LunaLongLabels: Scenario<ButtonProps> = { ...LongLabels, theme: 'luna' };

export const component = Button;
export const defaults: ButtonProps = { children: 'Save changes' };
export const scenarios = {
  Playground,
  InteractionStates,
  VariantsAndSizes,
  Composition,
  NativeForm,
  LongLabels,
  LunaVariants,
  LunaLongLabels,
};
