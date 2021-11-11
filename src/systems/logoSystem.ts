import { createSystem } from '../ecs/createSystem';
import { componentName, createGetSetForUniqComponent } from '../ecs/component';
import { Logo, State } from '../ecs/type';
import { updateLogoPosition } from './logoSystem/updateLogoPosition';
import { create } from './logoSystem/create';
import { remove } from './logoSystem/remove';
import { ECSEvent } from '../ecs/createEventSystem';

export const logoEntity = '8523773494048061';

export namespace LogoEvent {
  export enum Type {
    rotateBox = 'rotateBox',
  }

  export type All = RotateBoxEvent;

  export type RotateBoxEvent = ECSEvent<Type.rotateBox, {}>;
}

const logoGetSet = createGetSetForUniqComponent<Logo>({
  entity: logoEntity,
  name: componentName.logo,
});

export const getLogo = logoGetSet.getComponent;
export const setLogo = (params: { state: State; data: Partial<Logo> }) => {
  updateLogoPosition({ state: params.state });

  return logoGetSet.setComponent(params);
};

export const logoSystem = (state: State) =>
  createSystem<Logo, LogoEvent.All>({
    state,
    name: componentName.logo,
    create,
    remove,
    // event: ({ state, event, component }) => {
    //   switch (event.type) {
    //     case LogoEvent.Type.rotateBox:
    //       return handleRotateBox({ state, event, component });
    //   }
    // },
  });
