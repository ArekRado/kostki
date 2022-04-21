import { GameMap } from '../../type'
import { red, teal } from '../../utils/colors'
import { AIDifficulty } from '../../systems/aiSystem'

export const campaign7: Omit<GameMap, 'name'> = {
  entity: 'gameMap-campaign-7',
  campaignNumber: 7,
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
      undefined,
      { player: 0, dots: 1 },
      { player: 0, dots: 1 },
      undefined,
    ],
    [
      { player: 1, dots: 1 },
      { player: -1, dots: 0 },
      { player: -1, dots: 0 },
      { player: 1, dots: 1 },
    ],
    [
      { player: 1, dots: 1 },
      { player: -1, dots: 0 },
      { player: -1, dots: 0 },
      { player: 1, dots: 1 },
    ],
    [
      undefined,
      { player: 0, dots: 1 },
      { player: 0, dots: 1 },
      undefined,
    ],
  ],
}
