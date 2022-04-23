import { GameMap } from '../../type'
import { green, orange, red, teal, yellow } from '../../utils/colors'
import { AIDifficulty } from '../../systems/aiSystem'

export const campaign29: Omit<GameMap, 'name'> = {
  entity: 'gameMap-campaign-29',
  campaignNumber: 29,
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
      { player: -1, dots: 0 },
      undefined,
      { player: -1, dots: 0 },
      { player: -1, dots: 0 },
      { player: -1, dots: 0 },
    ],
    [
      { player: -1, dots: 0 },
      { player: -1, dots: 0 },
      { player: -1, dots: 0 },
      { player: -1, dots: 0 },
      { player: -1, dots: 0 },
      { player: -1, dots: 0 },
      { player: -1, dots: 0 },
    ],
    [
      { player: -1, dots: 0 },
      { player: -1, dots: 0 },
      { player: -1, dots: 0 },
      { player: -1, dots: 0 },
      { player: -1, dots: 0 },
      undefined,
      undefined,
    ],
    [
      { player: -1, dots: 0 },
      { player: -1, dots: 0 },
      undefined,
      { player: -1, dots: 0 },
      { player: -1, dots: 0 },
      { player: -1, dots: 0 },
      { player: -1, dots: 0 },
    ],
    [
      { player: -1, dots: 0 },
      { player: -1, dots: 0 },
      undefined,
      undefined,
      { player: -1, dots: 0 },
      { player: -1, dots: 0 },
      { player: -1, dots: 0 },
    ],
    [
      { player: -1, dots: 0 },
      { player: -1, dots: 0 },
      undefined,
      undefined,
      { player: -1, dots: 0 },
      { player: -1, dots: 0 },
      { player: -1, dots: 0 },
    ],
    [
      { player: -1, dots: 0 },
      { player: -1, dots: 0 },
      { player: -1, dots: 0 },
      { player: -1, dots: 0 },
      { player: -1, dots: 0 },
      { player: -1, dots: 0 },
      undefined,
    ],
  ],
}
