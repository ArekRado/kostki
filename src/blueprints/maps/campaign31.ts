import { GameMap } from '../../type'
import { green, orange, red, teal, yellow } from '../../utils/colors'
import { AIDifficulty } from '../../systems/aiSystem'

export const campaign31: Omit<GameMap, 'name'> = {
  entity: 'gameMap-campaign-31',
  campaignNumber: 31,
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
      undefined,
      undefined,
      undefined,
      { player: 4, dots: 1 },
      { player: 0, dots: 1 },
      { player: 0, dots: 1 },
      { player: 0, dots: 1 },
    ],
    [
      { player: 3, dots: 1 },
      undefined,
      undefined,
      { player: 4, dots: 1 },
      { player: 0, dots: 1 },
      { player: 0, dots: 1 },
      { player: 0, dots: 1 },
    ],
    [
      { player: 3, dots: 1 },
      { player: 3, dots: 1 },
      undefined,
      { player: 4, dots: 1 },
      { player: 4, dots: 1 },
      { player: 1, dots: 1 },
      { player: 1, dots: 1 },
    ],
    [
      { player: 3, dots: 1 },
      { player: 3, dots: 1 },
      { player: 4, dots: 1 },
      { player: 4, dots: 6 },
      { player: 4, dots: 1 },
      { player: 1, dots: 1 },
      { player: 1, dots: 1 },
    ],
    [
      { player: 3, dots: 1 },
      { player: 3, dots: 1 },
      { player: 4, dots: 1 },
      { player: 4, dots: 1 },
      undefined,
      { player: 1, dots: 1 },
      { player: 1, dots: 1 },
    ],
    [
      { player: 2, dots: 1 },
      { player: 2, dots: 1 },
      { player: 2, dots: 1 },
      { player: 4, dots: 1 },
      undefined,
      undefined,
      { player: 1, dots: 1 },
    ],
    [
      { player: 2, dots: 1 },
      { player: 2, dots: 1 },
      { player: 2, dots: 1 },
      { player: 4, dots: 1 },
      undefined,
      undefined,
      undefined,
    ],
  ],
}
