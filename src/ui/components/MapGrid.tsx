import React from 'react'
import { styled } from '@stitches/react'
import { GameMap } from '../../type'

const GridContainer = styled('div', {
  display: 'grid',
  gap: '1px',
  maxHeight: '100%',
  margin: '0 auto',
  alignItems: 'center',
  alignContent: 'center',
  '@bp1': {
    gap: '3px',
  },
})

const MiniBox = styled('div', {
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'black',
  boxSizing: 'border-box',
  backgroundColor: 'white',
  aspectRatio: '1 / 1',

  '@bp1': {
    borderWidth: '2px',
  },
})

export const MapGrid: React.FC<{ gameMap: GameMap }> = ({ gameMap }) => (
  <GridContainer
    css={{
      gridTemplateColumns: `repeat(${gameMap.grid[0]?.length}, 1fr)`,
      gridTemplateRows: `repeat(${gameMap.grid?.length - 1 || 0}, 1fr)`,
      aspectRatio: `${gameMap.grid?.length} / ${gameMap.grid?.[0]?.length}`,
    }}
  >
    {gameMap.grid
      .map((row, j) =>
        row.reduce((acc, box, i) => {
          if (!box) {
            return acc
          }

          const x = i
          const y = row.length - j

          return [
            ...acc,
            <MiniBox
              key={`${i}-${j}`}
              css={{
                gridColumn: `${x + 1} / ${x + 1}`,
                gridRow: `${y + 1} / ${y + 1}`,
              }}
            />,
          ]
        }, [] as (Element | JSX.Element)[]),
      )
      .flat()}
  </GridContainer>
)
