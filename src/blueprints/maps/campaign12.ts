import { GameMap } from '../../type'
import { green, red, teal } from '../../utils/colors'
import { AIDifficulty } from '../../systems/aiSystem'

export const campaign12: Omit<GameMap, 'name'> = {
  entity: 'gameMap-campaign-12',
  campaignNumber: 12,
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
      { player: -1, dots: 0 },
      { player: -1, dots: 0 },
      { player: -1, dots: 0 },
      { player: -1, dots: 0 },
      { player: -1, dots: 0 },
    ],
    [
      { player: 1, dots: 1 },
      { player: 1, dots: 1 },
      { player: 1, dots: 2 },
      { player: -1, dots: 0 },
      { player: -1, dots: 0 },
    ],
    [
      { player: 0, dots: 1 },
      { player: 0, dots: 1 },
      { player: 0, dots: 6 },
      { player: -1, dots: 0 },
      { player: -1, dots: 0 },
    ],
    [
      { player: 0, dots: 1 },
      { player: 0, dots: 2 },
      { player: 1, dots: 3 },
      { player: -1, dots: 0 },
      { player: -1, dots: 0 },
    ],
    [
      { player: -1, dots: 0 },
      { player: 0, dots: 1 },
      { player: 1, dots: 1 },
      { player: -1, dots: 0 },
      { player: -1, dots: 0 },
    ],
  ],
}
