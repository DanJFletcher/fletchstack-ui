import '../src/components/popover/popover.css';
import '../src/components/dialog/dialog.css';
import '../src/components/tabs/tabs.css';
import '../src/components/app-content/app-content.css';
import '../src/components/app-shell/app-shell.css';
import '../src/components/bottom-navigation/bottom-navigation.css';
import '../src/components/navbar/navbar.css';
import '../src/components/breadcrumbs/breadcrumbs.css';
import '../src/components/menu/menu.css';
import '../src/components/callout/callout.css';
import '../src/components/table/table.css';
import '../src/components/combobox/combobox.css';
import '../src/components/rating/rating.css';
import '../src/components/accordion/accordion.css';
import '../src/components/chip/chip.css';
import '../src/components/multi-select/multi-select.css';
import '../src/components/avatar-group/avatar-group.css';
import '../src/components/avatar/avatar.css';
import '../src/components/code-block/code-block.css';
import '../src/components/button-group/button-group.css';
import '../src/components/typography/typography.css';
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
import '../src/components/radio/radio.css';
import '../src/components/link/link.css';
import '../src/components/switch/switch.css';
import '../src/components/spinner/spinner.css';
import '../src/components/badge/badge.css';
import '../src/components/separator/separator.css';
import '../src/components/container/container.css';
import '../src/components/stack/stack.css';
import '../src/components/cluster/cluster.css';
import '../src/components/simple-grid/simple-grid.css';
import '../src/components/aspect-ratio/aspect-ratio.css';
import '../src/components/section/section.css';
import '../src/components/checkbox/stories/checkbox.stories.css';
import '../src/components/card/stories/card.stories.css';
import '../src/components/field/stories/field-atoms.css';
import '../stories/shared/stories.css';
import '../src/components/icon/stories/icon-gallery.css';
import '../stories/foundations/spatial.stories.css';

import { applyMotionPreview, installMotionPreview } from './motion';
import './motion.css';

const preview: Preview = {
  beforeAll: installMotionPreview,
  loaders: [context => { applyMotionPreview(context); return {}; }],
  globalTypes: {
    motion: { description: 'Preview motion (Storybook only)', toolbar: { icon: 'play', dynamicTitle: true, items: [
      { value: 'system', title: 'System preference' }, { value: 'reduced', title: 'Reduced motion' }, { value: 'full', title: 'Full motion' },
    ] } },
    theme: { description: 'Preview theme', toolbar: { icon: 'paintbrush', dynamicTitle: true, items: [
      { value: 'corporate', title: 'Corporate' }, { value: 'luna', title: 'Luna' },
    ] } },
  },
  initialGlobals: { theme: 'corporate', motion: 'system' },
  parameters: {
    layout: 'fullscreen',
    options: { storySort: { order: [
      'Design System', ['Foundation', 'Tokens', 'Spatial System', 'Spatial Examples', 'Motion', 'Motion Examples'],
      'Components', [
        'Identity', ['Avatar', ['Playground', 'Image Fallback', 'Sizes', 'Shapes', 'Both Themes', 'Composition', 'Source Changes', 'Customization', 'Hidden'], 'AvatarGroup', ['Docs', 'Playground', 'Composition'], 'Chip', ['Docs', 'Playground', 'Composition']],
        'Actions', ['ButtonGroup', ['Docs', 'Playground', 'Joined', 'Vertical Joins', 'Wrapping', 'Widths', 'Child Overrides', 'Disabled Actions', 'Visible Label', 'Composition', 'Both Themes'], 'Button', ['Docs', 'Playground', 'States', 'Interaction States', 'Checked', 'Selected', 'Filled', 'Indeterminate', 'Invalid', 'Disabled', 'Read Only', 'Variants', 'Variants And Sizes', 'Variants And Padding', 'Sizes', 'Composition', 'Content Patterns', 'Group Selection', 'Standalone Primitives', 'Native Children', 'With Footer', 'With Media', 'Reference Layouts', 'Customization', 'Consumer Override', 'Both Themes']],
        'Forms', ['Checkbox', ['Docs', 'Playground', 'States', 'Interaction States', 'Checked', 'Selected', 'Filled', 'Indeterminate', 'Invalid', 'Disabled', 'Read Only', 'Variants', 'Variants And Sizes', 'Variants And Padding', 'Sizes', 'Composition', 'Content Patterns', 'Group Selection', 'Standalone Primitives', 'Native Children', 'With Footer', 'With Media', 'Reference Layouts', 'Customization', 'Consumer Override', 'Both Themes'], 'Field', ['Docs', 'Playground', 'States', 'Interaction States', 'Checked', 'Selected', 'Filled', 'Indeterminate', 'Invalid', 'Disabled', 'Read Only', 'Variants', 'Variants And Sizes', 'Variants And Padding', 'Sizes', 'Composition', 'Content Patterns', 'Group Selection', 'Standalone Primitives', 'Native Children', 'With Footer', 'With Media', 'Reference Layouts', 'Customization', 'Consumer Override', 'Both Themes'], 'FieldDescription', ['Docs', 'Playground', 'States', 'Interaction States', 'Checked', 'Selected', 'Filled', 'Indeterminate', 'Invalid', 'Disabled', 'Read Only', 'Variants', 'Variants And Sizes', 'Variants And Padding', 'Sizes', 'Composition', 'Content Patterns', 'Group Selection', 'Standalone Primitives', 'Native Children', 'With Footer', 'With Media', 'Reference Layouts', 'Customization', 'Consumer Override', 'Both Themes'],
          'FieldError', ['Docs', 'Playground', 'States', 'Interaction States', 'Checked', 'Selected', 'Filled', 'Indeterminate', 'Invalid', 'Disabled', 'Read Only', 'Variants', 'Variants And Sizes', 'Variants And Padding', 'Sizes', 'Composition', 'Content Patterns', 'Group Selection', 'Standalone Primitives', 'Native Children', 'With Footer', 'With Media', 'Reference Layouts', 'Customization', 'Consumer Override', 'Both Themes'], 'FieldLabel', ['Docs', 'Playground', 'States', 'Interaction States', 'Checked', 'Selected', 'Filled', 'Indeterminate', 'Invalid', 'Disabled', 'Read Only', 'Variants', 'Variants And Sizes', 'Variants And Padding', 'Sizes', 'Composition', 'Content Patterns', 'Group Selection', 'Standalone Primitives', 'Native Children', 'With Footer', 'With Media', 'Reference Layouts', 'Customization', 'Consumer Override', 'Both Themes'], 'FormGroup', ['Docs', 'Playground', 'States', 'Interaction States', 'Checked', 'Selected', 'Filled', 'Indeterminate', 'Invalid', 'Disabled', 'Read Only', 'Variants', 'Variants And Sizes', 'Variants And Padding', 'Sizes', 'Composition', 'Content Patterns', 'Group Selection', 'Standalone Primitives', 'Native Children', 'With Footer', 'With Media', 'Reference Layouts', 'Customization', 'Consumer Override', 'Both Themes'],
          'Radio', ['Docs', 'Playground', 'States', 'Group Selection', 'Customization', 'Both Themes'], 'Select', ['Docs', 'Playground', 'States', 'Interaction States', 'Checked', 'Selected', 'Filled', 'Indeterminate', 'Invalid', 'Disabled', 'Read Only', 'Variants', 'Variants And Sizes', 'Variants And Padding', 'Sizes', 'Composition', 'Content Patterns', 'Group Selection', 'Standalone Primitives', 'Native Children', 'With Footer', 'With Media', 'Reference Layouts', 'Customization', 'Consumer Override', 'Both Themes'], 'Switch', ['Docs', 'Playground', 'States', 'On', 'Disabled', 'Customization', 'Both Themes'], 'TextInput', ['Docs', 'Playground', 'States', 'Interaction States', 'Checked', 'Selected', 'Filled', 'Indeterminate', 'Invalid', 'Disabled', 'Read Only', 'Variants', 'Variants And Sizes', 'Variants And Padding', 'Sizes', 'Composition', 'Content Patterns', 'Group Selection', 'Standalone Primitives', 'Native Children', 'With Footer', 'With Media', 'Reference Layouts', 'Customization', 'Consumer Override', 'Both Themes'], 'Textarea', ['Docs', 'Playground', 'States', 'Interaction States', 'Checked', 'Selected', 'Filled', 'Indeterminate', 'Invalid', 'Disabled', 'Read Only', 'Variants', 'Variants And Sizes', 'Variants And Padding', 'Sizes', 'Composition', 'Content Patterns', 'Group Selection', 'Standalone Primitives', 'Native Children', 'With Footer', 'With Media', 'Reference Layouts', 'Customization', 'Consumer Override', 'Both Themes'], 'MultiSelect', ['Docs', 'Playground', 'Composition'], 'Combobox', ['Docs', 'Playground', 'Composition']],
        'Feedback', ['Badge', ['Docs', 'Playground', 'Tones', 'In Context', 'Count', 'Customization', 'Both Themes'], 'Spinner', ['Docs', 'Playground', 'Sizes', 'Loading Patterns', 'Customization', 'Both Themes'], 'Accordion', ['Docs', 'Playground', 'Composition'], 'Callout', ['Docs', 'Playground', 'Composition']],
        'Layout', ['AppShell', ['Docs', 'Playground', 'Composition'], 'AppContent', ['Docs', 'Playground', 'Composition'], 'Section', ['Docs', 'Playground', 'Spacing Presets', 'Responsive', 'Composition', 'Semantics', 'Both Themes'], 'AspectRatio', ['Docs', 'Playground', 'Ratios', 'Responsive', 'Media Fitting', 'Composition', 'Both Themes'], 'SimpleGrid', ['Docs', 'Playground', 'Reflow', 'Gaps', 'Composition', 'Customization', 'Both Themes'], 'Cluster', ['Docs', 'Playground', 'Gaps', 'Wrapping', 'Alignments', 'Justification', 'Composition', 'Both Themes'], 'Container', ['Docs', 'Playground', 'Width Presets', 'Responsive Gutters', 'Without Gutters', 'Nesting', 'Token Overrides', 'Composition', 'Both Themes'], 'Stack', ['Docs', 'Playground', 'Gaps', 'Alignments', 'Nested', 'Scoped Overrides', 'Responsive Gap', 'Form Composition', 'Both Themes'], 'Separator', ['Docs', 'Playground', 'Semantic', 'Vertical', 'Composition', 'Customization', 'Both Themes']],
        'Content', ['CodeBlock', ['Docs', 'Playground', 'Metadata', 'Long Lines', 'Wrapped', 'Copy Success', 'Copy Failure', 'Copy Retry', 'Read Only', 'Composition', 'Both Themes'], 'Rating', ['Docs', 'Playground', 'Composition']],
        'Typography', ['Heading', ['Docs', 'Playground', 'Sizes', 'Levels', 'Composition', 'Both Themes'], 'Text', ['Docs', 'Playground', 'Sizes', 'Tones', 'Inline', 'Both Themes']],
        'Navigation', ['BottomNavigation', ['Docs', 'Playground', 'Composition'], 'Link', ['Docs', 'Playground', 'States', 'Usage', 'Customization', 'Both Themes'], 'Menu', ['Docs', 'Playground', 'Composition'], 'Breadcrumbs', ['Docs', 'Playground', 'Composition'], 'Navbar', ['Docs', 'Playground', 'Composition'], 'Tabs', ['Docs', 'Playground', 'Composition']],
        'Surfaces', ['Card', ['Docs', 'Playground', 'States', 'Interaction States', 'Checked', 'Selected', 'Filled', 'Indeterminate', 'Invalid', 'Disabled', 'Read Only', 'Variants', 'Variants And Sizes', 'Variants And Padding', 'Sizes', 'Composition', 'Content Patterns', 'Group Selection', 'Standalone Primitives', 'Native Children', 'With Footer', 'With Media', 'Reference Layouts', 'Customization', 'Consumer Override', 'Both Themes']], 'Visuals', ['Icon', ['Docs', 'Playground', 'States', 'Interaction States', 'Checked', 'Selected', 'Filled', 'Indeterminate', 'Invalid', 'Disabled', 'Read Only', 'Variants', 'Variants And Sizes', 'Variants And Padding', 'Sizes', 'Composition', 'Content Patterns', 'Group Selection', 'Standalone Primitives', 'Native Children', 'With Footer', 'With Media', 'Reference Layouts', 'Customization', 'Consumer Override', 'Both Themes']],
       'Data display', ['Table', ['Docs', 'Playground', 'Composition']], 'Overlays', ['Dialog', ['Docs', 'Playground', 'Composition'], 'Popover', ['Docs', 'Playground', 'Composition']]],
      'Patterns', ['Forms'],
    ] } },
    a11y: { test: 'error', options: { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] } } },
    controls: { expanded: true },
  },
  decorators: [(Story, context) => <main data-theme={context.globals.theme} className="showcase"><Story /></main>],
};
export default preview;
