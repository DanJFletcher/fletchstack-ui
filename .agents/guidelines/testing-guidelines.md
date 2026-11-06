# Unit Test Writing Guidelines for Agents

## Purpose and scope

You are writing unit tests that a human will read, debug and maintain long after you are gone. Optimize for the reader first, then for resilience to change, then for coverage.

Apply these rules to every unit test you write or modify. When the project already has established test conventions (framework, file layout, helper libraries, naming), match them; these rules govern how each test is written, not which tools are used. If a rule here conflicts with an explicit instruction from the user, follow the user and note the trade-off.

A good test answers three questions at a glance: what is being tested, under what conditions, and what should happen. If a reader has to scroll, jump to another file or run the test to understand it, the test needs work.

## Core principles

1. **One behavior per test.** Each test verifies a single outcome of a single action. If the test name needs the word "and", split it.
2. **Arrange, Act, Assert, always.** Every test has three visibly separated phases, in that order, each appearing once.
3. **Test behavior, not implementation.** Assert on what the unit returns or what observable effect it has, never on how it gets there. A correct refactor must not break a test.
4. **Readable in isolation.** Everything needed to understand the test is inside the test or one obvious helper. Prefer clarity over brevity.
5. **Deterministic.** Same input, same result, every run, on every machine, in any order. No real clocks, network, file system, randomness or shared mutable state.
6. **Fast and independent.** A unit test runs in milliseconds and never depends on another test having run first.
7. **Fails with a useful message.** When a test fails, the output alone should tell the reader what broke.

## Arrange, Act, Assert

Every test follows this exact shape. Use the `// arrange`, `// act` and `// assert` comments and a blank line between phases.

```ts
it('converts an array of digit strings into a number', () => {
  // arrange
  const given = ['1', '2', '3'];
  const expected = 123;

  // act
  const result = numerize(given);

  // assert
  expect(result).toEqual(expected);
});
```

**Arrange** sets up only what this test needs.

- Name the input `given` (or a descriptive name when there are several inputs) and the expected outcome `expected`.
- Declare `expected` as a literal value, written out by hand. Never compute it with the same logic the unit uses.
- Include only the data that matters to this behavior. Irrelevant fields come from a factory default (see Test data).

**Act** is exactly one call to the unit under test.

- Store its output in `result`. For async code, `const result = await doThing(given);`.
- If you need two calls, you are testing two things or the second call belongs in Arrange.
- For code expected to throw, capture the call in Act and assert in Assert: `const act = () => parse(given);` then `expect(act).toThrow(InvalidInputError);`.

**Assert** checks the one behavior named in the test title.

- Prefer a single `expect`. Several `expect` calls are acceptable only when they jointly describe one outcome (for example, status and body of one response). If they could fail independently for different reasons, split the test.
- Compare `result` to `expected`. Avoid assertions on anything not produced by Act.

When a phase is empty (for example, no arrange for a pure function with no inputs), keep the comment and leave the phase blank only if it aids consistency; otherwise omit it. Never merge phases, as in `expect(numerize(['1'])).toEqual(1)`.

## Naming

A test name states the expected behavior in plain language, so the test list reads like a specification.

- Group by unit with `describe('<unit name>')`, and by condition with nested `describe('when <condition>')` where it helps.
- Write `it` titles as a behavior: `it('returns 0 for an empty array')`, not `it('works')` or `it('test numerize 2')`.
- Name the outcome, not the mechanism: `it('rejects expired sessions')`, not `it('calls isExpired and throws')`.
- Keep titles specific enough that a failure tells the reader what broke without opening the file.

```ts
describe('numerize', () => {
  it('converts digit strings into a number', () => { /* ... */ });
  it('returns 0 for an empty array', () => { /* ... */ });

  describe('when an element is not a digit', () => {
    it('throws an InvalidInputError', () => { /* ... */ });
  });
});
```

## Test data, fixtures and factories

Show the data that matters to the behavior in the test itself, and hide everything else behind a factory with sensible defaults.

```ts
// factory with safe defaults; override only what the test cares about
const buildExamSession = (overrides = {}) => ({
  id: 'session-1',
  candidateId: 'candidate-1',
  status: 'in_progress',
  startedAt: new Date('2026-01-01T10:00:00Z'),
  ...overrides,
});

it('marks a completed session as not resumable', () => {
  // arrange
  const given = buildExamSession({ status: 'completed' });
  const expected = false;

  // act
  const result = canResume(given);

  // assert
  expect(result).toBe(expected);
});
```

- Put the values that drive the behavior inline as overrides, so the reader sees why the outcome happens.
- Use fixed, obvious values (`'session-1'`, fixed ISO dates), not random or generated ones.
- Create fresh data in each test. Never mutate shared objects across tests; if a `beforeEach` is used, it must rebuild state from scratch.
- Keep factories next to the tests or in a shared `test/factories` module, following project conventions.

**Never use real data.** Test data must be synthetic. Do not copy real names, emails, student or candidate IDs, exam content, hostnames, IPs, connection strings, API keys or credentials into tests, fixtures or snapshots. Use clearly fake placeholders such as `candidate-1`, `test@example.com` and `https://api.example.test`. Do not log PII from tests, and flag any existing fixture that appears to contain real records.

## Mocks and test doubles

Mock only at the boundaries of the unit: things that are slow, non-deterministic or outside your control. Over-mocking is the most common cause of brittle tests.

| Double | Use it for | Example |
| --- | --- | --- |
| Stub | Supplying canned answers to the unit | A repository that returns a fixed session |
| Fake | A lightweight working version of a dependency | An in-memory store instead of a database |
| Spy / mock | Verifying an outgoing command whose effect is the point of the test | Checking an audit event was emitted |

- **Do mock:** network calls, databases, file system, clocks, random number generators, message queues, third-party SDKs.
- **Do not mock:** the unit under test, pure helper functions, value objects, or internal private methods. If you feel the need, the design probably needs a seam.
- Prefer stubs and fakes over interaction mocks. Assert on the result the unit returns; only verify a call when that call is the behavior (for example, "sends a notification").
- When verifying a call, assert on the meaningful arguments, not on call counts or argument order the behavior does not depend on.
- Inject dependencies through parameters or constructors rather than patching modules globally. Reset or restore all mocks after each test.
- Stubbed responses should be minimal and realistic in shape. Never embed real credentials or tokens in mocked payloads.

## Assertions

Assert exactly what the test name promises, as precisely as the behavior requires and no more.

- Use the most specific matcher available: `toBe` for primitives, `toEqual` for structures, `toThrow(ErrorType)` for errors, `toHaveBeenCalledWith` for verified calls.
- Avoid weak assertions that pass for wrong results: `toBeTruthy()`, `toBeDefined()`, `not.toBeNull()` or `expect(result.length).toBeGreaterThan(0)` when an exact value is known.
- Avoid over-specified assertions that fail for irrelevant changes. When only some fields matter, use partial matchers such as `toMatchObject` or `expect.objectContaining`.
- Do not put logic in assertions: no loops, conditionals, `try/catch` or recomputing the expected value.
- Use snapshots sparingly and only for stable, small, reviewed output. Never snapshot large objects, timestamps, generated IDs or anything containing personal data.
- For errors, assert the error type and, if it is part of the contract, a stable code. Avoid matching full human-readable messages that may change.

## Avoiding brittleness

A test is brittle when it fails for reasons unrelated to the behavior it checks. Remove every such reason.

| Source of brittleness | What to do instead |
| --- | --- |
| Current time (`Date.now()`, `new Date()`) | Inject a clock or use fake timers set to a fixed instant |
| Randomness and generated IDs | Inject the generator or seed it; assert on shape only when the value is truly arbitrary |
| Timezone and locale | Pin them in test setup; use UTC ISO strings in data |
| Real timers and `setTimeout` waits | Use fake timers and advance them explicitly; never `sleep` |
| Async work | `await` every promise; avoid fire-and-forget; no arbitrary waits |
| Unordered collections | Sort before comparing, or use order-insensitive matchers |
| Test order and shared state | Rebuild state per test; tests must pass when run alone or shuffled |
| Private methods and internal structure | Test through the public API only |
| Exact call counts and internal calls | Assert on outputs or on the one meaningful outgoing call |
| Environment (network, files, env vars) | Stub at the boundary; set env values in the test and restore them |

If a test is flaky, fix the cause. Never add retries, longer timeouts or `skip` to make it pass.

## Maintainability and coverage

Tests should be DAMP (Descriptive And Meaningful Phrases) rather than strictly DRY. Some repetition is fine when it keeps each test readable on its own.

- Extract a helper only when it hides incidental detail (building objects, wiring a fake). Never hide the act or the assertion inside a helper.
- Keep `beforeEach` limited to setup that every test in the block genuinely shares. If a reader must scroll up to understand a test, inline the setup.
- Use table-driven tests (`it.each`) when several cases share one behavior and differ only in input and expected output. Each row must still be one case with a readable title.
- No conditional logic or loops in test bodies. A test with an `if` is two tests.
- Delete or update tests alongside the code they cover; never leave commented-out or skipped tests behind.

```ts
it.each([
  { given: ['0'], expected: 0 },
  { given: ['4', '2'], expected: 42 },
  { given: ['0', '7'], expected: 7 },
])('converts $given into $expected', ({ given, expected }) => {
  // act
  const result = numerize(given);

  // assert
  expect(result).toEqual(expected);
});
```

**What to cover** for each unit, as separate tests:

- The main success path.
- Boundaries: empty, single element, minimum and maximum values, zero, negative numbers.
- Invalid input and each documented error.
- Each meaningful branch in the logic.
- Security-relevant behavior: authorization checks, input validation, and that sensitive fields are not exposed or logged.

When you cannot cover something (for example, it needs an integration test), say so in your summary and flag the gap rather than writing a weak unit test for it.

## Anti-patterns

**Testing several things in one test.** Two acts and unrelated assertions mean one failure hides the other.

```ts
// avoid
it('numerize works', () => {
  expect(numerize(['1', '2'])).toEqual(12);
  expect(numerize([])).toEqual(0);
  expect(() => numerize(['a'])).toThrow();
});
```

```ts
// prefer: one test per behavior
it('returns 0 for an empty array', () => {
  // arrange
  const given: string[] = [];
  const expected = 0;

  // act
  const result = numerize(given);

  // assert
  expect(result).toEqual(expected);
});
```

**Coupling to implementation.** This breaks if the unit is refactored to use a different helper, even though behavior is unchanged.

```ts
// avoid
it('calls parseInt for each element', () => {
  const spy = jest.spyOn(global, 'parseInt');
  numerize(['1', '2']);
  expect(spy).toHaveBeenCalledTimes(2);
});
```

Prefer asserting on the returned value, as in the canonical example.

**Re-implementing the logic in the expected value.** If the code is wrong, the test is wrong in the same way.

```ts
// avoid
const expected = Number(given.join(''));
```

```ts
// prefer: a literal worked out by hand
const expected = 123;
```

**Hidden setup.** A test that depends on state built in a distant `beforeAll` or another test cannot be read or run on its own. Build what the test needs in its own Arrange, using factories.

**Real clocks.** `expect(isExpired(session)).toBe(true)` passes today and fails next year. Inject or freeze the clock and set the session's dates relative to it.

## Pre-submit checklist

Before returning tests, check every item. Fix any "no" before submitting.

- [ ] Each test checks one behavior, and its title says what that behavior is.
- [ ] Each test has `// arrange`, `// act`, `// assert` in order, with one call in Act.
- [ ] `expected` is a hand-written literal, not computed with the unit's logic.
- [ ] Assertions target the public result or one meaningful outgoing call, with precise matchers.
- [ ] No real time, randomness, network, file system or shared mutable state.
- [ ] Tests pass when run alone, in any order, and repeatedly.
- [ ] Only boundaries are mocked; mocks are restored after each test.
- [ ] No loops, conditionals or `try/catch` in test bodies.
- [ ] All data is synthetic: no real PII, exam data, hostnames, IPs or secrets.
- [ ] Success path, boundaries, errors and security-relevant behavior are covered, or gaps are flagged.
- [ ] Style, file layout and helpers match the project's existing conventions.
- [ ] Each test has been run, and you have seen it fail when the behavior is broken.
