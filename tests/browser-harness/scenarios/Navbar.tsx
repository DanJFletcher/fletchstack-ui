import { Navbar, type NavbarProps } from '../../../src/components/navbar/index';
import {
  NavbarAllVisible,
  NavbarControlled,
  NavbarDeferred,
  NavbarExample,
  NavbarIdentity,
  NavbarResources,
  ProjectNavbar,
} from '../../../src/components/navbar/stories/navbar-examples';
import type { Scenario } from '../gallery/types';
import '../../../src/components/navbar/navbar.css';
import '../../../src/components/button/button.css';
import '../../../src/components/field/field.css';
import '../../../src/components/switch/switch.css';
import '../../../src/components/typography/typography.css';
import '../../../src/components/navbar/stories/navbar.stories.css';

const Playground: Scenario<NavbarProps> = { render: () => <ProjectNavbar /> };
const Composition: Scenario<NavbarProps> = { render: () => <NavbarExample /> };
const Identity: Scenario<NavbarProps> = { render: () => <NavbarIdentity /> };
const AllVisible: Scenario<NavbarProps> = { render: () => <NavbarAllVisible /> };
const Controlled: Scenario<NavbarProps> = { render: () => <NavbarControlled /> };
const Deferred: Scenario<NavbarProps> = { render: () => <NavbarDeferred /> };
const Resources: Scenario<NavbarProps> = { render: () => <NavbarResources /> };
const Overrides: Scenario<NavbarProps> = {
  render: () => (
    <>
      <ProjectNavbar
        aria-label="Custom"
        style={{ '--fs-navbar-radius': '24px', '--fs-navbar-collapse-width': '1000px' }}
      />
      <ProjectNavbar aria-label="Neighbor" />
    </>
  ),
};
export const component = Navbar;
export const defaults: NavbarProps = { children: null };
export const scenarios = {
  Playground,
  Composition,
  Identity,
  AllVisible,
  Controlled,
  Deferred,
  Resources,
  Overrides,
};
