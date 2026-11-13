import { expect, it } from 'vitest';
import * as library from '../../../src/index';

it('retains the supported public runtime exports', () => {
  // arrange
  const expected = ['Accordion', 'ArrowRightIcon', 'AspectRatio', 'Avatar', 'AvatarGroup', 'Badge', 'Button', 'ButtonGroup', 'Callout', 'Card', 'CardContent', 'CardDescription', 'CardFooter', 'CardHeader', 'CardMedia', 'CardTitle', 'CheckIcon', 'Checkbox', 'ChevronDownIcon', 'Chip', 'CloseIcon', 'Cluster', 'CodeBlock', 'Combobox', 'Container', 'ExternalLinkIcon', 'Field', 'FieldDescription', 'FieldError', 'FieldLabel', 'FormGroup', 'Heading', 'Icon', 'Link', 'Menu', 'MoonIcon', 'MultiSelect', 'PlusIcon', 'Radio', 'Rating', 'Section', 'Select', 'Separator', 'SimpleGrid', 'Spinner', 'Stack', 'SunIcon', 'Switch', 'Table', 'Text', 'TextInput', 'Textarea', 'createTableColumn'];

  // act
  const result = Object.keys(library).sort();

  // assert
  expect(result).toEqual(expected);
});
