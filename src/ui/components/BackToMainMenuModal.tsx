import React, { FC } from 'react'
import { Page } from '../../type'
import { GameEvent } from '../../systems/gameSystem'
import { Button } from '../components/Button'
import { Flex } from '../components/Flex'
import { Modal } from '../components/Modal'
import { Typography } from '../components/Typography'
import { emitEvent } from '@arekrado/canvas-engine'

export const BackToMainMenuModal: FC<{ onClose: (flag: boolean) => void }> = ({
  onClose,
}) => (
  <Modal
    css={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-around',
    }}
  >
    <Typography css={{ textAlign: 'center' }}>
      Are you sure you want to finish the game?
    </Typography>

    <Flex css={{ justifyContent: 'space-evenly' }}>
      <Button
        css={{ width: '40%' }}
        onClick={() => {
          onClose(false)
        }}
      >
        No
      </Button>
      <Button
        css={{ width: '40%' }}
        onClick={() => {
          emitEvent<GameEvent.CleanSceneEvent>({
            type: GameEvent.Type.cleanScene,
            payload: { newPage: Page.mainMenu },
          })
        }}
      >
        Yes
      </Button>
    </Flex>
  </Modal>
)
