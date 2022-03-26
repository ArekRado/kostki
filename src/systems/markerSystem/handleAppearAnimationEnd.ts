import { EventHandler, Transform } from '@arekrado/canvas-engine'
import { componentName, updateComponent } from '@arekrado/canvas-engine'
import { State } from '../../type'
import { markerEntity, MarkerEvent } from '../markerSystem'

export const handleAppearAnimationEnd: EventHandler<
  MarkerEvent.AppearAnimationEndEvent,
  State
> = ({ state }) => {
  state = updateComponent<Transform, State>({
    state,
    entity: markerEntity,
    name: componentName.transform,
    update: () => ({
      position: [9999, 9999, 1],
    }),
  })

  return state
}
