import { CodeBlock } from '../../../src/components/code-block/CodeBlock';
import { Heading } from '../../../src/components/typography/Heading';
import { Stack } from '../../../src/components/stack/Stack';
import { Text } from '../../../src/components/typography/Text';
import type { CodeBlockProps, CodeBlockStyle } from '../../../src/components/code-block/CodeBlock';
import type { Scenario } from '../gallery/types';
import '../../../src/components/code-block/code-block.css';
import '../../../src/components/button/button.css';
import '../../../src/components/stack/stack.css';
import '../../../src/components/typography/typography.css';
import '../../../src/components/code-block/stories/code-block.stories.css';

const sample = 'const settings = {\n  theme: "corporate",\n};';

const longLine =
  'const title = settings.project.displayName.replaceAll("workspace", "international-editorial-workspace");';

const Playground: Scenario<CodeBlockProps> = {};

const Metadata: Scenario<CodeBlockProps> = {
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

const LongLines: Scenario<CodeBlockProps> = {
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

const Wrapped: Scenario<CodeBlockProps> = { args: { children: longLine, wrap: true } };

const LiteralContent: Scenario<CodeBlockProps> = {
  args: {
    filename: 'literal.txt',
    language: 'Plain text',
    children: '\n\t<div>Markup & whitespace stay literal.</div>\n<script>not executed</script>\n',
  },
};

const CopyFailure: Scenario<CodeBlockProps> = {};

const CopyRetry: Scenario<CodeBlockProps> = {};

const ScopedOverrides: Scenario<CodeBlockProps> = {
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

const LongMetadata: Scenario<CodeBlockProps> = {
  args: {
    filename: 'workspace-international-editorial-team-settings-with-a-very-long-filename.ts',
    language: 'TypeScript configuration for international workspaces',
    children: longLine,
    wrap: true,
  },
};

const RTL: Scenario<CodeBlockProps> = {
  render: () => (
    <div dir="rtl">
      <CodeBlock filename="settings.ts" language="TypeScript">
        {sample}
      </CodeBlock>
    </div>
  ),
};

const Hidden: Scenario<CodeBlockProps> = { args: { hidden: true } };

const SyntaxHighlighting: Scenario<CodeBlockProps> = {
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

const PlainTextFallback: Scenario<CodeBlockProps> = {
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

const HighlightedMarkup: Scenario<CodeBlockProps> = {
  args: {
    filename: 'literal.html',
    language: 'HTML',
    children: '\n\t<script>literal & text</script>\n',
  },
};

export const component = CodeBlock;
export const defaults: CodeBlockProps = {
  children: sample,
  filename: 'settings.ts',
  language: 'TypeScript',
  wrap: false,
  copyable: true,
  highlight: true,
};
export const scenarios = {
  Playground,
  Metadata,
  LongLines,
  Wrapped,
  LiteralContent,
  CopyFailure,
  CopyRetry,
  ScopedOverrides,
  LongMetadata,
  RTL,
  Hidden,
  SyntaxHighlighting,
  PlainTextFallback,
  HighlightedMarkup,
};
