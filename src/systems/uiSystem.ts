import { createSystem } from '../ecs/createSystem';
import { componentName, createGetSetForUniqComponent } from '../ecs/component';
import { Scene, State, UI } from '../ecs/type';
import { scene } from '..';
import { gameUIBlueprint } from '../blueprints/ui/gameUIBlueprint';
import { mainUIBlueprint } from '../blueprints/ui/mainUIBlueprint';
import { customLevelSettingsUIBlueprint } from '../blueprints/ui/customLevelSettingsUIBlueprint';

export const uiEntity = '23505760496063488';

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
  grid: BABYLON.GUI.Grid;
}) => State;
const setBabylonUi: SetBabylonUi = ({ state, ui, advancedTexture, grid }) => {
  // advancedTexture.clear();
  grid.clearControls();

  switch (ui.type) {
    case Scene.customLevel:
      return gameUIBlueprint({ state, scene, advancedTexture, grid });
    case Scene.mainMenu:
      return mainUIBlueprint({ state, scene, advancedTexture, grid });
    case Scene.customLevelSettings:
      return customLevelSettingsUIBlueprint({
        state,
        scene,
        advancedTexture,
        grid,
      });
  }
};

export let advancedTexture: null | BABYLON.GUI.AdvancedDynamicTexture = null;

export const grid = new BABYLON.GUI.Grid();
grid.background = 'transparent';

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
      advancedTexture.addControl(grid);
    
      state = setBabylonUi({ state, ui: component, advancedTexture, grid });

      return state;
    },
    update: ({ state, component }) => {
      if (advancedTexture) {
        state = setBabylonUi({ state, ui: component, advancedTexture, grid });
      }
      return state;
    },
  });
