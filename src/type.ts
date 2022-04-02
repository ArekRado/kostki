import {
  AnyStateForSystem,
  Component,
  Dictionary,
  Entity,
  InitialState,
  System,
} from '@arekrado/canvas-engine'
import { AIDifficulty } from './systems/aiSystem'

// Utils

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GITHUB_AUTH_TOKEN: string
      NODE_ENV: 'development' | 'production' | 'test'
      PORT?: string
      PWD: string
      PUBLIC_URL: string
    }
  }

  interface Window {
    loadAndMountDevtools: () => void
  }
}

export type Breakpoints<Value = number> = [Value, Value, Value]

export type Color = [number, number, number]

export enum name {
  box = 'box',
  ai = 'ai',
  game = 'game',
  marker = 'marker',
  background = 'background',
  logo = 'logo',
  gameMap = 'gameMap',
}

// Component

export type Box = Component<{
  isAnimating: boolean
  gridPosition: [number, number]
  dots: number
  player: Entity | undefined
}>

export type AI = Component<{
  human: boolean
  active: boolean
  level: AIDifficulty
  color: Color
  textureSet: [string, string, string, string, string, string, string]
}>

/**
 * @deprecated
 */
export enum Scene {
  mainMenu = 'mainMenu',
  customLevel = 'customLevel',
  customLevelSettings = 'customLevelSettings',
}

export enum Page {
  mainMenu = 'mainMenu',
  customLevel = 'customLevel',
  customLevelSettings = 'customLevelSettings',
}

export type Logo = Component<unknown>

export type Game = Component<{
  version: string
  page: Page
  moves: number
  lastBoxClickTimestamp: number
  round: number
  grid: Entity[]
  currentPlayer: Entity
  playersQueue: Entity[]
  boxRotationQueue: Entity[]
  gameStarted: boolean

  customLevelSettings: {
    players: AI[]
    difficulty: AIDifficulty
    quickStart: boolean
    mapEntity: Entity
  }
  colorBlindMode: boolean
}>

export type Marker = Component<{
  color: Color
  position: [number, number]
}>

export type GameMap = Component<{
  players: Pick<AI, 'human' | 'color' | 'level'>[]
  grid: (
    | {
        /**
         * index of players array
         */
        player?: number
        dots: number
      }
    | undefined
  )[][]
}>

// State

type Components = {
  box: Dictionary<Box>
  ai: Dictionary<AI>
  game: Dictionary<Game>
  marker: Dictionary<Marker>
  logo: Dictionary<Logo> // todo remove?
  gameMap: Dictionary<GameMap>
}

type Systems =
  | System<Box, AnyStateForSystem>
  | System<AI, AnyStateForSystem>
  | System<Game, AnyStateForSystem>
  | System<Marker, AnyStateForSystem>
  | System<Logo, AnyStateForSystem>

export type State = InitialState<Components, Systems>
