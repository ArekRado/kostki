import {
  createGetSetForUniqComponent,
  createSystem,
  Entity,
  getComponent,
  ECSEvent,
} from '@arekrado/canvas-engine';
import { AI, Game, State, Page, name } from '../type';
import { create } from './gameSystem/create';

export const gameEntity = 'game';

export const shakeAnimationTimeout = 4000;

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
    showNewVersion = 'GameEvent-showNewVersion',
    reload = 'GameEvent-reload',
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
    | ShowNewVersionEvent
    | ReloadEvent
    | PlayAgainCustomLevelEvent
    | ShakeAiBoxesEvent;

  export type StartCustomLevelEvent = ECSEvent<Type.startCustomLevel, {}>;
  export type PlayAgainCustomLevelEvent = ECSEvent<
    Type.playAgainCustomLevel,
    {}
  >;
  export type ShakeAiBoxesEvent = ECSEvent<Type.shakeAiBoxes, { ai: AI }>;
  export type PlayerClickEvent = ECSEvent<
    Type.playerClick,
    { boxEntity: Entity }
  >;
  export type CleanSceneEvent = ECSEvent<Type.cleanScene, { newPage: Page }>;

  export type ChangePlayersEvent = ECSEvent<Type.changePlayers, {}>;
  export type ChangeDifficultyEvent = ECSEvent<Type.changeDifficulty, {}>;
  export type ChangeQuickStartEvent = ECSEvent<Type.changeQuickStart, {}>;
  export type ChangeColorBlindModeEvent = ECSEvent<
    Type.changeColorBlindMode,
    {}
  >;
  export type ChangeMapTypeEvent = ECSEvent<Type.changeMapType, {}>;

  export type ShowNewVersionEvent = ECSEvent<Type.showNewVersion, {}>;
  export type ReloadEvent = ECSEvent<Type.reload, {}>;
}

const gameGetSet = createGetSetForUniqComponent<Game, State>({
  entity: gameEntity,
  name: name.game,
});

export const getGame = gameGetSet.getComponent;
export const setGame = gameGetSet.setComponent;

type GetCurrentAi = (params: { state: State }) => AI | undefined;
export const getCurrentAi: GetCurrentAi = ({ state }) => {
  const game = getGame({ state });
  const ai = getComponent<AI>({
    state,
    name: name.ai,
    entity: game?.currentPlayer || '',
  });

  return ai;
};

export const gameSystem = (state: State) =>
  createSystem<Game, State>({
    state,
    name: name.game,
    componentName: name.game,
    create,
  });
