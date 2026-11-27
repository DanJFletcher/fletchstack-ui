// @vitest-environment jsdom
import '../../../../tests/support/dom';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it, vi } from 'vitest';
import { createRef } from 'react';
import { CodeBlock, type CodeBlockStyle } from '../CodeBlock';

afterEach(() => vi.restoreAllMocks());

it('copies original whitespace and markup literally without moving focus', async () => {
  // arrange
  const user = userEvent.setup();
  const write = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);
  const given = '\n\t<div>literal & code</div>\n';
  render(<CodeBlock>{given}</CodeBlock>);

  // act
  await user.click(screen.getByRole('button', { name: 'Copy' }));

  // assert
  expect(write).toHaveBeenCalledExactlyOnceWith('\n\t<div>literal & code</div>\n');
  expect(await screen.findByRole('button', { name: 'Copied' })).toHaveFocus();
  expect(screen.getByRole('status')).toHaveTextContent('Code copied.');
});

it('renders escaped source literally inside a named keyboard-scrollable region', () => {
  // arrange
  const given = '\n<script>alert("sample")</script>\n\t  literal';

  // act
  render(
    <CodeBlock filename="settings.ts" language="TypeScript">
      {given}
    </CodeBlock>,
  );

  // assert
  const region = screen.getByRole('region', { name: 'Code in settings.ts' });
  expect(region.querySelector('code')?.textContent).toBe(
    '\n<script>alert("sample")</script>\n\t  literal',
  );
  expect(region.querySelector('script')).toBeNull();
  expect(region).toHaveAttribute('tabindex', '0');
  expect(screen.getByText('TypeScript')).toBeVisible();
});

it('supports visual wrapping without adding a code viewport keyboard stop', () => {
  // arrange
  const given = (
    <CodeBlock wrap label="Install command">
      npm install fletchstack-ui
    </CodeBlock>
  );

  // act
  render(given);

  // assert
  expect(screen.getByRole('region', { name: 'Install command' })).not.toHaveAttribute('tabindex');
  expect(screen.getByRole('region').parentElement).toHaveClass('fs-code-block--wrap');
});

it('omits copy controls and empty metadata for read-only code', () => {
  // arrange
  const given = <CodeBlock copyable={false}>{''}</CodeBlock>;

  // act
  render(given);

  // assert
  expect(screen.getByRole('region', { name: 'Code sample' }).textContent).toBe('');
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
  expect(screen.getByRole('region').parentElement?.children).toHaveLength(1);
});

it('keeps filename and language metadata when copying is omitted', () => {
  // arrange
  const given = (
    <CodeBlock filename="settings.ts" language="TypeScript" copyable={false}>
      const ready = true;
    </CodeBlock>
  );

  // act
  render(given);

  // assert
  expect(screen.getByText('settings.ts')).toBeVisible();
  expect(screen.getByText('TypeScript')).toBeVisible();
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
});

it('forwards native wrapper refs, attributes, className and typed token overrides', () => {
  // arrange
  const ref = createRef<HTMLDivElement>();
  const style: CodeBlockStyle = { '--fs-code-block-inset': '24px' };
  const given = (
    <CodeBlock
      ref={ref}
      id="example"
      title="Example"
      className="consumer"
      dir="rtl"
      style={style}
      label="  "
    >
      source
    </CodeBlock>
  );

  // act
  render(given);

  // assert
  expect(ref.current).toBe(screen.getByRole('region').parentElement);
  expect(ref.current).toHaveAttribute('id', 'example');
  expect(ref.current).toHaveAttribute('dir', 'rtl');
  expect(ref.current).toHaveAttribute('title', 'Example');
  expect(ref.current).toHaveClass('consumer');
  expect(ref.current?.style.getPropertyValue('--fs-code-block-inset')).toBe('24px');
  expect(screen.getByRole('region')).toHaveAccessibleName('Code sample');
});

it('shows one polite failure message while preserving focus for retry', async () => {
  // arrange
  const user = userEvent.setup();
  vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('Permission denied'));
  render(<CodeBlock filename="settings.ts">source</CodeBlock>);

  // act
  await user.click(screen.getByRole('button', { name: 'Copy settings.ts' }));

  // assert
  expect(await screen.findByRole('button', { name: 'Try again settings.ts' })).toHaveFocus();
  expect(screen.getAllByRole('status')).toHaveLength(1);
  expect(screen.getByRole('status')).toHaveTextContent(
    'Copy failed. Select the code to copy manually.',
  );
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});

it('recovers on retry without changing copied source', async () => {
  // arrange
  const user = userEvent.setup();
  const write = vi
    .spyOn(navigator.clipboard, 'writeText')
    .mockRejectedValueOnce(new Error('Denied'))
    .mockResolvedValue(undefined);
  render(<CodeBlock wrap>{'\tline one\nline two'}</CodeBlock>);
  await user.click(screen.getByRole('button', { name: 'Copy' }));

  // act
  await user.click(screen.getByRole('button', { name: 'Try again' }));

  // assert
  expect(write).toHaveBeenLastCalledWith('\tline one\nline two');
  expect(await screen.findByRole('button', { name: 'Copied' })).toHaveFocus();
  expect(screen.getByRole('status')).toHaveTextContent('Code copied.');
});

it('offers manual copy when the clipboard API is unavailable', async () => {
  // arrange
  const user = userEvent.setup();
  const original = Object.getOwnPropertyDescriptor(navigator, 'clipboard')!;
  Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true });
  render(<CodeBlock>source</CodeBlock>);

  // act
  await user.click(screen.getByRole('button', { name: 'Copy' }));
  Object.defineProperty(navigator, 'clipboard', original);

  // assert
  expect(await screen.findByRole('button', { name: 'Try again' })).toBeVisible();
  expect(screen.getByRole('status')).toHaveTextContent('Select the code to copy manually.');
});

it('shows pending state without disabling or blurring the copy button', async () => {
  // arrange
  const user = userEvent.setup();
  let finish!: () => void;
  vi.spyOn(navigator.clipboard, 'writeText').mockImplementation(
    () =>
      new Promise<void>((resolve) => {
        finish = resolve;
      }),
  );
  render(<CodeBlock>source</CodeBlock>);

  // act
  await user.click(screen.getByRole('button', { name: 'Copy' }));

  // assert
  const button = screen.getByRole('button', { name: 'Copying…' });
  expect(button).toHaveFocus();
  expect(button).toBeEnabled();
  expect(button).toHaveAttribute('aria-busy', 'true');
  expect(screen.getByRole('status')).toBeEmptyDOMElement();
  await act(async () => finish());
});

it('ignores pending results for changed source and copies the updated source', async () => {
  // arrange
  const user = userEvent.setup();
  let finish!: () => void;
  const write = vi
    .spyOn(navigator.clipboard, 'writeText')
    .mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          finish = resolve;
        }),
    )
    .mockResolvedValue(undefined);
  const { rerender } = render(<CodeBlock>old</CodeBlock>);
  await user.click(screen.getByRole('button', { name: 'Copy' }));
  rerender(<CodeBlock>new</CodeBlock>);
  await act(async () => finish());

  // act
  await user.click(screen.getByRole('button', { name: 'Copy' }));

  // assert
  expect(write).toHaveBeenLastCalledWith('new');
  expect(await screen.findByRole('button', { name: 'Copied' })).toBeVisible();
});

it('ignores an older completion after a newer attempt fails', async () => {
  // arrange
  const user = userEvent.setup();
  let finish!: () => void;
  vi.spyOn(navigator.clipboard, 'writeText')
    .mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          finish = resolve;
        }),
    )
    .mockRejectedValueOnce(new Error('Denied'));
  render(<CodeBlock>source</CodeBlock>);
  await user.click(screen.getByRole('button', { name: 'Copy' }));
  await user.click(screen.getByRole('button', { name: 'Copying…' }));

  // act
  await act(async () => finish());

  // assert
  expect(screen.getByRole('button', { name: 'Try again' })).toBeVisible();
  expect(screen.getByRole('status')).toHaveTextContent('Copy failed.');
});

it('ignores clipboard completion after unmount', async () => {
  // arrange
  const user = userEvent.setup();
  let finish!: () => void;
  vi.spyOn(navigator.clipboard, 'writeText').mockImplementation(
    () =>
      new Promise<void>((resolve) => {
        finish = resolve;
      }),
  );
  const { unmount } = render(<CodeBlock>source</CodeBlock>);
  await user.click(screen.getByRole('button', { name: 'Copy' }));
  unmount();

  // act
  await act(async () => finish());

  // assert
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
});

it('keeps a language-only header for read-only source', () => {
  // arrange
  const given = (
    <CodeBlock language="Shell" copyable={false}>
      npm run build
    </CodeBlock>
  );

  // act
  render(given);

  // assert
  expect(screen.getByText('Shell')).toBeVisible();
  expect(screen.getByRole('region', { name: 'Code sample' })).toHaveTextContent('npm run build');
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
});

it('highlights a recognized language while preserving the exact source', () => {
  // arrange
  const given = '\n\tconst ready = true;\n';

  // act
  render(<CodeBlock language="TypeScript">{given}</CodeBlock>);

  // assert
  const code = screen.getByRole('region').querySelector('code')!;
  expect(code.querySelector('.token.keyword')).toHaveTextContent('const');
  expect(code.textContent).toBe('\n\tconst ready = true;\n');
});

it.each([
  { language: undefined, highlight: true },
  { language: 'Unsupported language', highlight: true },
  { language: 'typescript', highlight: false },
  { language: '   ', highlight: true },
])('keeps source plain for $language with highlight=$highlight', ({ language, highlight }) => {
  // arrange
  const given = 'const ready = true;';

  // act
  render(
    <CodeBlock {...(language === undefined ? {} : { language })} highlight={highlight}>
      {given}
    </CodeBlock>,
  );

  // assert
  const code = screen.getByRole('region').querySelector('code')!;
  expect(code.childNodes).toHaveLength(1);
  expect(code.textContent).toBe('const ready = true;');
});

it.each([
  {
    language: '  TypeScript  ',
    source: 'const ready: boolean = true;',
    token: 'keyword',
    text: 'const',
  },
  { language: 'js', source: 'const ready = true;', token: 'keyword', text: 'const' },
  { language: 'tsx', source: 'const view = <Button />;', token: 'tag', text: '<Button />' },
  { language: 'jsx', source: 'const view = <Button />;', token: 'tag', text: '<Button />' },
  { language: 'JSON', source: '{"ready": true}', token: 'property', text: '"ready"' },
  {
    language: 'HTML',
    source: '<div title="sample">&amp;</div>',
    token: 'tag',
    text: '<div title="sample">',
  },
  { language: 'CSS', source: '.sample { color: red; }', token: 'selector', text: '.sample' },
  { language: 'Shell', source: 'echo "sample"', token: 'string', text: '"sample"' },
  { language: 'md', source: '# Sample', token: 'title', text: '# Sample' },
  { language: 'yml', source: 'ready: true', token: 'boolean', text: 'true' },
])('highlights $language source without changing its text', ({ language, source, token, text }) => {
  // act
  render(<CodeBlock language={language}>{source}</CodeBlock>);

  // assert
  const code = screen.getByRole('region').querySelector('code')!;
  expect(code.querySelector(`.token.${token}`)).toHaveTextContent(text);
  expect(code.textContent).toBe(source);
  expect(code.querySelector('button, div, script')).toBeNull();
});

it('copies the original highlighted source rather than token markup', async () => {
  // arrange
  const user = userEvent.setup();
  const write = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);
  render(<CodeBlock language="html">{'\n\t<script>literal & text</script>\n'}</CodeBlock>);

  // act
  await user.click(screen.getByRole('button', { name: 'Copy' }));

  // assert
  expect(write).toHaveBeenCalledExactlyOnceWith('\n\t<script>literal & text</script>\n');
  expect(screen.getByRole('button', { name: 'Copied' })).toHaveFocus();
});

it('updates highlighting when source or language changes', () => {
  // arrange
  const { rerender } = render(<CodeBlock language="js">const ready = true;</CodeBlock>);

  // act
  rerender(<CodeBlock language="json">{'{"count": 12}'}</CodeBlock>);

  // assert
  expect(screen.getByRole('region').querySelector('.token.number')).toHaveTextContent('12');
  expect(screen.getByRole('region').textContent).toBe('{"count": 12}');
});
