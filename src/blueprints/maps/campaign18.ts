import { GameMap } from '../../type'
import { green, red, teal, yellow } from '../../utils/colors'
import { AIDifficulty } from '../../systems/aiSystem'

export const campaign18: Omit<GameMap, 'name'> = {
  entity: 'gameMap-campaign-18',
  campaignNumber: 18,
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
    {
      human: false,
      color: yellow,
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
      { player: -1, dots: 0 },
    ],
    [
      { player: -1, dots: 0 },
      { player: -1, dots: 0 },
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
      { player: -1, dots: 0 },
      { player: -1, dots: 0 },
    ],
    [
      { player: -1, dots: 0 },
      { player: -1, dots: 0 },
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
      { player: -1, dots: 0 },
      { player: -1, dots: 0 },
    ],
    [
      { player: -1, dots: 0 },
      { player: -1, dots: 0 },
      { player: -1, dots: 0 },
      { player: -1, dots: 0 },
      { player: -1, dots: 0 },
      { player: -1, dots: 0 },
    ],
  ],
}
