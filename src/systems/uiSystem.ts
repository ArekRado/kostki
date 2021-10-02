import { createSystem } from '../ecs/createSystem';
import {
  componentName,
  createGetSetForUniqComponent,
  removeComponentsByName,
} from '../ecs/component';
import { Scene, State, UI } from '../ecs/type';
import { scene } from '..';
import {
  gameUIAttachEvents,
  gameUIBlueprint,
} from '../blueprints/ui/gameUIBlueprint';
import {
  mainUIAttachEvents,
  mainUIBlueprint,
} from '../blueprints/ui/mainUIBlueprint';
import {
  customLevelSettingsUIAttachEvents,
  customLevelSettingsUIBlueprint,
} from '../blueprints/ui/customLevelSettingsUIBlueprint';

export const uiEntity = '23505760496063488';
export const uiRoot = 'root';

const uiGetSet = createGetSetForUniqComponent<UI>({
  entity: uiEntity,
  name: componentName.ui,
});

export const getUi = uiGetSet.getComponent;
export const setUi = uiGetSet.setComponent;

type CleanControls = (params: {
  advancedTexture: BABYLON.GUI.AdvancedDynamicTexture;
  state: State;
}) => State;
const cleanControls: CleanControls = ({ state, advancedTexture }) => {
  advancedTexture
    .getChildren()
    .find((x) => x.name === uiRoot)
    ?.clearControls();

  state = removeComponentsByName({ state, name: componentName.uiImage });
  state = removeComponentsByName({ state, name: componentName.uiButton });
  state = removeComponentsByName({ state, name: componentName.uiText });

  return state;
};

type SetBabylonUi = (params: {
  state: State;
  advancedTexture: BABYLON.GUI.AdvancedDynamicTexture;
  attachEvents: boolean;
}) => State;
export const setBabylonUi: SetBabylonUi = ({
  state,
  advancedTexture,
  attachEvents,
}) => {
  const ui = getUi({
    state,
  });

  switch (ui?.type) {
    case Scene.customLevel:
      state = gameUIBlueprint({ state });
      attachEvents && gameUIAttachEvents({ advancedTexture });
      break;
    case Scene.mainMenu:
      state = mainUIBlueprint({ state, advancedTexture });
      attachEvents && mainUIAttachEvents({ advancedTexture });
      break;
    case Scene.customLevelSettings:
      state = customLevelSettingsUIBlueprint({
        state,
      });
      attachEvents && customLevelSettingsUIAttachEvents({ advancedTexture });
      break;
  }

  return state;
};

export let advancedTexture: null | BABYLON.GUI.AdvancedDynamicTexture = null;

export const uiSystem = (state: State) =>
  createSystem<UI, {}>({
    state,
    name: componentName.ui,
    create: ({ state, component }) => {
      advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI(
        'ui',
        true,
        scene as any as BABYLON.Scene
      );

      state = cleanControls({ advancedTexture, state });
      state = setBabylonUi({
        state,
        advancedTexture,
        attachEvents: true,
      });

      return state;
    },
    update: ({ state, component }) => {
      if (advancedTexture) {
        if (component.cleanControls) {
          state = cleanControls({ advancedTexture, state });
          state = setUi({ state, data: { cleanControls: false } });
          state = setBabylonUi({
            state,
            advancedTexture,
            attachEvents: true,
          });
        } else {
          state = setBabylonUi({
            state,
            advancedTexture,
            attachEvents: false,
          });
        }
      }
      return state;
    },
  });
