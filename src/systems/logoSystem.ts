import { Logo, State, name } from '../type';
import { updateLogoPosition } from './logoSystem/updateLogoPosition';
import { create } from './logoSystem/create';
import { remove } from './logoSystem/remove';
import {
  createGetSetForUniqComponent,
  createSystem,
} from '@arekrado/canvas-engine';
import { ECSEvent } from '@arekrado/canvas-engine';

export const logoEntity = '8523773494048061';

export namespace LogoEvent {
  export enum Type {
    rotateRandomLogoBox = 'LogoEvent-rotateRandomLogoBox',
  }

  export type All = RotateRandomLogoBoxEvent;

  export type RotateRandomLogoBoxEvent = ECSEvent<Type.rotateRandomLogoBox, {}>;
}

const logoGetSet = createGetSetForUniqComponent<Logo, State>({
  entity: logoEntity,
  name: name.logo,
});

export const getLogo = logoGetSet.getComponent;
export const setLogo = ({
  state,
  data,
}: {
  state: State;
  data: Partial<Logo>;
}) => {
  state = updateLogoPosition({ state });

  return logoGetSet.setComponent({ state, data });
};

export const logoSystem = (state: State) =>
  createSystem<Logo, State>({
    state,
    name: name.logo,
    componentName: name.logo,
    create,
    remove,
  });
