import React from 'react'
import {
  CustomLevelSettingsDifficulty,
  GameMap,
  Page,
  gameComponent,
} from '../../../type'
import { GameEvent, getGame } from '../../../systems/gameSystem'
import { Button } from '../../components/Button'
import { Flex } from '../../components/Flex'
import { Grid } from '../../components/Grid'
import { Check } from '../../components/icons/Check'
import { Cross } from '../../components/icons/Cross'
import { PageContainer } from '../../components/PageContainer'
import { useGameState } from '../../hooks/useGameState'
import { emitEvent, getComponentsByName } from '@arekrado/canvas-engine'
import { MapList } from './MapList'

const mapDifficultyToText = (
  difficulty: CustomLevelSettingsDifficulty,
): string => {
  switch (difficulty) {
    case CustomLevelSettingsDifficulty.random:
      return 'Random'
    case CustomLevelSettingsDifficulty.easy:
      return 'Easy'
    case CustomLevelSettingsDifficulty.medium:
      return 'Medium'
    case CustomLevelSettingsDifficulty.hard:
      return 'Hard'
  }
}

export const CustomLevelSettings: React.FC = () => {
  const gameState = useGameState()
  const game = gameState && getGame({ state: gameState })
  const selectedMapEntity = game?.customLevelSettings.mapEntity

  const gameMaps = Object.values(
    gameState
      ? getComponentsByName<GameMap>({
          state: gameState,
          name: gameComponent.gameMap,
        }) ?? {}
      : {},
  ).filter(({ campaignNumber }) => campaignNumber === -1)

  if (!game || !gameMaps) {
    return null
  }

  const changePlayers = () =>
    emitEvent<GameEvent.ChangePlayersEvent>({
      type: GameEvent.Type.changePlayers,
      payload: null,
    })

  const changeDifficulty = () =>
    emitEvent<GameEvent.ChangeDifficultyEvent>({
      type: GameEvent.Type.changeDifficulty,
      payload: null,
    })

  const changeQuickStart = () =>
    emitEvent<GameEvent.ChangeQuickStartEvent>({
      type: GameEvent.Type.changeQuickStart,
      payload: null,
    })

  const changeColorBlindMode = () =>
    emitEvent<GameEvent.ChangeColorBlindModeEvent>({
      type: GameEvent.Type.changeColorBlindMode,
      payload: null,
    })

  const startCustomLevel = () =>
    emitEvent<GameEvent.StartCustomLevelEvent>({
      type: GameEvent.Type.startCustomLevel,
      payload: null,
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
        gridTemplateRows: '1fr 1fr 1fr',
        gridTemplateColumns: '1fr 1fr',
        gridGap: '1rem',
        flex: 1,
      }}
    >
      <MapList
        selectedMapEntity={selectedMapEntity ?? ''}
        gameMaps={gameMaps}
        css={{
          gridRow: '1 / 1',
          gridColumn: '1 / 3',
        }}
      />

      <Grid
        css={{
          gridTemplateRows: '1fr 1fr 1fr 1fr',
          gridTemplateColumns: '1fr',
          '@bp2': {
            gridTemplateRows: '1fr 1fr',
            gridTemplateColumns: '1fr 1fr',
          },

          gridGap: '0.5rem',

          gridRow: '2 / 2',
          gridColumn: '1 / 3',
        }}
      >
        <Button
          css={{
            display: 'flex',
            justifyContent: 'space-between',

            gridRow: '1 / 1',
            gridColumn: '1 / 1',
            alignSelf: 'center',
          }}
          onClick={changeDifficulty}
        >
          <div>Difficulty</div>
          <div>{mapDifficultyToText(game.customLevelSettings.difficulty)}</div>
        </Button>
        <Button
          css={{
            display: 'flex',
            justifyContent: 'space-between',

            gridRow: '2 / 2',
            gridColumn: '1 / 1',
            alignSelf: 'center',

            '@bp2': {
              gridRow: '1 / 1',
              gridColumn: '2 / 2',
            },
          }}
          onClick={changePlayers}
        >
          <div>Players</div>
          <div>{game.customLevelSettings.players?.length}</div>
        </Button>
        <Button
          css={{
            display: 'flex',
            justifyContent: 'space-between',

            gridRow: '3 / 3',
            gridColumn: '1 / 1',
            alignSelf: 'center',

            '@bp2': {
              gridRow: '2 / 2',
              gridColumn: '1 / 1',
            },
          }}
          onClick={changeQuickStart}
        >
          <div>Quick Start</div>
          <div>
            {game.customLevelSettings.quickStart ? <Check /> : <Cross />}
          </div>
        </Button>
        <Button
          css={{
            display: 'flex',
            justifyContent: 'space-between',

            gridRow: '4 / 4',
            gridColumn: '1 / 1',
            alignSelf: 'center',

            '@bp2': {
              gridRow: '2 / 2',
              gridColumn: '2 / 2',
            },
          }}
          onClick={changeColorBlindMode}
        >
          <div>Color Blind Mode</div>
          <div>{game.colorBlindMode ? <Check /> : <Cross />}</div>
        </Button>
      </Grid>

      <Flex
        css={{
          flexDirection: 'column',
          justifyContent: 'center',
          gridRow: '3 / 3',
          gridColumn: '1 / 1',
        }}
      >
        <Button onClick={backToMainMenu}>Back</Button>
      </Flex>

      <Flex
        css={{
          flexDirection: 'column',
          justifyContent: 'center',
          gridRow: '3 / 3',
          gridColumn: '2 / 2',
        }}
      >
        <Button onClick={startCustomLevel}>Start</Button>
      </Flex>
    </PageContainer>
  )
}
