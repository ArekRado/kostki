import { createSystem } from '../ecs/createSystem';
import { componentName, createGetSetForUniqComponent } from '../ecs/component';
import { Scene, State, UI } from '../ecs/type';
import { scene } from '..';
import { gameUIBlueprint } from '../blueprints/ui/gameUIBlueprint';
import { mainUIBlueprint } from '../blueprints/ui/mainUIBlueprint';

export const uiEntity = '23505760496063488';

const uiGetSet = createGetSetForUniqComponent<UI>({
  entity: uiEntity,
  name: componentName.ui,
});

export const getUi = uiGetSet.getComponent;
export const setUi = uiGetSet.setComponent;

type SetBabylonUi = (params: { state: State; ui: UI }) => State;
const setBabylonUi: SetBabylonUi = ({ state, ui }) => {
  switch (ui.type) {
    case Scene.customLevel:
      return gameUIBlueprint({ state, scene });
    case Scene.mainMenu:
      return mainUIBlueprint({ state, scene });
  }
  return state;
};

export const uiSystem = (state: State) =>
  createSystem<UI, {}>({
    state,
    name: componentName.ui,
    create: ({ state, component }) => {
      state = setBabylonUi({ state, ui: component });

      return state;
    },
    update: ({ state, component }) => {
      state = setBabylonUi({ state, ui: component });

      return state;
    },
  });
