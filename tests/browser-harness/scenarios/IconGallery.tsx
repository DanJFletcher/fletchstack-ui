import { IconGallery } from '../../../src/components/icon/stories/icon-gallery';
import type { Scenario } from '../gallery/types';
import '../../../src/components/icon/icon.css';
import '../../../src/components/icon/stories/icon-gallery.css';

const Gallery: Scenario<Record<string, never>> = { render: () => <IconGallery /> };

export const component = IconGallery;
export const defaults = {};
export const scenarios = { Gallery };
