import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Item } from '../Item';
import { ItemActions, ItemContent, ItemDescription, ItemFooter, ItemGroup, ItemHeader, ItemMedia, ItemSeparator, ItemTitle } from '../ItemParts';
import { ItemComposition, ItemExample, ItemLinkExample, ItemLongExample, ItemMediaExamples, ItemOverrides, ItemSizes, ItemVariants } from './item-examples';

const meta = { id: 'components-item', title: 'Components/Data display/Item', component: Item, subcomponents: { ItemActions, ItemContent, ItemDescription, ItemFooter, ItemGroup, ItemHeader, ItemMedia, ItemSeparator, ItemTitle }, tags: ['autodocs'], args: { children: 'A compact content row' }, parameters: { a11y: { test: 'error' }, docs: { description: { component: 'Composable media, content and action rows. Item is a passive div by default; use as="a" with href for a native whole-row link. Do not nest buttons or links inside a whole-row link. Variants: default (transparent), outline, muted. Sizes: default, sm, xs. Every part forwards its ref, native attributes, className and scoped --fs-* styles. ItemGroup supplies layout, not list or menu semantics. Use native lists when needed. Import tokens.css and item.css, or styles.css. See docs/item.md for API, examples and accessibility guidance.' } } } } satisfies Meta<typeof Item>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Composition: Story = { render: () => <ItemComposition /> };
export const Variants: Story = { render: () => <ItemVariants /> };
export const Sizes: Story = { render: () => <ItemSizes /> };
export const Media: Story = { render: () => <ItemMediaExamples /> };
export const Link: Story = { render: () => <ItemLinkExample /> };
export const Actions: Story = { render: () => <ItemExample />, play: async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await userEvent.tab();
  await expect(canvas.getByRole('button', { name: 'Review invitation' })).toHaveFocus();
  await userEvent.keyboard('{Enter}');
  await expect(canvas.getByRole('status')).toHaveTextContent('Invitation reviewed');
} };
export const Narrow: Story = { render: () => <ItemLongExample />, decorators: [Story => <div style={{ maxWidth: 280 }}><Story /></div>] };
export const Customization: Story = { render: () => <ItemOverrides /> };
export const Rtl: Story = { render: () => <div dir="rtl"><ItemExample /></div> };
export const Luna: Story = { globals: { theme: 'luna' }, render: () => <ItemExample /> };
export const Hidden: Story = { args: { hidden: true } };
