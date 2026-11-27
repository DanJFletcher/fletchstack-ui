# Spec Delta

## Purpose

Keep media frames proportional as available parent width changes while preserving the media's native accessibility and consumer-owned presentation choices.

## ADDED Requirements

### Requirement: Proportional responsive frame

AspectRatio SHALL use all available inline width and derive its height from a positive numeric width/height ratio, defaulting to 16/9. Finite positive custom ratios SHALL be supported; zero, negative and non-finite values SHALL fall back to 16/9. Child intrinsic dimensions SHALL NOT expand the frame.

#### Scenario: Common and custom proportions

- **WHEN** square, landscape, portrait and custom frames render at different parent widths
- **THEN** each frame height equals width divided by the selected ratio before hydration and without viewport breakpoints or JavaScript measurements

#### Scenario: Invalid ratio

- **WHEN** the numeric ratio is zero, negative, NaN or infinite
- **THEN** the frame uses the default 16/9 geometry deterministically

### Requirement: Passive native API

The library SHALL export AspectRatio, AspectRatioProps and AspectRatioStyle, render a div and forward native attributes, classes, styles and an outer-div ref. The wrapper SHALL add no role, keyboard stop, focus management, surface, border, radius or clipping.

#### Scenario: Native child interaction

- **WHEN** a keyboard user traverses controls in and around a frame
- **THEN** native source/tab order and visible focus remain intact without wrapper interaction semantics

#### Scenario: Native overrides

- **WHEN** consumers supply native attributes or styles, including CSS aspectRatio
- **THEN** attributes and ref reach the outer div and explicit consumer styles take precedence

### Requirement: Consumer-owned media presentation

AspectRatio SHALL isolate its contents from frame sizing while leaving media fitting, alternative text, video controls, embed titles and captions to the consumer. Captions SHALL be demonstrated outside frames. Overflow SHALL remain visible; fixed-ratio frames SHALL NOT be recommended for reflowing text.

#### Scenario: Cover and contain

- **WHEN** the same landscape image fills square frames with consumer cover or contain styling
- **THEN** frame geometry stays square while the child's fitting choice determines cropping or empty space

#### Scenario: Oversized content

- **WHEN** a child exceeds the frame bounds
- **THEN** the frame keeps its ratio without concealing overflow or focus rings

### Requirement: Package and accessible composition

AspectRatio SHALL work with standalone/combined CSS and server rendering without browser globals, layout effects or CSS imports in JavaScript. Stories and documentation SHALL cover common ratios, responsive parents, media fitting, both themes, SimpleGrid/Card composition and narrow enlarged captions.

#### Scenario: Consistent themes

- **WHEN** Corporate and Luna render equivalent frames
- **THEN** geometry is identical and the frame stays transparent

#### Scenario: Enlarged narrow composition

- **WHEN** representative media cards render at 320px with 200% text and user text spacing
- **THEN** frames remain proportional and captions outside them reflow without page overflow
