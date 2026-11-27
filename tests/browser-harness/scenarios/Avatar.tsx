import { Avatar, type AvatarProps } from '../../../src/components/avatar/Avatar';
import {
  AvatarExamples,
  AvatarShapes,
  AvatarSizes,
  AvatarSourceChanges,
} from '../../../src/components/avatar/stories/avatar-examples';
import type { Scenario } from '../gallery/types';
import '../../../src/components/avatar/avatar.css';
import '../../../src/components/avatar/stories/avatar.stories.css';

/**
 * Pin the resource boundary; generic harness args cannot introduce an unowned photo URL.
 **/
function InitialsAvatar(props: AvatarProps) {
  return <Avatar {...props} src="" />;
}

const Playground: Scenario<AvatarProps> = {};
const Photo: Scenario<AvatarProps> = {
  render: (props) => (
    <Avatar
      {...props}
      src={
        new URL('../../../src/components/avatar/stories/portrait.svg?no-inline', import.meta.url)
          .href
      }
    />
  ),
};
const Failed: Scenario<AvatarProps> = {
  render: (props) => <Avatar {...props} src="data:image/png;base64,broken" />,
};
const Sizes: Scenario<AvatarProps> = { render: () => <AvatarSizes /> };
const Shapes: Scenario<AvatarProps> = { render: () => <AvatarShapes /> };
const Composition: Scenario<AvatarProps> = { render: () => <AvatarExamples /> };
const SourceChanges: Scenario<AvatarProps> = { render: () => <AvatarSourceChanges /> };
const Scopes: Scenario<AvatarProps> = {
  render: () => (
    <section
      data-theme="corporate"
      style={
        {
          '--fs-avatar-background': 'rgb(0, 0, 0)',
          '--fs-avatar-text': 'rgb(255, 255, 255)',
        } as import('../../../src/components/avatar/Avatar').AvatarStyle
      }
    >
      <Avatar name="Outer owner" />
      <section data-theme="luna">
        <Avatar name="Nested owner" />
      </section>
    </section>
  ),
};
const Keyboard: Scenario<AvatarProps> = {
  render: () => (
    <div className="actions">
      <button>Before</button>
      <Avatar name="Maya Chen" />
      <button>After</button>
    </div>
  ),
};

export const component = InitialsAvatar;
export const defaults: AvatarProps = { name: 'Maya Chen' };
export const scenarios = {
  Playground,
  Photo,
  Failed,
  Sizes,
  Shapes,
  Composition,
  SourceChanges,
  Scopes,
  Keyboard,
};
