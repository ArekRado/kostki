import { Entity, getComponentsByName } from '@arekrado/canvas-engine'
import { AI, gameComponent, State } from '../../type'

export const getAiColors = (state: State | undefined) =>
  state
    ? Object.values(
        getComponentsByName<AI>({ state, name: gameComponent.ai }) ?? {},
      ).reduce((acc, ai) => {
        acc[ai.entity] = ai.color
        return acc
      }, {} as Record<Entity, AI['color'] | undefined>)
    : {}
