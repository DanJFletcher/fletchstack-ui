import { expect, it } from 'vitest';
import * as library from '../../../src/index';

it('retains the supported public runtime exports', () => {
  // arrange
  const expected = ['ArrowRightIcon', 'AspectRatio', 'Avatar', 'AvatarGroup', 'Badge', 'Button', 'ButtonGroup', 'Card', 'CardContent', 'CardDescription', 'CardFooter', 'CardHeader', 'CardMedia', 'CardTitle', 'CheckIcon', 'Checkbox', 'ChevronDownIcon', 'Chip', 'CloseIcon', 'Cluster', 'CodeBlock', 'Container', 'ExternalLinkIcon', 'Field', 'FieldDescription', 'FieldError', 'FieldLabel', 'FormGroup', 'Heading', 'Icon', 'Link', 'MoonIcon', 'MultiSelect', 'PlusIcon', 'Radio', 'Section', 'Select', 'Separator', 'SimpleGrid', 'Spinner', 'Stack', 'SunIcon', 'Switch', 'Text', 'TextInput', 'Textarea'];

  // act
  const result = Object.keys(library).sort();

  // assert
  expect(result).toEqual(expected);
});
