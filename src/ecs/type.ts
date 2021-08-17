import { Breakpoints } from '../blueprints/ui/responsive';
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
  level: number;
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
  round: number;
  grid: Entity[];
  currentPlayer: Entity;
  playersQueue: Entity[];
  boxRotationQueue: Entity[];
  gameStarted: boolean;
  colorBlindMode: boolean;
  quickStart: boolean;
  customLevelSettings: {
    ai: AI[];
    levelSize: number;
  };
  musicEnabled: boolean;
}>;

export type Camera = Component<{
  position: [number, number];
  distance: number;
}>;

export type Marker = Component<{
  color: Color;
  position: [number, number];
}>;

export type UI = Component<{
  type: Scene;
}>;

export type UIButton = Component<{
  text: string;
  position: Breakpoints<[number, number]>;
  size: Breakpoints<[number, number]>;
  color?: string;
  cornerRadius?: number;
  background?: string;
  fontSize?: number;
  isPointerBlocker?: boolean;
}>;

export type UIImage = Component<{
  url: string;
  position: Breakpoints<[number, number]>;
  size: Breakpoints<[number, number]>;
}>;

export type UIText = Component<{
  text: string;
  position: Breakpoints<[number, number]>;
  size: Breakpoints<[number, number]>;
  color?: string;
  fontSize?: number;
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
  };
  system: Array<System<any, any> | GlobalSystem>;
};

export type GetDefaultComponent<X> = (
  params: Partial<Component<X>> & { entityId: Guid }
) => X;
