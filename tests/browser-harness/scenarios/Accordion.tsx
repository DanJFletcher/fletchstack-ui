import { Accordion, type AccordionProps } from '../../../src/components/accordion/Accordion';
import { AccordionExample, AccordionVariants, ControlledAccordion, teamQuestions } from '../../../src/components/accordion/stories/accordion-examples';
import type { Scenario } from '../gallery/types';
import '../../../src/components/accordion/accordion.css';
import '../../../src/components/accordion/stories/accordion.stories.css';

const Playground: Scenario<AccordionProps> = {};
const Composition: Scenario<AccordionProps> = { render: () => <AccordionExample /> };
const Variants: Scenario<AccordionProps> = { render: () => <AccordionVariants /> };
const Multiple: Scenario<AccordionProps> = { args: { multiple: true } };
const Disabled: Scenario<AccordionProps> = { args: { items: [{ ...teamQuestions[0]!, disabled: true }, ...teamQuestions.slice(1)] } };
const Controlled: Scenario<AccordionProps> = { render: () => <ControlledAccordion /> };
const Motion: Scenario<AccordionProps> = { args: { panelMotion: 'expand' } };
const LongTitle: Scenario<AccordionProps> = { args: { items: [{ id: 'long', title: 'HowCanIInviteSomeoneWithAnUnusuallyLongUnbrokenTitleToTheTeam?', content: 'Panel text aligns with the title.' }, teamQuestions[1]!] } };
const Instances: Scenario<AccordionProps> = { render: () => <><Accordion label="First FAQ" items={teamQuestions} /><Accordion label="Second FAQ" items={teamQuestions} /></> };
export const component = Accordion;
export const defaults: AccordionProps = { label: 'Team FAQ', items: teamQuestions };
export const scenarios = { Playground, Composition, Variants, Multiple, Disabled, Controlled, Motion, LongTitle, Instances };
