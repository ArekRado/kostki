import { styled } from '../styled';

export const Button = styled('button', {
  border: '5px solid black',
  background: 'white',
  padding: '20px 15px',
  fontSize: '1.5rem',
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
});
