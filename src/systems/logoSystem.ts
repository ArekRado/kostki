import { Logo, State, name } from '../type'
import { create } from './logoSystem/create'
import { remove } from './logoSystem/remove'
import { createSystem } from '@arekrado/canvas-engine'
import { ECSEvent } from '@arekrado/canvas-engine'

export const logoEntity = '8523773494048061'

export namespace LogoEvent {
  export enum Type {
    rotateRandomLogoBox = 'LogoEvent-rotateRandomLogoBox',
  }

  export type All = RotateRandomLogoBoxEvent

  export type RotateRandomLogoBoxEvent = ECSEvent<
    Type.rotateRandomLogoBox,
    null
  >
}

export const logoSystem = (state: State) =>
  createSystem<Logo, State>({
    state,
    name: name.logo,
    componentName: name.logo,
    create,
    // update: ({ state }) => {
    //   state = updateLogoPosition({ state })
    //   return state
    // },
    remove,
  })
