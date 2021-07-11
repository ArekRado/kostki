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
  getComponent,
  setComponent,
} from '../ecs/component';
import { AI, Box, Entity, Game, State } from '../ecs/type';
import { scene } from '..';
import { emitEvent } from '../ecs/emitEvent';
import { aiEvents, getAiMove, makeMove } from './aiSystem';
import { boxEvents } from './boxSystem';

export const gameEntity = 'game';

export const gameEvents = {
  startLevel: 'game-startLevel',
  nextTurn: 'game-nextTurn',
};

type GetGame = (params: { state: State }) => Game | undefined;
export const getGame: GetGame = ({ state }) => {
  return getComponent<Game>({
    state,
    entity: gameEntity,
    name: componentName.game,
  });
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

const getRandomAi = ({ state }: { state: State }): AI => {
  const allAi = getAllComponents<AI>({ name: componentName.ai, state }) || {};
  const aiList = Object.values(allAi);
  const randomIndex = Math.floor(Math.random() * aiList.length);
  return aiList[randomIndex];
};

export const gameSystem = (state: State) =>
  createSystem<Game>({
    state,
    name: componentName.game,
    event: {
      [gameEvents.startLevel]: ({ state, component }) => {
        const { currentPlayer } = component;

        const currentAi = getComponent<AI>({
          name: componentName.ai,
          state,
          entity: currentPlayer,
        });

        const ai = currentAi ? currentAi : getRandomAi({ state });

        state = setComponent<Game>({
          state,
          data: {
            ...component,
            currentPlayer: ai.entity,
          },
        });

        state = makeMove({ state, ai });

        return state;
      },

      [gameEvents.nextTurn]: ({ state, component }) => {
        const { currentPlayer, gameStarted } = component;

        if (gameStarted) {
          const nextPlayerIndex = component.playersQueue.findIndex(
            (entity) => currentPlayer === entity
          );

          const nextPlayer =
            component.playersQueue[nextPlayerIndex + 1] ||
            component.playersQueue[0];

          const ai = getComponent<AI>({
            name: componentName.ai,
            state,
            entity: nextPlayer,
          });

          if (!ai) {
            return state;
          }

          state = setComponent<Game>({
            state,
            data: {
              ...component,
              currentPlayer: ai.entity,
            },
          });

          // emitEvent({
          //   type: aiEvents.makeMove,
          //   entity: aiEntity,
          //   payload: {},
          // });
          state = makeMove({ state, ai });
        }

        return state;
      },
    },
  });
