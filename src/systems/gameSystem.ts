import {
  createGetSetForUniqComponent,
  createSystem,
  Entity,
  getComponent,
  ECSEvent,
} from '@arekrado/canvas-engine'
import { AI, Game, State, Page, gameComponent } from '../type'
import { create } from './gameSystem/create'

export const gameEntity = 'game'

export const shakeAnimationTimeout = 3000

export namespace GameEvent {
  export enum Type {
    startCustomLevel = 'GameEvent-startCustomLevel',
    boxExplosion = 'GameEvent-boxExplosion',
    playerClick = 'GameEvent-playerClick',
    cleanScene = 'GameEvent-cleanScene',
    shakeAiBoxes = 'GameEvent-shakeAiBoxes',
    playAgainCustomLevel = 'GameEvent-playAgainCustomLevel',

    changePlayers = 'GameEvent-changePlayers',
    changeDifficulty = 'GameEvent-changeDifficulty',
    changeQuickStart = 'GameEvent-changeQuickStart',
    changeColorBlindMode = 'GameEvent-changeColorBlindMode',
    changeMapType = 'GameEvent-changeMapType',
    startCampaignLevel = 'GameEvent-startCampaignLevel',
  }

  export type All =
    | StartCustomLevelEvent
    | PlayerClickEvent
    | CleanSceneEvent
    | ChangePlayersEvent
    | ChangeDifficultyEvent
    | ChangeQuickStartEvent
    | ChangeColorBlindModeEvent
    | ChangeMapTypeEvent
    | PlayAgainCustomLevelEvent
    | ShakeAiBoxesEvent
    | StartCampaignLevelEvent

  export type StartCustomLevelEvent = ECSEvent<Type.startCustomLevel, null>
  export type PlayAgainCustomLevelEvent = ECSEvent<
    Type.playAgainCustomLevel,
    null
  >
  export type ShakeAiBoxesEvent = ECSEvent<Type.shakeAiBoxes, { ai: AI }>
  export type PlayerClickEvent = ECSEvent<
    Type.playerClick,
    { boxEntity: Entity }
  >
  export type CleanSceneEvent = ECSEvent<Type.cleanScene, { newPage: Page }>

  export type ChangePlayersEvent = ECSEvent<Type.changePlayers, null>
  export type ChangeDifficultyEvent = ECSEvent<Type.changeDifficulty, null>
  export type ChangeQuickStartEvent = ECSEvent<Type.changeQuickStart, null>
  export type ChangeColorBlindModeEvent = ECSEvent<
    Type.changeColorBlindMode,
    null
  >
  export type ChangeMapTypeEvent = ECSEvent<
    Type.changeMapType,
    { gameMapEntity: Entity }
  >

  export type StartCampaignLevelEvent = ECSEvent<
    Type.startCampaignLevel,
    { mapEntity: Entity }
  >
}

const gameGetSet = createGetSetForUniqComponent<Game, State>({
  entity: gameEntity,
  name: gameComponent.game,
})

export const getGame = gameGetSet.getComponent
export const setGame = gameGetSet.setComponent

type GetCurrentAi = (params: { state: State }) => AI | undefined
export const getCurrentAi: GetCurrentAi = ({ state }) => {
  const game = getGame({ state })
  const ai = getComponent<AI>({
    state,
    name: gameComponent.ai,
    entity: game?.currentPlayer || '',
  })

  return ai
}

export const gameSystem = (state: State) =>
  createSystem<Game, State>({
    state,
    name: gameComponent.game,
    componentName: gameComponent.game,
    create,
  })
