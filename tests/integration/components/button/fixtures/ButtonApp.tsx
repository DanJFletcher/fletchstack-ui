import { useEffect, useRef, useState } from 'react';
import { Button } from '../../../../../src/components/button/Button';

/**
 * Exercise the public Button API in a real React form that can render and hydrate.
 **/
export function ButtonApp() {
  const [clicks, setClicks] = useState(0);
  const [submissions, setSubmissions] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    <form
      data-hydrated={hydrated}
      onSubmit={(event) => {
        event.preventDefault();
        setSubmissions((value) => value + 1);
      }}
    >
      <label>
        Title
        <input name="title" defaultValue="Draft" />
      </label>
      <Button
        ref={buttonRef}
        size="small"
        onClick={() => {
          setClicks((value) => value + 1);
        }}
      >
        Save draft
      </Button>
      <Button type="submit" variant="secondary" size="large">
        Submit
      </Button>
      <Button type="reset" variant="ghost">
        Reset
      </Button>
      <Button
        disabled
        onClick={() => {
          setClicks((value) => value + 1);
        }}
      >
        Unavailable
      </Button>
      <Button
        aria-label="Add item"
        onClick={() => {
          setClicks((value) => value + 1);
        }}
      >
        <span aria-hidden="true">+</span>
      </Button>
      <Button className="consumer-action" style={{ '--fs-button-radius': '0px' }}>
        Custom
      </Button>
      <button
        type="button"
        onClick={() => {
          buttonRef.current?.focus();
        }}
      >
        Focus draft
      </button>
      <output aria-label="Clicks">{clicks}</output>
      <output aria-label="Submissions">{submissions}</output>
    </form>
  );
}
