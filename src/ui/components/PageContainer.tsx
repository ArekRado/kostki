import { styled } from '../styled'

export const PageContainer = styled('div', {
  display: 'grid',
  margin: '0 auto',
  padding: '0.5rem',
  '@bp2': {
    maxWidth: '768px',
  },
  '@bp3': {
    maxWidth: '1080px',
  },
})
