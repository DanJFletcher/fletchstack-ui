import { expect, it } from 'vitest';
import * as library from '../../../src/index';

it('retains the supported public runtime exports', () => {
  // arrange
  const expected = ['ArrowRightIcon', 'AspectRatio', 'Badge', 'Button', 'ButtonGroup', 'Card', 'CardContent', 'CardDescription', 'CardFooter', 'CardHeader', 'CardMedia', 'CardTitle', 'CheckIcon', 'Checkbox', 'ChevronDownIcon', 'CloseIcon', 'Cluster', 'Container', 'ExternalLinkIcon', 'Field', 'FieldDescription', 'FieldError', 'FieldLabel', 'FormGroup', 'Heading', 'Icon', 'Link', 'MoonIcon', 'PlusIcon', 'Radio', 'Section', 'Select', 'Separator', 'SimpleGrid', 'Spinner', 'Stack', 'SunIcon', 'Switch', 'Text', 'TextInput', 'Textarea'];

  // act
  const result = Object.keys(library).sort();

  // assert
  expect(result).toEqual(expected);
});
