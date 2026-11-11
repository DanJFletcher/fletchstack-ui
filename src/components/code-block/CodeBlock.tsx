import { forwardRef, useEffect, useMemo, useRef, useState, type ComponentPropsWithoutRef, type CSSProperties, type ForwardRefExoticComponent, type RefAttributes } from 'react';
import { Button } from '../button/Button.js';
import { highlightCode } from './highlight-code.js';

export type CodeBlockStyle = CSSProperties & { [token: `--fs-${string}`]: string | number | undefined };
export type CodeBlockProps = Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'style' | 'dangerouslySetInnerHTML'> & {
  children: string;
  filename?: string;
  language?: string;
  highlight?: boolean;
  label?: string;
  wrap?: boolean;
  copyable?: boolean;
  style?: CodeBlockStyle;
  dangerouslySetInnerHTML?: never;
};
type CopyStatus = 'idle' | 'pending' | 'success' | 'error';
type CopyState = { code: string; status: CopyStatus };
const copyLabels = { idle: 'Copy', pending: 'Copying…', success: 'Copied', error: 'Try again' };

/**
 * Attempt native clipboard writing only after activation, returning recoverable failure.
 **/
async function writeCode(code: string): Promise<'success' | 'error'> {
  try {
    await navigator.clipboard.writeText(code);
    return 'success';
  } catch {
    return 'error';
  }
}

/**
 * Reset on source changes and ignore stale, overlapping or unmounted copy completions.
 **/
function useCodeCopy(code: string) {
  const [state, setState] = useState<CopyState>({ code, status: 'idle' });
  const request = useRef(0);
  useEffect(() => { request.current += 1; setState({ code, status: 'idle' }); return () => { request.current += 1; }; }, [code]);
  const copy = async () => {
    const operation = ++request.current;
    setState({ code, status: 'pending' });
    const status = await writeCode(code);
    if (operation === request.current) { setState({ code, status }); }
  };

  return { status: state.code === code ? state.status : 'idle', copy };
}

/**
 * Render wrapping metadata and the existing Button without making the header a landmark.
 **/
function CodeBlockHeader({ filename, language, copyable, status, copy }: { filename: CodeBlockProps['filename']; language: CodeBlockProps['language']; copyable: boolean; status: CopyStatus; copy: () => Promise<void> }) {
  return <div className="fs-code-block__header">{filename && <strong className="fs-code-block__filename">{filename}</strong>}{language && <span className="fs-code-block__language">{language}</span>}{copyable && <Button className="fs-code-block__copy" variant="secondary" size="small" data-copy-state={status} aria-busy={status === 'pending'} aria-label={filename ? `${copyLabels[status]} ${filename}` : copyLabels[status]} onClick={copy}>{copyLabels[status]}</Button>}</div>;
}

/**
 * Announce each result through one polite status; expose failure guidance visibly.
 **/
function CopyFeedback({ status }: { status: CopyStatus }) {
  const error = status === 'error';

  return <p role="status" aria-atomic="true" className={['fs-code-block__feedback', error && 'fs-code-block__feedback--error'].filter(Boolean).join(' ')}>{error ? 'Copy failed. Select the code to copy manually.' : status === 'success' && 'Code copied.'}</p>;
}

/**
 * Display literal, selectable source with native scrolling or optional visual wrapping.
 **/
export const CodeBlock: ForwardRefExoticComponent<CodeBlockProps & RefAttributes<HTMLDivElement>> = /* @__PURE__ */ forwardRef<HTMLDivElement, CodeBlockProps>(function CodeBlock(
  { children, filename, language, label, wrap = false, copyable = true, highlight = true, className, ...props }, ref,
) {
  const { status, copy } = useCodeCopy(children);
  const content = useMemo(() => highlightCode(children, language, highlight), [children, language, highlight]);
  const name = label?.trim() || (filename ? `Code in ${filename}` : 'Code sample');

  return <div {...props} ref={ref} className={['fs-code-block', wrap && 'fs-code-block--wrap', className].filter(Boolean).join(' ')}>
    {(filename || language || copyable) && <CodeBlockHeader filename={filename} language={language} copyable={copyable} status={status} copy={copy} />}
    <pre className="fs-code-block__viewport" role="region" aria-label={name} tabIndex={wrap ? undefined : 0}><code>{content}</code></pre>
    {copyable && <CopyFeedback status={status} />}
  </div>;
});
