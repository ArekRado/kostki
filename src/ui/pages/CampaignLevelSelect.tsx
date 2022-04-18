import React from 'react'
import { GameMap, gameComponent, Page, State } from '../../type'
import { GameEvent } from '../../systems/gameSystem'
import { Button } from '../components/Button'
import { Flex } from '../components/Flex'
import { Grid } from '../components/Grid'
import { PageContainer } from '../components/PageContainer'
import { useGameState } from '../hooks/useGameState'
import { emitEvent, Entity, getComponentsByName } from '@arekrado/canvas-engine'
import { MapGrid } from '../components/MapGrid'
import { Lock } from '../components/icons/Lock'

export const CampaignLevelSelect: React.FC = () => {
  const gameState = useGameState()

  if (!gameState) {
    return null
  }

  const allMaps = getComponentsByName<GameMap, State>({
    state: gameState,
    name: gameComponent.gameMap,
  })

  const campaignMaps = Object.values(allMaps ?? {}).filter(
    ({ campaignNumber }) => campaignNumber !== -1,
  )

  const startCampaignMap = (mapEntity: Entity) =>
    emitEvent<GameEvent.StartCampaignLevelEvent>({
      type: GameEvent.Type.startCampaignLevel,
      payload: { mapEntity },
    })

  const backToMainMenu = () =>
    emitEvent<GameEvent.CleanSceneEvent>({
      type: GameEvent.Type.cleanScene,
      payload: {
        newPage: Page.mainMenu,
      },
    })

  return (
    <PageContainer
      css={{
        gridTemplateRows: '10fr 1fr',
        gridTemplateColumns: '1fr',
        flex: 1,
      }}
    >
      <Grid
        css={{
          gridTemplateColumns: 'repeat(4, 1fr)',
          alignContent: 'baseline',
          gridGap: '0.5rem',
          '@bp2': {
            gridTemplateColumns: 'repeat(10, 1fr)',
            gridGap: '1rem',
          },
        }}
      >
        {campaignMaps.map((gameMap) => (
          <Button
            key={gameMap.entity}
            onClick={() => !gameMap.locked && startCampaignMap(gameMap.entity)}
            css={{
              flex: '1',
              padding: '3px',
              aspectRatio: '1 / 1',
              border: 'none',
              transition: '0.2s transform, 0.2s background-color',
              backgroundColor: 'rgba(255,255,255,0.5)',
            }}
          >
            {gameMap.locked ? <Lock /> : <MapGrid gameMap={gameMap} />}{' '}
          </Button>
        ))}
      </Grid>

      <Flex
        css={{
          flexDirection: 'column',
          justifyContent: 'center',
          gridRow: '2 / ',
          gridColumn: '1 / 1',
        }}
      >
        <Button onClick={backToMainMenu}>Back</Button>
      </Flex>
    </PageContainer>
  )
}
