import { Breakpoints } from '../blueprints/ui/responsive';
import { AIDifficulty } from '../systems/aiSystem';
import { GlobalSystem, System } from './createSystem';

export type Dictionary<Value> = { [key: string]: Value };

export type Guid = string;

export type EventHandler<ComponentData, Events> = (params: {
  event: Events;
  state: State;
  component: Component<ComponentData>;
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

export enum Scene {
  mainMenu,
  customLevel,
  customLevelSettings,
}

export type Game = Component<{
  version: string;
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
  musicEnabled: boolean;
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

export type UI = Component<{
  type: Scene;
  cleanControls: boolean;
}>;

export type UIElement = {
  position: Breakpoints<[number, number]>;
  size: Breakpoints<[number, number]>;
  maxSize?: Breakpoints<[number, number]>;
  minSize?: Breakpoints<[number, number]>;
  aspectRation?: number; // 1 is square
};

export type UIButton = Component<
  UIElement & {
    text: string;
    color?: string;
    cornerRadius?: number;
    background?: string;
    fontSize?: number;
    isPointerBlocker?: boolean;
  }
>;

export type UIImage = Component<
  UIElement & {
    url: string;
  }
>;

export type UIText = Component<
  UIElement & {
    text: string;
    color?: string;
    fontSize?: number;
  }
>;

export type Background = Component<{
  gradientTime: number;
}>;

export type TurnIndicator = Component<{
  position: [number, number];
  boxes: Entity[];
  texts: Entity[];
}>;

export type State = {
  entity: Dictionary<Entity>;
  component: Dictionary<Dictionary<Component<any>>> & {
    box: Dictionary<Box>;
    ai: Dictionary<AI>;
    game: Dictionary<Game>;
    camera: Dictionary<Camera>;
    marker: Dictionary<Marker>;
    ui: Dictionary<UI>;
    uiButton: Dictionary<UIButton>;
    uiImage: Dictionary<UIImage>;
    uiText: Dictionary<UIText>;
    background: Dictionary<Background>;
    turnIndicator: Dictionary<TurnIndicator>;
  };
  system: Array<System<any, any> | GlobalSystem>;
};

export type GetDefaultComponent<X> = (
  params: Partial<Component<X>> & { entityId: Guid }
) => X;
