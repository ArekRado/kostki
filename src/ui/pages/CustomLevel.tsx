import React, { FC, useState } from 'react'
import { Box, Game, gameComponent, Page, State } from '../../type'
import { GameEvent, getGame } from '../../systems/gameSystem'
import { Button } from '../components/Button'
import { Flex } from '../components/Flex'
import { Burger } from '../components/icons/Burger'
import { Modal } from '../components/Modal'
import { PageContainer } from '../components/PageContainer'
import { TurnIndicator, TurnIndicatorItem } from '../components/TurnIndicator'
import { Typography } from '../components/Typography'
import { useGameState } from '../hooks/useGameState'
import { emitEvent, getComponent } from '@arekrado/canvas-engine'
import { StackedAreaChart } from '../components/StackedAreaChart'
import { BackToMainMenuModal } from '../components/BackToMainMenuModal'
import { PlayerLostModal } from '../components/PlayerLostModal'
import { getAiList } from '../utils/getAiList'

const PlayerWonModal: FC = () => (
  <Modal
    css={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-around',
    }}
  >
    <Typography css={{ textAlign: 'center' }}>You won</Typography>

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
        Main menu
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

enum GameStatus {
  playerWon = 'playerWon',
  playerLost = 'playerLost',
  gameInProgress = 'gameInProgress',
}

const getGameStatus = ({
  aiList,
  game,
  state,
}: {
  state: State
  game: Game
  aiList: TurnIndicatorItem[]
}): GameStatus => {
  if (game.gameStarted === true) {
    return GameStatus.gameInProgress
  }

  const humanAi = aiList.find((ai) => ai.human)
  const amountOfCapturedBoxes = game.grid.reduce((acc, boxEntity) => {
    const box = getComponent<Box>({
      state,
      name: gameComponent.box,
      entity: boxEntity,
    })

    return box?.player === humanAi?.entity ? acc + 1 : acc
  }, 0)

  if (amountOfCapturedBoxes === 0) return GameStatus.playerLost
  if (amountOfCapturedBoxes === game.grid.length) return GameStatus.playerWon

  return GameStatus.gameInProgress
}

export const CustomLevel: React.FC = () => {
  const state = useGameState()
  const game = state && getGame({ state })
  const aiList = state ? getAiList(state) : []

  const [showModal, setShowModal] = useState(false)

  const gameStatus: GameStatus =
    game && state
      ? getGameStatus({ game, aiList, state })
      : GameStatus.gameInProgress

  return (
    <PageContainer
      css={{
        gridTemplateRows: '4rem 1fr',
        gridTemplateColumns: '1fr 4rem',
        flex: 1,
      }}
    >
      {showModal && (
        <BackToMainMenuModal
          onCancel={() => setShowModal(false)}
          onAccept={() =>
            emitEvent<GameEvent.CleanSceneEvent>({
              type: GameEvent.Type.cleanScene,
              payload: { newPage: Page.mainMenu },
            })
          }
        />
      )}
      {gameStatus === GameStatus.playerWon && <PlayerWonModal />}
      {gameStatus === GameStatus.playerLost && <PlayerLostModal />}

      <Flex
        css={{
          gridRow: '1 / 3',
          gridColumn: '1 / 1',
        }}
      >
        <TurnIndicator ai={aiList} />
      </Flex>
      <Button
        css={{
          gridRow: '1 / 1',
          gridColumn: '2 / 2',
          display: 'flex',
          alignContent: 'center',
          alignItems: 'center',
          padding: '0.75rem',
        }}
        onClick={() => {
          setShowModal(true)
        }}
      >
        <Burger />
      </Button>
    </PageContainer>
  )
}
