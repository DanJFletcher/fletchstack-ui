// @vitest-environment jsdom
import '../../../support/dom';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it, vi } from 'vitest';
import { CodeBlock } from '../../../../src/components/code-block/CodeBlock';

afterEach(() => vi.restoreAllMocks());

it('composes native copy feedback with filename labels and recovers after failure', async () => {
  const user = userEvent.setup();
  const write = vi
    .spyOn(navigator.clipboard, 'writeText')
    .mockRejectedValueOnce(new Error('Denied'))
    .mockResolvedValue(undefined);
  render(
    <CodeBlock filename="settings.ts" language="TypeScript" className="consumer">
      {'\n\tconst ready = true;\n'}
    </CodeBlock>,
  );
  await user.click(screen.getByRole('button', { name: 'Copy settings.ts' }));
  expect(screen.getByRole('status')).toHaveTextContent(
    'Copy failed. Select the code to copy manually.',
  );
  await user.click(screen.getByRole('button', { name: 'Try again settings.ts' }));
  expect(write).toHaveBeenLastCalledWith('\n\tconst ready = true;\n');
  expect(screen.getByRole('button', { name: 'Copied settings.ts' })).toHaveFocus();
  expect(screen.getByRole('status')).toHaveTextContent('Code copied.');
});

it('invalidates old source work and old attempt results through real rerenders', async () => {
  const user = userEvent.setup();
  let finish!: () => void;
  vi.spyOn(navigator.clipboard, 'writeText')
    .mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          finish = resolve;
        }),
    )
    .mockRejectedValue(new Error('Denied'));
  const { rerender } = render(<CodeBlock>old source</CodeBlock>);
  await user.click(screen.getByRole('button', { name: 'Copy' }));
  expect(screen.getByRole('button', { name: 'Copying…' })).toHaveAttribute('aria-busy', 'true');
  rerender(
    <CodeBlock wrap label="Updated source" filename="" language="">
      new source
    </CodeBlock>,
  );
  await act(async () => finish());
  expect(screen.getByRole('status')).toBeEmptyDOMElement();
  await user.click(screen.getByRole('button', { name: 'Copy' }));
  expect(screen.getByRole('button', { name: 'Try again' })).toBeVisible();
  expect(screen.getByRole('region', { name: 'Updated source' })).not.toHaveAttribute('tabindex');
});

it('retains the newest result when older clipboard requests complete later', async () => {
  const user = userEvent.setup();
  let finish!: () => void;
  vi.spyOn(navigator.clipboard, 'writeText')
    .mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          finish = resolve;
        }),
    )
    .mockResolvedValue(undefined);
  const { unmount } = render(<CodeBlock>source</CodeBlock>);
  await user.click(screen.getByRole('button', { name: 'Copy' }));
  await user.click(screen.getByRole('button', { name: 'Copying…' }));
  expect(screen.getByRole('status')).toHaveTextContent('Code copied.');
  unmount();
  await act(async () => finish());
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
});

it('can remove interactive controls without losing literal source and metadata', () => {
  const { rerender } = render(<CodeBlock copyable={false}>{''}</CodeBlock>);
  expect(screen.getByRole('region', { name: 'Code sample' }).textContent).toBe('');
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
  rerender(
    <CodeBlock language="Shell" label="  " copyable={false}>
      npm install fletchstack-ui
    </CodeBlock>,
  );
  expect(screen.getByText('Shell')).toBeVisible();
  expect(screen.getByRole('region', { name: 'Code sample' })).toHaveAttribute('tabindex', '0');
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
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
