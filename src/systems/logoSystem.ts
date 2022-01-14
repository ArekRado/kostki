import { Logo, State, name } from '../type';
import { updateLogoPosition } from './logoSystem/updateLogoPosition';
import { create } from './logoSystem/create';
import { remove } from './logoSystem/remove';
import { ECSEvent } from '@arekrado/canvas-engine/dist/system/createEventSystem';
import {
  createGetSetForUniqComponent,
  createSystem,
} from '@arekrado/canvas-engine';

export const logoEntity = '8523773494048061';

export namespace LogoEvent {
  export enum Type {
    rotateBox = 'LogoEvent-rotateBox',
  }

  export type All = RotateBoxEvent;

  export type RotateBoxEvent = ECSEvent<Type.rotateBox, {}>;
}

const logoGetSet = createGetSetForUniqComponent<Logo>({
  entity: logoEntity,
  name: name.logo,
});

export const getLogo = logoGetSet.getComponent;
export const setLogo = (params: { state: State; data: Partial<Logo> }) => {
  updateLogoPosition({ state: params.state });

  return logoGetSet.setComponent(params);
};

export const logoSystem = (state: State) =>
  createSystem<Logo, State>({
    state,
    name: name.logo,
    create,
    remove,
  });
