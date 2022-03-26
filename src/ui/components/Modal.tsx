import React, { FC } from 'react'
import { styled } from '../styled'
import { CSS } from '@stitches/react'

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

export const ModalBody = styled('div', {
  border: '5px solid black',
  background: 'white',
})

export const Modal: FC<{ css: CSS }> = ({ children, css }) => {
  return (
    <ModalBackdrop>
      <ModalBody css={css}>{children}</ModalBody>
    </ModalBackdrop>
  )
}
