---
name: establish-design-system
description: Establish a design system from scratch for a component library, using a real product flow to define initial patterns, semantic tokens, and the handoff to component authors.
---

# Establish a design system

From the project root, read `.agents/guidelines/design-tokens.md` and `.agents/guidelines/component-library.md` when present. If either is missing, apply the workflow below and use the project's existing instructions. AGI users can select the companion guidelines separately.

1. **Select a representative flow.** Identify who uses it, what they need to accomplish, and the states they encounter. For sign-in, include entering credentials, submitting, and recovering from a validation or authentication error. Use those states to identify the initial text, surfaces, actions, spacing, focus, and feedback roles.
2. **Establish authority.** Agree on who owns the system and approves changes. Record where the approved patterns and tokens live, where tokens are authored, and how changes reach consumers. Ask the design owner to resolve open decisions. Mark unapproved work as draft.
3. **Define the first patterns and tokens.** Record each pattern's purpose, supported states, interaction and accessibility expectations, and semantic roles. Use DTCG 2025.10 for interchange. Put raw values in primitives and define semantic aliases or compositions for component and consumer use. Use `px` for spatial dimensions and default to `rem` for tokenized font sizes.
4. **Verify the handoff.** Resolve the aliases and check the types and units. Map the selected flow's states to the approved patterns and semantic roles. If the team uses Figma or another design tool, pass a small sample through the intended workflow and compare names, types, values, aliases, and any modes used. Record unsupported types and conversions, including how the web mapping preserves relative typography if the tool requires pixel dimensions.
5. **Record what component authors need.** Point to the approved pattern and token sources, the results of the checks, and the owner and approval path for gaps. Report unverified steps or unresolved decisions. A flow is ready for component work when its required states and roles have approved coverage.

For sign-in, the handoff might identify the input and error pattern, the primary action's resting and submitting states, and the tokens for label text, focus, and feedback. Trace those roles to their primitives before handing off. Use the `build-react-components` skill for the React and Storybook workflow when available.
