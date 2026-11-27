import { Button, type ButtonProps } from '../../../src/components/button/Button';
import type { Scenario } from '../gallery/types';
import '../../../src/components/button/button.css';

const BothThemes: Scenario<ButtonProps> = {
  render: () => (
    <div className="theme-grid">
      {(['corporate', 'luna'] as const).map((theme) => (
        <section key={theme} data-theme={theme} className="theme-panel stack">
          <h2>{theme === 'corporate' ? 'Corporate' : 'Luna'}</h2>
          <div className="actions">
            <Button>Save changes</Button>
            <Button variant="secondary">Cancel</Button>
            <Button variant="ghost">Learn more</Button>
            <Button disabled>Saved</Button>
          </div>
        </section>
      ))}
    </div>
  ),
};

export const component = Button;
export const defaults: ButtonProps = { children: 'Save changes' };
export const scenarios = { BothThemes };
