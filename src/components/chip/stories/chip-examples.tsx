import { useRef, useState } from 'react';
import { Chip } from '../Chip';

/**
 * Keep selection and removal controlled by a parent, restoring focus when a chip is removed.
 **/
export function ChipFilters() {
  const [draftVisible, setDraftVisible] = useState(true);
  const [selected, setSelected] = useState(false);
  const reset = useRef<HTMLButtonElement>(null);
  return <section aria-label="Article filters" className="chip-demo__filter"><h2>Article filters</h2>
    <div className="chip-demo__row"><Chip selected={selected} onSelect={setSelected}>Design systems</Chip>
      {draftVisible && <Chip onRemove={() => { setDraftVisible(false); reset.current!.focus(); }} removeLabel="Remove Drafts">Drafts</Chip>}
      <Chip disabled selected={false} onSelect={setSelected}>Disabled filter</Chip></div>
    <p role="status">{selected ? 'Design systems selected.' : 'All topics.'} {!draftVisible && 'Drafts removed.'}</p>
    <button type="button" ref={reset} onClick={() => { setDraftVisible(true); setSelected(false); }}>Reset filters</button>
  </section>;
}

/**
 * Show a chip offering two independent native actions without nesting buttons.
 **/
export function SelectableRemovableChip() {
  const [selected, setSelected] = useState(true);
  const [removed, setRemoved] = useState(false);
  return <><Chip selected={selected} onSelect={setSelected} onRemove={() => setRemoved(true)} removeLabel="Remove React">React</Chip><output aria-label="Removal requested">{removed ? 'React removal requested.' : 'Nothing removed.'}</output></>;
}

/**
 * Compare static, selectable and selected tags across the supported themes.
 **/
export function ChipExample() {
  return <main className="chip-demo"><p className="chip-demo__eyebrow">fletchstack-ui / Identity</p><h1>Chip</h1>
    <div className="chip-demo__themes">{(['corporate', 'luna'] as const).map(theme => <ChipThemePanel key={theme} theme={theme} />)}</div>
    <div className="chip-demo__comparisons"><section><h2>Sizes</h2><div className="chip-demo__row">{(['small', 'medium', 'large'] as const).map(size => <Chip key={size} size={size}>Design · {size}</Chip>)}</div></section>
      <section><h2>Selection and removal</h2><SelectableRemovableChip /></section><section><h2>Long labels</h2><Chip>A long content tag that wraps instead of overflowing its container</Chip></section></div>
    <ChipFilters />
  </main>;
}

/**
 * Keep each themed preview independently interactive without storing a JavaScript theme.
 **/
function ChipThemePanel({ theme }: { theme: 'corporate' | 'luna' }) {
  const [filter, setFilter] = useState(false);
  const [selected, setSelected] = useState(true);
  return <section data-theme={theme} className="chip-demo__panel"><h2>{theme === 'corporate' ? 'Corporate' : 'Luna'}</h2>
    <div className="chip-demo__row"><Chip>Content tag</Chip><Chip selected={filter} onSelect={setFilter}>Filter</Chip><Chip selected={selected} onSelect={setSelected}>Selected</Chip></div>
  </section>;
}
