import React, { FC } from 'react'
import { Button } from '../components/Button'
import { Flex } from '../components/Flex'
import { Modal } from '../components/Modal'
import { Typography } from '../components/Typography'

export const BackToMainMenuModal: FC<{
  onCancel: (flag: boolean) => void
  onAccept: (flag: boolean) => void
}> = ({ onCancel, onAccept }) => (
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
      <Button css={{ width: '40%' }} onClick={onCancel}>
        No
      </Button>
      <Button css={{ width: '40%' }} onClick={onAccept}>
        Yes
      </Button>
    </Flex>
  </Modal>
)
