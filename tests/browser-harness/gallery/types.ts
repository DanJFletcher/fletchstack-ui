import type { ComponentType, ReactNode } from 'react';

export interface Scenario<Props> {
  args?: Partial<Props>;
  render?: (props: Props) => ReactNode;
  theme?: 'corporate' | 'luna';
}

export interface ScenarioModule {
  component: ComponentType<Record<string, unknown>>;
  defaults: Record<string, unknown>;
  scenarios: Record<string, Scenario<Record<string, unknown>>>;
}

export interface MountRequest {
  story: string;
  props?: Record<string, unknown>;
}

declare global {
  interface Window {
    mount: (request: MountRequest) => Promise<void>;
    unmount: () => Promise<void>;
  }
}
