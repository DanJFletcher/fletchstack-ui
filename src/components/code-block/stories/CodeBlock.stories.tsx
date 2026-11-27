import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { CodeBlock, Container, Heading, Stack, Text, type CodeBlockStyle } from '../../../index';
import './code-block.stories.css';

const sample = 'const settings = {\n  theme: "corporate",\n};';
const longLine =
  'const title = settings.project.displayName.replaceAll("workspace", "international-editorial-workspace");';

/**
 * Simulate only clipboard I/O for feedback demonstrations and restore it on story cleanup.
 **/
function demoClipboard(writeText: (text: string) => Promise<void>) {
  const original = Object.getOwnPropertyDescriptor(navigator, 'clipboard');
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });

  return () => {
    if (original) {
      Object.defineProperty(navigator, 'clipboard', original);
    } else {
      Reflect.deleteProperty(navigator, 'clipboard');
    }
  };
}

const meta = {
  id: 'components-code-block',
  title: 'Components/Content/CodeBlock',
  component: CodeBlock,
  tags: ['autodocs'],
  args: {
    children: sample,
    filename: 'settings.ts',
    language: 'TypeScript',
    wrap: false,
    copyable: true,
    highlight: true,
  },
  parameters: {
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Literal preformatted source for reading and copying: 14px monospace, 1.5 line height, 16px inset. Optional language selects synchronous Refractor syntax highlighting for supported web languages; unknown or absent languages stay plain. Use highlight={false} to opt out. Scroll by default; wrap is visual only and copying preserves original whitespace. Scroll regions have a keyboard stop; wrapped code does not. Copy retains focus and announces results through one polite status. Missing/denied Clipboard API shows Try again and manual-copy guidance. Source changes invalidate stale requests; no timers clear feedback. Load tokens.css, button.css and code-block.css, or combined styles. Playground uses the real Clipboard API; feedback stories simulate only clipboard I/O and restore it on cleanup.',
      },
    },
  },
} satisfies Meta<typeof CodeBlock>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Metadata: Story = {
  render: () => (
    <Stack>
      <CodeBlock filename="settings.ts" language="TypeScript">
        {sample}
      </CodeBlock>
      <CodeBlock language="JavaScript">const ready = true;</CodeBlock>
      <CodeBlock filename="install.sh">npm install fletchstack-ui</CodeBlock>
      <CodeBlock>npm run build</CodeBlock>
    </Stack>
  ),
};
export const LongLines: Story = {
  render: () => (
    <Stack>
      <Heading as="h2" size="subheading">
        Scroll (default)
      </Heading>
      <div className="code-block-demo-narrow">
        <CodeBlock label="Scrollable long source" copyable={false}>
          {longLine}
        </CodeBlock>
      </div>
      <Heading as="h2" size="subheading">
        Wrap (optional)
      </Heading>
      <div className="code-block-demo-narrow">
        <CodeBlock label="Wrapped long source" wrap copyable={false}>
          {longLine}
        </CodeBlock>
      </div>
      <Text>Wrapping changes display only. Copying preserves the original source.</Text>
    </Stack>
  ),
};
export const Wrapped: Story = { args: { children: longLine, wrap: true } };
export const ReadOnly: Story = { args: { copyable: false, filename: '', language: '' } };
export const LiteralContent: Story = {
  args: {
    filename: 'literal.txt',
    language: 'Plain text',
    children: '\n\t<div>Markup & whitespace stay literal.</div>\n<script>not executed</script>\n',
  },
};
export const CopySuccess: Story = {
  beforeEach: () => demoClipboard(fn().mockResolvedValue(undefined)),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Copy settings.ts' }));
    await expect(canvas.getByRole('button', { name: 'Copied settings.ts' })).toHaveFocus();
    await expect(canvas.getByRole('status')).toHaveTextContent('Code copied.');
  },
};
export const CopyFailure: Story = {
  beforeEach: () =>
    demoClipboard(fn().mockRejectedValue(new Error('Simulated clipboard permission denial'))),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Copy settings.ts' }));
    await expect(canvas.getByRole('button', { name: 'Try again settings.ts' })).toHaveFocus();
    await expect(canvas.getByRole('status')).toHaveTextContent(
      'Copy failed. Select the code to copy manually.',
    );
  },
};
export const CopyRetry: Story = {
  beforeEach: () =>
    demoClipboard(
      fn().mockRejectedValueOnce(new Error('Simulated denial')).mockResolvedValue(undefined),
    ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Copy settings.ts' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Try again settings.ts' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('Code copied.');
  },
};
export const BothThemes: Story = {
  render: () => (
    <div className="theme-grid">
      {(['corporate', 'luna'] as const).map((theme) => (
        <section key={theme} data-theme={theme} className="theme-panel">
          <Stack>
            <Heading>{theme}</Heading>
            <CodeBlock language="JavaScript">const ready = true;</CodeBlock>
          </Stack>
        </section>
      ))}
    </div>
  ),
};
export const Composition: Story = {
  render: () => (
    <Container size="reading">
      <Stack>
        <Heading as="h1" size="page">
          Configure your workspace
        </Heading>
        <Text>Choose a theme in your project configuration, then restart your application.</Text>
        <CodeBlock filename="settings.ts" language="TypeScript">
          {sample}
        </CodeBlock>
        <Text size="small" tone="muted">
          The language selects highlighting; copying preserves your exact original source.
        </Text>
      </Stack>
    </Container>
  ),
};
export const ScopedOverrides: Story = {
  render: () => (
    <Stack>
      <div
        style={
          {
            '--fs-code-block-inset': '24px',
            '--fs-code-block-font-size': '1.125rem',
            '--fs-code-block-syntax-keyword': 'rgb(138, 35, 100)',
          } as CodeBlockStyle
        }
      >
        <CodeBlock language="TypeScript" label="Scoped source" copyable={false}>
          {sample}
        </CodeBlock>
        <div data-theme="luna" className="theme-panel">
          <CodeBlock language="TypeScript" label="Reset source" copyable={false}>
            {sample}
          </CodeBlock>
        </div>
      </div>
      <CodeBlock language="TypeScript" label="Sibling source" copyable={false}>
        {sample}
      </CodeBlock>
    </Stack>
  ),
};
export const LongMetadata: Story = {
  args: {
    filename: 'workspace-international-editorial-team-settings-with-a-very-long-filename.ts',
    language: 'TypeScript configuration for international workspaces',
    children: longLine,
    wrap: true,
  },
};
export const RTL: Story = {
  render: () => (
    <div dir="rtl">
      <CodeBlock filename="settings.ts" language="TypeScript">
        {sample}
      </CodeBlock>
    </div>
  ),
};
export const Hidden: Story = { args: { hidden: true } };

export const SyntaxHighlighting: Story = {
  render: () => (
    <Stack>
      {[
        {
          language: 'TypeScript',
          source:
            '// Workspace settings\nconst count: number = 12;\nfunction greet(name: string) { return "Hello " + name; }\nconst ready = true;',
        },
        { language: 'TSX', source: 'const view = <Button disabled={false}>Save</Button>;' },
        { language: 'JSON', source: '{"theme": "corporate", "count": 12, "ready": true}' },
        { language: 'HTML', source: '<div class="sample">Literal &amp; safe</div>' },
        { language: 'CSS', source: '.sample { color: red; margin: 12px; }' },
        { language: 'Shell', source: 'echo "Installing"\nnpm install fletchstack-ui' },
        { language: 'Markdown', source: '# Configuration\nUse **semantic tokens** for colors.' },
        { language: 'YAML', source: 'theme: corporate\nready: true' },
      ].map(({ language, source }) => (
        <CodeBlock key={language} language={language} copyable={false}>
          {source}
        </CodeBlock>
      ))}
    </Stack>
  ),
};
export const PlainTextFallback: Story = {
  render: () => (
    <Stack>
      <CodeBlock language="Custom language" copyable={false}>
        {sample}
      </CodeBlock>
      <CodeBlock language="TypeScript" highlight={false} copyable={false}>
        {sample}
      </CodeBlock>
    </Stack>
  ),
};
export const HighlightedMarkup: Story = {
  args: {
    filename: 'literal.html',
    language: 'HTML',
    children: '\n\t<script>literal & text</script>\n',
  },
};
