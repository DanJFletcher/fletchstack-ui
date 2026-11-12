import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within, waitFor } from 'storybook/test';
import { Accordion } from '../Accordion';
import { AccordionExample, AccordionVariants, ControlledAccordion, teamQuestions } from './accordion-examples';
import './accordion.stories.css';

const meta = { id: 'components-accordion', title: 'Components/Feedback/Accordion', component: Accordion, tags: ['autodocs'],
  args: { items: teamQuestions, label: 'Team FAQ' }, parameters: { a11y: { test: 'error' }, docs: { description: { component: 'Single- or multi-open disclosures with native heading buttons, unique panel relationships and persistent content. panelMotion="expand" opts into token-based size/opacity transitions; closed animated content is inert and hidden from assistive technology. Reduced motion makes all transitions immediate. Import accordion.css with tokens or use combined styles.' } } },
} satisfies Meta<typeof Accordion>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const KeyboardAndPanelLink: Story = { play: async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  canvas.getByRole('button', { name: 'How do I invite someone?' }).focus();
  await userEvent.keyboard('{Enter}');
  await userEvent.tab();
  await expect(canvas.getByRole('link', { name: 'Team settings' })).toHaveFocus();
  await userEvent.tab({ shift: true });
  await userEvent.keyboard(' ');
  await userEvent.tab();
  await expect(canvas.getByRole('button', { name: 'Can I change a role?' })).toHaveFocus();
  await expect(canvas.queryByRole('link', { name: 'Team settings' })).not.toBeInTheDocument();
} };
export const Variants: Story = { render: () => <AccordionVariants /> };
export const MultipleOpenPanels: Story = { args: { multiple: true, defaultOpenItems: ['join', 'invite'] } };
export const DisabledItem: Story = { args: { items: [...teamQuestions, { id: 'future', title: 'Not available yet', content: 'Future guidance.', disabled: true }] } };
export const ControlledState: Story = { render: () => <ControlledAccordion /> };
export const ExpandCollapseMotion: Story = { args: { panelMotion: 'expand' }, play: async ({ canvasElement }) => { await userEvent.click(within(canvasElement).getByRole('button', { name: 'How do I invite someone?' })); await waitFor(() => expect(within(canvasElement).getByRole('region', { name: 'How do I invite someone?' })).toHaveStyle({ opacity: '1' })); } };
export const LongTitle: Story = { args: { items: [{ id: 'long', title: 'HowCanIInviteSomeoneWithAnUnusuallyLongUnbrokenTitleToTheTeam?', content: 'Panel content remains aligned with the heading text.' }] }, decorators: [Story => <div style={{ maxWidth: 280 }}><Story /></div>] };
export const Composition: Story = { render: () => <AccordionExample /> };
export const Hidden: Story = { args: { hidden: true } };
