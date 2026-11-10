import { useEffect, useRef, useState } from 'react';
import { Button } from '../../../../../src/components/button/Button';
import { Checkbox } from '../../../../../src/components/checkbox/Checkbox';

/**
 * Hydrate native checkbox properties, descriptions, and the public input ref.
 **/
export function CheckboxApp() {
  const [hydrated, setHydrated] = useState(false);
  const [selection, setSelection] = useState('partial');
  const [reference, setReference] = useState('Not inspected');
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => { setHydrated(true); }, []);

  return <div data-hydrated={hydrated}>
    <Checkbox label="Select all" description="Some channels are selected." checked={selection === 'all'} indeterminate={selection === 'partial'} onChange={event => setSelection(event.target.checked ? 'all' : 'none')} ref={input} />
    <p id="checkbox-context">Notification settings.</p><Checkbox id="email" label="Email updates" description="Receive product news." error="Choose a channel." aria-describedby="checkbox-context" defaultChecked />
    <Checkbox label="Unavailable channel" disabled /><Button onClick={() => setReference(String(input.current instanceof HTMLInputElement))}>Inspect input ref</Button><output aria-label="Ref result">{reference}</output>
  </div>;
}
