# Dialog

A controlled, native modal for a focused task in the current view. Dialog renders a native `<dialog>` and calls `showModal()` after hydration. The browser owns the top layer, focus containment, inert background and focus restoration. No portal or routing dependency is required; theme tokens inherit from its original DOM ancestry.

```tsx
import { useState } from 'react';
import { Button, Dialog } from 'fletchstack-ui';
import 'fletchstack-ui/styles.css';

function ReviewChanges() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Review changes</Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        heading="Confirm the changes?"
        description="Review this action before continuing."
        footer={<Button onClick={() => setOpen(false)}>Confirm</Button>}
      >
        Your draft changes are ready to save.
      </Dialog>
    </>
  );
}
```

## Public API

| Prop                 | Type                    | Default                                    |
| -------------------- | ----------------------- | ------------------------------------------ |
| open                 | boolean                 | required; parent owns state                |
| onOpenChange         | (open: boolean) => void | required; dismissal requests false         |
| heading              | ReactNode               | omitted                                    |
| headingLevel         | 1 through 6             | 2                                          |
| description          | ReactNode               | omitted; associated using aria-describedby |
| children / footer    | ReactNode               | omitted                                    |
| size                 | 'sm', 'md', 'lg'        | 'md' (400/512/720px maximum widths)        |
| motion               | 'fade', 'slide', 'none' | 'fade'                                     |
| closeOnEscape        | boolean                 | true                                       |
| closeOnBackdropClick | boolean                 | true                                       |
| showCloseButton      | boolean                 | true                                       |
| closeLabel           | string                  | 'Close dialog'                             |
| ref                  | Ref<HTMLDialogElement>  | native element                             |
| style                | DialogStyle             | CSSProperties plus scoped --fs-* tokens    |

Exports: Dialog, DialogProps and DialogStyle. Native dialog attributes, className and event handlers are forwarded. Give every dialog a name through heading, aria-label or aria-labelledby. Explicit naming takes precedence over the generated heading association. Caller-provided aria-describedby is combined with description. Omitted slots leave no empty container. Keep body content structurally meaningful; omit description for complex content that should be explored in reading order.

## State, focus and dismissal

The consumer owns its trigger, actions and open state. The close button and Escape request `onOpenChange(false)`; the dialog stays modal until the parent accepts. A consumer onCancel can call preventDefault to veto Escape. Backdrop clicks dismiss by default. Set closeOnBackdropClick to false to disable this. Dismissal requires a pointer gesture that begins and ends outside the panel; clicking panel padding or dragging from inside does not dismiss. onClick can prevent default to veto backdrop dismissal. Custom actions do not close automatically.

Native `form method="dialog"` and ref.close() close immediately and notify the parent once. Respond by setting open false. A prop-driven close does not emit a second request. Native focus goes to the browser's initial dialog target (the close button by default); use an autofocus content control when appropriate. Tab/Shift+Tab stay within the modal. Escape restores focus to the invoking control once close completes. Supply a logical alternative focus destination if your application removes that trigger.

Dialog is modal-only. Server output is closed, including when open is initially true; hydration opens it modally rather than exposing a nonmodal open attribute. Body content stays mounted on close, so React state persists and effects can continue. The document scroll is locked while a library dialog is modal; long content scrolls inside the body, keeping the header/actions available. At extreme text enlargement, oversized header/footer content also scrolls within bounded regions so neither can push the other controls outside the viewport.

## Motion, themes and styles

Fade and slide use shared standard duration and enter/exit easing. Native modality remains active during the brief exit, then focus and background access restore together. `motion="none"` and live reduced-motion preferences complete immediately. Reopening cancels a pending exit. Native close methods bypass exit motion.

Corporate/Luna and nested themes provide the surface, text, border, backdrop, radius, padding, gap, viewport inset, widths and slide distance through `--fs-dialog-*`. Override one instance with `style={{ '--fs-dialog-radius': '24px' }}`; neighboring instances remain unchanged. Focus uses existing Button/field/link tokens. Import tokens.css, button.css, icon.css and dialog.css (plus CSS for composed controls), or styles.css. The reference inspiration is [the Dialog Storybook](https://themed-react-ui-foundation.replit.app/?path=/docs/components-dialog--docs).

## Storybook documentation

The Docs page keeps every embedded dialog closed until its trigger is activated. Initially Open and Initially Open Luna remain separate stories for inspecting initial modal behavior; they are excluded from inline autodocs to avoid opening stacked modals when documentation loads.
