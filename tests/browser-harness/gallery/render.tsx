import { Component, useLayoutEffect, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';

interface CommitProps {
  children: ReactNode;
  resolve: () => void;
  reject: (error: Error) => void;
}

/**
 * Reject render failures instead of leaving a mount promise waiting indefinitely.
 **/
class RenderBoundary extends Component<CommitProps, { failed: boolean }> {
  override state = { failed: false };

  /**
   * Remove a failed tree without trying to render it again.
   **/
  static getDerivedStateFromError() {
    return { failed: true };
  }

  /**
   * Forward React's caught error to the awaiting Playwright mount.
   **/
  override componentDidCatch(error: Error) {
    this.props.reject(error);
  }

  /**
   * Expose children only while the render remains healthy.
   **/
  override render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * A layout effect confirms the requested tree has committed before interaction.
 **/
function Committed({ children, resolve }: CommitProps) {
  useLayoutEffect(resolve);
  return children;
}

let root: Root | undefined;

/**
 * Render a scenario and resolve on commit; failed renders reject the caller.
 **/
export async function renderScenario(children: ReactNode, key: string) {
  root ??= createRoot(document.getElementById('root')!);
  await new Promise<void>((resolve, reject) => {
    const callbacks = { resolve, reject };
    root!.render(
      <RenderBoundary key={key} {...callbacks}>
        <Committed {...callbacks}>{children}</Committed>
      </RenderBoundary>,
    );
  });
}

/**
 * Dispose React effects and state when Playwright explicitly unmounts a scenario.
 **/
export async function unmountScenario() {
  root?.unmount();
  root = undefined;
}
