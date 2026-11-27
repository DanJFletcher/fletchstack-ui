import { useRef, useState } from 'react';
import { Questionnaire } from '../Questionnaire';
import type { QuestionnaireAnswers } from '../types';
import { Button } from '../../button/Button';
import { planningDraft, planningItems } from './planning-items';

/**
 * Keep receipts and the success destination application-owned while showing the complete reference flow.
 **/
export function QuestionnaireExample() {
  const [saved, setSaved] = useState<QuestionnaireAnswers>();

  return (
    <div className="stack">
      <Questionnaire
        aria-label="Plan the next feature"
        items={planningItems}
        shortcuts="letters"
        labels={{ submit: 'Save plan', submitting: 'Saving plan...' }}
        onSubmit={(answers) => setSaved(answers)}
      />
      {saved && <p role="status">Plan saved.</p>}
    </div>
  );
}

/**
 * Recreate three reference checkpoints with consumer-supplied defaults; the active theme supplies all paint.
 **/
export function QuestionnaireComposition() {
  return (
    <div className="questionnaire-demo-grid">
      {planningItems.map((item) => (
        <Questionnaire
          key={item.id}
          aria-label={`Planning checkpoint ${item.id}`}
          items={planningItems}
          defaultValue={item.id}
          defaultAnswers={planningDraft}
          shortcuts="letters"
          labels={{ submit: 'Save plan', submitting: 'Saving plan...' }}
          onSubmit={() => {}}
        />
      ))}
    </div>
  );
}

/**
 * Demonstrate independently controlled answers and navigation using the same public data contract.
 **/
export function QuestionnaireControlled() {
  const [answers, setAnswers] = useState<QuestionnaireAnswers>({});
  const [value, setValue] = useState('feature');

  return (
    <Questionnaire
      aria-label="Controlled planning"
      items={planningItems}
      answers={answers}
      onAnswersChange={setAnswers}
      value={value}
      onValueChange={setValue}
      labels={{ submit: 'Save plan' }}
      onSubmit={() => {}}
    />
  );
}

/**
 * Resume a saved checkpoint and expose the native reset method through a forwarded form reference.
 **/
export function QuestionnaireResume() {
  const form = useRef<HTMLFormElement>(null);

  return (
    <div className="stack">
      <Questionnaire
        ref={form}
        aria-label="Saved draft"
        items={planningItems}
        defaultValue="updates"
        defaultAnswers={planningDraft}
        labels={{ submit: 'Save plan' }}
        onSubmit={() => {}}
      />
      <Button variant="secondary" onClick={() => form.current!.reset()}>
        Reset draft
      </Button>
    </div>
  );
}

/**
 * Hold a local promise open so pending locks, rejection and successful retry can be inspected without transport.
 **/
export function QuestionnairePending() {
  const operation = useRef<{ resolve: () => void; reject: () => void } | null>(null);
  const [waiting, setWaiting] = useState(false);
  const [saved, setSaved] = useState(false);
  /**
   * Resolve or reject the current local persistence attempt explicitly from the consumer fixture.
   **/
  function finish(failed: boolean) {
    if (failed) {
      operation.current!.reject();
    } else {
      operation.current!.resolve();
      setSaved(true);
    }
    setWaiting(false);
  }

  return (
    <div className="stack">
      <Questionnaire
        aria-label="Pending planning"
        items={planningItems}
        defaultValue="timing"
        defaultAnswers={planningDraft}
        labels={{ submit: 'Save plan', submitting: 'Saving plan...' }}
        onSubmit={() =>
          new Promise<void>((resolve, reject) => {
            operation.current = {
              resolve,
              reject: () => reject(new Error('Private persistence detail')),
            };
            setWaiting(true);
          })
        }
      />
      <div className="actions">
        <Button disabled={!waiting} onClick={() => finish(false)}>
          Resolve save
        </Button>
        <Button disabled={!waiting} variant="secondary" onClick={() => finish(true)}>
          Reject save
        </Button>
      </div>
      {saved && <p role="status">Plan saved.</p>}
    </div>
  );
}

/**
 * Demonstrate a rejected local save without losing answers, followed by a successful explicit retry.
 **/
export function QuestionnaireRetry() {
  const attempts = useRef(0);
  const [saved, setSaved] = useState(false);

  return (
    <div className="stack">
      <Questionnaire
        aria-label="Retry planning"
        items={planningItems}
        defaultValue="timing"
        defaultAnswers={planningDraft}
        labels={{ submit: 'Save plan' }}
        onSubmit={async () => {
          if (attempts.current++ === 0) {
            throw new Error('Private server detail');
          }
          setSaved(true);
        }}
      />
      {saved && <p role="status">Plan saved.</p>}
    </div>
  );
}
