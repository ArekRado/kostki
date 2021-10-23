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
import { uiResize } from './uiSystem/uiResize';

export const uiEntity = '23505760496063488';
export const uiRoot = 'root';

const uiGetSet = createGetSetForUniqComponent<UI>({
  entity: uiEntity,
  name: componentName.ui,
});

type RemoveAllControls = (params: {
  advancedTexture: BABYLON.GUI.AdvancedDynamicTexture;
  state: State;
}) => State;
const removeAllControls: RemoveAllControls = ({ state, advancedTexture }) => {
  advancedTexture
    .getChildren()
    .find((x) => x.name === uiRoot)
    ?.clearControls();

  state = removeComponentsByName({ state, name: componentName.uiImage });
  state = removeComponentsByName({ state, name: componentName.uiButton });
  state = removeComponentsByName({ state, name: componentName.uiText });

  return state;
};

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
    if (cleanControls) {
      state = removeAllControls({ advancedTexture, state });
      // state = setUi({ state, data: { cleanControls: false } });
      state = setBabylonUi({
        state,
        advancedTexture,
        attachEvents: true,
        uiType: data?.type,
      });
    } else {
      state = setBabylonUi({
        state,
        advancedTexture,
        attachEvents: false,
        uiType: data?.type,
      });
    }
  }

  uiResize({ state, scene });

  return uiGetSet.setComponent({ state, data });
};

type SetBabylonUi = (params: {
  state: State;
  advancedTexture: BABYLON.GUI.AdvancedDynamicTexture;
  attachEvents: boolean;
  uiType: UI['type'] | undefined;
}) => State;
const setBabylonUi: SetBabylonUi = ({
  state,
  advancedTexture,
  attachEvents,
  uiType,
}) => {
  switch (uiType) {
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

      state = removeAllControls({ advancedTexture, state });
      state = setBabylonUi({
        state,
        advancedTexture,
        attachEvents: true,
        uiType: getUi({ state })?.type,
      });

      uiResize({ state, scene });

      return state;
    },
  });
