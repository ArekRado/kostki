import { createSystem } from '../ecs/createSystem';
import {
  componentName,
  createGetSetForUniqComponent,
  removeComponentsByName,
} from '../ecs/component';
import { Scene, State, UI } from '../ecs/type';
import { scene } from '..';
import { uiResize } from './uiSystem/uiResize';
import { removeAllControls } from './uiSystem/removeAllControls';
import { setBabylonUi } from './uiSystem/setBabylonUi';
import { create } from './uiSystem/create';
import { advancedTexture } from './uiSystem/advancedTexture';
import { ECSEvent } from '../ecs/emitEvent';

export const uiEntity = '23505760496063488';
export const uiRoot = 'root';

export namespace UIEvent {
  export enum Type {
    changeUrl,
  }

  export type All = ChangeUrlEvent;

  export type ChangeUrlEvent = ECSEvent<
    Type.changeUrl,
    {
      uiType: Scene;
    }
  >;
}

const uiGetSet = createGetSetForUniqComponent<UI>({
  entity: uiEntity,
  name: componentName.ui,
});

export const getUi = uiGetSet.getComponent;
export const setUi = ({
  state,
  data,
  cleanControls,
}: {
  state: State;
  data: Partial<UI>;
  cleanControls: boolean;
}) => {
  if (advancedTexture) {
    const uiType = data?.type || getUi({ state })?.type || Scene.mainMenu;
    if (cleanControls) {
      state = removeAllControls({ advancedTexture, state });
      state = removeComponentsByName({ name: componentName.logo, state });
      // state = setUi({ state, data: { cleanControls: false } });
      state = setBabylonUi({
        state,
        advancedTexture,
        attachEvents: true,
        uiType,
      });
    } else {
      state = setBabylonUi({
        state,
        advancedTexture,
        attachEvents: false,
        uiType,
      });
    }
  }

  uiResize({ state, scene });

  return uiGetSet.setComponent({ state, data });
};

export const uiSystem = (state: State) =>
  createSystem<UI, UIEvent.All>({
    state,
    name: componentName.ui,
    create,
    event: ({ event, state }) => {
      switch (event.type) {
        case UIEvent.Type.changeUrl:
          return setUi({
            state,
            data: { type: event.payload.uiType },
            cleanControls: true,
          });
      }
    },
  });
