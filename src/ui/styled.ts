import { createStitches } from '@stitches/react'

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
    zIndices: {
      modal: 1,
    },
    transitions: {},
  },
  media: {
    bp1: '(max-width: 768px)',
    bp2: '(min-width: 769px)',
    bp3: '(min-width: 1024px)',
  },
})
