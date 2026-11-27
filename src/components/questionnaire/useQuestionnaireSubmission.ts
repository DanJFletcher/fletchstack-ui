import type { QuestionnaireSubmission } from './model.js';
import { useEffect, useRef, useState } from 'react';
import type { QuestionnaireAnswers, QuestionnaireProps } from './types.js';

/**
 * Serialize saves before invoking application code and discard completion updates after unmount.
 **/
export function useQuestionnaireSubmission(
  onSubmit: QuestionnaireProps['onSubmit'],
): QuestionnaireSubmission {
  const running = useRef(false);
  const generation = useRef(0);
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(
    () => () => {
      generation.current += 1;
    },
    [],
  );
  /**
   * Preserve drafts on synchronous throws or rejected saves and allow a later explicit retry.
   **/
  const run = async (answers: QuestionnaireAnswers) => {
    running.current = true;
    const token = ++generation.current;
    setPending(true);
    setFailed(false);
    try {
      await onSubmit(answers);
    } catch {
      if (generation.current === token) {
        setFailed(true);
      }
    } finally {
      if (generation.current === token) {
        running.current = false;
        setPending(false);
      }
    }
  };

  return { running, pending, failed, run, clearFailure: () => setFailed(false) };
}
