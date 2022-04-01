import { AI, Box, Game, State, Marker, Page, name, GameMap } from '../../type'
import {
  gameEntity,
  GameEvent,
  getGame,
  setGame,
  shakeAnimationTimeout,
} from '../gameSystem'
import { generateId } from '../../utils/generateId'
import { aiBlueprint } from '../../blueprints/aiBlueprint'
import { getGridDimensions } from '../../blueprints/gridBlueprint'
import { getNextPlayer } from './getNextPlayer'
import { getAiMove } from '../aiSystem/getAiMove'
import { getNextDots, onClickBox } from '../boxSystem/onClickBox'
import { markerEntity } from '../markerSystem'
import { eventBusDispatch } from '../../utils/eventBus'
import { playLevelStartAnimation } from './playLevelStartAnimation'
import {
  createComponent,
  emitEvent,
  EventHandler,
  getComponent,
  setEntity,
  updateComponent,
} from '@arekrado/canvas-engine'
import { setCamera } from '../../wrappers/setCamera'
import { getTime } from '@arekrado/canvas-engine/system/time'

type setLevelFromSettings = (params: { state: State; game: Game }) => State
export const setLevelFromSettings: setLevelFromSettings = ({ state, game }) => {
  const gameMap = getComponent<GameMap, State>({
    state,
    name: name.gameMap,
    entity: game.customLevelSettings.mapType,
  })

  if (!gameMap) {
    return state
  }

  state = gameMap.grid.reduce(
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
            dots: 0,
            gridPosition: [y, x],
            player: undefined,
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

  state = aiBlueprint({
    state,
    ai: game.customLevelSettings.players.map((ai) => ({
      ...ai,
      level: game.customLevelSettings.difficulty,
    })),
  })

  const { center, cameraDistance } = getGridDimensions({ state })

  state = setCamera({
    state,
    data: {
      position: [center[0], center[1]],
      distance: cameraDistance,
    },
  })

  return state
}

type RunQuickStart = (params: { state: State }) => State
const runQuickStart: RunQuickStart = ({ state }) => {
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

export const handleStartCustomLevel: EventHandler<
  GameEvent.StartCustomLevelEvent,
  State
> = ({ state }) => {
  const component = getGame({ state })
  if (!component) {
    return state
  }

  state = setLevelFromSettings({ state, game: component })

  state = setGame({
    state,
    data: {
      currentPlayer: getNextPlayer({ state })?.entity,
    },
  })

  const game = getGame({ state })

  if (game?.customLevelSettings.quickStart) {
    state = runQuickStart({ state })
  }

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

  return state
}
