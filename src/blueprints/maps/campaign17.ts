import { GameMap } from '../../type'
import { green, red, teal } from '../../utils/colors'
import { AIDifficulty } from '../../systems/aiSystem'

export const campaign17: Omit<GameMap, 'name'> = {
  entity: 'gameMap-campaign-17',
  campaignNumber: 17,
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
      { player: 0, dots: 1 },
      { player: 2, dots: 1 },
      { player: 1, dots: 1 },
      { player: 0, dots: 1 },
      { player: 2, dots: 1 },
    ],
    [
      { player: 1, dots: 1 },
      { player: 0, dots: 1 },
      { player: 2, dots: 1 },
      { player: 1, dots: 1 },
      { player: 0, dots: 1 },
    ],
    [
      { player: 2, dots: 1 },
      { player: 1, dots: 1 },
      { player: 0, dots: 1 },
      { player: 2, dots: 1 },
      { player: 1, dots: 1 },
    ],
    [
      { player: 0, dots: 1 },
      { player: 2, dots: 1 },
      { player: 1, dots: 1 },
      { player: 0, dots: 1 },
      { player: 2, dots: 1 },
    ],
    [
      { player: 1, dots: 1 },
      { player: 0, dots: 1 },
      { player: 2, dots: 1 },
      { player: 1, dots: 1 },
      { player: 0, dots: 1 },
    ],
  ],
}
