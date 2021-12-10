import { createStitches } from '@stitches/react';

export const { styled, css } = createStitches({
  theme: {
    colors: {
      outline: '#595cff',
    },
    space: {},
    fontSizes: {},
    fonts: {},
    fontWeights: {},
    lineHeights: {},
    letterSpacings: {},
    sizes: {},
    borderWidths: {},
    borderStyles: {},
    radii: {},
    shadows: {},
    zIndices: {},
    transitions: {},
  },
  media: {
    bp1: '(min-width: 1024px)',
  },
});
