import { useState } from 'react';
import { Callout, type CalloutTone } from '../Callout';
import { Button } from '../../button/Button';
import { Icon } from '../../icon/Icon';

const messages: Record<CalloutTone, string> = { info: 'Drafts are visible to editors.', success: 'Your changes are live.', warning: 'Two pages still need approval.', error: 'The upload failed. Try again.', neutral: 'This project is archived.' };
const artwork: Record<CalloutTone, string> = { info: 'M12 11v6m0-10v.01', success: 'm8 12 3 3 5-6', warning: 'M12 9v4m0 3v.01', error: 'M12 7v6m0 4v.01', neutral: 'M8 12h8' };

/**
 * Supply decorative artwork through the library Icon primitive, outside the Callout implementation.
 **/
export function CalloutGlyph({ tone }: { tone: CalloutTone }) {
  return <Icon>{tone === 'warning' ? <path d="M12 3 2 21h20Z" /> : <circle cx="12" cy="12" r="9" />}<path d={artwork[tone]} /></Icon>;
}

/**
 * Demonstrate a caller-owned action without automatically removing the publishing warning.
 **/
export function PublishingWarning({ showFeedback = true }: { showFeedback?: boolean }) {
  const [reviews, setReviews] = useState(0);

  return <><Callout tone="warning" title="Review before publishing" icon={<CalloutGlyph tone="warning" />}
    action={<Button variant="secondary" size="small" onClick={() => setReviews(reviews + 1)}>Review pages</Button>}>Two pages still need approval.</Callout>
    {showFeedback && <output aria-label="Review requests" className="callout-demo__result">{reviews ? `Review requested ${reviews} time(s).` : 'No review requested.'}</output>}</>;
}

/**
 * Compare five descriptive tones without implying live-region behavior.
 **/
export function CalloutTones() {
  return <div className="callout-demo__stack">{(Object.keys(messages) as CalloutTone[]).map(tone =>
    <Callout key={tone} tone={tone} title={tone[0]!.toUpperCase() + tone.slice(1)} icon={<CalloutGlyph tone={tone} />}>{messages[tone]}</Callout>)}</div>;
}

/**
 * Preserve wrapping of long messages and consumer-provided action labels in small containers.
 **/
export function NarrowCallout() {
  return <div className="callout-demo__narrow"><Callout tone="warning" title="Review before publishing" icon={<CalloutGlyph tone="warning" />}
    action={<Button variant="secondary">Review all pages awaiting approval from the publishing team</Button>}>
    Two pages still need approval from your team before this project can be published. VeryLongUnbrokenProjectNamesMustWrapAsWell.
  </Callout></div>;
}

/**
 * Contrast a scoped instance override with an unchanged neighboring callout.
 **/
export function CalloutOverrides() {
  return <div className="callout-demo__stack"><Callout title="Custom instance" style={{ '--fs-callout-surface': 'rgb(255, 255, 255)', '--fs-callout-text': 'rgb(0, 0, 0)', '--fs-callout-accent': 'rgb(0, 0, 0)', '--fs-callout-border': 'rgb(120, 120, 120)', '--fs-callout-radius': '0px' }}>Only this instance changes.</Callout>
    <Callout title="Neighbor">The theme supplies this instance.</Callout></div>;
}

/**
 * Recreate the publishing sheet in both themes with shared content and inherited semantic colors.
 **/
export function CalloutExample() {
  return <main className="callout-demo"><p>fletchstack-ui / Feedback</p><h1>Callout</h1>
    <div className="callout-demo__themes">{(['corporate', 'luna'] as const).map(theme => <section key={theme} data-theme={theme} className="callout-demo__theme" aria-label={theme === 'corporate' ? 'Corporate' : 'Luna'}>
      <h2>{theme === 'corporate' ? 'Corporate' : 'Luna'}</h2><PublishingWarning showFeedback={false} /></section>)}</div>
    <section className="callout-demo__tones"><h2>Tones</h2><CalloutTones /></section></main>;
}
