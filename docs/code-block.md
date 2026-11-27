# CodeBlock

The supplied CodeBlock design sheet approves preformatted code with optional filename/language metadata, copying and feedback, horizontal scrolling by default, and optional visual wrapping. Defaults are 14px (0.875rem) monospace, unitless 1.5 line height, and 16px code inset. Corporate uses a light neutral panel; Luna uses a deep navy panel. Existing Button supplies the copy action and native interaction states. CodeBlock gives the idle action a neutral outlined Corporate appearance and lavender Luna fill, as in the sheet; Button retains hover, active and focus behavior.

## Public contract

Exports `CodeBlock`, `CodeBlockProps`, and `CodeBlockStyle`. Required `children` is a string, rendered literally inside native pre/code elements. React escapes markup; executable code and HTML injection are never supported. `language` is an optional display label that also selects syntax highlighting, and `filename` is optional metadata. `label` optionally names the code region; its default identifies the filename or says “Code sample”.

`wrap` defaults to false: preserve whitespace and horizontally scroll inside the code viewport. The named region has a keyboard stop for native scrolling and text selection. `wrap={true}` uses pre-wrap and breaks long tokens without modifying the original text; it adds no viewport keyboard stop. Header labels wrap as needed. The wrapper itself adds no focus stop. Parents own surrounding spacing.

`copyable` defaults to true. Copy uses the asynchronous Clipboard API only after activation. The button stays focused, reports Copied after success and Try again after failure, and remains available for retry. One polite status region announces results; it is not an alert or an additional live button. Failure guidance says “Copy failed. Select the code to copy manually.” Missing APIs, insecure contexts and rejected permission requests all follow the same recoverable failure path. No deprecated copy fallback or hidden textarea is added.

Changing source resets feedback and invalidates pending results. Concurrent requests use the latest result; pending completions after unmount are ignored. No timer clears feedback. `copyable={false}` omits the button/status region; the metadata header is omitted when it would otherwise be empty.

Supports native div attributes, className, a forwarded HTMLDivElement ref and typed `--fs-*` style overrides. Raw HTML injection is intentionally excluded. The source contains no stylesheet imports or browser access during rendering; server markup is deterministic. Copy interaction requires hydration. Plain code display and CSS scrolling/wrapping work without JavaScript.

## Composition

```tsx
import { CodeBlock } from 'fletchstack-ui';
import 'fletchstack-ui/tokens.css';
import 'fletchstack-ui/button.css';
import 'fletchstack-ui/code-block.css';

<CodeBlock filename="settings.ts" language="TypeScript">
  {'const settings = {\n  theme: "corporate",\n};'}
</CodeBlock>;
```

The combined stylesheet includes dependencies. New `--fs-code-block-*` semantic roles directly reference existing primitives in both themes. Scoped overrides inherit; explicit nested themes reset the contract. Focus rings remain visible around both the code viewport and copy Button. The root does not clip overflow to round its corners. Code direction defaults to LTR independently of surrounding RTL metadata; native style overrides remain available.

Unknown language labels remain plain text. Horizontal code scrolling is intentional for preserved source, while wrap mode is available when reflow is preferred. At narrow widths and with enlarged or spaced text, surrounding metadata, controls and failure guidance reflow. No fixed height or truncation hides content. Screen-reader and cross-browser verification limits are recorded in the verification guide.

## Syntax highlighting

The request to add third-party highlighting approves synchronous [Refractor](https://github.com/wooorm/refractor) tokenization and six semantic syntax color roles: comment, keyword, string, number, function and operator. These roles reference existing raw palette primitives, meet AA text contrast on the default code surfaces, support scoped overrides, and reset at nested themes. Forced colors use CanvasText. Unclassified tokens inherit the source foreground. Color is supplementary: the complete source remains readable without it.

`highlight` defaults to true. With a recognized `language`, CodeBlock renders escaped React text and spans during SSR and client rendering. No HTML strings, injected styles, asynchronous initialization, network requests, workers or language detection are used. Tokenization is memoized by source, language and opt-out, so copy feedback does not retokenize source. Copy always uses the original string, including tabs and newlines; highlighting and visual wrapping never change it. `filename` does not infer a language. `highlight={false}` retains the displayed language label while rendering plain source. Empty, missing and unsupported languages safely render plain source.

Supported language names and aliases (case-insensitive; surrounding whitespace ignored):

- JavaScript / js, JSX, TypeScript / ts, TSX.
- HTML / markup / XML / SVG, CSS, JSON.
- Bash / sh / shell, Markdown / md, YAML / yml.

Only these grammars and their dependencies are registered. Additional languages and consumer grammar registration are outside the initial API. Refractor is an exact-version runtime dependency, externalized in the library output; consumer bundlers resolve it normally and its installed package retains its license. It adds synchronous parsing cost and bundle weight to CodeBlock consumers. Very large or untrusted samples can use `highlight={false}` to avoid parser cost. No arbitrary input-size cutoff silently changes highlighting.
