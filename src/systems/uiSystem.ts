import { createSystem } from '../ecs/createSystem';
import { componentName, createGetSetForUniqComponent } from '../ecs/component';
import { Scene, State, UI } from '../ecs/type';
import { scene } from '..';
import { gameUIBlueprint } from '../blueprints/ui/gameUIBlueprint';
import { mainUIBlueprint } from '../blueprints/ui/mainUIBlueprint';
import { customLevelSettingsUIBlueprint } from '../blueprints/ui/customLevelSettingsUIBlueprint';

export const uiEntity = '23505760496063488';
export const uiRoot = 'root';

const uiGetSet = createGetSetForUniqComponent<UI>({
  entity: uiEntity,
  name: componentName.ui,
});

export const getUi = uiGetSet.getComponent;
export const setUi = uiGetSet.setComponent;

type SetBabylonUi = (params: {
  state: State;
  ui: UI;
  advancedTexture: BABYLON.GUI.AdvancedDynamicTexture;
}) => State;
const setBabylonUi: SetBabylonUi = ({ state, ui, advancedTexture }) => {
  advancedTexture
    .getChildren()
    .find((x) => x.name === uiRoot)
    ?.clearControls();

  switch (ui.type) {
    case Scene.customLevel:
      return gameUIBlueprint({ state, scene, advancedTexture });
    case Scene.mainMenu:
      return mainUIBlueprint({ state, scene, advancedTexture });
    case Scene.customLevelSettings:
      return customLevelSettingsUIBlueprint({
        state,
        scene,
        advancedTexture,
      });
  }
};

export let advancedTexture: null | BABYLON.GUI.AdvancedDynamicTexture = null;

export const uiSystem = (state: State) =>
  createSystem<UI, {}>({
    state,
    name: componentName.ui,
    create: ({ state, component }) => {
      advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI(
        'ui',
        false,
        scene as any as BABYLON.Scene
      );
      state = setBabylonUi({ state, ui: component, advancedTexture });

      return state;
    },
    update: ({ state, component }) => {
      if (advancedTexture) {
        state = setBabylonUi({ state, ui: component, advancedTexture });
      }
      return state;
    },
  });
