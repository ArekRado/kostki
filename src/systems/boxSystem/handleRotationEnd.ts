import { AI, Box, name, State } from '../../type';
import { BoxEvent } from '../boxSystem';
import { removeBoxFromRotationQueue } from './removeBoxFromRotationQueue';
import {
  EventHandler,
  getComponent,
  setComponent,
} from '@arekrado/canvas-engine';
import { componentName } from '@arekrado/canvas-engine';
import { Transform } from '@arekrado/canvas-engine';
import { setMeshTexture } from '../../utils/setMeshTexture';
import { boxExplosion } from './boxExplosion';
import { getGame } from '../gameSystem';
import { startNextTurn } from '../gameSystem/handleNextTurn';

export const handleRotationEnd: EventHandler<
  BoxEvent.RotationEndEvent,
  State
> = ({ state, event }) => {
  const sceneRef = state.babylonjs.sceneRef;
  const { boxEntity, texture, color, nextTurn } = event.payload;
  const box = getComponent<Box, State>({
    state,
    name: name.box,
    entity: boxEntity,
  });
  const transform = getComponent<Transform>({
    state,
    name: componentName.transform,
    entity: boxEntity,
  });

  if (!box || !sceneRef || !transform) {
    return state;
  }

  state = removeBoxFromRotationQueue({ entity: box.entity, state });

  state = setComponent({
    state,
    data: {
      ...transform,
      rotation: [0, 0, 0],
    },
  });

  const boxMesh = sceneRef.getTransformNodeByUniqueId(parseInt(box.entity));

  if (boxMesh) {
    boxMesh.getChildren().forEach((plane) => {
      const mesh = sceneRef.getMeshByUniqueId(plane.uniqueId);
      if (mesh) {
        setMeshTexture({
          mesh,
          color,
          texture,
          scene: sceneRef,
        });
      }
    });
  }

  state = setComponent<Box, State>({
    state,
    data: {
      ...box,
      isAnimating: false,
    },
  });

  const game = getGame({ state });
  const ai = getComponent<AI, State>({
    state,
    name: name.ai,
    entity: box?.player || '',
  });

  if (nextTurn && ai && game && box) {
    const shouldExplode = box.dots === 1;

    if (shouldExplode) {
      state = boxExplosion({
        state,
        box,
        ai,
      });
    } else {
      if (game.boxRotationQueue.length === 0) {
        state = startNextTurn({ state });
      }
    }
  }

  return state;
};
