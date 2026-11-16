import { AppContent, type AppContentProps } from '../../../src/components/app-content/AppContent';
import { ShellExample } from '../../../src/components/bottom-navigation/stories/bottom-navigation-examples';
import type { Scenario } from '../gallery/types';
import '../../../src/components/bottom-navigation/bottom-navigation.css';
import '../../../src/components/app-shell/app-shell.css';
import '../../../src/components/app-content/app-content.css';
import '../../../src/components/icon/icon.css';
import '../../../src/components/bottom-navigation/stories/bottom-navigation.stories.css';

const Playground: Scenario<AppContentProps> = { render: () => <ShellExample /> };
export const component = AppContent;
export const defaults: AppContentProps = { children: null };
export const scenarios = { Playground };
