import { useEffect, type RefObject } from 'react';

/**
 * Wait only for the dialog's own visual exit, keeping native modality until completion.
 * Reopening or unmounting cancels this pending close; cancelled animations settle immediately.
 **/
function closeAfterMotion(dialog: HTMLDialogElement): () => void {
  dialog.dataset['state'] = 'closing';
  const animations = dialog.getAnimations();
  let cancelled = false;
  if (!animations.length) {
    dialog.close();
  } else {
    void Promise.allSettled(animations.map((animation) => animation.finished)).then(() => {
      if (!cancelled) {
        dialog.close();
      }
    });
  }

  return () => {
    cancelled = true;
  };
}

/**
 * Open in the top layer after hydration and reconcile controlled state with native modality.
 **/
export function useDialogModal(
  ref: RefObject<HTMLDialogElement | null>,
  open: boolean,
  motion: string,
): void {
  useEffect(() => {
    const dialog = ref.current!;
    if (open) {
      dialog.dataset['state'] = 'open';
      if (!dialog.open) {
        dialog.showModal();
      }
    } else if (dialog.open) {
      return closeAfterMotion(dialog);
    }
    return undefined;
  }, [ref, open, motion]);
}
