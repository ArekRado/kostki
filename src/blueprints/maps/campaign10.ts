import { GameMap } from '../../type'
import { red, teal } from '../../utils/colors'
import { AIDifficulty } from '../../systems/aiSystem'

export const campaign10: Omit<GameMap, 'name'> = {
  entity: 'gameMap-campaign-10',
  campaignNumber: 10,
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
      { player: 0, dots: 4 },
      { player: 1, dots: 4 },
      { player: 0, dots: 4 },
      { player: 1, dots: 4 },
      { player: 0, dots: 4 },
    ],
    [
      { player: 1, dots: 4 },
      { player: 0, dots: 4 },
      { player: 1, dots: 4 },
      { player: 0, dots: 4 },
      { player: 1, dots: 4 },
    ],
    [
      { player: 0, dots: 4 },
      { player: 1, dots: 4 },
      { player: 0, dots: 4 },
      { player: 1, dots: 4 },
      { player: 0, dots: 4 },
    ],
    [
      { player: 1, dots: 4 },
      { player: 0, dots: 4 },
      { player: 1, dots: 4 },
      { player: 0, dots: 4 },
      { player: 1, dots: 4 },
    ],
    [
      { player: 0, dots: 4 },
      { player: 1, dots: 4 },
      { player: 0, dots: 4 },
      { player: 1, dots: 4 },
      { player: 0, dots: 4 },
    ],
  ],
}
