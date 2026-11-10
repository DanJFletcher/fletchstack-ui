# Link

The supplied Link reference approves navigation to pages, sections, and resources, with descriptive text, a persistent underline, optional decorative destination icons, and native browser actions. Text size, font family, and line height inherit from the surrounding content. Inline links use regular weight; standalone links use semibold. Corporate uses blue default links and purple visited links; Luna uses lavender and a lighter purple visited color, with gold focus. Hover and active remain underlined. Independent `link.*` semantic roles own these states, icon spacing/size, underline geometry, and offset focus outlines.

`Link` renders a native anchor, forwards its native ref and attributes, and requires children. `href` accepts local paths, fragments, and external destinations. Native behavior owns Enter activation, Tab order, modified clicks, context menus, downloads, and browser history. Use Button for actions. An external icon does not infer a target; `target="_blank"` explicitly opens a new tab, adds `noopener` while preserving caller `rel`, and associates a hidden “Opens in a new tab.” description with the link. Caller descriptions are preserved. Custom named targets retain native behavior; consumers must explain any additional window behavior they introduce.

Omit `href` to render unavailable text: the anchor has no hyperlink role, underline, default keyboard stop, click/aux-click activation handler, or destination target. There is no synthetic disabled link and no placeholder URL. Empty-string href remains a real native destination. `variant="inline"` is the default; `variant="standalone"` emphasizes a navigation item without owning external spacing. `icon` accepts trusted non-interactive artwork and is decorative; keep descriptive text in children. Native classes, CSS styles, and scoped `--fs-link-*` overrides are available. Consumers preserve contrast and focus clearance when customizing.

```tsx
<p>Review our <Link href="/privacy">privacy policy</Link> before continuing.</p>
<Link href="/components" variant="standalone" icon={<ArrowRightIcon />}>View all components</Link>
<Link href="https://example.com/docs" target="_blank" icon={<ExternalLinkIcon />}>Read documentation</Link>
<Link>Unavailable documentation</Link>
```

Import `fletchstack-ui/styles.css`, or tokens.css + link.css (plus icon.css when using library icons). Browser privacy protections prevent reliable automated inspection of actual `:visited` colors; the contract and generated stylesheet can be checked without claiming history-based rendering. Real screen-reader and non-Chromium checks are recorded separately from automated results.

## Verification

The new-tab description test failed against a plain native anchor, then passed after adding the linked announcement. Full verification passed 362 unit tests, 142 integration tests, 157 Storybook interaction/axe checks, and 276 Chromium E2E tests. Unit, integration, and browser coverage each independently reached 100% per file with existing thresholds and exclusions unchanged. Type checks, lint, package/Storybook builds, and packed React 18/19 public types/CSS/SSR/bundle-isolation checks passed.

Browser journeys verify Enter navigation, Tab skipping of unavailable text, underlines through hover/active states, visible focus, explicit new-tab announcements and opener isolation, ordinary same-tab external navigation, modified clicks, native downloads, empty href semantics, forced colors, and 320px reflow with 200% text and user text spacing. The external destination document is fulfilled locally in its test; the browser navigation itself remains real. Both themes were visually inspected. Visited palette contrast is checked through declared tokens; actual history-dependent visited painting, real screen-reader output, and non-Chromium browsers remain unverified.
