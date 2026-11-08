import { useState } from 'react';
import { Button } from 'fletchstack-ui';

/**
 * Own the event handler inside the React island; Astro only passes serializable data.
 **/
export default function SaveAction() {
  const [saved, setSaved] = useState(false);

  return <Button onClick={() => setSaved(true)} disabled={saved}>{saved ? 'Saved' : 'Save changes'}</Button>;
}
