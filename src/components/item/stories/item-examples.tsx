import { useState } from 'react';
import { Item } from '../Item';
import {
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from '../ItemParts';
import { Button } from '../../button/Button';
import { Avatar } from '../../avatar/Avatar';
import { InboxIcon } from '../../icon/named/InboxIcon';

/**
 * Present a reusable row with optional actions while leaving behavior to native controls.
 **/
export function ItemExample() {
  const [reviewed, setReviewed] = useState(false);

  return (
    <Item variant="outline">
      <ItemMedia variant="icon">
        <InboxIcon />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Workspace invitation</ItemTitle>
        <ItemDescription>Maya invited you to collaborate on Atlas.</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button onClick={() => setReviewed(true)}>Review invitation</Button>
      </ItemActions>
      <ItemFooter>
        <span role="status">{reviewed ? 'Invitation reviewed' : 'Waiting for your review'}</span>
      </ItemFooter>
    </Item>
  );
}

/**
 * Render identical content under sibling themes to demonstrate inherited semantic tokens.
 **/
export function ItemComposition() {
  return (
    <div className="stack">
      {(['corporate', 'luna'] as const).map((theme) => (
        <section data-theme={theme} className="theme-panel stack" key={theme}>
          <h2>{theme === 'corporate' ? 'Corporate' : 'Luna'}</h2>
          <ItemExample />
        </section>
      ))}
    </div>
  );
}

/**
 * Compare independent appearances and density choices without adding interaction state.
 **/
export function ItemVariants() {
  return (
    <ItemGroup>
      {(['default', 'outline', 'muted'] as const).map((variant) => (
        <Item key={variant} variant={variant}>
          <ItemContent>
            <ItemTitle>{variant}</ItemTitle>
            <ItemDescription>A compact content row.</ItemDescription>
          </ItemContent>
        </Item>
      ))}
    </ItemGroup>
  );
}

/**
 * Exercise supported compact row padding with the same content.
 **/
export function ItemSizes() {
  return (
    <ItemGroup>
      {(['default', 'sm', 'xs'] as const).map((size) => (
        <Item variant="outline" size={size} key={size}>
          <ItemContent>
            <ItemTitle>{size}</ItemTitle>
            <ItemDescription>Content remains readable at every density.</ItemDescription>
          </ItemContent>
        </Item>
      ))}
    </ItemGroup>
  );
}

/**
 * Compose avatars, caller-owned images and full-width header/footer slots in a related group.
 **/
export function ItemMediaExamples() {
  return (
    <ItemGroup>
      <Item variant="outline">
        <ItemHeader>
          <strong>Team member</strong>
          <span>Online</span>
        </ItemHeader>
        <ItemMedia variant="avatar">
          <Avatar name="Maya Chen" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Maya Chen</ItemTitle>
          <ItemDescription>Product designer</ItemDescription>
        </ItemContent>
        <ItemFooter>Workspace owner</ItemFooter>
      </Item>
      <ItemSeparator />
      <Item>
        <ItemMedia variant="image">
          <img
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%236b7280'/%3E%3C/svg%3E"
            alt="Gray project cover"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Design resources</ItemTitle>
          <ItemDescription>Shared files for the team.</ItemDescription>
        </ItemContent>
      </Item>
    </ItemGroup>
  );
}

/**
 * Keep whole-row destinations native and independent of application routing.
 **/
export function ItemLinkExample() {
  return (
    <div className="stack">
      <a href="#before">Before</a>
      <Item as="a" href="#guide" variant="outline">
        <ItemContent>
          <ItemTitle>Read the guide</ItemTitle>
          <ItemDescription>Learn how to build your workspace.</ItemDescription>
        </ItemContent>
      </Item>
      <a href="#after">After</a>
    </div>
  );
}

/**
 * Show wrapping content and action labels without fixed heights or truncation.
 **/
export function ItemLongExample() {
  return (
    <Item variant="muted">
      <ItemContent>
        <ItemTitle>A very long resource title that remains completely visible</ItemTitle>
        <ItemDescription>
          LongUnbrokenLocalizedResourceDescriptionWithoutWhitespaceThatMustWrapOnNarrowScreens
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button>Review all pending workspace invitations</Button>
      </ItemActions>
    </Item>
  );
}

/**
 * Scope padding and border overrides to a single instance.
 **/
export function ItemOverrides() {
  return (
    <ItemGroup>
      <Item variant="outline" style={{ '--fs-item-padding': '32px', '--fs-item-radius': '0px' }}>
        Custom row
      </Item>
      <Item variant="outline">Default row</Item>
    </ItemGroup>
  );
}
