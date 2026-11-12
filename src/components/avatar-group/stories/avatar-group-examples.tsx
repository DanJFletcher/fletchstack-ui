import { AvatarGroup, type AvatarGroupMember } from '../AvatarGroup';

export const teamMembers: readonly AvatarGroupMember[] = [
  { id: 'maya', name: 'Maya Chen', src: new URL('../../avatar/stories/portrait.svg', import.meta.url).href },
  { id: 'theo', name: 'Theo Park' }, { id: 'nia', name: 'Nia Woods' },
  { id: 'ari', name: 'Ari Morgan' }, { id: 'jo', name: 'Jo Rivera' }, { id: 'sam', name: 'Sam Lee' },
];

/**
 * Present the compact team stack in both themes and its count-only/small-group boundaries.
 **/
export function AvatarGroupExample() {
  return <div className="avatar-group-demo"><p className="avatar-group-demo__eyebrow">fletchstack-ui / Identity</p><h1>AvatarGroup</h1>
    <div className="avatar-group-demo__themes">{(['corporate', 'luna'] as const).map(theme => <section key={theme} data-theme={theme} className="avatar-group-demo__panel">
      <p>{theme === 'corporate' ? 'Corporate' : 'Luna'}</p><h2>Project team</h2><AvatarGroup label={`${theme} project team`} members={teamMembers} size="xlarge" />
    </section>)}</div>
    <div className="avatar-group-demo__comparisons"><section><h2>Overflow disclosure</h2><p>Open +3 to reveal the remaining names.</p><AvatarGroup label="Expandable project team" members={teamMembers} size="large" /></section>
      <section><h2>Small group</h2><AvatarGroup label="Small project team" members={teamMembers.slice(0, 2)} size="large" /></section>
      <section><h2>Count only</h2><AvatarGroup label="All project members" members={teamMembers} maxVisible={0} size="large" /></section></div>
    <p className="avatar-group-demo__note">32 px default / 8 px overlap / 2 px separating ring</p>
  </div>;
}

/**
 * Compare all existing Avatar footprints without changing group ownership or ordering.
 **/
export function AvatarGroupSizes() {
  return <div className="stack">{(['small', 'medium', 'large', 'xlarge'] as const).map(size => <section key={size}><h2>{size}</h2><AvatarGroup label={`${size} team`} members={teamMembers} size={size} /></section>)}</div>;
}
