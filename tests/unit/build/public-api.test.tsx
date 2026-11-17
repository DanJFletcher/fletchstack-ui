import { expect, it } from 'vitest';
import * as library from '../../../src/index';

it('retains the supported public runtime exports', () => {
  // arrange
  const expected = ['Accordion', 'AppContent', 'AppShell', 'ArrowRightIcon', 'AspectRatio', 'Avatar', 'AvatarGroup', 'Badge', 'BottomNavigation', 'Breadcrumbs', 'Button', 'ButtonGroup', 'Callout', 'Card', 'CardContent', 'CardDescription', 'CardFooter', 'CardHeader', 'CardMedia', 'CardTitle', 'CheckIcon', 'Checkbox', 'ChevronDownIcon', 'Chip', 'CloseIcon', 'Cluster', 'CodeBlock', 'Combobox', 'Container', 'ExternalLinkIcon', 'Field', 'FieldDescription', 'FieldError', 'FieldLabel', 'FormGroup', 'Heading', 'HelpIcon', 'HomeIcon', 'Icon', 'InboxIcon', 'Link', 'Menu', 'MoonIcon', 'MultiSelect', 'Navbar', 'PlusIcon', 'Radio', 'Rating', 'Section', 'Select', 'Separator', 'SimpleGrid', 'Spinner', 'Stack', 'SunIcon', 'Switch', 'Table', 'Tabs', 'Text', 'TextInput', 'Textarea', 'createTableColumn'];

  // act
  const result = Object.keys(library).sort();

  // assert
  expect(result).toEqual(expected);
});
