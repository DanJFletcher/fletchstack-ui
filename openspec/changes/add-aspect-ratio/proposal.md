# Proposal

## Why

Images, videos and embeds need a stable proportional frame as parent width changes. The supplied AspectRatio design adds geometry that complements SimpleGrid and Card while leaving media presentation and captions with consumers.

## What Changes

- Export AspectRatio, AspectRatioProps and AspectRatioStyle with a positive numeric ratio (default 16/9), native div attributes, classes, styles and forwarded refs.
- Reserve height from available width without JavaScript measurements, child-driven frame expansion or automatic clipping; consumers size media and choose object-fit.
- Integrate standalone/combined CSS, native/SSR/package checks, common ratios and representative media stories, and spatial guidance.
- Verify responsive geometry, overflow/focus visibility, native interaction order, themes, narrow content and source rendering before hydration.

## Capabilities

### New Capabilities

- `proportional-media-frame`: Passive proportional geometry for consumer-owned images, video and embeds.

### Modified Capabilities

None.

## Impact

New aspect-ratio family and tests; additive public JS/types/CSS exports, packaging consumers and Storybook layout navigation. Existing tokens and unrelated work remain intact. No dependency or token additions.
