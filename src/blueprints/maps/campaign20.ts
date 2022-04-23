import { GameMap } from '../../type'
import { green, red, teal, yellow } from '../../utils/colors'
import { AIDifficulty } from '../../systems/aiSystem'

export const campaign20: Omit<GameMap, 'name'> = {
  entity: 'gameMap-campaign-20',
  campaignNumber: 20,
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
      { player: 2, dots: 4 },
      { player: 2, dots: 3 },
      undefined,
      undefined,
      { player: 0, dots: 3 },
      { player: 0, dots: 4 },
    ],
    [
      { player: 2, dots: 3 },
      { player: -1, dots: 0 },
      { player: -1, dots: 0 },
      { player: -1, dots: 0 },
      { player: -1, dots: 0 },
      { player: 0, dots: 3 },
    ],
    [
      undefined,
      { player: -1, dots: 0 },
      { player: -1, dots: 0 },
      { player: -1, dots: 0 },
      { player: -1, dots: 0 },
      undefined,
    ],
    [
      undefined,
      { player: -1, dots: 0 },
      { player: -1, dots: 0 },
      { player: -1, dots: 0 },
      { player: -1, dots: 0 },
      undefined,
    ],
    [
      { player: 3, dots: 3 },
      { player: -1, dots: 0 },
      { player: -1, dots: 0 },
      { player: -1, dots: 0 },
      { player: -1, dots: 0 },
      { player: 1, dots: 3 },
    ],
    [
      { player: 3, dots: 4 },
      { player: 3, dots: 3 },
      undefined,
      undefined,
      { player: 1, dots: 3 },
      { player: 1, dots: 4 },
    ],
  ],
}
