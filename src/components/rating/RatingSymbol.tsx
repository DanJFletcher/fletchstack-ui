import type { ReactElement } from 'react';
import { Icon } from '../icon/Icon.js';
import type { RatingSymbol as SymbolName } from './types.js';

const paths = {
  star: 'M12 2.75 14.72 8.27 20.82 9.16 16.41 13.46 17.45 19.53 12 16.66 6.55 19.53 7.59 13.46 3.18 9.16 9.28 8.27Z',
  heart:
    'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z',
  thumbs:
    'M7 10H3v11h4V10Zm0 10h10.5a2 2 0 0 0 1.96-1.6l1.5-7A2 2 0 0 0 19 9h-5l1-5a2 2 0 0 0-2-2l-6 8v10Z',
};

/**
 * Clip the filled full-size artwork beneath a separate stable outline, including fractional scores.
 **/
export function RatingSymbol({ symbol, fill }: { symbol: SymbolName; fill: number }): ReactElement {
  return (
    <span className="fs-rating__symbol" aria-hidden="true" data-symbol={symbol}>
      <span className="fs-rating__fill" style={{ clipPath: `inset(0 ${100 - fill * 100}% 0 0)` }}>
        <Icon className="fs-rating__solid">
          <path d={paths[symbol]} />
        </Icon>
      </span>
      <Icon className="fs-rating__outline">
        <path d={paths[symbol]} />
      </Icon>
    </span>
  );
}
