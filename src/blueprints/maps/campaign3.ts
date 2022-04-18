import { GameMap } from '../../type'
import { red, teal } from '../../utils/colors'
import { AIDifficulty } from '../../systems/aiSystem'

export const campaign3: Omit<GameMap, 'name'> = {
  entity: 'gameMap-campaign-3',
  campaignNumber: 3,
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
      { player: 1, dots: 1 },
      { player: 1, dots: 1 },
      { player: 1, dots: 1 },
      { player: 1, dots: 1 },
    ],
    [
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
    ],
    [
      { player: 0, dots: 1 },
      { player: 0, dots: 1 },
      { player: 0, dots: 1 },
      { player: 0, dots: 1 },
    ],
  ],
}
