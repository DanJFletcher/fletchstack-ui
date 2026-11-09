import { useEffect, useRef, useState } from 'react';
import { ArrowRightIcon, Button, CheckIcon, ChevronDownIcon, CloseIcon, ExternalLinkIcon, Icon, MoonIcon, PlusIcon, SunIcon } from '../../../../src';

const catalog = [MoonIcon, SunIcon, CheckIcon, CloseIcon, ChevronDownIcon, ArrowRightIcon, PlusIcon, ExternalLinkIcon];

/**
 * Hydrate custom and named SVG compositions with real theme scopes and controls.
 **/
export function IconApp() {
  const [hydrated, setHydrated] = useState(false);
  const [clicks, setClicks] = useState(0);
  const [reference, setReference] = useState('Not inspected');
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => { setHydrated(true); }, []);

  return <div data-hydrated={hydrated}>
    <Icon label=" Custom shape " viewBox="0 0 32 32" className="brand-art" data-source="consumer" style={{ '--fs-icon-size-medium': '28px' }} ref={ref} fill="currentColor" stroke="none"><g><path d="M4 4h24v24H4Z" /></g></Icon>
    <Icon /><Icon label="" /><Icon label="   " />
    {catalog.map((Artwork, index) => <div key={index}>{(['small', 'medium', 'large'] as const).map(size => <Artwork key={size} size={size} label={`${index} ${size}`} />)}</div>)}
    <Button onClick={() => setReference(String(ref.current instanceof SVGSVGElement))}>Inspect SVG ref</Button><output aria-label="Ref result">{reference}</output>
    <div data-theme="corporate"><Icon label="Corporate default" /><div style={{ '--fs-icon-size-medium': '30px', '--fs-icon-stroke-width': 3 } as React.CSSProperties}>
      <Icon label="Local override" /><div data-theme="luna"><Icon label="Nested reset" /></div>
    </div></div>
    <div className="narrow"><Button onClick={() => setClicks(value => value + 1)}><MoonIcon />Save all changes and return to your account settings</Button></div>
    <Button aria-label="Close dialog"><CloseIcon /></Button><Button disabled><CheckIcon />Unavailable</Button>
    <output aria-label="Activations">{clicks}</output>
  </div>;
}
