import { styled } from '../styled';

export const Button = styled('button', {
  borderWidth: '5px',
  borderColor: 'Black',
  borderStyle: 'solid',
  background: 'White',
  padding: '40px',
  fontSize: '32px',

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
