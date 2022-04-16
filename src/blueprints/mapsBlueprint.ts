import { name, State, GameMap } from '../type'
import { createComponent } from '@arekrado/canvas-engine'
import { createEntity } from '@arekrado/canvas-engine/entity/createEntity'
import { SavedData } from '../utils/localDb'
import { red, teal } from '../utils/colors'
import { AIDifficulty } from '../systems/aiSystem'

const maps: Omit<GameMap, 'name'>[] = [
  {
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
        { player: 0, dots: 3 },
        { player: 0, dots: 2 },
        { player: 1, dots: 3 },
        { player: 1, dots: 1 },
      ],
    ],
  },
  {
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
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
      ],
    ],
  },
  {
    entity: 'gameMap-small-0',
    campaignNumber: -1,
    locked: true,
    players: [],
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
  },
  {
    entity: 'gameMap-small-1',
    campaignNumber: -1,
    locked: true,
    players: [],
    grid: [
      [
        undefined,
        undefined,
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        undefined,
      ],
      [
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        undefined,
        undefined,
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
        undefined,
        undefined,
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
      ],
      [
        undefined,
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        undefined,
        undefined,
      ],
    ],
  },
  {
    entity: 'gameMap-small-2',
    campaignNumber: -1,
    locked: true,
    players: [],
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
        undefined,
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
      ],
      [
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        undefined,
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
      ],
      [
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        undefined,
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
      ],
      [
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        undefined,
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
  },
  {
    entity: 'gameMap-medium-0',
    campaignNumber: -1,
    locked: true,
    players: [],
    grid: [
      [
        { player: -1, dots: 0 },
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
        { player: -1, dots: 0 },
      ],
      [
        { player: -1, dots: 0 },
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
        { player: -1, dots: 0 },
      ],
      [
        { player: -1, dots: 0 },
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
        { player: -1, dots: 0 },
      ],
      [
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
      ],
    ],
  },
  {
    entity: 'gameMap-medium-1',
    campaignNumber: -1,
    locked: true,
    players: [],
    grid: [
      [
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        undefined,
        undefined,
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
      ],
      [
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        undefined,
        undefined,
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
        { player: -1, dots: 0 },
      ],
      [
        { player: -1, dots: 0 },
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
        { player: -1, dots: 0 },
      ],
      [
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        undefined,
        undefined,
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
      ],
      [
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        undefined,
        undefined,
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
      ],
    ],
  },
  {
    entity: 'gameMap-medium-2',
    campaignNumber: -1,
    locked: true,
    players: [],
    grid: [
      [
        undefined,
        undefined,
        undefined,
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
      ],
      [
        undefined,
        undefined,
        undefined,
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
      ],
      [
        undefined,
        undefined,
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
        { player: -1, dots: 0 },
      ],
      [
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        undefined,
        undefined,
      ],
      [
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        undefined,
        undefined,
        undefined,
      ],
      [
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        undefined,
        undefined,
        undefined,
      ],
    ],
  },
  {
    entity: 'gameMap-0',
    campaignNumber: -1,
    locked: true,
    players: [],
    grid: [
      [
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
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
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
      ],
    ],
  },
  {
    entity: 'gameMap-1',
    campaignNumber: -1,
    locked: true,
    players: [],
    grid: [
      [
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        undefined,
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
        undefined,
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
        { player: -1, dots: 0 },
        undefined,
      ],
      [
        undefined,
        { player: -1, dots: 0 },
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
        undefined,
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
      ],
      [
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        undefined,
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
        undefined,
        { player: -1, dots: 0 },
      ],
      [
        { player: -1, dots: 0 },
        undefined,
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
      ],
    ],
  },
  {
    entity: 'gameMap-2',
    campaignNumber: -1,
    locked: true,
    players: [],
    grid: [
      [
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
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
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
      ],
      [
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        undefined,
        undefined,
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
      ],
      [
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        undefined,
        undefined,
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
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
      ],
    ],
  },
  {
    entity: 'gameMap-3',
    campaignNumber: -1,
    locked: true,
    players: [],
    grid: [
      [
        undefined,
        undefined,
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        undefined,
        undefined,
      ],
      [
        undefined,
        undefined,
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        undefined,
        undefined,
      ],
      [
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
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
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
      ],
      [
        undefined,
        undefined,
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        undefined,
        undefined,
      ],
      [
        undefined,
        undefined,
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        undefined,
        undefined,
      ],
    ],
  },
  {
    entity: 'gameMap-4',
    campaignNumber: -1,
    locked: true,
    players: [],
    grid: [
      [
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        undefined,
        undefined,
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
      ],
      [
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        undefined,
        undefined,
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
      ],
      [
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        undefined,
        undefined,
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
      ],
      [
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        undefined,
        undefined,
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
      ],
      [
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        undefined,
        undefined,
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
      ],
      [
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
        undefined,
        undefined,
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
        { player: -1, dots: 0 },
        { player: -1, dots: 0 },
      ],
    ],
  },
]

export const gameMapsBlueprint = ({
  state,
  savedData,
}: {
  state: State
  savedData: SavedData
}): State => {
  maps.forEach((map) => {
    state = createEntity({ state, entity: map.entity })

    const locked = !savedData.unlockedCampaignMapEntities.find(
      (unlockedMapEntity) => unlockedMapEntity === map.entity,
    )

    state = createComponent<GameMap, State>({
      state,
      data: {
        name: name.gameMap,
        ...map,
        locked,
      },
    })
  })

  return state
}
