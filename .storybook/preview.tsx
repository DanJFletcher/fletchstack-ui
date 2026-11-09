import '../src/components/textarea/textarea.css';
import '../src/components/field/field.css';
import '../src/components/form-group/form-group.css';
import type { Preview } from '@storybook/react-vite';
import '../src/generated/tokens.css';
import '../src/components/button/button.css';
import '../src/components/icon/icon.css';
import '../src/components/card/card.css';
import '../src/components/select/select.css';
import '../src/components/text-input/text-input.css';
import '../src/components/checkbox/checkbox.css';
import '../src/components/checkbox/stories/checkbox.stories.css';
import '../src/components/card/stories/card.stories.css';
import '../src/components/field/stories/field-atoms.css';
import '../stories/shared/stories.css';
import '../src/components/icon/stories/icon-gallery.css';
import '../stories/foundations/spatial.stories.css';

const preview: Preview = {
  globalTypes: {
    theme: { description: 'Preview theme', toolbar: { icon: 'paintbrush', dynamicTitle: true, items: [
      { value: 'corporate', title: 'Corporate' }, { value: 'luna', title: 'Luna' },
    ] } },
  },
  initialGlobals: { theme: 'corporate' },
  parameters: {
    layout: 'fullscreen',
    options: { storySort: { order: [
      'Design System', ['Foundation', 'Tokens', 'Spatial System', 'Spatial Examples'],
      'Components', [
        'Actions', ['Button', ['Docs', 'Playground', 'States', 'Interaction States', 'Checked', 'Selected', 'Filled', 'Indeterminate', 'Invalid', 'Disabled', 'Read Only', 'Variants', 'Variants And Sizes', 'Variants And Padding', 'Sizes', 'Composition', 'Content Patterns', 'Group Selection', 'Standalone Primitives', 'Native Children', 'With Footer', 'With Media', 'Reference Layouts', 'Customization', 'Consumer Override', 'Both Themes']],
        'Forms', ['Checkbox', ['Docs', 'Playground', 'States', 'Interaction States', 'Checked', 'Selected', 'Filled', 'Indeterminate', 'Invalid', 'Disabled', 'Read Only', 'Variants', 'Variants And Sizes', 'Variants And Padding', 'Sizes', 'Composition', 'Content Patterns', 'Group Selection', 'Standalone Primitives', 'Native Children', 'With Footer', 'With Media', 'Reference Layouts', 'Customization', 'Consumer Override', 'Both Themes'], 'Field', ['Docs', 'Playground', 'States', 'Interaction States', 'Checked', 'Selected', 'Filled', 'Indeterminate', 'Invalid', 'Disabled', 'Read Only', 'Variants', 'Variants And Sizes', 'Variants And Padding', 'Sizes', 'Composition', 'Content Patterns', 'Group Selection', 'Standalone Primitives', 'Native Children', 'With Footer', 'With Media', 'Reference Layouts', 'Customization', 'Consumer Override', 'Both Themes'], 'FieldDescription', ['Docs', 'Playground', 'States', 'Interaction States', 'Checked', 'Selected', 'Filled', 'Indeterminate', 'Invalid', 'Disabled', 'Read Only', 'Variants', 'Variants And Sizes', 'Variants And Padding', 'Sizes', 'Composition', 'Content Patterns', 'Group Selection', 'Standalone Primitives', 'Native Children', 'With Footer', 'With Media', 'Reference Layouts', 'Customization', 'Consumer Override', 'Both Themes'],
          'FieldError', ['Docs', 'Playground', 'States', 'Interaction States', 'Checked', 'Selected', 'Filled', 'Indeterminate', 'Invalid', 'Disabled', 'Read Only', 'Variants', 'Variants And Sizes', 'Variants And Padding', 'Sizes', 'Composition', 'Content Patterns', 'Group Selection', 'Standalone Primitives', 'Native Children', 'With Footer', 'With Media', 'Reference Layouts', 'Customization', 'Consumer Override', 'Both Themes'], 'FieldLabel', ['Docs', 'Playground', 'States', 'Interaction States', 'Checked', 'Selected', 'Filled', 'Indeterminate', 'Invalid', 'Disabled', 'Read Only', 'Variants', 'Variants And Sizes', 'Variants And Padding', 'Sizes', 'Composition', 'Content Patterns', 'Group Selection', 'Standalone Primitives', 'Native Children', 'With Footer', 'With Media', 'Reference Layouts', 'Customization', 'Consumer Override', 'Both Themes'], 'FormGroup', ['Docs', 'Playground', 'States', 'Interaction States', 'Checked', 'Selected', 'Filled', 'Indeterminate', 'Invalid', 'Disabled', 'Read Only', 'Variants', 'Variants And Sizes', 'Variants And Padding', 'Sizes', 'Composition', 'Content Patterns', 'Group Selection', 'Standalone Primitives', 'Native Children', 'With Footer', 'With Media', 'Reference Layouts', 'Customization', 'Consumer Override', 'Both Themes'],
          'Select', ['Docs', 'Playground', 'States', 'Interaction States', 'Checked', 'Selected', 'Filled', 'Indeterminate', 'Invalid', 'Disabled', 'Read Only', 'Variants', 'Variants And Sizes', 'Variants And Padding', 'Sizes', 'Composition', 'Content Patterns', 'Group Selection', 'Standalone Primitives', 'Native Children', 'With Footer', 'With Media', 'Reference Layouts', 'Customization', 'Consumer Override', 'Both Themes'], 'TextInput', ['Docs', 'Playground', 'States', 'Interaction States', 'Checked', 'Selected', 'Filled', 'Indeterminate', 'Invalid', 'Disabled', 'Read Only', 'Variants', 'Variants And Sizes', 'Variants And Padding', 'Sizes', 'Composition', 'Content Patterns', 'Group Selection', 'Standalone Primitives', 'Native Children', 'With Footer', 'With Media', 'Reference Layouts', 'Customization', 'Consumer Override', 'Both Themes'], 'Textarea', ['Docs', 'Playground', 'States', 'Interaction States', 'Checked', 'Selected', 'Filled', 'Indeterminate', 'Invalid', 'Disabled', 'Read Only', 'Variants', 'Variants And Sizes', 'Variants And Padding', 'Sizes', 'Composition', 'Content Patterns', 'Group Selection', 'Standalone Primitives', 'Native Children', 'With Footer', 'With Media', 'Reference Layouts', 'Customization', 'Consumer Override', 'Both Themes']],
        'Surfaces', ['Card', ['Docs', 'Playground', 'States', 'Interaction States', 'Checked', 'Selected', 'Filled', 'Indeterminate', 'Invalid', 'Disabled', 'Read Only', 'Variants', 'Variants And Sizes', 'Variants And Padding', 'Sizes', 'Composition', 'Content Patterns', 'Group Selection', 'Standalone Primitives', 'Native Children', 'With Footer', 'With Media', 'Reference Layouts', 'Customization', 'Consumer Override', 'Both Themes']], 'Visuals', ['Icon', ['Docs', 'Playground', 'States', 'Interaction States', 'Checked', 'Selected', 'Filled', 'Indeterminate', 'Invalid', 'Disabled', 'Read Only', 'Variants', 'Variants And Sizes', 'Variants And Padding', 'Sizes', 'Composition', 'Content Patterns', 'Group Selection', 'Standalone Primitives', 'Native Children', 'With Footer', 'With Media', 'Reference Layouts', 'Customization', 'Consumer Override', 'Both Themes']],
      ],
      'Patterns', ['Forms'],
    ] } },
    a11y: { test: 'error', options: { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] } } },
    controls: { expanded: true },
  },
  decorators: [(Story, context) => <main data-theme={context.globals.theme} className="showcase"><Story /></main>],
};
export default preview;
