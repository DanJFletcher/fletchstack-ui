# Design

## Context

See proposal.md for motivation. Existing layout families establish forwarded native divs, typed --fs-* overrides, family-local CSS/stories/tests, explicit JS/type exports and standalone/combined styles. The supplied sheet specifies default 16:9, full available width and no automatic clipping.

## Goals / Non-Goals

**Goals:** Stable media geometry before hydration; arbitrary positive numeric ratios; child-owned fitting and semantics; visible overflow and focus.

**Non-Goals:** Text containers, media loading, automatic object-fit, clipping, radius, overlays/controls, polymorphic rendering, breakpoint props or media providers.

## Decisions

- API: ratio?:number (width divided by height; default 16/9), native div attributes/ref/children/className, AspectRatioStyle with typed --fs-* values. Normalize invalid numeric inputs to 16/9 for deterministic safe geometry rather than failing an SSR render. Consumer style.aspectRatio overrides the prop, following native style precedence. Exclude dangerouslySetInnerHTML because the component owns a child content layer; consumers supply media through children.
- Outer div uses position:relative, width:100%, min-inline-size:0 and box-sizing:border-box; set native CSS aspectRatio inline from the validated number. Ratio describes content geometry, not theme styling, so no new token is introduced. Existing tokens are preserved exactly.
- An absolutely positioned, inset:0 internal content div keeps intrinsic image/video/embed dimensions out of the outer sizing flow. This preserves exact proportions without a fixed height or overflow clipping. Consumers explicitly fill media width/height and choose object-fit on the media itself. Avoid broad descendant selectors that silently resize controls or add fitting policies.
- Keep media and accessible names real: inline illustrative SVG image data (local story fixture, not generated raster art), native video with controls, titled local iframe srcDoc, and SimpleGrid → Card → AspectRatio → image with captions outside the frame. Illustration outlines and surfaces are example CSS only.
- Use native aspect-ratio rather than a padding-bottom fallback or client measurement. Verify browser geometry before hydration, native attributes/style precedence, content isolation, zero/narrow parents, RTL, nested frames, theme consistency and focus overflow.
- All existing independent unit/integration/browser 100% coverage gates remain in place; preserve uncommitted Cluster/SimpleGrid and unrelated edits.

## Risks / Trade-offs

- Unfitted intrinsic media can overflow → document the fill CSS and fitting responsibility, keep overflow visible, test both fitting options.
- Fixed ratios are unsuitable for reflowing text → keep captions outside and verify enlarged narrow captions; document not to use this wrapper for text sections.
- Absolute content wrapper adds a DOM node → forward attributes/ref to the outer div, keep both wrappers passive, document content sizing without promoting internal markup to a public slot API.
- Consumer styles may override geometry → explicitly document native aspectRatio precedence and parent sizing ownership.

## Migration Plan

Optional additive adoption with standalone or combined CSS. Existing wrappers and component APIs remain supported. Replace with equivalent native CSS to roll back without data/dependency changes.
