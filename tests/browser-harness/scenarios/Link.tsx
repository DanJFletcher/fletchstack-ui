import { Link, type LinkProps } from '../../../src/components/link/Link';
import { ArrowRightIcon } from '../../../src/components/icon/named/ArrowRightIcon';
import { ExternalLinkIcon } from '../../../src/components/icon/named/ExternalLinkIcon';
import type { Scenario } from '../gallery/types';
import '../../../src/components/link/link.css';
import '../../../src/components/icon/icon.css';

const Playground: Scenario<LinkProps> = {};

const ExternalDestination: Scenario<LinkProps> = { args: { href: 'https://example.com/docs', children: 'Read documentation', icon: <ExternalLinkIcon /> }, render: props => <Link {...props} href="https://example.com/docs" /> };

const NewTab: Scenario<LinkProps> = { render: () => <div className="stack"><p id="reference-context">Reference material.</p><Link href="#documentation" target="_blank" rel="noreferrer" aria-describedby="reference-context" icon={<ExternalLinkIcon />}>Read documentation</Link><section id="documentation"><h2>Documentation</h2><p>This example opens in a new tab only when explicitly activated.</p></section></div> };

const Unavailable: Scenario<LinkProps> = { args: { href: undefined, children: 'Unavailable documentation' }, render: () => <Link>Unavailable documentation</Link> };

const Usage: Scenario<LinkProps> = { render: () => <div className="stack"><p>Review our <Link href="#privacy">privacy policy</Link> before continuing.</p><Link href="#components" variant="standalone" icon={<ArrowRightIcon />}>View all components</Link><section id="privacy"><h2>Privacy policy</h2><p>Inline links wrap with the surrounding paragraph.</p></section><section id="components"><h2>Component index</h2></section></div> };

const Keyboard: Scenario<LinkProps> = { render: () => <div className="stack"><Link href="#keyboard-destination">First destination</Link><Link tabIndex={0}>Unavailable destination</Link><Link href="#keyboard-destination">Second destination</Link><section id="keyboard-destination"><h2>Keyboard destination</h2></section></div> };

const Download: Scenario<LinkProps> = { args: { href: 'data:text/plain,Component%20guide', download: 'component-guide.txt', children: 'Download component guide' }, render: props => <Link {...props} href="data:text/plain,Component%20guide" /> };

const EmptyDestination: Scenario<LinkProps> = { args: { href: '', children: 'Current page' }, render: props => <Link {...props} href="" /> };

const LongText: Scenario<LinkProps> = { args: { children: 'Read the complete documentation for every shared component in this workspace before continuing', icon: <ArrowRightIcon /> } };

/**
 * Keep the default destination explicit so static ownership includes every navigation input.
 **/
function LinkScenario(props: LinkProps) { return <Link {...props} href="#documentation" />; }
export const component = LinkScenario;
export const defaults: LinkProps = { href: '#documentation', children: 'View documentation' };
export const scenarios = { Keyboard, Playground, LongText, NewTab, ExternalDestination, Usage, Download, EmptyDestination, Unavailable };
