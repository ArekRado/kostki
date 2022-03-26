import {
  EventHandler,
  ECSEvent,
  AnyState,
  emitEvent,
} from '@arekrado/canvas-engine'
import { State } from '../type'

export const loadAndMountDevtools = () => {
  import('@arekrado/canvas-engine-devtools').then(({ debugSystem }) => {
    emitEvent<DevtoolsEvent.Enable>({
      type: DevtoolsEvent.Type.enable,
      payload: { debugSystem },
    })
  })
}

window.loadAndMountDevtools = loadAndMountDevtools

export namespace DevtoolsEvent {
  export enum Type {
    enable = 'DevtoolsEvent-enable',
  }

  export type All = Enable

  export type Enable = ECSEvent<
    Type.enable,
    {
      debugSystem: (state: AnyState, containerId: string) => AnyState
    }
  >
}

export const handleEnableDevtools: EventHandler<
  DevtoolsEvent.Enable,
  State
> = ({
  state,
  event: {
    payload: { debugSystem },
  },
}) => debugSystem(state, 'devtools') as State
