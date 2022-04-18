import { GameMap } from '../../type'
import { red, teal } from '../../utils/colors'
import { AIDifficulty } from '../../systems/aiSystem'

export const campaign0: Omit<GameMap, 'name'> = {
  entity: 'gameMap-campaign-0',
  campaignNumber: 0,
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
      { player: 0, dots: 2 },
      { player: 0, dots: 1 },
      { player: 0, dots: 2 },
    ],
    [
      { player: 0, dots: 1 },
      { player: 0, dots: 2 },
      { player: 0, dots: 3 },
      { player: 0, dots: 1 },
    ],
    [
      { player: 0, dots: 2 },
      { player: 0, dots: 4 },
      { player: 1, dots: 4 },
      { player: 1, dots: 2 },
    ],
    [
      { player: 0, dots: 2 },
      { player: 0, dots: 5 },
      { player: 1, dots: 3 },
      { player: 1, dots: 1 },
    ],
  ],
}
