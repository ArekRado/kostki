import {
  componentName,
  createComponent,
  getComponent,
  Transform,
} from '@arekrado/canvas-engine'
import { boxBlueprint } from '../../blueprints/boxBlueprint'
import { AI, Box, name, State } from '../../type'
import { boxWithGap } from './boxSizes'

export const create = ({
  state,
  component,
}: {
  state: State
  component: Box
}) => {
  const sceneRef = state.babylonjs.sceneRef
  if (!sceneRef) {
    return state
  }

  const { gridPosition } = component
  const ai = getComponent<AI, State>({
    state,
    name: name.ai,
    entity: component.player || '',
  })

  state = createComponent<Transform, State>({
    state,
    data: {
      name: componentName.transform,
      entity: component.entity,
      rotation: [0, 0, 0],
      fromParentRotation: [0, 0, 0],
      scale: [1, 1, 1],
      fromParentScale: [1, 1, 1],
      position: [gridPosition[0] * boxWithGap, gridPosition[1] * boxWithGap],
      fromParentPosition: [0, 0],
    },
  })

  boxBlueprint({
    scene: sceneRef,
    name: `${gridPosition[0]}-${gridPosition[1]}`,
    // position: [gridPosition[0] * boxWithGap, gridPosition[1] * boxWithGap],
    uniqueId: parseFloat(component.entity),
    // texture: ai?.textureSet[component.dots] || empty,
    color: [1, 1, 1],
    // color: ai?.color || [1, 1, 1],
    ai,
    dots: 0,
    // dots: component.dots,
    state,
    isClickable: true,
  })

  return state
}
