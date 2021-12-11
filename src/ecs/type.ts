import { AIDifficulty } from '../systems/aiSystem';
import { GlobalSystem, System } from './createSystem';

export type Dictionary<Value> = { [key: string]: Value };

export type Guid = string;

export type EventHandler<ComponentData, Events> = (params: {
  event: Events;
  state: State;
}) => State;

export type Component<Data> = {
  entity: Guid;
  name: string;
} & Data;

export type Entity = Guid;

export type Color = [number, number, number];

export type Box = Component<{
  isAnimating: boolean;
  gridPosition: [number, number];
  dots: number;
  player: Entity | undefined;
}>;

export type AI = Component<{
  human: boolean;
  active: boolean;
  level: AIDifficulty;
  color: Color;
  textureSet: [string, string, string, string, string, string, string];
}>;

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

export type Logo = {};

export type Game = Component<{
  version: string;
  page: Page;
  moves: number;

  newVersionAvailable: boolean;
  round: number;
  grid: Entity[];
  currentPlayer: Entity;
  playersQueue: Entity[];
  boxRotationQueue: Entity[];
  gameStarted: boolean;

  customLevelSettings: {
    players: AI[];
    difficulty: AIDifficulty;
    quickStart: boolean;
    mapType: string;
  };
  colorBlindMode: boolean;
}>;

export type Camera = Component<{
  position: [number, number];
  distance: number;

  // ortho
  bottom: number;
  top: number;
  left: number;
  right: number;
}>;

export type Marker = Component<{
  color: Color;
  position: [number, number];
}>;

export type Breakpoints<Value = number> = [Value, Value, Value];

export type Background = Component<{
  gradientTime: number;
}>;

export type Event = Component<{}>;

export type State = {
  entity: Dictionary<Entity>;
  component: Dictionary<Dictionary<Component<any>>> & {
    box: Dictionary<Box>;
    ai: Dictionary<AI>;
    game: Dictionary<Game>;
    camera: Dictionary<Camera>;
    marker: Dictionary<Marker>;
    background: Dictionary<Background>;
    logo: Dictionary<Logo>;
    event: Dictionary<Event>;
  };
  system: Array<System<any, any> | GlobalSystem>;
};

export type GetDefaultComponent<X> = (
  params: Partial<Component<X>> & { entityId: Guid }
) => X;
