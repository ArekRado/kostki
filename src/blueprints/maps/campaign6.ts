import { GameMap } from '../../type'
import { red, teal } from '../../utils/colors'
import { AIDifficulty } from '../../systems/aiSystem'

export const campaign6: Omit<GameMap, 'name'> = {
  entity: 'gameMap-campaign-6',
  campaignNumber: 6,
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
  ],
  grid: [
    [
      { player: 0, dots: 1 },
      { player: 0, dots: 1 },
      { player: 0, dots: 5 },
      { player: -1, dots: 0 },
    ],
    [
      { player: 0, dots: 5 },
      { player: -1, dots: 0 },
      { player: -1, dots: 0 },
      { player: -1, dots: 0 },
    ],
    [
      { player: -1, dots: 0 },
      { player: -1, dots: 0 },
      { player: -1, dots: 0 },
      { player: 1, dots: 5 },
    ],
    [
      { player: -1, dots: 0 },
      { player: 1, dots: 5 },
      { player: 1, dots: 1 },
      { player: 1, dots: 1 },
    ],
  ],
}
