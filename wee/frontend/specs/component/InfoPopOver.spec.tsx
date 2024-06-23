import React from 'react';
import { render } from '@testing-library/react';
import { checkPlacement } from '../../src/app/components/InfoPopOver';

describe('InfoPopOver Component', () => {
  it('sets default placement to "right-end" if an invalid placement is provided', () => {
    const placement = 'invalid-placement';
    const newPlacement = checkPlacement(placement);

    expect(newPlacement).toBe('right-end');
  });

  it('keeps the provided placement if it is valid', () => {
    const placement = 'top';
    const newPlacement = checkPlacement(placement);

    expect(newPlacement).toBe(placement);
  });
});
