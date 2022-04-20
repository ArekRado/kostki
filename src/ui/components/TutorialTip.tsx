import React, { FC } from 'react'
import { styled } from '../styled'
import { popup } from './Modal'
import { Typography } from './Typography'

export const TutorialTipBackdrop = styled('div', {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  pointerEvents: 'none',
})

export const TutorialTipBody = styled('div', {
  border: '5px solid black',
  background: 'rgba(255,255,255,0.9)',
  padding: '1rem',

  alignSelf: 'end',
  marginBottom: '50px',

  '@bp1': {
    width: '80%',
    height: '20%',
  },
  '@bp2': {
    width: '70%',
    height: '20%',
  },
  '@bp3': {
    width: '40%',
    height: '20%',
  },

  animation: `${popup.toString()} 300ms`,
})

export const TutorialTip: FC = ({ children }) => {
  return (
    <TutorialTipBackdrop>
      <TutorialTipBody>
        <Typography>{children}</Typography>
      </TutorialTipBody>
    </TutorialTipBackdrop>
  )
}
