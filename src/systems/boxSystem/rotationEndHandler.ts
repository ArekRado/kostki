import { Box, name, State } from '../../type';
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

export const rotationEndHandler: EventHandler<
  BoxEvent.RotationEndEvent,
  State
> = ({ state, event }) => {
  const sceneRef = state.babylonjs.sceneRef;
  const { boxEntity, texture, color } = event.payload;
  const component = getComponent<Box, State>({
    state,
    name: name.box,
    entity: boxEntity,
  });
  const transform = getComponent<Transform>({
    state,
    name: componentName.transform,
    entity: boxEntity,
  });

  if (!component || !sceneRef || !transform) {
    return state;
  }

  state = removeBoxFromRotationQueue({ entity: component.entity, state });

  state = setComponent({
    state,
    data: {
      ...transform,
      rotation: [0, 0, 0],
    },
  });

  const boxMesh = sceneRef.getTransformNodeByUniqueId(
    parseInt(component.entity)
  );

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
      ...component,
      isAnimating: false,
    },
  });

  return state;
};
