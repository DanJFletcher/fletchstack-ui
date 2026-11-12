import { useState } from 'react';
import { Accordion, type AccordionItem } from '../Accordion';

export const teamQuestions: readonly AccordionItem[] = [
  { id: 'join', title: 'Who can join?', content: <p>Anyone invited to your team can join your workspace.</p> },
  { id: 'invite', title: 'How do I invite someone?', content: <p>Open <a href="#team-settings">Team settings</a> and select Invite member.</p> },
  { id: 'role', title: 'Can I change a role?', content: <p>Team administrators can update member roles in Team settings.</p> },
];
export const settingsQuestions: readonly AccordionItem[] = [{ id: 'members', title: 'Members', content: 'Manage the people on your team.' }, { id: 'permissions', title: 'Permissions', content: 'Choose what each role can access.' }];

/**
 * Show expansion owned by an external parent and updated from native disclosure buttons.
 **/
export function ControlledAccordion() {
  const [openItems, setOpenItems] = useState<readonly string[]>(['invite']);
  return <><Accordion label="Controlled team FAQ" items={teamQuestions} openItems={openItems} onOpenItemsChange={setOpenItems} />
    <button type="button" onClick={() => setOpenItems(['role'])}>Show role guidance</button><output aria-label="Open question">{openItems.join(', ') || 'None'}</output></>;
}

/**
 * Compare one group boundary, inter-item dividers and a shared tinted surface.
 **/
export function AccordionVariants() {
  return <div className="accordion-demo__variants">{(['divided', 'outlined', 'surface'] as const).map(variant => <section key={variant}><h2>{variant[0]!.toUpperCase() + variant.slice(1)}</h2>
    <Accordion label={`${variant} settings`} variant={variant} items={settingsQuestions} /></section>)}</div>;
}

/**
 * Recreate the one-page team FAQ with Invite expanded in two independently themed regions.
 **/
export function AccordionExample() {
  return <main className="accordion-demo"><p className="accordion-demo__eyebrow"><strong>fletchstack-ui</strong> / Feedback</p><h1>Accordion</h1>
    <div className="accordion-demo__themes">{(['corporate', 'luna'] as const).map(theme => <section key={theme} data-theme={theme} className="accordion-demo__panel"><h2>{theme === 'corporate' ? 'Corporate' : 'Luna'}</h2>
      <Accordion label={`${theme} team FAQ`} items={teamQuestions} defaultOpenItems={['invite']} /></section>)}</div>
    <AccordionVariants />
  </main>;
}
