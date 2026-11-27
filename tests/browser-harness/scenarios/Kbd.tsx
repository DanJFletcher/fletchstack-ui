import { Kbd, type KbdProps } from '../../../src/components/kbd/Kbd';
import {
  KbdExample,
  KbdButtonExample,
  KbdTooltipExample,
  KbdInputExample,
  KbdOverrides,
} from '../../../src/components/kbd/stories/kbd-examples';
import { KbdGroup } from '../../../src/components/kbd/KbdGroup';
import type { Scenario } from '../gallery/types';
import '../../../src/components/kbd/kbd.css';
import '../../../src/components/kbd/stories/kbd.stories.css';
import '../../../src/components/button/button.css';
import '../../../src/components/tooltip/tooltip.css';
import '../../../src/components/field/field.css';
import '../../../src/components/text-input/text-input.css';
import '../../../src/components/icon/icon.css';
const Playground: Scenario<KbdProps> = {};
const Composition: Scenario<KbdProps> = { render: () => <KbdExample /> };
const Button: Scenario<KbdProps> = { render: () => <KbdButtonExample /> };
const Tooltip: Scenario<KbdProps> = { render: () => <KbdTooltipExample /> };
const Search: Scenario<KbdProps> = { render: () => <KbdInputExample /> };
const Overrides: Scenario<KbdProps> = { render: () => <KbdOverrides /> };
const Flow: Scenario<KbdProps> = {
  render: () => (
    <>
      <a href="#before">Before</a>
      <KbdGroup>
        <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd>
      </KbdGroup>
      <a href="#after">After</a>
    </>
  ),
};
const Rtl: Scenario<KbdProps> = {
  render: () => (
    <div dir="rtl">
      <KbdGroup dir="ltr">
        <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd>
      </KbdGroup>
    </div>
  ),
};
const Long: Scenario<KbdProps> = {
  args: { children: 'VeryLongLocalizedKeyboardInputWithoutSpaces' },
};
const Wrapping: Scenario<KbdProps> = {
  render: () => (
    <KbdGroup>
      <Kbd>Control</Kbd> + <Kbd>Shift</Kbd> + <Kbd>Alt</Kbd> + <Kbd>ArrowDown</Kbd>
    </KbdGroup>
  ),
};
const HiddenGroup: Scenario<KbdProps> = {
  render: () => (
    <>
      <p>Visible content</p>
      <KbdGroup hidden>
        <Kbd>Ctrl</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
    </>
  ),
};
export const component = Kbd;
export const defaults: KbdProps = { children: 'Ctrl' };
export const scenarios = {
  Playground,
  Composition,
  Button,
  Tooltip,
  Search,
  Overrides,
  Flow,
  Rtl,
  Long,
  Wrapping,
  HiddenGroup,
};
