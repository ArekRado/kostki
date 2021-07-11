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
  player: Entity | undefined;
}>;

export type AI = Component<{
  human: boolean;
  level: number;
  color: [number, number, number];
  textureSet: [string, string, string, string, string, string, string];
}>;

export type Game = Component<{
  round: number;
  grid: Entity[];
  currentPlayer: Entity;
  playersQueue: Entity[];
  gameStarted: boolean;
}>;

export type State = {
  entity: Dictionary<Entity>;
  component: Dictionary<Dictionary<Component<any>>> & {
    box: Dictionary<Box>;
    ai: Dictionary<AI>;
    game: Dictionary<Game>;
  };
  system: Array<System<any> | GlobalSystem>;
};

export type GetDefaultComponent<X> = (
  params: Partial<Component<X>> & { entityId: Guid }
) => X;
