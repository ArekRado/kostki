import { GameMap } from '../../type'
import { red, teal } from '../../utils/colors'
import { AIDifficulty } from '../../systems/aiSystem'

export const campaign2: Omit<GameMap, 'name'> = {
  entity: 'gameMap-campaign-2',
  campaignNumber: 2,
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
      level: AIDifficulty.random,
    },
  ],
  grid: [
    [
      { player: 1, dots: 3 },
      { player: 1, dots: 2 },
      { player: 1, dots: 1 },
      { player: 1, dots: 1 },
    ],
    [
      { player: 1, dots: 6 },
      { player: 1, dots: 5 },
      { player: 1, dots: 6 },
      { player: 1, dots: 3 },
    ],
    [
      { player: 1, dots: 5 },
      { player: 0, dots: 6 },
      { player: 0, dots: 5 },
      { player: 1, dots: 5 },
    ],
    [
      { player: 0, dots: 6 },
      { player: 0, dots: 6 },
      { player: 0, dots: 3 },
      { player: 0, dots: 2 },
    ],
  ],
}
