import { forwardRef, type ComponentPropsWithoutRef, type CSSProperties, type ForwardRefExoticComponent, type RefAttributes } from 'react';
import { Avatar, type AvatarSize } from '../avatar/Avatar.js';

export interface AvatarGroupMember { id: string; name: string; src?: string; initials?: string }
export type AvatarGroupStyle = CSSProperties & { [token: `--fs-${string}`]: string | number | undefined };
type OwnedAttribute = 'children' | 'role' | 'aria-label' | 'aria-labelledby' | 'dangerouslySetInnerHTML';
export type AvatarGroupProps = Omit<ComponentPropsWithoutRef<'div'>, 'style' | OwnedAttribute> & { [Attribute in OwnedAttribute]?: never } & {
  label: string;
  members: readonly AvatarGroupMember[];
  maxVisible?: number;
  size?: AvatarSize;
  overflowLabel?: string;
  overflowListLabel?: string;
  style?: AvatarGroupStyle;
};

/**
 * Preserve native container attributes while keeping the group's identity and content owned.
 **/
function groupAttributes(props: ComponentPropsWithoutRef<'div'>) {
  const attributes = { ...props };
  for (const name of ['children', 'role', 'aria-label', 'aria-labelledby', 'dangerouslySetInnerHTML']) { Reflect.deleteProperty(attributes, name); }
  return attributes;
}

/**
 * Keep the member key internal instead of forwarding it as a DOM identity.
 **/
function avatarProps(member: AvatarGroupMember) {
  const props = { ...member };
  Reflect.deleteProperty(props, 'id');
  return props;
}

/**
 * Reveal the ordered hidden members through a native, server-renderable disclosure.
 **/
function OverflowMembers({ members, size, label, listLabel }: { members: readonly AvatarGroupMember[]; size: AvatarSize; label: string; listLabel: string }) {
  return <details className="fs-avatar-group__overflow">
    <summary className="fs-avatar-group__summary" aria-label={label}><span aria-hidden="true">+{members.length}</span></summary>
    <ul className="fs-avatar-group__list" aria-label={listLabel}>{members.map(member => <li key={member.id}>
      <Avatar {...avatarProps(member)} alt="" size={size} /><span>{member.name}</span>
    </li>)}</ul>
  </details>;
}

/**
 * Present an ordered team of shared Avatars with a compact, accessible overflow disclosure.
 **/
export const AvatarGroup: ForwardRefExoticComponent<AvatarGroupProps & RefAttributes<HTMLDivElement>> = /* @__PURE__ */ forwardRef<HTMLDivElement, AvatarGroupProps>(function AvatarGroup(
  { label, members, maxVisible = 3, size = 'medium', overflowLabel, overflowListLabel = 'Additional team members', className, ...props }, ref,
) {
  const limit = Number.isFinite(maxVisible) ? Math.max(0, Math.floor(maxVisible)) : 3;
  const visible = members.slice(0, limit);
  const remaining = members.slice(limit);
  const disclosureLabel = overflowLabel ?? `Show ${remaining.length} more ${remaining.length === 1 ? 'member' : 'members'}`;

  return <div {...groupAttributes(props)} ref={ref} className={['fs-avatar-group', `fs-avatar-group--${size}`, className].filter(Boolean).join(' ')} role="group" aria-label={label}>
    <div className="fs-avatar-group__stack">{visible.map(member => <span className="fs-avatar-group__member" key={member.id}>
      <Avatar {...avatarProps(member)} size={size} />
    </span>)}{remaining.length > 0 && <OverflowMembers members={remaining} size={size} label={disclosureLabel} listLabel={overflowListLabel} />}</div>
  </div>;
});
