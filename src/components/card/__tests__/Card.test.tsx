// @vitest-environment jsdom
import '../../../../tests/support/dom';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter,
} from '../Card';
import { Button } from '../../button/Button';

describe('Card', () => {
  it('exposes a consumer-named article with composed content', () => {
    // arrange
    const given = (
      <Card as="article" aria-labelledby="title">
        <CardContent>
          <CardTitle id="title">Collection</CardTitle>
          <CardDescription>Shared components</CardDescription>
        </CardContent>
      </Card>
    );

    // act
    render(given);

    // assert
    expect(screen.getByRole('article', { name: 'Collection' })).toHaveTextContent(
      'Shared components',
    );
  });

  it('supports the heading level required by the surrounding document', () => {
    // arrange
    const given = <CardTitle as="h3">Collection</CardTitle>;

    // act
    render(given);

    // assert
    expect(screen.getByRole('heading', { level: 3 })).toHaveAccessibleName('Collection');
  });

  it('keeps actions in its footer accessible', () => {
    // arrange
    const given = (
      <Card>
        <CardFooter divided>
          <Button>Save collection</Button>
        </CardFooter>
      </Card>
    );

    // act
    render(given);

    // assert
    expect(screen.getByRole('button', { name: 'Save collection' })).toBeEnabled();
  });

  it('forwards its native ref', () => {
    // arrange
    const ref = createRef<HTMLElement>();
    const given = <Card as="section" aria-label="Collection" ref={ref} />;

    // act
    render(given);

    // assert
    expect(ref.current).toBe(screen.getByRole('region', { name: 'Collection' }));
  });

  it('preserves consumer media alternative text', () => {
    // arrange
    const given = (
      <Card>
        <CardMedia>
          <img src="/collection.svg" alt="Collection preview" />
        </CardMedia>
      </Card>
    );

    // act
    render(given);

    // assert
    expect(screen.getByRole('img', { name: 'Collection preview' })).toBeVisible();
  });

  it('keeps a header and footer optional around arbitrary content', () => {
    // arrange
    const given = (
      <Card>
        <CardHeader>
          <CardTitle>Collection</CardTitle>
        </CardHeader>
        <CardFooter>Two themes</CardFooter>
      </Card>
    );

    // act
    render(given);

    // assert
    expect(screen.getByText('Two themes')).toBeVisible();
  });
});
