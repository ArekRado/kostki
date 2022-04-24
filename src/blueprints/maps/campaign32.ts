import { GameMap } from '../../type'
import { green, orange, red, teal, yellow } from '../../utils/colors'
import { AIDifficulty } from '../../systems/aiSystem'

export const campaign32: Omit<GameMap, 'name'> = {
  entity: 'gameMap-campaign-32',
  campaignNumber: 32,
  locked: true,
  players: [
    {
      human: true,
      color: teal,
      level: AIDifficulty.easy,
    },
    {
      human: false,
      color: red,
      level: AIDifficulty.easy,
    },
    {
      human: false,
      color: green,
      level: AIDifficulty.easy,
    },
    {
      human: false,
      color: yellow,
      level: AIDifficulty.easy,
    },
    {
      human: false,
      color: orange,
      level: AIDifficulty.medium,
    },
  ],
  grid: [
    [
      { player: 0, dots: 1 },
      { player: 0, dots: 6 },
      { player: 0, dots: 1 },
      { player: 3, dots: 1 },
      { player: 0, dots: 1 },
      { player: 0, dots: 6 },
      { player: 0, dots: 1 },
    ],
    [
      { player: 0, dots: 6 },
      { player: 3, dots: 6 },
      { player: 0, dots: 6 },
      { player: 2, dots: 1 },
      { player: 0, dots: 6 },
      { player: 2, dots: 6 },
      { player: 0, dots: 6 },
    ],
    [
      { player: 0, dots: 1 },
      { player: 0, dots: 6 },
      { player: 0, dots: 1 },
      { player: 1, dots: 1 },
      { player: 0, dots: 1 },
      { player: 0, dots: 6 },
      { player: 0, dots: 1 },
    ],
    [
      { player: 3, dots: 1 },
      { player: 2, dots: 1 },
      { player: 1, dots: 1 },
      { player: 4, dots: 6 },
      { player: 1, dots: 1 },
      { player: 2, dots: 1 },
      { player: 3, dots: 1 },
    ],
    [
      { player: 0, dots: 1 },
      { player: 0, dots: 6 },
      { player: 0, dots: 1 },
      { player: 1, dots: 1 },
      { player: 0, dots: 1 },
      { player: 0, dots: 5 },
      { player: 0, dots: 1 },
    ],
    [
      { player: 0, dots: 6 },
      { player: 1, dots: 6 },
      { player: 0, dots: 6 },
      { player: 2, dots: 1 },
      { player: 0, dots: 5 },
      { player: 4, dots: 6 },
      { player: 0, dots: 5 },
    ],
    [
      { player: 0, dots: 1 },
      { player: 0, dots: 6 },
      { player: 0, dots: 1 },
      { player: 3, dots: 1 },
      { player: 0, dots: 1 },
      { player: 0, dots: 5 },
      { player: 0, dots: 1 },
    ],
  ],
}
