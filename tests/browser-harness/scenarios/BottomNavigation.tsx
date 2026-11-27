import {
  BottomNavigation,
  type BottomNavigationProps,
} from '../../../src/components/bottom-navigation/BottomNavigation';
import {
  BottomNavigationExample,
  ChangingDestination,
  NativeDestinations,
  NavigationOverrides,
  RouterExample,
  ShellExample,
} from '../../../src/components/bottom-navigation/stories/bottom-navigation-examples';
import type { Scenario } from '../gallery/types';
import '../../../src/components/bottom-navigation/bottom-navigation.css';
import '../../../src/components/app-shell/app-shell.css';
import '../../../src/components/app-content/app-content.css';
import '../../../src/components/icon/icon.css';
import '../../../src/components/bottom-navigation/stories/bottom-navigation.stories.css';

const Playground: Scenario<BottomNavigationProps> = { render: () => <NativeDestinations /> };
const Composition: Scenario<BottomNavigationProps> = { render: () => <BottomNavigationExample /> };
const Changes: Scenario<BottomNavigationProps> = { render: () => <ChangingDestination /> };
const LongLabels: Scenario<BottomNavigationProps> = { render: () => <NativeDestinations long /> };
const Overrides: Scenario<BottomNavigationProps> = { render: () => <NavigationOverrides /> };
const Routing: Scenario<BottomNavigationProps> = { render: () => <RouterExample /> };
const Shell: Scenario<BottomNavigationProps> = { render: () => <ShellExample /> };
const SafeArea: Scenario<BottomNavigationProps> = {
  render: () => <ShellExample inset="24px" longLabels />,
};
const Viewport: Scenario<BottomNavigationProps> = {
  render: () => <ShellExample height="viewport" />,
};
export const component = BottomNavigation;
export const defaults: BottomNavigationProps = { 'aria-label': 'Primary', children: null };
export const scenarios = {
  Playground,
  Composition,
  Changes,
  LongLabels,
  Overrides,
  Routing,
  Shell,
  SafeArea,
  Viewport,
};
