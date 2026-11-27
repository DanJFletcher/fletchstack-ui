import { Toast, type ToastProps } from '../../../src/components/toast/Toast';
import {
  ControlledToast,
  PositionedToast,
  NarrowToast,
  TimedToast,
  ToastExample,
  ToastOverrides,
  ToastQueue,
  ToastTones,
} from '../../../src/components/toast/stories/toast-examples';
import type { Scenario } from '../gallery/types';
import '../../../src/components/toast/toast.css';
import '../../../src/components/icon/icon.css';
import '../../../src/components/button/button.css';
const Playground: Scenario<ToastProps> = {};
const Composition: Scenario<ToastProps> = { render: () => <ToastExample /> };
const Controlled: Scenario<ToastProps> = { render: () => <ControlledToast /> };
const Timed: Scenario<ToastProps> = { render: () => <TimedToast /> };
const InteractiveQueue: Scenario<ToastProps> = { render: () => <ToastQueue /> };
const Narrow: Scenario<ToastProps> = { render: () => <NarrowToast /> };
const ScopedOverrides: Scenario<ToastProps> = { render: () => <ToastOverrides /> };
const Tones: Scenario<ToastProps> = { render: () => <ToastTones /> };
const Positions: Scenario<ToastProps> = { render: () => <PositionedToast /> };
const PositionedStack: Scenario<ToastProps> = { render: () => <PositionedToast stacked /> };
export const component = Toast;
export const defaults: ToastProps = {
  title: 'Changes saved',
  children: 'Your team can see the latest version.',
};
export const scenarios = {
  Playground,
  Composition,
  Controlled,
  Timed,
  InteractiveQueue,
  Narrow,
  ScopedOverrides,
  Tones,
  Positions,
  PositionedStack,
};
