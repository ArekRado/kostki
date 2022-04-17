import React, { FC } from 'react'
import { styled } from '../styled'
import { CSS, keyframes } from '@stitches/react'

export const ModalBackdrop = styled('div', {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  pointerEvents: 'auto',
})

const popup = keyframes({
  '0%': {
    opacity: 0,
    transform: 'scale(0.9) translateY(100px)',
  },
  '100%': {
    opacity: 1,
    transform: 'scale(1) translateY(0px)',
  },
})

export const ModalBody = styled('div', {
  border: '5px solid black',
  background: 'white',

  '@bp1': {
    width: '80%',
    height: '60%',
  },
  '@bp2': {
    width: '70%',
    height: '40%',
  },
  '@bp3': {
    width: '40%',
    height: '40%',
  },

  animation: `${popup.toString()} 300ms`,
})

export const Modal: FC<{ css: CSS }> = ({ children, css }) => {
  return (
    <ModalBackdrop>
      <ModalBody css={css}>{children}</ModalBody>
    </ModalBackdrop>
  )
}
