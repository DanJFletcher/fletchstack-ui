import { hydrateRoot } from 'react-dom/client';
import { CheckboxApp } from './CheckboxApp';

const root = document.getElementById('root');
if (!root) { throw new Error('Missing fixture root'); }
hydrateRoot(root, <CheckboxApp />, { onRecoverableError: error => { throw error; } });
