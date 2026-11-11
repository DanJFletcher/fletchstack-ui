import type { ComponentType } from 'react';
import { ArrowRightIcon } from '../named/ArrowRightIcon';
import { CheckIcon } from '../named/CheckIcon';
import { ChevronDownIcon } from '../named/ChevronDownIcon';
import { CloseIcon } from '../named/CloseIcon';
import { ExternalLinkIcon } from '../named/ExternalLinkIcon';
import { MoonIcon } from '../named/MoonIcon';
import { PlusIcon } from '../named/PlusIcon';
import { SunIcon } from '../named/SunIcon';
import type { NamedIconProps } from '../Icon';

interface CatalogEntry {
  name: string;
  use: string;
  Artwork: ComponentType<NamedIconProps>;
  keywords: readonly string[];
}

export const catalog: readonly CatalogEntry[] = [
  { name: 'MoonIcon', use: 'Night mode', Artwork: MoonIcon, keywords: ['night', 'dark', 'theme'] },
  { name: 'SunIcon', use: 'Light mode', Artwork: SunIcon, keywords: ['day', 'light', 'theme'] },
  { name: 'CheckIcon', use: 'Success and confirmation', Artwork: CheckIcon, keywords: ['confirm', 'done', 'complete'] },
  { name: 'CloseIcon', use: 'Dismiss or cancel', Artwork: CloseIcon, keywords: ['dismiss', 'cancel', 'remove'] },
  { name: 'ChevronDownIcon', use: 'Expand a section or menu', Artwork: ChevronDownIcon, keywords: ['down', 'expand', 'dropdown'] },
  { name: 'ArrowRightIcon', use: 'Continue or navigate forward', Artwork: ArrowRightIcon, keywords: ['next', 'forward', 'navigate'] },
  { name: 'PlusIcon', use: 'Add or create', Artwork: PlusIcon, keywords: ['add', 'create', 'new'] },
  { name: 'ExternalLinkIcon', use: 'External destination', Artwork: ExternalLinkIcon, keywords: ['external', 'link', 'open'] },
];
