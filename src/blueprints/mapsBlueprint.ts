import { name, State, GameMap } from '../type'
import { createComponent, generateEntity } from '@arekrado/canvas-engine'
import { createEntity } from '@arekrado/canvas-engine/entity/createEntity'
import { AIDifficulty } from '../systems/aiSystem'
import {
  gray,
  green,
  teal,
  orange,
  yellow,
  red,
  pink,
  purple,
} from '../utils/colors'

const maps: Omit<GameMap, 'entity' | 'name'>[] = [
  {
    players: [
      {
        human: true,
        level: AIDifficulty.easy,
        color: teal,
      },
      {
        human: false,
        level: AIDifficulty.easy,
        color: green,
      },
      {
        human: false,
        level: AIDifficulty.easy,
        color: red,
      },
    ],
    grid: [
      [
        { player: 1, dots: 1 },
        { player: 2, dots: 2 },
        { player: 3, dots: 3 },
        { player: 3, dots: 3 },
        { player: 3, dots: 3 },
      ],
      [
        { player: 1, dots: 1 },
        { player: 2, dots: 2 },
        { player: 3, dots: 3 },
        { player: 3, dots: 3 },
        { player: 3, dots: 3 },
      ],
      [
        { player: 1, dots: 1 },
        { player: 2, dots: 2 },
        { player: 3, dots: 3 },
        { player: 3, dots: 3 },
        { player: 3, dots: 3 },
      ],
    ],
  },
  {
    players: [
      {
        human: true,
        level: AIDifficulty.easy,
        color: teal,
      },
      {
        human: false,
        level: AIDifficulty.easy,
        color: green,
      },
      {
        human: false,
        level: AIDifficulty.easy,
        color: red,
      },
    ],
    grid: [
      [
        { player: 1, dots: 1 },
        { player: 2, dots: 2 },
        { player: 3, dots: 3 },
        { player: 3, dots: 3 },
      ],
      [{ player: 1, dots: 1 }, undefined, undefined, { player: 3, dots: 3 }],
      [{ player: 1, dots: 1 }, undefined, undefined, { player: 3, dots: 3 }],
      [
        { player: 1, dots: 1 },
        { player: 2, dots: 2 },
        { player: 3, dots: 3 },
        { player: 3, dots: 3 },
      ],
    ],
  },
  {
    players: [
      {
        human: true,
        level: AIDifficulty.easy,
        color: teal,
      },
      {
        human: false,
        level: AIDifficulty.easy,
        color: green,
      },
      {
        human: false,
        level: AIDifficulty.easy,
        color: red,
      },
    ],
    grid: [
      [
        { player: 1, dots: 1 },
        { player: 2, dots: 2 },
        { player: 3, dots: 3 },
      ],
      [
        { player: 1, dots: 1 },
        { player: 2, dots: 2 },
        { player: 3, dots: 3 },
      ],
      [
        { player: 1, dots: 1 },
        { player: 2, dots: 2 },
        { player: 3, dots: 3 },
      ],
      [
        { player: 1, dots: 1 },
        { player: 2, dots: 2 },
        { player: 3, dots: 3 },
      ],
    ],
  },
  {
    players: [
      {
        human: true,
        level: AIDifficulty.easy,
        color: teal,
      },
      {
        human: false,
        level: AIDifficulty.easy,
        color: green,
      },
      {
        human: false,
        level: AIDifficulty.easy,
        color: red,
      },
    ],
    grid: [
      [
        { player: 1, dots: 1 },
        { player: 2, dots: 2 },
        { player: 3, dots: 3 },
      ],
      [
        { player: 1, dots: 1 },
        { player: 2, dots: 2 },
        { player: 3, dots: 3 },
      ],
      [
        { player: 1, dots: 1 },
        { player: 2, dots: 2 },
        { player: 3, dots: 3 },
      ],
    ],
  },
]

export const gameMapsBlueprint = ({ state }: { state: State }): State => {
  maps.forEach((map) => {
    const entity = generateEntity({ name: 'gameMap' })
    state = createEntity({ state, entity })

    state = createComponent<GameMap, State>({
      state,
      data: {
        name: name.gameMap,
        entity,
        ...map,
      },
    })
  })

  return state
}
