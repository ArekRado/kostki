import {
  customLevelSettingsUIAttachEvents,
  customLevelSettingsUIBlueprint,
} from '../../blueprints/ui/customLevelSettingsUIBlueprint';
import {
  gameUIAttachEvents,
  gameUIBlueprint,
} from '../../blueprints/ui/gameUIBlueprint';
import {
  mainUIAttachEvents,
  mainUIBlueprint,
} from '../../blueprints/ui/mainUIBlueprint';
import { Scene, State, UI } from '../../ecs/type';

type SetBabylonUi = (params: {
  state: State;
  advancedTexture: BABYLON.GUI.AdvancedDynamicTexture;
  attachEvents: boolean;
  uiType: UI['type'];
}) => State;
export const setBabylonUi: SetBabylonUi = ({
  state,
  advancedTexture,
  attachEvents,
  uiType,
}) => {
  // const newHash = uiType;
  // const currentHash = window.location.hash.replace('#', '') as Scene;

  // if (newHash !== currentHash) {
  //   window.history.pushState(uiType, uiType, `#${uiType}`);

  //   emitEvent<UIEvent.All>({
  //     type: UIEvent.Type.changeUrl,
  //     payload: {
  //       uiType: window.location.hash.replace('#', '') as Scene,
  //     },
  //   });
  // }

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
