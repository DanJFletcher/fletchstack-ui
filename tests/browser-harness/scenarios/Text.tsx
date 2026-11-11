import { Heading } from '../../../src/components/typography/Heading';
import { Stack } from '../../../src/components/stack/Stack';
import { Text, type TextProps, type TextStyle } from '../../../src/components/typography/Text';
import type { Scenario } from '../gallery/types';
import '../../../src/components/typography/typography.css';
import '../../../src/components/stack/stack.css';
import '../../../src/components/typography/stories/typography.stories.css';

const Sizes: Scenario<TextProps> = { render: () => <Stack>{(['lead', 'body', 'small'] as const).map(size => <Text key={size} size={size} data-testid={`text-${size}`}>{size}: Choose which updates arrive in your inbox.</Text>)}</Stack> };

const BothThemes: Scenario<TextProps> = { render: () => <div className="theme-grid">{(['corporate', 'luna'] as const).map(theme => <section key={theme} data-theme={theme} className="theme-panel" aria-label={`${theme} content`}><Stack><Heading>Project settings</Heading><Text size="lead">Manage your workspace.</Text><Text>Choose which updates arrive in your inbox.</Text><Text tone="muted" size="small">Updated yesterday</Text></Stack></section>)}</div> };

const ScopedOverrides: Scenario<TextProps> = { render: () => <Stack><div style={{ '--fs-typography-text-font-body': '1.25rem', '--fs-typography-text-line-height': 2 } as TextStyle}><Text data-testid="outer-text">Scoped body text</Text><div data-theme="luna" className="theme-panel"><Text data-testid="reset-text">Nested theme body</Text></div></div><Text data-testid="sibling-text">Unaffected sibling</Text><Text size="small" data-testid="small-text">Independent small text</Text></Stack> };

const Hidden: Scenario<TextProps> = { args: { hidden: true } };

export const component = Text;
export const defaults: TextProps = { children: 'Choose which updates arrive in your inbox.', as: 'p', size: 'body', tone: 'default' };
export const scenarios = { Sizes, BothThemes, ScopedOverrides, Hidden };
