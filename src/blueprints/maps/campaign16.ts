import { GameMap } from '../../type'
import { green, red, teal } from '../../utils/colors'
import { AIDifficulty } from '../../systems/aiSystem'

export const campaign16: Omit<GameMap, 'name'> = {
  entity: 'gameMap-campaign-16',
  campaignNumber: 16,
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
  ],
  grid: [
    [
      { player: 2, dots: 6 },
      { player: 0, dots: 3 },
      { player: 0, dots: 6 },
      undefined,
      { player: 1, dots: 6 },
    ],
    [
      { player: 2, dots: 1 },
      { player: 2, dots: 6 },
      { player: 0, dots: 3 },
      { player: 1, dots: 6 },
      { player: 1, dots: 1 },
    ],
    [
      { player: 2, dots: 6 },
      undefined,
      { player: 0, dots: 6 },
      { player: 0, dots: 3 },
      { player: 1, dots: 6 },
    ],
    [
      { player: 2, dots: 1 },
      { player: 2, dots: 6 },
      { player: 0, dots: 3 },
      { player: 1, dots: 6 },
      { player: 1, dots: 1 },
    ],
    [
      { player: 2, dots: 6 },
      { player: 0, dots: 3 },
      { player: 0, dots: 6 },
      undefined,
      { player: 1, dots: 6 },
    ],
  ],
}
