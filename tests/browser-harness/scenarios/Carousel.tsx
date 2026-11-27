import {
  CarouselDemo,
  CarouselExample,
  CarouselOverrides,
  ControlledCarousel,
  ManySlides,
  ReservedCarousel,
} from '../../../src/components/carousel/stories/carousel-examples';
import type { CarouselProps } from '../../../src/components/carousel/types';
import type { Scenario } from '../gallery/types';
import '../../../src/components/carousel/carousel.css';
import '../../../src/components/icon/icon.css';
import '../../../src/components/carousel/stories/carousel.stories.css';

const Playground: Scenario<Partial<CarouselProps>> = {};
const Composition = { render: () => <CarouselExample /> };
const Controlled = { render: () => <ControlledCarousel /> };
const Many: Scenario<Partial<CarouselProps>> = { render: (args) => <ManySlides {...args} /> };
const Reserved = { render: () => <ReservedCarousel /> };
const Overrides = { render: () => <CarouselOverrides /> };
export const component = CarouselDemo;
export const defaults = {};
export const scenarios = { Playground, Composition, Controlled, Many, Reserved, Overrides };
