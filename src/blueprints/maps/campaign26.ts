import { GameMap } from '../../type'
import { green, orange, red, teal, yellow } from '../../utils/colors'
import { AIDifficulty } from '../../systems/aiSystem'

export const campaign26: Omit<GameMap, 'name'> = {
  entity: 'gameMap-campaign-26',
  campaignNumber: 26,
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
      { player: 1, dots: 1 },
      { player: 1, dots: 1 },
      { player: 1, dots: 1 },
      { player: 1, dots: 1 },
      { player: 1, dots: 1 },
      { player: 1, dots: 4 },
    ],
    [
      { player: 4, dots: 2 },
      { player: 1, dots: 1 },
      { player: 2, dots: 1 },
      { player: 2, dots: 1 },
      { player: 1, dots: 1 },
      { player: 0, dots: 2 },
    ],
    [
      { player: 4, dots: 4 },
      { player: 4, dots: 2 },
      { player: 2, dots: 1 },
      { player: 2, dots: 1 },
      { player: 0, dots: 2 },
      { player: 0, dots: 4 },
    ],
    [
      { player: 4, dots: 2 },
      { player: 4, dots: 4 },
      { player: 2, dots: 1 },
      { player: 2, dots: 1 },
      { player: 0, dots: 4 },
      { player: 0, dots: 2 },
    ],
    [
      { player: 4, dots: 4 },
      { player: 3, dots: 1 },
      { player: 2, dots: 1 },
      { player: 2, dots: 1 },
      { player: 3, dots: 1 },
      { player: 0, dots: 4 },
    ],
    [
      { player: 3, dots: 1 },
      { player: 3, dots: 1 },
      { player: 3, dots: 1 },
      { player: 3, dots: 1 },
      { player: 3, dots: 1 },
      { player: 3, dots: 1 },
    ],
  ],
}
