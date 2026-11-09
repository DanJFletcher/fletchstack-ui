import { useId, useRef, useState } from 'react';
import type { ChangeEventHandler, RefObject } from 'react';
import { CloseIcon, Icon, type IconSize } from '../src';
import { catalog } from './icon-catalog';

type GalleryEntry = (typeof catalog)[number];
const sizes = [{ size: 'small', label: '16 px' }, { size: 'medium', label: '20 px' }, { size: 'large', label: '24 px' }] as const;

/**
 * Match literal text against names, intended uses, and curated synonyms in catalog order.
 **/
function matchingIcons(query: string): readonly GalleryEntry[] {
  const normalized = query.trim().toLowerCase();

  return catalog.filter(entry => [entry.name, entry.use, ...entry.keywords].join(' ').toLowerCase().includes(normalized));
}

/**
 * Identify the documentation page without duplicating Storybook's navigation actions.
 **/
function GalleryBreadcrumbs() {
  return <div className="icon-gallery__breadcrumbs" aria-label="Location">
    <span className="icon-gallery__brand"><Icon size="small"><path d="m3 8 9-5 9 5-9 5Z M3 12l9 5 9-5 M3 16l9 5 9-5" /></Icon> fletchstack-ui</span>
    <span>Components</span><span aria-hidden="true">›</span><span>Icon</span><span aria-hidden="true">›</span><span>Gallery</span>
    <span className="icon-gallery__storybook">Storybook</span>
  </div>;
}

/**
 * Offer local theme selection; Storybook inherits the existing preview toolbar theme.
 **/
function GalleryHeading({ theme, onTheme }: { theme: string; onTheme: ChangeEventHandler<HTMLSelectElement> }) {
  const id = useId();

  return <header className="icon-gallery__heading"><div><h1>Icon gallery</h1><p>Consistent symbols for clear interfaces.</p></div>
    <div className="icon-gallery__theme"><label htmlFor={id}>Theme</label>
      <select id={id} value={theme} onChange={onTheme}><option value="inherit">Storybook</option><option value="corporate">Corporate</option><option value="luna">Luna</option></select>
    </div>
  </header>;
}

/**
 * Keep search and its explicit clear action mounted while results change.
 **/
function GallerySearch({ query, onQuery, input }: { query: string; onQuery: ChangeEventHandler<HTMLInputElement>; input: RefObject<HTMLInputElement | null> }) {
  const id = useId();

  return <div className="icon-gallery__field"><label htmlFor={id}>Search icons</label><div className="icon-gallery__search">
    <Icon size="small"><circle cx="10" cy="10" r="6" /><path d="m15 15 5 5" /></Icon>
    <input ref={input} id={id} type="search" placeholder="Search by name or purpose…" value={query} onChange={onQuery} />
  </div></div>;
}

/**
 * Use a native radio group for arrow-key preview size selection.
 **/
function GallerySizes({ size, onSize }: { size: IconSize; onSize: (size: IconSize) => void }) {
  const name = useId();

  return <fieldset className="icon-gallery__sizes"><legend>Preview size</legend><div>
    {sizes.map(option => <label key={option.size}><input type="radio" name={name} value={option.size} checked={size === option.size} onChange={() => onSize(option.size)} /><span>{option.label}</span></label>)}
  </div></fieldset>;
}

/**
 * Present decorative artwork with centered export names and intended uses.
 **/
function GalleryResults({ matches, size }: { matches: readonly GalleryEntry[]; size: IconSize }) {
  return <>
    <div className="icon-gallery__summary"><p role="status" aria-live="polite">{matches.length} {matches.length === 1 ? 'icon' : 'icons'}</p><p>24 × 24 viewBox · 2px stroke</p></div>
    <ul aria-label="Icon results" className="icon-gallery__results">
      {matches.map(({ name, use, Artwork }) => <li key={name} className="icon-gallery__card">
        <Artwork size={size} /><h2>{name}</h2><p>{use}</p>
      </li>)}
    </ul>
    {matches.length === 0 && <p className="icon-gallery__empty">No icons found. Try another term or clear the search.</p>}
  </>;
}

/**
 * Explain named imports and accessible labeling without adding actions to cards.
 **/
function GalleryUsage() {
  return <footer className="icon-gallery__footer"><div className="icon-gallery__usage"><div><h2>Ready to use</h2><p>Import only what you need.</p></div>
    <pre><code><span>import</span>{" { MoonIcon } from 'fletchstack-ui';\n"}<span>{'<MoonIcon'}</span>{' size="medium" label="Night mode" />'}</code></pre>
  </div><p className="icon-gallery__note"><Icon size="small"><circle cx="12" cy="4" r="2" /><path d="m4 8 8 2 8-2 M12 10v5 M8 21l4-6 4 6" /></Icon><span>Decorative by default. Add a <code>label</code> when the icon carries meaning.</span></p></footer>;
}

/**
 * Compose the documentation gallery; clearing restores results and search focus.
 **/
function GalleryContent({ query, setQuery, size, setSize }: { query: string; setQuery: (query: string) => void; size: IconSize; setSize: (size: IconSize) => void }) {
  const input = useRef<HTMLInputElement>(null);

  return <><div className="icon-gallery__controls">
    <div className="icon-gallery__search-controls"><GallerySearch input={input} query={query} onQuery={event => setQuery(event.target.value)} />
      <button className="icon-gallery__clear" type="button" aria-label="Clear search" title="Clear search" onClick={() => { setQuery(''); input.current!.focus(); }}><CloseIcon size="small" /></button>
    </div><GallerySizes size={size} onSize={setSize} />
  </div><GalleryResults matches={matchingIcons(query)} size={size} /><GalleryUsage /></>;
}

/**
 * Browse the story-only collection with local preview settings and literal search.
 **/
export function IconGallery() {
  const [query, setQuery] = useState('');
  const [size, setSize] = useState<IconSize>('large');
  const [theme, setTheme] = useState('inherit');

  return <div className="icon-gallery" data-theme={theme === 'inherit' ? undefined : theme}>
    <GalleryBreadcrumbs /><div className="icon-gallery__body">
      <GalleryHeading theme={theme} onTheme={event => setTheme(event.target.value)} />
      <GalleryContent query={query} setQuery={setQuery} size={size} setSize={setSize} />
    </div>
  </div>;
}
