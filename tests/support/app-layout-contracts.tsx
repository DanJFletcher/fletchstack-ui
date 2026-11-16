import { createRef, type ReactElement } from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { AppShell } from '../../src/components/app-shell/AppShell';
import { AppContent } from '../../src/components/app-content/AppContent';

/**
 * Exercise native layout attributes and both sizing/semantic variants.
 **/
export function appLayoutContracts(render: (element: ReactElement) => unknown) {
  it('defaults to viewport sizing and a main landmark', () => {
    // arrange
    const given = <AppShell data-testid="shell"><AppContent>Page</AppContent></AppShell>;

    // act
    render(given);

    // assert
    expect(screen.getByTestId('shell')).toHaveClass('fs-app-shell--viewport');
    expect(screen.getByRole('main')).toHaveTextContent('Page');
  });

  it('forwards layout refs and native styling', () => {
    // arrange
    const shell = createRef<HTMLDivElement>(), content = createRef<HTMLElement>();
    const given = <AppShell ref={shell} height="parent" data-testid="shell" id="app" className="custom-shell" style={{ '--fs-surface': 'navy' }}><AppContent as="div" ref={content} data-testid="content" id="page" className="custom-content" style={{ padding: 12 }}>Content</AppContent></AppShell>;

    // act
    render(given);

    // assert
    expect(shell.current).toBe(screen.getByTestId('shell'));
    expect(shell.current).toHaveClass('custom-shell', 'fs-app-shell--parent');
    expect(shell.current).toHaveAttribute('id', 'app');
    expect(shell.current?.style.getPropertyValue('--fs-surface')).toBe('navy');
    expect(content.current).toBe(screen.getByTestId('content'));
    expect(content.current).toHaveClass('custom-content');
    expect(content.current).toHaveAttribute('id', 'page');
    expect(content.current).toHaveStyle({ padding: '12px' });
    expect(screen.queryByRole('main')).not.toBeInTheDocument();
  });

  it('forwards consumer native events through content and shell', async () => {
    // arrange
    const user = userEvent.setup(), shellClick = vi.fn(), contentClick = vi.fn();
    render(<AppShell onClick={shellClick}><AppContent onClick={contentClick}><button>Open</button></AppContent></AppShell>);

    // act
    await user.click(screen.getByRole('button', { name: 'Open' }));

    // assert
    expect(contentClick).toHaveBeenCalledOnce();
    expect(shellClick).toHaveBeenCalledOnce();
  });
}
