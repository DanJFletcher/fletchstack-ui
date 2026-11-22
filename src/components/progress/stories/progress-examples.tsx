import { useId, useState } from 'react';
import { Progress } from '../Progress';
import { Button } from '../../button/Button';

/**
 * Share the same upload progress and pending task in two independent theme regions.
 **/
export function ProgressExample() {
  return <div className="stack">{(['corporate', 'luna'] as const).map(theme => <section key={theme} className="theme-panel stack" data-theme={theme} aria-label={`${theme} progress`}><h2>{theme === 'corporate' ? 'Corporate' : 'Luna'}</h2><Progress value={56} label="Upload progress" showValue /><Progress value={null} label="Preparing files" showValue /></section>)}</div>;
}

/**
 * Let native controls own measured task updates rather than simulating progress with a timer.
 **/
export function ProgressControlled() {
  const [value, setValue] = useState(40);
  const id = useId();

  return <div className="stack"><Progress value={value} label="Upload progress" showValue /><label htmlFor={id}>Upload percentage</label><input id={id} type="range" min={0} max={100} value={value} onChange={event => setValue(Number(event.currentTarget.value))} /><div className="actions"><Button onClick={() => setValue(current => Math.min(100, current + 10))}>Advance upload</Button><Button variant="secondary" onClick={() => setValue(0)}>Reset upload</Button></div></div>;
}

/**
 * Compare the bar's three thicknesses without changing the task's meaning.
 **/
export function ProgressSizes() {
  return <div className="stack">{(['small', 'medium', 'large'] as const).map(size => <Progress key={size} value={60} size={size} label={`${size} progress`} showValue />)}</div>;
}

/**
 * Keep overrides local while the adjacent progress indicator retains theme defaults.
 **/
export function ProgressOverrides() {
  return <div className="stack"><Progress value={60} label="Custom progress" style={{ '--fs-progress-height': '16px', '--fs-progress-radius': '0px' }} /><Progress value={60} label="Default progress" /></div>;
}
