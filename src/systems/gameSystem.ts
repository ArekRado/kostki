import {
  TransformNode,
  Animation,
  AnimationEvent,
  Color3,
  StandardMaterial,
  Texture,
  Vector3,
  Tools,
  Quaternion,
  Axis,
  Space,
  Vector2,
} from 'babylonjs';
import { createSystem } from '../ecs/createSystem';
import {
  componentName,
  getAllComponents,
  setComponent,
} from '../ecs/component';
import { AI, Box, Entity, Game, State } from '../ecs/type';
import { scene } from '..';
import { emitEvent } from '../ecs/emitEvent';

type GetGame = (params: { state: State }) => Game | undefined;
export const getGame: GetGame = ({ state }) => {
  const allGames = getAllComponents<Game>({
    name: componentName.game,
    state,
  });

  const game = Object.values(allGames || {})[0];

  return game;
};

// type SetGame = (params: { state: State; game: Game }) => State;
// export const setGame: SetGame = ({ state, game:paramGame }) => {
//   const game = getGame({ state });

//   if (game) {
//     return setComponent<Game>({
//       state,
//       data: {
//         ...game,
//         ...paramGame,

//       },
//     });
//   } else {
//     return state;
//   }
// };

export const gameSystem = (state: State) =>
  createSystem<Game>({
    state,
    name: componentName.game,
  });
