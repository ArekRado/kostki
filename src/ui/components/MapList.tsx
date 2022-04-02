import React, { useEffect } from 'react'
import { Button } from '../components/Button'
import { Flex } from '../components/Flex'
import { useGameState } from '../hooks/useGameState'
import { styled } from '@stitches/react'
import { emitEvent, Entity, getComponentsByName } from '@arekrado/canvas-engine'
import { GameMap, name } from '../../type'
import { GameEvent, getGame } from '../../systems/gameSystem'

const ScrolledList = styled(Flex, {
  overflowX: 'auto',
  cursor: 'grab',
  gap: '10px',
  userSelect: 'all',
  pointerEvents: 'all',
  padding: '10px',
  width: '100%',
})

const GridContainer = styled('div', {
  display: 'grid',
  gap: '3px',
  maxHeight: '100%',
  margin: '0 auto',
})

const MiniBox = styled('div', {
  borderWidth: '2px',
  borderStyle: 'solid',
  borderColor: 'black',
  boxSizing: 'border-box',
  backgroundColor: 'white',
})

const mapListId = 'mapList'

export const MapList: React.FC = () => {
  const gameState = useGameState()

  const gameMaps = Object.values(
    gameState
      ? getComponentsByName<GameMap>({
          state: gameState,
          name: name.gameMap,
        }) ?? {}
      : {},
  )

  const changeMapType = (gameMapEntity: Entity) =>
    emitEvent<GameEvent.ChangeMapTypeEvent>({
      type: GameEvent.Type.changeMapType,
      payload: { gameMapEntity },
    })

  useEffect(() => {
    const scrollContainer = document.querySelector(`#${mapListId}`)
    if (!scrollContainer) {
      return
    }
    const scrollEvent = (evt: Event & { deltaY: number }) => {
      scrollContainer.scrollLeft += evt.deltaY
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    scrollContainer?.addEventListener<any>('wheel', scrollEvent)

    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      scrollContainer?.removeEventListener<any>('wheel', scrollEvent)
    }
  }, [])

  const game = gameState ? getGame({ state: gameState }) : null
  const mapType = game?.customLevelSettings.mapType

  return (
    <ScrolledList id={mapListId}>
      {gameMaps.map((mapGrid) => (
        <Button
          key={mapGrid.entity}
          css={{
            padding: '5px',
            aspectRatio: '1 / 1',
            height: '100%',
            border: 'none',

            transition: '0.2s transform, 0.2s background-color',

            backgroundColor:
              mapType === mapGrid.entity
                ? 'rgba(255,255,255,0.5)'
                : 'rgba(255,255,255,0.0)',
          }}
          onClick={() => changeMapType(mapGrid.entity)}
        >
          <GridContainer
            css={{
              gridTemplateColumns: `repeat(${mapGrid.grid?.length}, 1fr)`,
              gridTemplateRows: `repeat(${
                mapGrid.grid?.[0]?.length || 0
              }, 1fr)`,
              aspectRatio: `${mapGrid.grid?.length} / ${mapGrid.grid?.[0]?.length}`,
            }}
          >
            {mapGrid.grid
              .map((row, j) =>
                row.reduce((acc, box, i) => {
                  if (!box) {
                    return acc
                  }

                  return [
                    ...acc,
                    <MiniBox
                      key={`${i}-${j}`}
                      css={{
                        gridColumn: `${i + 1} / ${i + 1}`,
                        gridRow: `${j + 1} / ${j + 1}`,
                      }}
                    />,
                  ]
                }, [] as (Element | JSX.Element)[]),
              )
              .flat()}
          </GridContainer>
        </Button>
      ))}
    </ScrolledList>
  )
}
