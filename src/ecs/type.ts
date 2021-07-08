import { GlobalSystem, System } from './createSystem';

export type Dictionary<Value> = { [key: string]: Value };

export type Guid = string;

export type Component<Data> = {
  entity: Guid;
  name: string;
} & Data;

export type Entity = Guid;

export type Box = Component<{
  isAnimating: boolean;
  gridPosition: [number, number];
  dots: number;
  player: Guid,
}>;

export type AI = Component<{
  isHuman: boolean;
  level: number;
  color: [];
  textureSet: string;
}>;

export type Game = Component<{
  round: number;
  grid: Guid[];
}>;

export type State = {
  entity: Dictionary<Entity>;
  component: Dictionary<Dictionary<Component<any>>> & {
    box: Dictionary<Box>;
    ai: Dictionary<AI>;
    game: Dictionary<Game>;
  };
  system: Array<System<any> | GlobalSystem>;
  enableBabylonjs: boolean;
};

export type GetDefaultComponent<X> = (
  params: Partial<Component<X>> & { entityId: Guid }
) => X;
