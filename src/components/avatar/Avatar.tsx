import { forwardRef, useCallback, useState, type ComponentPropsWithoutRef, type CSSProperties, type ForwardRefExoticComponent, type ReactNode, type RefAttributes } from 'react';

export type AvatarSize = 'small' | 'medium' | 'large' | 'xlarge';
export type AvatarShape = 'circle' | 'rounded' | 'square';
export type AvatarStyle = CSSProperties & { [token: `--fs-${string}`]: string | number | undefined };
const ownedAttributes = ['children', 'role', 'tabIndex', 'contentEditable', 'aria-live', 'aria-atomic', 'aria-hidden', 'aria-label', 'aria-labelledby', 'dangerouslySetInnerHTML'] as const;
type OwnedAttribute = typeof ownedAttributes[number] | Extract<keyof ComponentPropsWithoutRef<'span'>, `on${string}`>;
export type AvatarProps = Omit<ComponentPropsWithoutRef<'span'>, 'style' | OwnedAttribute> & { [Attribute in OwnedAttribute]?: never } & {
  name?: string;
  src?: string;
  alt?: string;
  initials?: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  style?: AvatarStyle;
};

/**
 * Keep identity artwork passive and preserve its owned semantics for untyped callers.
 **/
function avatarAttributes(props: ComponentPropsWithoutRef<'span'>) {
  const attributes = { ...props };
  for (const name of Object.keys(attributes)) {
    if ((ownedAttributes as readonly string[]).includes(name) || /^on[A-Z]/.test(name)) { Reflect.deleteProperty(attributes, name); }
  }
  return attributes;
}

/**
 * Use a bounded custom monogram or the first and last name initials; unknown names use ?.
 **/
function monogram(name: string, initials: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const ends = words.length > 1 ? [words[0]!, words.at(-1)!] : words;
  const generated = ends.map(word => Array.from(word)[0]).join('');

  return Array.from((initials.trim() || generated || '?').toUpperCase()).slice(0, 2).join('');
}

/**
 * Retain fallback until an image loads, including completion before hydration; keyed by src.
 **/
function AvatarPhoto({ src, fallback }: { src: string; fallback: ReactNode }) {
  const [status, setStatus] = useState('loading');
  const inspect = useCallback((image: HTMLImageElement | null) => {
    if (image?.complete) { setStatus(image.naturalWidth > 0 ? 'loaded' : 'failed'); }
  }, []);

  return <>{status !== 'loaded' && fallback}{status !== 'failed' && <img ref={inspect} src={src} alt="" aria-hidden="true" draggable={false}
    className={`fs-avatar__photo fs-avatar__photo--${status}`} onLoad={() => setStatus('loaded')} onError={() => setStatus('failed')} />}</>;
}

/**
 * Present a named or decorative identity image with a stable initials fallback.
 **/
export const Avatar: ForwardRefExoticComponent<AvatarProps & RefAttributes<HTMLSpanElement>> = /* @__PURE__ */ forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { name = '', initials = '', src, alt, size = 'medium', shape = 'circle', className, ...props }, ref,
) {
  const label = (alt ?? name).trim();
  const fallback = <span className="fs-avatar__initials" aria-hidden="true">{monogram(name, initials)}</span>;

  return <span {...avatarAttributes(props)} ref={ref} className={['fs-avatar', `fs-avatar--${size}`, `fs-avatar--${shape}`, className].filter(Boolean).join(' ')}
    role={label ? 'img' : undefined} aria-label={label || undefined} aria-hidden={label ? undefined : true}>
    {src?.trim() ? <AvatarPhoto key={src} src={src} fallback={fallback} /> : fallback}
  </span>;
});
