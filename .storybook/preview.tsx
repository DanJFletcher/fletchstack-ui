import type { Preview } from '@storybook/react-vite';
import '../src/generated/tokens.css';
import '../src/button.css';
import '../src/icon.css';
import '../stories/stories.css';

const preview: Preview = {
  globalTypes: {
    theme: { description: 'Preview theme', toolbar: { icon: 'paintbrush', dynamicTitle: true, items: [
      { value: 'corporate', title: 'Corporate' }, { value: 'luna', title: 'Luna' },
    ] } },
  },
  initialGlobals: { theme: 'corporate' },
  parameters: {
    layout: 'fullscreen',
    options: { storySort: { order: ['Design System', ['Foundation', 'Tokens'], 'Components'] } },
    a11y: { test: 'error', options: { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] } } },
    controls: { expanded: true },
  },
  decorators: [(Story, context) => <main data-theme={context.globals.theme} className="showcase"><Story /></main>],
};
export default preview;
