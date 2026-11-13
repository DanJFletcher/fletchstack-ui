import { Menu, type MenuProps } from '../../../src/components/menu/Menu';
import { AdvancedMenu, ControlledMenu, MenuExample, ProjectMenu, projectMenuItems } from '../../../src/components/menu/stories/menu-examples';
import type { Scenario } from '../gallery/types';
import '../../../src/components/menu/menu.css';
import '../../../src/components/menu/stories/menu.stories.css';
import '../../../src/components/button/button.css';
import '../../../src/components/icon/icon.css';

const Playground: Scenario<MenuProps> = {};
const Composition: Scenario<MenuProps> = { render: () => <MenuExample /> };
const Project: Scenario<MenuProps> = { render: () => <ProjectMenu /> };
const Advanced: Scenario<MenuProps> = { render: () => <AdvancedMenu /> };
const Controlled: Scenario<MenuProps> = { render: () => <ControlledMenu /> };
const KeepOpen: Scenario<MenuProps> = { render: () => <ProjectMenu closeOnSelect={false} /> };
const Empty: Scenario<MenuProps> = { args: { items: [] } };
export const component = Menu;
export const defaults: MenuProps = { triggerLabel: 'Project actions', menuLabel: 'Project actions', items: projectMenuItems(() => {}) };
export const scenarios = { Playground, Composition, Project, Advanced, Controlled, KeepOpen, Empty };
