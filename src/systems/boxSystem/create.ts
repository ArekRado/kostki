import {
  componentName,
  getComponent,
  setComponent,
  Transform,
} from '@arekrado/canvas-engine';
import { boxBlueprint } from '../../blueprints/boxBlueprint';
import { boxWithGap } from '../../blueprints/gridBlueprint';
import { AI, Box, name, State } from '../../type';

export const create = ({
  state,
  component,
}: {
  state: State;
  component: Box;
}) => {
  const sceneRef = state.babylonjs.sceneRef;
  if (!sceneRef) {
    return state;
  }

  const { gridPosition } = component;
  const ai = getComponent<AI, State>({
    state,
    name: name.ai,
    entity: component.player || '',
  });

  state = setComponent<Transform, State>({
    state,
    data: {
      name: componentName.transform,
      entity: component.entity,
      rotation: [0, 0, 0],
      fromParentRotation: [0, 0, 0],
      scale: [1, 1, 1],
      fromParentScale: [0, 0],
      position: [gridPosition[0] * boxWithGap, gridPosition[1] * boxWithGap],
      fromParentPosition: [0, 0],
    },
  });

  boxBlueprint({
    scene: sceneRef,
    name: `${gridPosition[0]}-${gridPosition[1]}`,
    position: [gridPosition[0] * boxWithGap, gridPosition[1] * boxWithGap],
    uniqueId: parseFloat(component.entity),
    // texture: ai?.textureSet[component.dots] || empty,
    color: ai?.color || [0, 0, 0],
    ai,
    dots: component.dots,
    state,
    isClickable: true,
  });

  return state;
};
