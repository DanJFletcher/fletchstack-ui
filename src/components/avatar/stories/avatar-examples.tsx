import { useState } from 'react';
import { Avatar } from '../Avatar';

/**
 * Compare the reference's identity cards and its image, size and shape choices.
 **/
export function AvatarExamples() {
  return <div className="avatar-demo"><p className="avatar-demo__eyebrow">fletchstack-ui / Identity</p><h1>Avatar</h1>
    <div className="avatar-demo__profiles">{(['corporate', 'luna'] as const).map(theme => <section key={theme} data-theme={theme} className="avatar-demo__profile">
      <Avatar name="Maya Chen" alt="" size="xlarge" src={new URL('./portrait.svg', import.meta.url).href} />
      <div><h2>Maya Chen</h2><p>Product designer</p></div>
    </section>)}</div>
    <div className="avatar-demo__comparisons"><section><h2>Image fallback</h2><div className="avatar-demo__items">
      <figure><Avatar name="Maya Chen" size="xlarge" src={new URL('./portrait.svg', import.meta.url).href} /><figcaption>Image</figcaption></figure>
      <figure><Avatar name="Maya Chen" size="xlarge" /><figcaption>Generated initials</figcaption></figure>
      <figure><Avatar name="Maya Chen" initials="M" size="xlarge" /><figcaption>Custom initials</figcaption></figure>
    </div></section><section><h2>Sizes</h2><AvatarSizes /></section><section><h2>Shapes</h2><AvatarShapes /></section></div>
    <p className="avatar-demo__note">A missing or failed photo keeps the same footprint.</p>
  </div>;
}

/**
 * Present the four approved footprints with visible size labels.
 **/
export function AvatarSizes() {
  return <div className="avatar-demo__items">{([{ size: 'small', label: 'sm · 24 px' }, { size: 'medium', label: 'md · 32 px' }, { size: 'large', label: 'lg · 48 px' }, { size: 'xlarge', label: 'xl · 64 px' }] as const).map(({ size, label }) => <figure key={size}><Avatar name="Maya Chen" size={size} /><figcaption>{label}</figcaption></figure>)}</div>;
}

/**
 * Compare shapes at a shared footprint without making them selectable controls.
 **/
export function AvatarShapes() {
  return <div className="avatar-demo__items">{(['circle', 'rounded', 'square'] as const).map(shape => <figure key={shape}><Avatar name="Maya Chen" size="large" shape={shape} /><figcaption>{shape}</figcaption></figure>)}</div>;
}

/**
 * Let a consumer replace a failed URL and then return to the original source.
 **/
export function AvatarSourceChanges() {
  const [photo, setPhoto] = useState(false);
  return <div className="stack"><h1>Replace a failed photo</h1>
    {photo ? <Avatar name="Maya Chen" size="xlarge" src={new URL('./portrait.svg', import.meta.url).href} /> : <Avatar name="Maya Chen" size="xlarge" src="data:image/png;base64,broken" />}
    <button type="button" onClick={() => setPhoto(value => !value)}>{photo ? 'Use failed photo' : 'Use available photo'}</button>
  </div>;
}
