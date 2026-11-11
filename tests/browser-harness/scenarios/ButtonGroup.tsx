import { useState } from 'react';
import { Button } from '../../../src/components/button/Button';
import { ButtonGroup } from '../../../src/components/button-group/ButtonGroup';
import { Container } from '../../../src/components/container/Container';
import { Heading } from '../../../src/components/typography/Heading';
import { Stack } from '../../../src/components/stack/Stack';
import { Text } from '../../../src/components/typography/Text';
import type { ButtonGroupProps, ButtonGroupStyle } from '../../../src/components/button-group/ButtonGroup';
import type { Scenario } from '../gallery/types';
import '../../../src/components/button-group/button-group.css';
import '../../../src/components/button/button.css';
import '../../../src/components/container/container.css';
import '../../../src/components/typography/typography.css';
import '../../../src/components/stack/stack.css';
import '../../../src/components/button-group/stories/button-group.stories.css';

/**
 * Exercise action handlers and external native submit/reset form association.
 **/
function Editor() {
  const [status, setStatus] = useState('No action yet');

  return <Container size="reading"><Stack><Heading as="h1" size="page">Publish article</Heading><form id="article" onSubmit={event => { event.preventDefault(); setStatus('Published'); }} onReset={() => setStatus('Reset')}><label htmlFor="article-title">Article title</label><input id="article-title" name="title" defaultValue="Draft article" /></form><Heading id="editor-actions">Article actions</Heading><ButtonGroup aria-labelledby="editor-actions" variant="secondary"><Button onClick={() => setStatus('Draft saved')}>Save draft</Button><Button onClick={() => setStatus('Preview opened')}>Preview</Button><Button variant="primary" type="submit" form="article">Publish</Button><Button type="reset" form="article">Reset</Button></ButtonGroup><Text role="status">{status}</Text></Stack></Container>;
}

/**
 * Toggle hidden edge and interior actions to demonstrate live seam recalculation.
 **/
function HiddenActions() {
  const [showEdges, setShowEdges] = useState(false);

  return <Stack><Button onClick={() => setShowEdges(!showEdges)}>Toggle edge actions</Button>{(['horizontal', 'vertical'] as const).map(orientation => <ButtonGroup key={orientation} aria-label={`Hidden ${orientation} edges`} appearance="joined" orientation={orientation} variant="secondary"><Button hidden={!showEdges}>First</Button><Button>Copy</Button><Button hidden>Hidden middle</Button><Button>Export</Button><Button hidden={!showEdges}>Last</Button>{showEdges && <Button>Optional</Button>}</ButtonGroup>)}<ButtonGroup aria-label="Single visible action" appearance="joined" variant="secondary"><Button hidden>Before</Button><Button>Only action</Button><Button hidden>After</Button></ButtonGroup></Stack>;
}

/**
 * Return direct native action components for layout demonstrations.
 **/
function actions() {
  return ['Save draft', 'Preview', 'Publish'].map(label => <Button key={label}>{label}</Button>);
}

const Joined: Scenario<ButtonGroupProps> = { args: { appearance: 'joined', variant: 'secondary' } };

const VerticalJoins: Scenario<ButtonGroupProps> = { args: { appearance: 'joined', orientation: 'vertical', variant: 'secondary' } };

const Wrapping: Scenario<ButtonGroupProps> = { render: () => <Stack><Text>Same actions, different parent widths. Outlines belong to demonstration parents.</Text><div className="button-group-demo-wide"><ButtonGroup aria-label="Wide actions" variant="secondary">{actions()}</ButtonGroup></div><div className="button-group-demo-narrow"><ButtonGroup aria-label="Narrow actions" variant="secondary">{actions()}</ButtonGroup></div><div className="button-group-demo-narrow"><ButtonGroup aria-label="Unwrapped actions" wrap={false} variant="secondary">{actions()}</ButtonGroup></div></Stack> };

const Widths: Scenario<ButtonGroupProps> = { render: () => <Stack>{[{ fullWidth: false, equalWidth: false, name: 'Intrinsic' }, { fullWidth: true, equalWidth: false, name: 'Full width' }, { fullWidth: true, equalWidth: true, name: 'Equal width' }].map(props => <div className="button-group-demo-wide" key={props.name}><ButtonGroup aria-label={props.name} fullWidth={props.fullWidth} equalWidth={props.equalWidth} variant="secondary">{actions()}</ButtonGroup></div>)}<div className="button-group-demo-last-row"><ButtonGroup aria-label="Equal wrapped rows" fullWidth equalWidth variant="secondary">{['One', 'Two', 'Three', 'Four', 'Five'].map(label => <Button key={label}>{label}</Button>)}</ButtonGroup></div><div className="button-group-demo-wide"><ButtonGroup aria-label="Equal column" orientation="vertical" fullWidth equalWidth variant="secondary">{actions()}</ButtonGroup></div></Stack> };

const Alignments: Scenario<ButtonGroupProps> = { render: () => <Stack>{(['horizontal', 'vertical'] as const).flatMap(orientation => (['start', 'center', 'end'] as const).map(align => <div key={`${orientation}-${align}`} className="button-group-demo-wide"><ButtonGroup aria-label={`${orientation} ${align}`} orientation={orientation} align={align} fullWidth variant="secondary">{actions()}</ButtonGroup></div>))}</Stack> };

const DisabledActions: Scenario<ButtonGroupProps> = { args: { appearance: 'joined', disabled: true }, render: args => <Stack><ButtonGroup {...args}><Button disabled={false}>Save draft</Button><Button>Preview</Button><Button disabled>Publish</Button></ButtonGroup><ButtonGroup aria-label="Independently disabled actions"><Button>Save</Button><Button disabled>Delete</Button></ButtonGroup></Stack> };

const JoinedFocus: Scenario<ButtonGroupProps> = { args: { appearance: 'joined', variant: 'secondary' } };

const RTL: Scenario<ButtonGroupProps> = { render: () => <div dir="rtl"><ButtonGroup aria-label="RTL actions" appearance="joined" variant="secondary">{actions()}</ButtonGroup></div> };

const HiddenEdges: Scenario<ButtonGroupProps> = { render: () => <HiddenActions /> };

const Composition: Scenario<ButtonGroupProps> = { render: () => <Editor /> };

const ScopedGap: Scenario<ButtonGroupProps> = { render: () => <Stack><div style={{ '--fs-space-gap-actions': '20px' } as ButtonGroupStyle}><ButtonGroup aria-label="Scoped actions">{actions()}</ButtonGroup><div data-theme="luna" className="theme-panel"><ButtonGroup aria-label="Reset actions">{actions()}</ButtonGroup></div></div><ButtonGroup aria-label="Sibling actions">{actions()}</ButtonGroup></Stack> };

const LongLabels: Scenario<ButtonGroupProps> = { render: () => <Container><Stack><Heading>Workspace publishing actions</Heading><ButtonGroup aria-label="Long separated labels" variant="secondary"><Button>Save a draft for the international editorial team</Button><Button>Preview pending changes before publishing</Button><Button>Publish workspace announcement</Button></ButtonGroup><ButtonGroup aria-label="Long joined labels" appearance="joined" variant="secondary" fullWidth equalWidth><Button>Save the latest draft</Button><Button>Preview changes</Button><Button>Publish announcement</Button></ButtonGroup></Stack></Container> };

const Hidden: Scenario<ButtonGroupProps> = { args: { hidden: true } };

export const component = ButtonGroup;
export const defaults: ButtonGroupProps = { 'aria-label': 'Page actions', children: actions(), appearance: 'separated', orientation: 'horizontal', align: 'start', wrap: true, fullWidth: false, equalWidth: false, disabled: false };
export const scenarios = { Joined, VerticalJoins, HiddenEdges, JoinedFocus, Wrapping, LongLabels, RTL, Widths, Alignments, ScopedGap, Composition, DisabledActions, Hidden };
