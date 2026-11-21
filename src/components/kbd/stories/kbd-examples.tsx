import { useId, useState } from 'react';
import { Kbd } from '../Kbd';
import { KbdGroup } from '../KbdGroup';
import { Button } from '../../button/Button';
import { Tooltip } from '../../tooltip/Tooltip';
import { TextInput } from '../../text-input/TextInput';
import { ArrowRightIcon } from '../../icon/named/ArrowRightIcon';

/**
 * Pair a decorative platform glyph with readable text in the same native keycap.
 **/
export function CommandKey() {
  return <Kbd><span aria-hidden="true">⌘</span><span className="kbd-demo__sr-only">Command</span></Kbd>;
}

/**
 * Keep shortcut punctuation explicit so consumers can choose combinations or key sequences.
 **/
export function Shortcut() {
  return <KbdGroup><Kbd>Ctrl</Kbd><span>+</span><Kbd>K</Kbd></KbdGroup>;
}

/**
 * Share meaningful key and group compositions across nested theme regions.
 **/
export function KbdExample() {
  return <div className="kbd-demo">{(['corporate', 'luna'] as const).map(theme => <section key={theme} data-theme={theme} className="theme-panel stack"><h2>{theme === 'corporate' ? 'Corporate' : 'Luna'}</h2>
    <p>Open the command palette with <Shortcut />.</p><p>Save with <KbdGroup><CommandKey /><span>+</span><Kbd>S</Kbd></KbdGroup>.</p>
    <div className="actions"><Kbd>Esc</Kbd><Kbd>Enter</Kbd><Kbd>Space</Kbd><Kbd><ArrowRightIcon /><span className="kbd-demo__sr-only">Right Arrow</span></Kbd></div>
  </section>)}</div>;
}

/**
 * Keep one real button as the keyboard and pointer target while its hint remains passive.
 **/
export function KbdButtonExample() {
  const [accepted, setAccepted] = useState(0);
  return <div className="stack"><Button onClick={() => setAccepted(count => count + 1)}>Accept <Kbd>Enter</Kbd></Button><p role="status">Accepted {accepted} times</p></div>;
}

/**
 * Compose a keyboard hint in supplementary help without moving the action's focus target.
 **/
export function KbdTooltipExample() {
  const [saved, setSaved] = useState(false);
  return <div className="stack"><Tooltip content={<span>Save changes <KbdGroup><CommandKey /><span>+</span><Kbd>S</Kbd></KbdGroup></span>}><Button onClick={() => setSaved(true)}>Save</Button></Tooltip><p role="status">{saved ? 'Changes saved' : 'Unsaved changes'}</p></div>;
}

/**
 * Associate a noninteractive shortcut hint with a native search field through its description.
 **/
export function KbdInputExample() {
  const hintId = useId();
  return <div className="stack"><TextInput label="Search workspace" type="search" aria-describedby={hintId} /><p id={hintId}>Focus search using <Shortcut />. Shortcut handling belongs to your application.</p></div>;
}

/**
 * Keep local keycap overrides scoped while the adjacent group retains theme defaults.
 **/
export function KbdOverrides() {
  return <div className="stack"><p>Custom <Kbd style={{ '--fs-kbd-radius': '0px', '--fs-kbd-padding-inline': '12px' }}>Enter</Kbd></p><p>Default <Kbd>Enter</Kbd></p><KbdGroup style={{ '--fs-kbd-group-gap': '12px' }}><Kbd>Ctrl</Kbd><Kbd>C</Kbd></KbdGroup></div>;
}
