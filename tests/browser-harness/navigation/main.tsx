import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { RouterDestinations } from '../../../src/components/bottom-navigation/stories/bottom-navigation-examples';
import '../../../src/generated/tokens.css';
import '../../../src/components/bottom-navigation/bottom-navigation.css';
import '../../../src/components/icon/icon.css';

createRoot(document.getElementById('root')!).render(<main data-theme="corporate"><BrowserRouter basename="/navigation-demo"><RouterDestinations base="/navigation-demo" /></BrowserRouter></main>);
