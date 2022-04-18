import React, { FC } from 'react'
import { Page } from '../../type'
import { GameEvent } from '../../systems/gameSystem'
import { Button } from '../components/Button'
import { Flex } from '../components/Flex'
import { Modal } from '../components/Modal'
import { Typography } from '../components/Typography'
import { emitEvent } from '@arekrado/canvas-engine'
import { StackedAreaChart } from '../components/StackedAreaChart'

export const PlayerLostModal: FC = () => (
  <Modal
    css={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-around',
    }}
  >
    <Typography css={{ textAlign: 'center' }}>You lost</Typography>

    <Flex
      css={{
        width: '90%',
        height: '90%',
        alignSelf: 'center',
        margin: '1rem',
      }}
    >
      <StackedAreaChart />
    </Flex>

    <Flex css={{ justifyContent: 'space-evenly' }}>
      <Button
        css={{ width: '40%' }}
        onClick={() => {
          emitEvent<GameEvent.CleanSceneEvent>({
            type: GameEvent.Type.cleanScene,
            payload: { newPage: Page.mainMenu },
          })
        }}
      >
        Back to main menu
      </Button>
      <Button
        css={{ width: '40%' }}
        onClick={() => {
          emitEvent<GameEvent.PlayAgainCustomLevelEvent>({
            type: GameEvent.Type.playAgainCustomLevel,
            payload: null,
          })
        }}
      >
        Play again
      </Button>
    </Flex>
  </Modal>
)
