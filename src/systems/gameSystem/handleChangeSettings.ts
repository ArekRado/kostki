import { AI, Color, CustomLevelSettingsDifficulty, Game, name, State } from '../../type'
import { AIDifficulty } from '../aiSystem'
import {
  gray,
  green,
  orange,
  pink,
  purple,
  red,
  teal,
  yellow,
} from '../../utils/colors'
import {
  set1,
  set2,
  set3,
  set4,
  set5,
  set6,
  set7,
  set8,
} from '../../utils/textureSets'
import { gameEntity, GameEvent, getGame } from '../gameSystem'
import { humanPlayerEntity } from '../..'
import { eventBusDispatch } from '../../utils/eventBus'
import { saveStateToData } from '../../utils/localDb'
import { Entity, EventHandler, updateComponent } from '@arekrado/canvas-engine'

export const basicAI = (
  entity: Entity,
  color: Color,
  textureSet: AI['textureSet'],
  human = false,
  level = AIDifficulty.easy,
): AI => ({
  entity,
  name: name.ai,
  human,
  level,
  color,
  textureSet,
  active: true,
})

export const playersList = () => [
  basicAI(humanPlayerEntity, teal, set1, true, AIDifficulty.easy),
  basicAI('2', red, set2, false, AIDifficulty.easy),
  basicAI('3', green, set3, false, AIDifficulty.easy),
  basicAI('4', yellow, set4, false, AIDifficulty.easy),
  basicAI('5', orange, set5, false, AIDifficulty.easy),
  basicAI('6', pink, set6, false, AIDifficulty.easy),
  basicAI('7', gray, set7, false, AIDifficulty.easy),
  basicAI('8', purple, set8, false, AIDifficulty.easy),
]

export const handleChangePlayers: EventHandler<
  GameEvent.ChangePlayersEvent,
  State
> = ({ state }) => {
  const game = getGame({ state })
  if (!game) {
    return state
  }

  const playersAmount =
    game.customLevelSettings.players?.length === 8
      ? 2
      : game.customLevelSettings.players?.length + 1

  state = updateComponent<Game, State>({
    state,
    entity: gameEntity,
    name: name.game,
    update: (game) => ({
      customLevelSettings: {
        ...game.customLevelSettings,
        players: playersList().slice(0, playersAmount),
      },
    }),
  })

  eventBusDispatch('setUIState', state)
  saveStateToData(state)

  return state
}

export const handleChangeDifficulty: EventHandler<
  GameEvent.ChangeDifficultyEvent,
  State
> = ({ state }) => {
  const game = getGame({ state })
  if (!game) {
    return state
  }

  const difficultyList = [
    CustomLevelSettingsDifficulty.easy,
    CustomLevelSettingsDifficulty.medium,
    CustomLevelSettingsDifficulty.hard,
    CustomLevelSettingsDifficulty.random,
  ]

  const index = difficultyList.findIndex(
    (difficulty) => difficulty === game.customLevelSettings.difficulty,
  )

  const nextDifficulty =
    index === -1
      ? difficultyList[0]
      : difficultyList[index + 1] ?? difficultyList[0]

  state = updateComponent<Game, State>({
    state,
    entity: gameEntity,
    name: name.game,
    update: (game) => ({
      customLevelSettings: {
        ...game.customLevelSettings,
        difficulty: nextDifficulty,
      },
    }),
  })

  eventBusDispatch('setUIState', state)
  saveStateToData(state)

  return state
}

export const handleChangeQuickStart: EventHandler<
  GameEvent.ChangeQuickStartEvent,
  State
> = ({ state }) => {
  state = updateComponent<Game, State>({
    state,
    entity: gameEntity,
    name: name.game,
    update: (game) => ({
      customLevelSettings: {
        ...game.customLevelSettings,
        quickStart: !game.customLevelSettings.quickStart,
      },
    }),
  })

  eventBusDispatch('setUIState', state)
  saveStateToData(state)

  return state
}

export const handleChangeColorBlindMode: EventHandler<
  GameEvent.ChangeColorBlindModeEvent,
  State
> = ({ state }) => {
  state = updateComponent<Game, State>({
    state,
    entity: gameEntity,
    name: name.game,
    update: (game) => ({
      colorBlindMode: !game.colorBlindMode,
    }),
  })

  eventBusDispatch('setUIState', state)
  saveStateToData(state)

  return state
}

export const handleChangeMapType: EventHandler<
  GameEvent.ChangeMapTypeEvent,
  State
> = ({
  state,
  event: {
    payload: { gameMapEntity },
  },
}) => {
  state = updateComponent<Game, State>({
    state,
    entity: gameEntity,
    name: name.game,
    update: (game) => ({
      customLevelSettings: {
        ...game.customLevelSettings,
        mapEntity: gameMapEntity,
      },
    }),
  })
  eventBusDispatch('setUIState', state)
  saveStateToData(state)

  return state
}

export const handleShowNewVersion: EventHandler<
  GameEvent.ShowNewVersionEvent,
  State
> = ({ state }) => {
  // state = updateComponent<Game, State>({
  //   state,
  //   entity: gameEntity,
  //   name: name.game,
  //   update: () => ({
  //     newVersionAvailable: true,
  //   }),
  // })

  return state
}

export const handleReload: EventHandler<GameEvent.ReloadEvent, State> = ({
  state,
}) => {
  window.location.reload()
  return state
}
