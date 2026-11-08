# Bootstrap plan

The user's initial brief is approved authority for this foundation. Repository maintainers own subsequent changes; record new visual roles here and in the foundation before implementing them. There is no existing product, design tool, or OpenSpec workflow in this repository.

1. Record the save-settings action flow and initial foundation, then author two DTCG token sets with the same semantic contract.
2. Establish package/tool configuration; use focused red–green cycles for token validation and Button behavior.
3. Generate semantic CSS, implement the native Button, and demonstrate the contract in Storybook.
4. Run browser interactions, automated axe checks, contrast/reflow checks, lint, types, library and Storybook builds.
5. Pack and install in a temporary consumer; verify exports, declarations, CSS, and server rendering. Exercise small framework fixtures when tooling permits.
6. Record actual evidence and gaps in verification.md and finish consumption documentation.

## Dependency decision

Registry metadata checked 2026-11-06: Gatsby 5.16.1 accepts React 18/19 and Node >=18 <26; Astro 7.4.7 and @astrojs/react 7.1.4 require Node >=22.23.4, and the React integration accepts React 17/18/19. Use Node 22.23.4+, React 19 for development, and a library peer range of ^18.2.0 || ^19.0.0. Use forwardRef to preserve React 18 compatibility.

Storybook 10.6.6 accepts Vite 8 and its Vitest addon accepts Vitest 5. The implementation selects patched Vite 7.3.7 and Vitest 4.1.12 with plugin-react 5.1.4, also within those supported peer ranges. TypeScript 5.9.3 is deliberately retained because typescript-eslint 8.72.1 supports TypeScript <6.1, while the latest TypeScript is 7.0.2. Do not force incompatible latest versions.

## Scope and tradeoffs

- One public React component; no theme provider or runtime token engine.
- ESM package, declaration files, explicit CSS exports; React stays external.
- Two conceptual token layers. Resolve primitive aliases to literals when emitting semantic properties at every theme boundary, preventing inherited alias resolution from leaking across scopes.
- Native button semantics, flexible sizing, no decorative motion or loading abstraction.
- No design-tool exchange is configured; JSON is authoritative and CSS is generated.

The starter's agent-guides-installer dependency referenced an external local tarball and was not available from npm. Generated repository instructions are retained; that authoring-only dependency was removed so a checkout can install reproducibly.
