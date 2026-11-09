import { hydrateRoot } from 'react-dom/client';
import { IconApp } from './IconApp';

const root = document.getElementById('root');
if (!root) { throw new Error('Missing fixture root'); }
hydrateRoot(root, <IconApp />, { onRecoverableError: error => { throw error; } });
