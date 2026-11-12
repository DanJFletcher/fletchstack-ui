import { AvatarGroup, type AvatarGroupProps } from '../../../src/components/avatar-group/AvatarGroup';
import { AvatarGroupExample, AvatarGroupSizes, teamMembers } from '../../../src/components/avatar-group/stories/avatar-group-examples';
import type { Scenario } from '../gallery/types';
import '../../../src/components/avatar/avatar.css';
import '../../../src/components/avatar-group/avatar-group.css';
import '../../../src/components/avatar-group/stories/avatar-group.stories.css';

const Playground: Scenario<AvatarGroupProps> = {};
const Composition: Scenario<AvatarGroupProps> = { render: () => <AvatarGroupExample /> };
const Sizes: Scenario<AvatarGroupProps> = { render: () => <AvatarGroupSizes /> };
const Small: Scenario<AvatarGroupProps> = { args: { members: teamMembers.slice(0, 2) } };
const FailedPhoto: Scenario<AvatarGroupProps> = { args: { members: [{ id: 'failed', name: 'Unavailable Photo', src: 'data:image/png;base64,broken' }, ...teamMembers.slice(1)] } };
const LongNames: Scenario<AvatarGroupProps> = { args: { maxVisible: 0, members: [{ id: 'long', name: 'AlexandriaVeryLongUnbrokenFamilyNameForReflowVerification' }] } };
const Scopes: Scenario<AvatarGroupProps> = { render: () => <section data-theme="corporate" style={{ '--fs-avatar-group-overflow-background': 'rgb(0, 0, 0)', '--fs-avatar-group-overflow-text': 'rgb(255, 255, 255)' } as import('../../../src/components/avatar-group/AvatarGroup').AvatarGroupStyle}><AvatarGroup label="Outer team" members={teamMembers} /><section data-theme="luna"><AvatarGroup label="Nested team" members={teamMembers} /></section></section> };
export const component = AvatarGroup;
export const defaults: AvatarGroupProps = { label: 'Project team', members: teamMembers };
export const scenarios = { Playground, Composition, Sizes, Small, FailedPhoto, LongNames, Scopes };
