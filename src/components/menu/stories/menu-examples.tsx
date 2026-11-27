import { useState } from 'react';
import { Menu } from '../Menu';
import type { MenuItem, MenuProps } from '../types';
import { PlusIcon } from '../../icon/named/PlusIcon';

/**
 * Keep project-specific actions in the consumer and share configuration across themes and layouts.
 **/
export function projectMenuItems(select: (label: string) => void): MenuItem[] {
  return [
    { type: 'item', id: 'rename', label: 'Rename', onSelect: () => select('Rename') },
    {
      type: 'submenu',
      id: 'export',
      label: 'Export',
      items: [
        { type: 'item', id: 'pdf', label: 'Download PDF', onSelect: () => select('Download PDF') },
        { type: 'item', id: 'csv', label: 'Download CSV', onSelect: () => select('Download CSV') },
      ],
    },
    { type: 'item', id: 'archive', label: 'Archive', onSelect: () => select('Archive') },
  ];
}

/**
 * Show selected actions as caller-owned feedback and provide a following Tab destination.
 **/
export function ProjectMenu({
  defaultOpen = false,
  closeOnSelect = true,
}: Pick<MenuProps, 'defaultOpen' | 'closeOnSelect'>) {
  const [selected, setSelected] = useState('No action selected.');
  const [count, setCount] = useState(0);
  const select = (label: string) => {
    setSelected(label);
    setCount(count + 1);
  };

  return (
    <div className="menu-demo__project">
      <Menu
        triggerLabel="Project actions"
        menuLabel="Project actions"
        items={projectMenuItems(select)}
        defaultOpen={defaultOpen}
        closeOnSelect={closeOnSelect}
      />
      <output aria-label="Selected action">
        {selected} ({count})
      </output>
      <button type="button">Next control</button>
    </div>
  );
}

/**
 * Exercise sibling switching at two levels, decorative icons, disabled items and native links.
 **/
export function AdvancedMenu() {
  const [selected, setSelected] = useState('No action selected.');
  const items: MenuItem[] = [
    ...projectMenuItems(setSelected),
    { type: 'divider', id: 'divider' },
    {
      type: 'submenu',
      id: 'share',
      label: 'Share',
      icon: <PlusIcon />,
      items: [
        {
          type: 'submenu',
          id: 'team',
          label: 'Team',
          items: [
            {
              type: 'item',
              id: 'copy',
              label: 'Copy team link',
              onSelect: () => setSelected('Team link copied.'),
            },
          ],
        },
        {
          type: 'submenu',
          id: 'public',
          label: 'Public',
          items: [
            {
              type: 'item',
              id: 'copy',
              label: 'Copy public link',
              onSelect: () => setSelected('Public link copied.'),
            },
          ],
        },
      ],
    },
    {
      type: 'item',
      id: 'disabled',
      label: 'Delete project',
      disabled: true,
      onSelect: () => setSelected('Unexpected deletion'),
    },
    { type: 'item', id: 'guide', label: 'Publishing guide', href: '#publishing-guide' },
  ];

  return (
    <>
      <Menu triggerLabel="More actions" menuLabel="More project actions" items={items} />
      <output aria-label="Advanced selection">{selected}</output>
      <a id="publishing-guide" href="#publishing-guide">
        Guide destination
      </a>
      <button type="button">Next control</button>
    </>
  );
}

/**
 * Demonstrate parent-controlled expansion and item-specific dismissal cancellation.
 **/
export function ControlledMenu() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(false);
  const items: MenuItem[] = [
    {
      type: 'item',
      id: 'save',
      label: 'Save draft',
      onSelect: (event) => {
        event.preventDefault();
        setSelected(true);
      },
    },
  ];

  return (
    <>
      <button type="button" onClick={() => setOpen(!open)}>
        Toggle externally
      </button>
      <Menu
        triggerLabel="Controlled actions"
        menuLabel="Draft actions"
        items={items}
        open={open}
        onOpenChange={setOpen}
      />
      <output aria-label="Draft saved">{selected ? 'Draft saved.' : 'Draft not saved.'}</output>
      <button type="button">Next control</button>
    </>
  );
}

/**
 * Use identical project menus and inherited theme colors in the design composition.
 **/
export function MenuExample() {
  return (
    <main className="menu-demo">
      <p>fletchstack-ui / Navigation</p>
      <h1>Menu</h1>
      <div className="menu-demo__themes">
        {(['corporate', 'luna'] as const).map((theme) => (
          <section
            key={theme}
            data-theme={theme}
            aria-label={theme === 'corporate' ? 'Corporate' : 'Luna'}
            className="menu-demo__theme"
          >
            <h2>{theme === 'corporate' ? 'Corporate' : 'Luna'}</h2>
            <ProjectMenu defaultOpen />
          </section>
        ))}
      </div>
      <section>
        <h2>Keyboard</h2>
        <p>
          ↑ / ↓ Move within a level · → Open submenu · ← / Escape Return to parent · Escape at root
          Close menu
        </p>
      </section>
    </main>
  );
}
