import { GameMap } from '../../type'
import { green, red, teal, yellow } from '../../utils/colors'
import { AIDifficulty } from '../../systems/aiSystem'

export const campaign21: Omit<GameMap, 'name'> = {
  entity: 'gameMap-campaign-21',
  campaignNumber: 21,
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
  ],
  grid: [
    [
      { player: 1, dots: 1 },
      { player: 1, dots: 1 },
      { player: 3, dots: 1 },
      { player: 3, dots: 1 },
      { player: 0, dots: 1 },
      { player: 0, dots: 1 },
    ],
    [
      { player: 1, dots: 1 },
      { player: 1, dots: 1 },
      { player: 3, dots: 1 },
      { player: 3, dots: 1 },
      { player: 0, dots: 4 },
      { player: 0, dots: 1 },
    ],
    [
      { player: 1, dots: 1 },
      { player: 1, dots: 1 },
      { player: 3, dots: 1 },
      { player: 3, dots: 1 },
      { player: 3, dots: 1 },
      undefined,
    ],
    [
      { player: 1, dots: 1 },
      { player: 1, dots: 1 },
      undefined,
      { player: 2, dots: 1 },
      { player: 2, dots: 1 },
      undefined,
    ],
    [
      { player: 1, dots: 1 },
      undefined,
      undefined,
      { player: 2, dots: 1 },
      { player: 2, dots: 1 },
      { player: 2, dots: 1 },
    ],
    [
      undefined,
      undefined,
      undefined,
      { player: 2, dots: 1 },
      { player: 2, dots: 1 },
      { player: 2, dots: 1 },
    ],
  ],
}
