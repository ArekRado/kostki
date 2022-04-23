import { GameMap } from '../../type'
import { green, red, teal, yellow } from '../../utils/colors'
import { AIDifficulty } from '../../systems/aiSystem'

export const campaign23: Omit<GameMap, 'name'> = {
  entity: 'gameMap-campaign-23',
  campaignNumber: 23,
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
  ],
  grid: [
    [
      undefined,
      undefined,
      { player: 3, dots: 1 },
      { player: 3, dots: 1 },
      undefined,
      undefined,
    ],
    [
      undefined,
      { player: 1, dots: 1 },
      { player: 3, dots: 1 },
      { player: 3, dots: 1 },
      { player: 3, dots: 1 },
      undefined,
    ],
    [
      { player: 1, dots: 1 },
      { player: 1, dots: 1 },
      { player: 1, dots: 1 },
      { player: 3, dots: 1 },
      { player: 2, dots: 1 },
      { player: 2, dots: 1 },
    ],
    [
      { player: 1, dots: 1 },
      { player: 1, dots: 1 },
      { player: 0, dots: 1 },
      { player: 2, dots: 1 },
      { player: 2, dots: 1 },
      { player: 2, dots: 1 },
    ],
    [
      undefined,
      { player: 0, dots: 1 },
      { player: 0, dots: 1 },
      { player: 0, dots: 1 },
      { player: 2, dots: 1 },
      undefined,
    ],
    [
      undefined,
      undefined,
      { player: 0, dots: 1 },
      { player: 0, dots: 1 },
      undefined,
      undefined,
    ],
  ],
}
