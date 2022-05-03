import React, { FC, useState } from 'react'
import { gameComponent, GameMap, Page, State, Tutorial } from '../../type'
import { GameEvent, getGame } from '../../systems/gameSystem'
import { Button } from '../components/Button'
import { Flex } from '../components/Flex'
import { Burger } from '../components/icons/Burger'
import { Modal } from '../components/Modal'
import { PageContainer } from '../components/PageContainer'
import { TurnIndicator } from '../components/TurnIndicator'
import { Typography } from '../components/Typography'
import { useGameState } from '../hooks/useGameState'
import {
  emitEvent,
  Entity,
  getComponent,
  getComponentsByName,
} from '@arekrado/canvas-engine'
import { StackedAreaChart } from '../components/StackedAreaChart'
import { GameStatus, getGameStatus } from '../utils/getGameStatus'
import { getAiList } from '../utils/getAiList'
import { PlayerLostModal } from '../components/PlayerLostModal'
import { tutorialEntity } from '../../systems/tutorialSystem'
import { TutorialTip } from '../components/TutorialTip'
import { BackToMainMenuModal } from '../components/BackToMainMenuModal'

// const BackToMainMenuModal: FC<{ onClose: (flag: boolean) => void }> = ({
//   onClose,
// }) => (
//   <Modal
//     css={{
//       display: 'flex',
//       flexDirection: 'column',
//       justifyContent: 'space-around',
//     }}
//   >
//     <Typography css={{ textAlign: 'center' }}>
//       Are you sure you want to finish the game?
//     </Typography>

//     <Flex css={{ justifyContent: 'space-evenly' }}>
//       <Button
//         css={{ width: '40%' }}
//         onClick={() => {
//           onClose(false)
//         }}
//       >
//         No
//       </Button>
//       <Button css={{ width: '40%' }} onClick={() => {}}>
//         Yes
//       </Button>
//     </Flex>
//   </Modal>
// )

const PlayerWonModal: FC<{ nextMapEntity: Entity | undefined }> = ({
  nextMapEntity,
}) => (
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
            payload: { newPage: Page.campaignLevelSelect },
          })
        }}
      >
        Levels list
      </Button>
      {nextMapEntity ? (
        <Button
          css={{ width: '40%' }}
          onClick={() => {
            emitEvent<GameEvent.StartCampaignLevelEvent>({
              type: GameEvent.Type.startCampaignLevel,
              payload: { mapEntity: nextMapEntity },
            })
          }}
        >
          Next level
        </Button>
      ) : null}
    </Flex>
  </Modal>
)

const getNextMapEntity = ({
  state,
  currentCampaignLevelEntity,
}: {
  state: State
  currentCampaignLevelEntity: Entity
}) => {
  const currentCampaignLevelNumber =
    getComponent<GameMap>({
      state,
      entity: currentCampaignLevelEntity,
      name: gameComponent.gameMap,
    })?.campaignNumber ?? 0

  const gameMaps = getComponentsByName<GameMap>({
    state,
    name: gameComponent.gameMap,
  })

  return Object.values(gameMaps ?? {}).find(
    ({ campaignNumber }) => campaignNumber === currentCampaignLevelNumber + 1,
  )?.entity
}

export const CampaignLevel: React.FC = () => {
  const state = useGameState()
  const game = state && getGame({ state })
  const tutorial =
    state &&
    getComponent<Tutorial>({
      state,
      entity: tutorialEntity,
      name: gameComponent.tutorial,
    })

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
      {gameStatus === GameStatus.playerWon && (
        <PlayerWonModal
          nextMapEntity={
            state
              ? getNextMapEntity({
                  state,
                  currentCampaignLevelEntity:
                    game?.currentCampaignLevelEntity ?? '',
                })
              : ''
          }
        />
      )}
      {gameStatus === GameStatus.playerLost && <PlayerLostModal />}
      {tutorial?.tipText && <TutorialTip>{tutorial?.tipText}</TutorialTip>}

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
