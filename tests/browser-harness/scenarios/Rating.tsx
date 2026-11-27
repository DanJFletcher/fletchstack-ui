import { Rating, type RatingProps } from '../../../src/components/rating/Rating';
import {
  ControlledRating,
  RatingExample,
  RatingForm,
} from '../../../src/components/rating/stories/rating-examples';
import type { Scenario } from '../gallery/types';
import '../../../src/components/rating/rating.css';
import '../../../src/components/icon/icon.css';
import '../../../src/components/field/field.css';
import '../../../src/components/rating/stories/rating.stories.css';

const Playground: Scenario<RatingProps> = {};
const Composition: Scenario<RatingProps> = { render: () => <RatingExample /> };
const Input: Scenario<RatingProps> = { render: () => <RatingForm step={1} /> };
const HalfStepInput: Scenario<RatingProps> = { render: () => <RatingForm /> };
const Controlled: Scenario<RatingProps> = { render: () => <ControlledRating /> };
const Narrow: Scenario<RatingProps> = {
  render: () => (
    <Rating mode="input" label="Detailed rating" max={10} step={0.5} defaultValue={6.5} showValue />
  ),
};
const Required: Scenario<RatingProps> = {
  render: () => (
    <form>
      <Rating
        mode="input"
        name="required"
        label="Required rating"
        required
        description="Choose one score."
        error="Choose a rating."
      />
      <button>Submit</button>
    </form>
  ),
};
const Instances: Scenario<RatingProps> = {
  render: () => (
    <>
      <Rating mode="input" label="First" defaultValue={2} />
      <Rating mode="input" label="Second" defaultValue={4} />
    </>
  ),
};
export const component = Rating;
export const defaults: RatingProps = { value: 4.5, showValue: true };
export const scenarios = {
  Playground,
  Composition,
  Input,
  HalfStepInput,
  Controlled,
  Narrow,
  Required,
  Instances,
};
