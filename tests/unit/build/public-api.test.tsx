import { expect, it } from 'vitest';
import * as library from '../../../src/index';

it('retains the supported public runtime exports', () => {
  // arrange
  const expected = ['Accordion', 'AppContent', 'AppShell', 'ArrowRightIcon', 'AspectRatio', 'Avatar', 'AvatarGroup', 'Badge', 'BottomNavigation', 'BounceCards', 'Breadcrumbs', 'Button', 'ButtonGroup', 'Callout', 'Card', 'CardContent', 'CardDescription', 'CardFooter', 'CardHeader', 'CardMedia', 'CardTitle', 'Carousel', 'CheckIcon', 'Checkbox', 'ChevronDownIcon', 'Chip', 'CloseIcon', 'Cluster', 'CodeBlock', 'Combobox', 'Container', 'DataTable', 'Dialog', 'ExternalLinkIcon', 'Field', 'FieldDescription', 'FieldError', 'FieldLabel', 'FormGroup', 'Heading', 'HelpIcon', 'HomeIcon', 'Icon', 'InboxIcon', 'Item', 'ItemActions', 'ItemContent', 'ItemDescription', 'ItemFooter', 'ItemGroup', 'ItemHeader', 'ItemMedia', 'ItemSeparator', 'ItemTitle', 'Kbd', 'KbdGroup', 'Link', 'Menu', 'MoonIcon', 'MultiSelect', 'Navbar', 'PlusIcon', 'Popover', 'Radio', 'Rating', 'Section', 'Select', 'Separator', 'SimpleGrid', 'Spinner', 'Stack', 'SunIcon', 'Switch', 'Table', 'Tabs', 'Text', 'TextInput', 'Textarea', 'Tooltip', 'createTableColumn'];

  // act
  const result = Object.keys(library).sort();

  // assert
  expect(result).toEqual(expected);
});
