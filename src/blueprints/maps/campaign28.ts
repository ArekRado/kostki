import { GameMap } from '../../type'
import { green, orange, red, teal, yellow } from '../../utils/colors'
import { AIDifficulty } from '../../systems/aiSystem'

export const campaign28: Omit<GameMap, 'name'> = {
  entity: 'gameMap-campaign-28',
  campaignNumber: 28,
  locked: false,
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
      { player: 4, dots: 3 },
      { player: 4, dots: 3 },
      undefined,
      { player: 1, dots: 3 },
      { player: 1, dots: 3 },
      { player: 1, dots: 3 },
      { player: 1, dots: 3 },
    ],
    [
      { player: 4, dots: 3 },
      { player: 4, dots: 3 },
      undefined,
      { player: 1, dots: 3 },
      { player: 1, dots: 3 },
      { player: 1, dots: 3 },
      { player: 1, dots: 3 },
    ],
    [
      { player: 4, dots: 3 },
      { player: 4, dots: 3 },
      { player: 3, dots: 3 },
      { player: 3, dots: 3 },
      { player: 3, dots: 3 },
      { player: 1, dots: 3 },
      { player: 1, dots: 3 },
    ],
    [
      { player: 2, dots: 3 },
      { player: 2, dots: 3 },
      { player: 3, dots: 3 },
      { player: 3, dots: 3 },
      { player: 3, dots: 3 },
      { player: 1, dots: 3 },
      { player: 1, dots: 3 },
    ],
    [
      { player: 2, dots: 3 },
      { player: 2, dots: 3 },
      { player: 3, dots: 3 },
      { player: 3, dots: 3 },
      { player: 3, dots: 3 },
      { player: 0, dots: 3 },
      { player: 0, dots: 3 },
    ],
    [
      { player: 2, dots: 3 },
      { player: 2, dots: 3 },
      { player: 2, dots: 3 },
      { player: 2, dots: 3 },
      undefined,
      { player: 0, dots: 3 },
      { player: 0, dots: 3 },
    ],
    [
      { player: 2, dots: 3 },
      { player: 2, dots: 3 },
      { player: 2, dots: 3 },
      { player: 2, dots: 3 },
      undefined,
      { player: 0, dots: 3 },
      { player: 0, dots: 3 },
    ],
  ],
}
