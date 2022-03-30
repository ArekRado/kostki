import { styled } from '../styled'

export const Button = styled('button', {
  border: '5px solid black',
  background: 'white',
  padding: '10px 7px',
  fontSize: '1rem',
  whiteSpace: 'nowrap',

  cursor: 'pointer',
  transition: '0.2s transform',

  pointerEvents: 'auto',

  '&:hover': {
    transform: 'scale(1.05)',
  },

  '&:focus': {
    transform: 'scale(0.98)',
  },
})
