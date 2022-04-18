import { GameMap } from '../../type'
import { red, teal } from '../../utils/colors'
import { AIDifficulty } from '../../systems/aiSystem'

export const campaign1: Omit<GameMap, 'name'> = {
  entity: 'gameMap-campaign-1',
  campaignNumber: 1,
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
      level: AIDifficulty.disabled,
    },
  ],
  grid: [
    [
      { player: 0, dots: 1 },
      { player: 0, dots: 1 },
      { player: 1, dots: 1 },
      { player: 1, dots: 6 },
    ],
    [
      { player: 0, dots: 1 },
      { player: 0, dots: 1 },
      { player: 1, dots: 1 },
      { player: 1, dots: 6 },
    ],
    [
      { player: 0, dots: 1 },
      { player: 0, dots: 6 },
      { player: 1, dots: 6 },
      { player: 1, dots: 6 },
    ],
    [
      { player: 0, dots: 1 },
      { player: 0, dots: 1 },
      { player: 1, dots: 1 },
      { player: 1, dots: 1 },
    ],
  ],
}
