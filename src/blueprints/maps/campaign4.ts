import { GameMap } from '../../type'
import { red, teal } from '../../utils/colors'
import { AIDifficulty } from '../../systems/aiSystem'

export const campaign4: Omit<GameMap, 'name'> = {
  entity: 'gameMap-campaign-4',
  campaignNumber: 4,
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
      level: AIDifficulty.random,
    },
  ],
  grid: [
    [
      { player: 1, dots: 2 },
      { player: -1, dots: 0 },
      { player: 1, dots: 4 },
      { player: -1, dots: 0 },
    ],
    [
      { player: 0, dots: 1 },
      { player: 0, dots: 5 },
      { player: 0, dots: 2 },
      { player: 0, dots: 1 },
    ],
    [
      { player: -1, dots: 0 },
      { player: 1, dots: 3 },
      { player: -1, dots: 0 },
      { player: 1, dots: 2 },
    ],
    [
      { player: 0, dots: 4 },
      { player: 0, dots: 1 },
      { player: 0, dots: 2 },
      { player: 0, dots: 5 },
    ],
  ],
}
