import { useState } from 'react';
import { Button, CheckIcon } from 'fletchstack-ui';

/**
 * Own the event handler inside the React island; Astro only passes serializable data.
 **/
export default function SaveAction() {
  const [saved, setSaved] = useState(false);

  return <Button onClick={() => setSaved(true)} disabled={saved}><CheckIcon /><span>{saved ? 'Saved' : 'Save changes'}</span></Button>;
}
