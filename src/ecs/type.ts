import { Vector2D } from '@arekrado/vector-2d';
import { AIDifficulty } from '../systems/aiSystem';
import { GlobalSystem, System } from './createSystem';
import { Animation } from './ecsType';

export type Dictionary<Value> = { [key: string]: Value };

export type Vector3D = [number, number, number];

export type Guid = string;

export type EventHandler<Event> = (params: {
  event: Event;
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

export type Time = Component<{
  previousTimeNow: number;
  timeNow: number;
  delta: number;
}>;

export type Transform = Component<{
  rotation: [number, number, number];
  fromParentRotation: [number, number, number];
  scale: Vector2D;
  fromParentScale: Vector2D;
  position: Vector2D;
  fromParentPosition: Vector2D;
  parentId?: Guid;
}>;

export type State = {
  entity: Dictionary<Entity>;
  component: Dictionary<Dictionary<Component<any>>> & {
    box: Dictionary<Box>;
    ai: Dictionary<AI>;
    game: Dictionary<Game>;
    marker: Dictionary<Marker>;
    background: Dictionary<Background>;
    logo: Dictionary<Logo>; // todo remove?
    event: Dictionary<Event>;

    camera: Dictionary<Camera>;
    animation: Dictionary<Animation>;
    time: Dictionary<Time>;
    transform: Dictionary<Transform>;
  };
  system: Array<System<any> | GlobalSystem>;
};

export type GetDefaultComponent<X> = (
  params: Partial<Component<X>> & { entityId: Guid }
) => X;
