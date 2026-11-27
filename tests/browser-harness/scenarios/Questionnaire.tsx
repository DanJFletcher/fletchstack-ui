import { Questionnaire } from '../../../src/components/questionnaire/Questionnaire';
import type { QuestionnaireProps } from '../../../src/components/questionnaire/types';
import {
  QuestionnaireComposition,
  QuestionnaireControlled,
  QuestionnaireExample,
  QuestionnairePending,
  QuestionnaireResume,
  QuestionnaireRetry,
} from '../../../src/components/questionnaire/stories/questionnaire-examples';
import {
  feedbackItems,
  planningItems,
  shortcutItems,
} from '../../../src/components/questionnaire/stories/planning-items';
import type { Scenario } from '../gallery/types';
import '../../../src/components/questionnaire/questionnaire.css';
import '../../../src/components/questionnaire/stories/questionnaire.stories.css';
import '../../../src/components/field/field.css';
import '../../../src/components/radio/radio.css';
import '../../../src/components/checkbox/checkbox.css';
import '../../../src/components/text-input/text-input.css';
import '../../../src/components/textarea/textarea.css';
import '../../../src/components/button/button.css';
import '../../../src/components/kbd/kbd.css';
import '../../../src/components/icon/icon.css';
const Playground: Scenario<QuestionnaireProps> = {};
const Composition: Scenario<QuestionnaireProps> = { render: () => <QuestionnaireComposition /> };
const Interactive: Scenario<QuestionnaireProps> = { render: () => <QuestionnaireExample /> };
const Controlled: Scenario<QuestionnaireProps> = { render: () => <QuestionnaireControlled /> };
const Pending: Scenario<QuestionnaireProps> = { render: () => <QuestionnairePending /> };
const Retry: Scenario<QuestionnaireProps> = { render: () => <QuestionnaireRetry /> };
const Resume: Scenario<QuestionnaireProps> = { render: () => <QuestionnaireResume /> };
const Text: Scenario<QuestionnaireProps> = { args: { items: feedbackItems } };
const Shortcuts: Scenario<QuestionnaireProps> = {
  args: { items: shortcutItems, shortcuts: 'letters' },
};
export const component = Questionnaire;
export const defaults: QuestionnaireProps = { items: planningItems, onSubmit: () => {} };
export const scenarios = {
  Playground,
  Composition,
  Interactive,
  Controlled,
  Pending,
  Retry,
  Resume,
  Text,
  Shortcuts,
};
