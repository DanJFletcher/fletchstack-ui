import { expect, test } from '../fixtures/test';
import baseline from '../../fixtures/component-organization-baseline.json' with { type: 'json' };
import { openStory } from '../fixtures/storybook';

test('legacy story and documentation IDs retain their corresponding examples', async ({ request, page }) => {
  await openStory(page, 'components-textarea--both-themes');
  const response = await request.get('/index.json');
  const index = await response.json();

  for (const story of baseline.stories) {
    const entry = index.entries[story.id];
    expect(entry, story.id).toBeDefined();
    expect(entry).toMatchObject({ id: story.id, name: story.name, type: story.type });
    expect(entry.title.split('/').at(-1)).toBe(story.title.split('/').at(-1));
  }
});

test('the manager groups public components by function and retains example order', async ({ page, request }) => {
  await page.goto('/?path=/story/components-textarea--both-themes');
  const navigation = page.getByRole('navigation', { name: 'Stories' });
  const preview = page.frameLocator('#storybook-preview-iframe');
  await expect(preview.getByRole('textbox').first()).toBeVisible();
  await expect(navigation.getByRole('button', { name: 'Forms', exact: true })).toBeVisible();
  await expect(navigation.getByRole('button', { name: 'Actions', exact: true })).toBeVisible();
  await expect(navigation.getByRole('button', { name: 'Surfaces', exact: true })).toBeVisible();
  await expect(navigation.getByRole('button', { name: 'Visuals', exact: true })).toBeVisible();
  const links = await navigation.getByRole('link').allTextContents();
  expect(links.indexOf('Playground')).toBeLessThan(links.indexOf('Both Themes'));
  const index = await (await request.get('/index.json')).json();
  expect(index.entries['components-button--playground'].title).toBe('Components/Actions/Button');
  expect(index.entries['components-textarea--both-themes'].title).toBe('Components/Forms/Textarea');
  expect(index.entries['components-card--reference-layouts'].title).toBe('Components/Surfaces/Card');
  expect(index.entries['components-icon--gallery'].title).toBe('Components/Visuals/Icon');
});

test('the Forms guide opens canonical compositions in the manager preview', async ({ page }) => {
  const preview = page.frameLocator('#storybook-preview-iframe');
  await page.goto('/?path=/docs/patterns-forms--docs');
  await preview.getByRole('link', { name: 'Explore related controls in FormGroup →' }).click();
  await expect(page).toHaveURL(/path=\/story\/components-formgroup--composition/);
  await expect(preview.getByRole('group', { name: 'Contact details' })).toBeVisible();
  await page.goto('/?path=/docs/patterns-forms--docs');
  await preview.getByRole('link', { name: 'Explore native form submission and reset →' }).click();
  await expect(page).toHaveURL(/path=\/story\/components-textarea--native-form/);
  await expect(preview.getByRole('button', { name: 'Save', exact: true })).toBeVisible();
});

for (const story of baseline.stories.filter(entry => entry.type === 'docs')) {
  test(`legacy documentation ${story.id} renders its owning guidance`, async ({ page }) => {
    await page.goto(`/?path=/docs/${story.id}`);
    const preview = page.frameLocator('#storybook-preview-iframe');
    await expect(preview.getByRole('heading', { level: 1 }).first()).toBeVisible();
    await expect(page).toHaveURL(new RegExp(`path=/docs/${story.id}`));
  });
}

test('Card documents every compound part with its parent', async ({ page }) => {
  await page.goto('/?path=/docs/components-card--docs');
  const preview = page.frameLocator('#storybook-preview-iframe');
  for (const name of ['CardHeader', 'CardContent', 'CardFooter', 'CardMedia', 'CardTitle', 'CardDescription']) {
    await preview.getByRole('tab', { name, exact: true }).click();
    await expect(preview.getByRole('table').first()).toContainText('style');
  }
});

test('Textarea documentation presents standard examples before specialized guidance', async ({ page }) => {
  await page.goto('/?path=/docs/components-textarea--docs');
  const preview = page.frameLocator('#storybook-preview-iframe');
  await expect(preview.getByRole('heading', { name: 'Textarea', exact: true })).toBeVisible();
  await expect(preview.getByRole('heading', { name: /Length Guidance$/ })).toBeVisible();
  const headings = await preview.getByRole('heading').allTextContents();
  expect(headings.indexOf('Playground')).toBeLessThan(headings.indexOf('States'));
  expect(headings.indexOf('States')).toBeLessThan(headings.indexOf('Customization'));
  expect(headings.indexOf('Customization')).toBeLessThan(headings.indexOf('Both Themes'));
  expect(headings.indexOf('Both Themes')).toBeLessThan(headings.indexOf('Length Guidance'));
});
