import { GameMap } from '../../type'
import { red, teal } from '../../utils/colors'
import { AIDifficulty } from '../../systems/aiSystem'

export const campaign8: Omit<GameMap, 'name'> = {
  entity: 'gameMap-campaign-8',
  campaignNumber: 8,
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
      { player: 0, dots: 1 },
      { player: 0, dots: 1 },
    ],
    [
      undefined,
      { player: 1, dots: 2 },
      { player: -1, dots: 0 },
      { player: 1, dots: 2 },
    ],
    [
      { player: 1, dots: 2 },
      { player: -1, dots: 0 },
      { player: 1, dots: 2 },
      undefined,
    ],
    [
      { player: 0, dots: 1 },
      { player: 0, dots: 1 },
      { player: 0, dots: 1 },
      { player: 0, dots: 1 },
    ],
  ],
}
