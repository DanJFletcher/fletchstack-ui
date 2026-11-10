import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it } from 'vitest';
import { Button, Container, FormGroup, Select, Stack, TextInput } from '../../../src/index';

it('renders a composed consumer form through the public entrypoint', () => {
  // arrange
  const given = <Container><Stack><FormGroup legend="Project"><TextInput label="Name" defaultValue="Example" /><Select label="Workspace" defaultValue="personal"><option value="personal">Personal</option></Select><Button type="submit">Save</Button></FormGroup></Stack></Container>;

  // act
  const result = renderToStaticMarkup(given);

  // assert
  expect(result).toContain('<legend');
  expect(result).toContain('value="Example"');
  expect(result).toContain('selected=""');
  expect(result).toContain('type="submit"');
});
