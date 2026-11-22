import { createRef, type ReactElement } from 'react';
import type { RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { Progress } from '../../src/components/progress/Progress';

/**
 * Verify the public completion contract through client rendering and independent SSR hydration.
 **/
export function progressContracts(render: (element: ReactElement) => RenderResult) {
  it('exposes a named measured progressbar', () => {
    // arrange
    // act
    const result = render(<Progress value={33} label="Upload progress" />);

    // assert
    const bar = result.getByRole('progressbar', { name: 'Upload progress' });
    expect(bar).toHaveAttribute('aria-valuenow', '33');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
    expect(bar).toHaveAttribute('aria-valuetext', '33%');
  });
  it('provides a fallback accessible name without visible label text', () => {
    // arrange
    // act
    const result = render(<Progress value={50} />);

    // assert
    expect(result.getByRole('progressbar', { name: 'Progress' })).toBeInTheDocument();
    expect(result.queryByText('50%')).toBeNull();
  });
  for (const [value, expected] of [[-10, '0'], [150, '100'], [0, '0'], [100, '100']] as const) {
    it(`normalizes ${value} to ${expected} measured completion`, () => {
      // arrange
      // act
      const result = render(<Progress value={value} />);

      // assert
      expect(result.getByRole('progressbar')).toHaveAttribute('aria-valuenow', expected);
    });
  }
  for (const value of [undefined, null, NaN, Infinity]) {
    it(`reports ${String(value)} as indeterminate without a numeric value`, () => {
      // arrange
      // act
      const result = render(<Progress value={value} showValue />);

      // assert
      expect(result.getByRole('progressbar')).not.toHaveAttribute('aria-valuenow');
      expect(result.getByRole('progressbar')).toHaveAttribute('aria-valuetext', 'In progress');
      expect(result.getByText('In progress')).toBeInTheDocument();
    });
  }
  for (const max of [0, -10, NaN, Infinity]) {
    it(`uses the default maximum for ${String(max)}`, () => {
      // arrange
      // act
      const result = render(<Progress value={25} max={max} />);

      // assert
      expect(result.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '100');
    });
  }
  it('preserves fractional values on a custom scale', () => {
    // arrange
    // act
    const result = render(<Progress value={2.5} max={8} showValue />);

    // assert
    expect(result.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '2.5');
    expect(result.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '8');
    expect(result.getByText('31%')).toBeInTheDocument();
  });
  it('formats both visual and accessible completion text', () => {
    // arrange
    // act
    const result = render(<Progress value={3} max={8} showValue getValueLabel={(value, max) => `${value} of ${max} files`} />);

    // assert
    expect(result.getByRole('progressbar')).toHaveAttribute('aria-valuetext', '3 of 8 files');
    expect(result.getByText('3 of 8 files')).toBeInTheDocument();
  });
  it('supports localized indeterminate text', () => {
    // arrange
    // act
    const result = render(<Progress value={null} getValueLabel={() => 'Chargement'} />);

    // assert
    expect(result.getByRole('progressbar')).toHaveAttribute('aria-valuetext', 'Chargement');
  });
  it('allows a separate accessible value description', () => {
    // arrange
    // act
    const result = render(<Progress value={50} showValue aria-valuetext="Half the files uploaded" />);

    // assert
    expect(result.getByRole('progressbar')).toHaveAttribute('aria-valuetext', 'Half the files uploaded');
    expect(result.getByText('50%')).toBeInTheDocument();
  });
  it('uses an explicit accessible name instead of visible label text', () => {
    // arrange
    // act
    const result = render(<Progress value={10} label="Upload" aria-label="Project export" />);

    // assert
    expect(result.getByRole('progressbar', { name: 'Project export' })).toBeInTheDocument();
  });
  it('prioritizes an external label relationship', () => {
    // arrange
    // act
    const result = render(<><h2 id="task">Project upload</h2><Progress value={20} label="Upload" aria-label="Ignored" aria-labelledby="task" /></>);

    // assert
    expect(result.getByRole('progressbar', { name: 'Project upload' })).not.toHaveAttribute('aria-label');
  });
  it('associates an external description with the progressbar', () => {
    // arrange
    // act
    const result = render(<><p id="details">Please keep this tab open.</p><Progress value={20} aria-describedby="details" /></>);

    // assert
    expect(result.getByRole('progressbar')).toHaveAccessibleDescription('Please keep this tab open.');
  });
  it('forwards the root ref and native attributes', () => {
    // arrange
    const ref = createRef<HTMLDivElement>();

    // act
    const result = render(<Progress value={20} ref={ref} id="upload" dir="rtl" data-task="upload" />);

    // assert
    expect(ref.current).toBe(result.getByRole('progressbar'));
    expect(ref.current).toHaveAttribute('id', 'upload');
    expect(ref.current).toHaveAttribute('dir', 'rtl');
    expect(ref.current).toHaveAttribute('data-task', 'upload');
  });
  it('preserves local styles and consumer classes', () => {
    // arrange
    // act
    const result = render(<Progress value={20} className="custom" size="small" style={{ '--fs-progress-height': '16px' }} />);

    // assert
    expect(result.getByRole('progressbar')).toHaveClass('custom', 'fs-progress--small');
    expect(result.getByRole('progressbar').style.getPropertyValue('--fs-progress-height')).toBe('16px');
  });
  it('removes hidden progress from the accessibility tree', () => {
    // arrange
    // act
    const result = render(<Progress value={20} hidden />);

    // assert
    expect(result.queryByRole('progressbar')).toBeNull();
  });
  it('reflects consumer updates immediately in its accessible value', () => {
    // arrange
    const result = render(<Progress value={20} />);

    // act
    result.rerender(<Progress value={60} />);

    // assert
    expect(result.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '60');
  });
  it('keeps passive progress out of the normal Tab sequence', async () => {
    // arrange
    const user = userEvent.setup();
    const result = render(<><button>Before</button><Progress value={20} /><button>After</button></>);
    result.getByRole('button', { name: 'Before' }).focus();

    // act
    await user.tab();

    // assert
    expect(result.getByRole('button', { name: 'After' })).toHaveFocus();
  });
  it('forwards consumer handlers without registering task behavior', async () => {
    // arrange
    const user = userEvent.setup();
    const onClick = vi.fn();
    const result = render(<Progress value={20} onClick={onClick} />);

    // act
    await user.click(result.getByRole('progressbar'));

    // assert
    expect(onClick).toHaveBeenCalledTimes(1);
  });
  it('does not impose live announcement semantics', () => {
    // arrange
    // act
    const result = render(<Progress value={20} />);

    // assert
    expect(result.getByRole('progressbar')).not.toHaveAttribute('aria-live');
  });
}
