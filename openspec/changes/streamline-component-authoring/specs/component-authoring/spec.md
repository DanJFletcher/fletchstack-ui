# Spec Delta

## Purpose

Make new library components straightforward to author and integrate through a concise repository recipe, safe mechanical scaffolding, and explicit remaining design and verification work.

## ADDED Requirements

### Requirement: Repository component recipe

The component workflow SHALL provide concern-specific references, a lightweight contract checklist, required integration locations, and existing verification commands. It MUST distinguish routine implementation decisions from missing product decisions without requiring a separate planning document or extra approval for routine choices.

#### Scenario: Authoring a passive component

- **WHEN** an agent follows the recipe for passive content
- **THEN** it can identify a relevant reference and the naming, semantics, token, composition, and verification decisions needed
- **AND** it does not inherit interactive behavior merely because another reference implements it

### Requirement: Previewable component scaffolding

The repository SHALL offer a noninteractive scaffold for a named component using explicitly selected structural inputs. Its dry run MUST list proposed files, registration edits, conflicts, and remaining authored work without writing files, launching services, executing tests, or collecting coverage.

#### Scenario: Preview a component addition

- **WHEN** valid inputs are supplied in dry-run mode
- **THEN** the command returns a deterministic plan and leaves the repository unchanged
- **AND** applying the same inputs to unchanged files uses that plan

### Requirement: Safe scaffold application

Scaffolding MUST validate all inputs and destinations before writing, reject duplicate identities and existing component files, preserve unrelated edits, and confine writes to the project. Invalid input or unsupported registration layouts MUST fail with actionable errors. A repeat invocation MUST NOT overwrite authored work or duplicate registrations.

#### Scenario: Existing component or registration conflict

- **WHEN** the requested name, slug, story identity, or target file conflicts with existing work
- **THEN** the command exits unsuccessfully before making changes and identifies the conflict

#### Scenario: Unsafe destination

- **WHEN** a supplied path or existing symlink would place output outside the project
- **THEN** the command rejects the operation before writing

#### Scenario: Unrelated work exists

- **WHEN** the workspace contains unrelated edits and the planned registration edits are unambiguous
- **THEN** scaffolding preserves those edits and changes only its reported targets

### Requirement: Explicit scaffold completion boundary

Generated structure MUST identify outstanding API, behavior, semantic-token, example, test, and review work. It MUST NOT invent design variants, behavioral assertions, or successful verification evidence. Structural checks SHALL distinguish wiring readiness from behavioral completion and report missing required artifacts or unresolved scaffold markers as incomplete.

#### Scenario: Fresh scaffold

- **WHEN** scaffolding completes successfully
- **THEN** its report identifies incomplete authored work and the next relevant commands
- **AND** no placeholder or skipped test is presented as proof of component correctness

### Requirement: Independent adapters with shared examples

New component setup SHALL support sharing framework-independent React examples between Storybook and the browser harness. Harness examples MUST retain direct implementation and explicit style dependencies and MUST NOT load Storybook metadata or execute play functions. Distinct Storybook and browser assertions SHALL retain their own owners.

#### Scenario: Shared composition

- **WHEN** a composition is consumed by both adapters
- **THEN** both render the shared example while the harness runs independently of Storybook
- **AND** dependency discovery follows the composition's real component and asset imports or reports its existing conservative fallback

### Requirement: Consistent mechanical registration

Component registration SHALL consistently connect source entrypoints, individual and combined stylesheets, Storybook setup, and harness scenario ownership. Structural validation MUST detect missing files, duplicate identities, mismatched exports, and stale registration. Existing stylesheet order and published entrypoints MUST remain compatible.

#### Scenario: New component registration

- **WHEN** a component's generated structure is completed and registered
- **THEN** its source and stylesheet entrypoints resolve and its scenarios have explicit test owners
- **AND** existing exports and combined stylesheet order remain unchanged

#### Scenario: Registration drift

- **WHEN** a stylesheet, export, scenario, or owner no longer matches its registration
- **THEN** structural validation fails with the affected identity and missing or inconsistent target

### Requirement: Independent compatibility evidence

Consolidating inventory MUST retain independent public API, installed-package, stylesheet, and historical preservation checks. Historical checks SHALL detect losses or changes to their protected baseline without requiring per-component exception lists for additive components. Tests MUST NOT derive all expected public contracts from the inventory used to produce them.

#### Scenario: Additive component

- **WHEN** a valid new component is added
- **THEN** historical preservation checks accept the addition without a new name-specific exemption
- **AND** removing a protected export or changing a protected token still fails its compatibility check

### Requirement: Existing verification and measured adoption

The recipe and scaffold MUST preserve current coverage timing, independent coverage gates, browser ownership, and full-fallback policies. Evaluation SHALL distinguish setup time, integration corrections, and verification time. A synthetic scaffold exercise MUST NOT be reported as a measured real-component speedup.

#### Scenario: Evaluate the next component

- **WHEN** a separately requested real component uses the workflow
- **THEN** its report records setup duration, missed registrations or corrective edits, and verification scope and duration
- **AND** no runtime improvement is inferred solely from fewer manual edits
