import React from 'react'
import { Button } from '../components/Button'
import { Flex } from '../components/Flex'
import { useGameState } from '../hooks/useGameState'
import { styled } from '@stitches/react'
import { getComponentsByName } from '@arekrado/canvas-engine'
import { GameMap, name } from '../../type'

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
  gap: '5px',
  // justifyContent: 'center',
  // alignItems: 'center',
  // maxWidth: '100%',
  maxHeight: '100%',
  margin: '0 auto',
})

const MiniBox = styled('div', {
  borderWidth: '2px',
  borderStyle: 'solid',
  borderColor: 'black',
  boxSizing: 'border-box',
  // width: '100%',
  // height: '100%',
})

// type MapGrid = Array<
//   (GameMap['grid'][0][0] & { position: Vector2D; size: number }) | undefined
// >

// type EnchancedGameMap = Omit<GameMap, 'grid'> & {
//   longerSide: number
//   grid: MapGrid
// }

// const getLongerSide = (gameMap: GameMap): EnchancedGameMap['longerSide'] =>
//   gameMap.grid.length > gameMap.grid?.[0]?.length
//     ? gameMap.grid.length
//     : gameMap.grid?.[0]?.length || 0

// const getShorterSide = (gameMap: GameMap): EnchancedGameMap['longerSide'] =>
//   gameMap.grid.length > gameMap.grid?.[0]?.length
//     ? gameMap.grid?.[0]?.length || 0
//     : gameMap.grid.length

// const getGridPositions = (gameMap: GameMap): MapGrid => {
//   const [longerSide, shorterSide] = [
//     getLongerSide(gameMap),
//     getShorterSide(gameMap),
//   ]

//   const size = 100 / longerSide
//   const shift = [
//     ((longerSide - gameMap.grid?.[0]?.length || 0) * size) / 2,
//     ((longerSide - gameMap.grid.length) * size) / 2,
//   ]

//   const list: MapGrid = [] as MapGrid

//   gameMap.grid.forEach((row, y) => {
//     row.forEach((box, x) => {
//       if (!box) {
//         return
//       }

//       const enhancedBox: MapGrid[0] = {
//         ...box,
//         size,
//         position: [
//           (x * 100) / longerSide + shift[0],
//           (y * 100) / longerSide + shift[1],
//         ],
//       }

//       list.push(enhancedBox)
//     })
//   })

//   return list
// }

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

  // const gameMapsWithGrids: EnchancedGameMap[] = gameMaps.map((gameMap) => {
  //   const longerSide = getLongerSide(gameMap)

  //   return {
  //     ...gameMap,
  //     longerSide,
  //     grid: getGridPositions(gameMap),
  //   }
  // })

  // const changeMapType = () =>
  //   emitEvent<GameEvent.ChangeMapTypeEvent>({
  //     type: GameEvent.Type.changeMapType,
  //     payload: null,
  //   })

  return (
    <ScrolledList>
      {gameMaps.map((mapGrid) => (
        <Button
          key={mapGrid.entity}
          css={{
            padding: '5px',
            aspectRatio: '1 / 1',
            height: '100%',
          }}
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
              .map((row, i) =>
                row.reduce((acc, box, j) => {
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
