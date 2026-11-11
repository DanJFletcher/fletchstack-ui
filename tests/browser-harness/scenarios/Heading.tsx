import { Container } from '../../../src/components/container/Container';
import { Heading, type HeadingProps, type HeadingStyle } from '../../../src/components/typography/Heading';
import { Stack } from '../../../src/components/stack/Stack';
import { Text } from '../../../src/components/typography/Text';
import type { Scenario } from '../gallery/types';
import '../../../src/components/typography/typography.css';
import '../../../src/components/container/container.css';
import '../../../src/components/stack/stack.css';
import '../../../src/components/typography/stories/typography.stories.css';

const sizeLabels = { page: 'Project settings', section: 'Notifications', subheading: 'Email delivery' };

const Sizes: Scenario<HeadingProps> = { render: () => <Stack>{(['page', 'section', 'subheading'] as const).map(size => <Heading key={size} as="h2" size={size} data-testid={`heading-${size}`}>{sizeLabels[size]}</Heading>)}</Stack> };

const ScopedOverrides: Scenario<HeadingProps> = { render: () => <Stack><Text>Only the outer heading changes. The nested explicit theme resets all typography roles.</Text><div style={{ '--fs-typography-heading-font-section': '2.5rem' } as HeadingStyle}><Heading data-testid="outer-heading">Scoped size</Heading><div data-theme="luna" className="theme-panel"><Heading data-testid="reset-heading">Nested theme</Heading></div></div><Heading data-testid="sibling-heading">Unaffected sibling</Heading><Heading as="h3" size="subheading" data-testid="independent-heading">Independent subheading</Heading></Stack> };

const LongContent: Scenario<HeadingProps> = { render: () => <Container size="reading"><Stack data-testid="long-copy"><Heading as="h1" size="page">Project settings for international teams and accessibility preferences</Heading><Text size="lead">Choose which updates arrive in your inbox, including announcements across teams and workspaces.</Text><Heading as="h2">WorkspaceIdentifierWithoutAnyNaturalBreakOpportunities012345678901234567890123456789</Heading><Text>https://example.test/projects/VeryLongProjectIdentifierWithoutBreakOpportunities012345678901234567890123456789</Text><Text lang="ar" dir="rtl">إعدادات المشروع وإشعارات البريد الإلكتروني</Text></Stack></Container> };

const Hidden: Scenario<HeadingProps> = { args: { hidden: true } };

export const component = Heading;
export const defaults: HeadingProps = { children: 'Project settings', as: 'h2', size: 'section' };
export const scenarios = { Sizes, LongContent, ScopedOverrides, Hidden };
