import { Button } from 'fletchstack-ui';
import 'fletchstack-ui/styles.css';

/**
 * Render the same native control during Gatsby SSR and client hydration.
 **/
export default function SettingsPage() {
  return <main data-theme="corporate"><h1>Account settings</h1><Button onClick={() => window.alert('Saved')}>Save changes</Button></main>;
}
