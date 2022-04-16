import React from 'react'
import { Page } from '../../type'
import { GameEvent, getGame } from '../../systems/gameSystem'
import { Button } from '../components/Button'
import { Flex } from '../components/Flex'
import { PageContainer } from '../components/PageContainer'
import { Typography } from '../components/Typography'
import { useGameState } from '../hooks/useGameState'
import { emitEvent } from '@arekrado/canvas-engine'

export const Main: React.FC = () => {
  const state = useGameState()
  const game = state && getGame({ state })

  return (
    <PageContainer
      css={{
        gridTemplateRows: '20% 70% 10%',
        gridTemplateColumns: '20% 60% 20%',
        flex: 1,
      }}
    >
      <Flex
        css={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gridRow: '2 / 2',
          gridColumn: '2 / 3',
        }}
      >
        {/* <Button
          css={{ maxWidth: '500px', width: '100%' }}
          onClick={() => {
            emitEvent<GameEvent.CleanSceneEvent>({
              type: GameEvent.Type.cleanScene,
              payload: {
                newPage: Page.campaignLevelSelect,
              },
            })
          }}
        >
          Start
        </Button> */}
        <Button
          css={{ marginTop: '100px', maxWidth: '500px', width: '100%' }}
          onClick={() => {
            emitEvent<GameEvent.CleanSceneEvent>({
              type: GameEvent.Type.cleanScene,
              payload: {
                newPage: Page.customLevelSettings,
              },
            })
          }}
        >
          Custom Level
        </Button>
      </Flex>

      <Typography
        css={{
          flexDirection: 'column',
          justifyContent: 'center',
          gridRow: '3 / 4',
          gridColumn: '3 / 3',
          color: 'white',
          fontSize: '1rem',
        }}
      >
        {game?.version}
      </Typography>
    </PageContainer>
  )
}
