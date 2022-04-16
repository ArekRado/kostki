import {
  AI,
  Box,
  Game,
  State,
  Marker,
  Page,
  name,
  GameMap,
  CustomLevelSettingsDifficulty,
} from '../../type'
import {
  gameEntity,
  GameEvent,
  getGame,
  setGame,
  shakeAnimationTimeout,
} from '../gameSystem'
import { generateId } from '../../utils/generateId'
import { aiBlueprint } from '../../blueprints/aiBlueprint'
import { getNextPlayer } from './getNextPlayer'
import { getAiMove } from '../aiSystem/getAiMove'
import { getNextDots, onClickBox } from '../boxSystem/onClickBox'
import { markerEntity } from '../markerSystem'
import { eventBusDispatch } from '../../utils/eventBus'
import { playLevelStartAnimation } from './playLevelStartAnimation'
import {
  createComponent,
  emitEvent,
  Entity,
  generateEntity,
  getComponent,
  getComponentsByName,
  setEntity,
  updateComponent,
} from '@arekrado/canvas-engine'
import { setCamera } from '../../wrappers/setCamera'
import { getTime } from '@arekrado/canvas-engine/system/time'
import { playersList } from './handleChangeSettings'
import { clamp } from '../../utils/js/clamp'
import { boxGap, boxWithGap } from '../boxSystem/boxSizes'
import { AIDifficulty } from '../aiSystem'

const mapCustomLevelSettingsDifficultyToAIDifficulty = (
  customLevelSettingsDifficulty: CustomLevelSettingsDifficulty,
): AIDifficulty => {
  switch (customLevelSettingsDifficulty) {
    case CustomLevelSettingsDifficulty.easy:
      return AIDifficulty.easy
    case CustomLevelSettingsDifficulty.medium:
      return AIDifficulty.medium
    case CustomLevelSettingsDifficulty.hard:
      return AIDifficulty.hard
    case CustomLevelSettingsDifficulty.random:
      const index = Math.floor(Math.random() * 3)
      return [AIDifficulty.easy, AIDifficulty.medium, AIDifficulty.hard][index]
  }
}

export const getGridDimensions = ({
  grid,
}: {
  grid: GameMap['grid'] | undefined
}) => {
  const gridWidth = grid?.[0] ? grid?.[0].length * boxWithGap : boxWithGap
  const gridHeight = grid !== undefined ? grid.length * boxWithGap : boxWithGap
  const longerDimension = gridWidth > gridHeight ? gridWidth : gridHeight

  const center = [(gridHeight - boxWithGap) / 2, (gridWidth - boxWithGap) / 2]

  return {
    center,
    cameraDistance: clamp({
      value: longerDimension / 2 + boxGap,
      min: 3,
      max: Infinity,
    }),
  }
}

const centerCameraInMapCenter = ({
  state,
  mapEntity,
}: {
  state: State
  mapEntity: Entity
}) => {
  const gameMap = getComponent<GameMap>({
    state,
    name: name.gameMap,
    entity: mapEntity,
  })

  const { center, cameraDistance } = getGridDimensions({ grid: gameMap?.grid })

  return setCamera({
    state,
    data: {
      position: [center[0], center[1]],
      distance: cameraDistance,
    },
  })
}

const createGrid = ({
  state,
  gameMap,
}: {
  state: State
  gameMap: GameMap
}): State => {
  const players = Object.values(
    getComponentsByName<AI>({ state, name: name.ai }) ?? {},
  )

  const getPlayer = (index: number | undefined) => {
    const color = gameMap.players[index ?? -1]?.color

    if (color) {
      return players.find(
        (player) =>
          player.color[0] === color[0] &&
          player.color[1] === color[1] &&
          player.color[2] === color[2],
      )?.entity
    }

    return undefined
  }
  return gameMap.grid.reduce(
    (acc: State, row, x) =>
      row.reduce((acc2: State, box, y) => {
        if (!box) {
          return acc2
        }

        const entity = generateId().toString()
        acc2 = setEntity({ state: acc2, entity })
        acc2 = createComponent<Box, State>({
          state: acc2,
          data: {
            name: name.box,
            entity,
            isAnimating: false,
            dots: box.dots,
            gridPosition: [y, x],
            player: box.player === -1 ? undefined : getPlayer(box.player),
          },
        })

        const game = getGame({ state: acc2 })

        if (!game) {
          return acc2
        }

        return setGame({
          state: acc2,
          data: {
            ...game,
            grid: [...game.grid, entity],
          },
        })
      }, acc),
    state,
  )
}

type SetLevelFromGameSettings = (params: { state: State }) => State
export const setLevelFromGameSettings: SetLevelFromGameSettings = ({
  state,
}) => {
  const game = getGame({ state })

  if (!game) {
    return state
  }

  const gameMap = getComponent<GameMap, State>({
    state,
    name: name.gameMap,
    entity: game.customLevelSettings.mapEntity,
  })

  if (!gameMap) {
    return state
  }

  state = aiBlueprint({
    state,
    ai: game.customLevelSettings.players.map((ai) => ({
      ...ai,
      level: mapCustomLevelSettingsDifficultyToAIDifficulty(
        game.customLevelSettings.difficulty,
      ),
    })),
  })

  state = createGrid({ state, gameMap })

  return state
}

type SetLevelFromMapEntity = (params: {
  state: State
  mapEntity: Entity
}) => State
export const setLevelFromMapEntity: SetLevelFromMapEntity = ({
  state,
  mapEntity,
}) => {
  const game = getGame({ state })

  if (!game) {
    return state
  }

  const gameMap = getComponent<GameMap, State>({
    state,
    name: name.gameMap,
    entity: mapEntity,
  })

  if (!gameMap) {
    return state
  }

  state = aiBlueprint({
    state,
    ai: gameMap.players.map((ai, i) => ({
      ...ai,
      name: name.ai,
      entity: generateEntity({ name: 'ai' }),
      active: true,
      textureSet: playersList()[i].textureSet,
    })),
  })

  state = createGrid({ state, gameMap })

  return state
}

type RunQuickStart = (params: { state: State }) => State
export const runQuickStart: RunQuickStart = ({ state }) => {
  const game = getGame({ state })
  const gridLength = game?.grid.length || 1
  const playersLength = game?.customLevelSettings.players.length || 1
  // Run same amount of moves as boxes in a grid
  const movesAmout = gridLength - (gridLength % playersLength)

  const newState = Array.from({ length: movesAmout * 2 }).reduce(
    (acc: State) => {
      const game = getGame({ state: acc })

      const currentAi = getComponent<AI>({
        state: acc,
        name: name.ai,
        entity: game?.currentPlayer || '',
      })

      if (!game || !currentAi) {
        return acc
      }

      const box = getAiMove({
        state: acc,
        ai: currentAi,
        preferEmptyBoxes: true,
      })

      if (!box) {
        return acc
      }

      acc = updateComponent<Box, State>({
        state: acc,
        name: name.box,
        entity: box.entity,
        update: () => ({
          player: currentAi.entity,
          dots: getNextDots(box.dots),
        }),
      })

      acc = updateComponent<Game, State>({
        state: acc,
        name: name.game,
        entity: gameEntity,
        update: () => ({
          currentPlayer: getNextPlayer({ state: acc })?.entity || '',
        }),
      })

      return acc
    },
    state,
  )

  return newState || state
}

export const startLevel = ({
  state,
  mapEntity,
}: {
  state: State
  mapEntity: Entity
}) => {
  playLevelStartAnimation({ state })

  state = setGame({
    state,
    data: {
      gameStarted: true,
      page: Page.customLevel,
    },
  })

  const currentAi = getComponent<AI>({
    state,
    name: name.ai,
    entity: getGame({ state })?.currentPlayer || '',
  })

  if (currentAi && !currentAi.human) {
    const box = getAiMove({ state, ai: currentAi })

    if (box) {
      state = onClickBox({ box, state, ai: currentAi })
    }
  }

  state = setEntity({ state, entity: markerEntity })
  state = createComponent<Marker, State>({
    state,
    data: {
      entity: markerEntity,
      name: name.marker,
      color: [1, 1, 1],
      position: [0, 0],
    },
  })

  eventBusDispatch('setUIState', state)

  if (currentAi) {
    setTimeout(() => {
      emitEvent<GameEvent.ShakeAiBoxesEvent>({
        type: GameEvent.Type.shakeAiBoxes,
        payload: {
          ai: currentAi,
        },
      })
    }, shakeAnimationTimeout)
  }

  state = updateComponent<Game, State>({
    state,
    name: name.game,
    entity: gameEntity,
    update: () => ({ lastBoxClickTimestamp: getTime({ state })?.timeNow || 0 }),
  })

  state = centerCameraInMapCenter({ state, mapEntity })

  eventBusDispatch('setUIState', state)

  return state
}
