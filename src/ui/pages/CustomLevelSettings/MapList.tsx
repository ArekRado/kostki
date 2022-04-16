import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Button } from '../../components/Button'
import { Flex } from '../../components/Flex'
import { CSS, styled } from '@stitches/react'
import { emitEvent, Entity } from '@arekrado/canvas-engine'
import { GameMap } from '../../../type'
import { GameEvent } from '../../../systems/gameSystem'
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

export const MapList: React.FC<{
  css: CSS
  gameMaps: GameMap[]
  selectedMapEntity: Entity
}> = ({ css, gameMaps, selectedMapEntity }) => {
  const [blockScrollTo, setBlockScrollTo] = useState(false)

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

  useLayoutEffect(() => {
    if (!blockScrollTo) {
      const scrollContainer = document.querySelector(`#${mapListId}`)
      const selectedMap = document.querySelector(`#${selectedMapEntity ?? ''}`)

      if (scrollContainer && selectedMap) {
        const rec = selectedMap.getBoundingClientRect()
        scrollContainer.scrollTo({
          left: rec.left - rec.width / 2,
        })
        scrollContainer.scrollLeft = rec.left - rec.width / 2
        setBlockScrollTo(true)
      }
    }
  }, [selectedMapEntity, blockScrollTo])

  return (
    <ScrolledList id={mapListId} css={css}>
      {gameMaps.map((gameMap) => (
        <Button
          id={gameMap.entity}
          key={gameMap.entity}
          css={{
            padding: '5px',
            aspectRatio: '1 / 1',
            height: '100%',
            border: 'none',

            transition: '0.2s transform, 0.2s background-color',

            backgroundColor:
              gameMap.entity === selectedMapEntity
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
