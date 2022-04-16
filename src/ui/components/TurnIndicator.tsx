import { Entity } from '@arekrado/canvas-engine'
import { styled } from '@stitches/react'
import React from 'react'
import { Color } from '../../type'
import { Typography } from '../components/Typography'
import { Flex } from './Flex'

export type TurnIndicatorItem = {
  entity: string
  color: Color
  human: boolean
  hasCurrentTurn: boolean
  name: string
  active: boolean
}

const Highlighter = styled('div', {
  backgroundColor: 'rgba(255,255,255,0.6)',
  position: 'absolute',
  top: '0',
  left: '0',
  width: '100%',
  transition: 'transform 0.5s cubic-bezier(.77,0,.18,1) 0s',
  zIndex: '$turnIndicatorHighlighter',
})

const getId = (entity: Entity) => `TurnIndicator${entity}`

export const TurnIndicator: React.FC<{ ai: TurnIndicatorItem[] }> = ({
  ai,
}) => {
  const activeAI = ai.find(({ hasCurrentTurn }) => hasCurrentTurn) ?? ai[0]
  const element = document.getElementById(getId(activeAI?.entity ?? ''))
  const rec = element?.getBoundingClientRect()
  const position = element ? [element.offsetLeft, element.offsetTop] : [0, 0]

  return (
    <Flex
      css={{
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      <Highlighter
        css={{
          transform: `translate(${position[0]}px, ${position[1]}px)`,
          height: `${rec?.height ?? 0}px`,
        }}
      />
      {ai.map(({ entity, name, color, active }) => (
        <Flex
          id={getId(entity)}
          key={entity}
          css={{
            alignItems: 'center',
            padding: '0.125rem',
            paddingRight: '1rem',
            zIndex: '$turnIndicatorText',
          }}
        >
          <Flex
            css={{
              position: 'relative',
              width: '0.5rem',
              height: '0.5rem',
              border: '0.125rem solid black',
              '@bp2': {
                width: '2rem',
                height: '2rem',
                border: '0.25rem solid black',
              },
              marginRight: '0.5rem',

              backgroundColor: `rgb(${color[0] * 255}, ${color[1] * 255}, ${
                color[2] * 255
              })`,
            }}
          />
          <Typography
            css={{
              fontSize: '0.75rem',
              textDecoration: active ? '' : 'line-through',
              color: active ? '$gray900' : '$gray500',
              '@bp2': { fontSize: '1.5rem' },
            }}
          >
            {name}
          </Typography>
        </Flex>
      ))}
    </Flex>
  )
}
