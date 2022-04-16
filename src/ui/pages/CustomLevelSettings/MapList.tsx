import React, { useEffect } from 'react'
import { Button } from '../../components/Button'
import { Flex } from '../../components/Flex'
import { useGameState } from '../../hooks/useGameState'
import { CSS, styled } from '@stitches/react'
import { emitEvent, Entity, getComponentsByName } from '@arekrado/canvas-engine'
import { GameMap, name } from '../../../type'
import { GameEvent, getGame } from '../../../systems/gameSystem'
import { MapGrid } from '../../components/MapGrid'

const ScrolledList = styled(Flex, {
  overflowX: 'auto',
  gap: '10px',
  userSelect: 'all',
  pointerEvents: 'all',
  padding: '10px',
  width: '100%',
})

const mapListId = 'mapList'

export const MapList: React.FC<{ css: CSS }> = ({ css }) => {
  const gameState = useGameState()

  const gameMaps = Object.values(
    gameState
      ? getComponentsByName<GameMap>({
          state: gameState,
          name: name.gameMap,
        }) ?? {}
      : {},
  ).filter(({ campaignNumber }) => campaignNumber === -1)

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
  const mapType = game?.customLevelSettings.mapEntity

  return (
    <ScrolledList id={mapListId} css={css}>
      {gameMaps.map((gameMap) => (
        <Button
          key={gameMap.entity}
          css={{
            padding: '5px',
            aspectRatio: '1 / 1',
            height: '100%',
            border: 'none',

            transition: '0.2s transform, 0.2s background-color',

            backgroundColor:
              mapType === gameMap.entity
                ? 'rgba(255,255,255,0.5)'
                : 'rgba(255,255,255,0.0)',
          }}
          onClick={() => changeMapType(gameMap.entity)}
        >
          <MapGrid gameMap={gameMap} />
        </Button>
      ))}
    </ScrolledList>
  )
}
