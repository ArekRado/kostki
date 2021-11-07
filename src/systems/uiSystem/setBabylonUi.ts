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
import { componentName, setComponent } from '../../ecs/component';
import { Logo, Scene, State, UI } from '../../ecs/type';
import { logoEntity } from '../logoSystem';

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
  const newHash = `#${uiType}`;
  const currentHash = window.location.hash;

  if (newHash !== currentHash) {
    window.history.pushState(uiType, uiType, `#${uiType}`);
  }

  switch (uiType) {
    case Scene.customLevel:
      state = gameUIBlueprint({ state });
      attachEvents && gameUIAttachEvents({ advancedTexture });
      break;
    case Scene.mainMenu:
      state = setComponent<Logo>({
        state,
        data: {
          entity: logoEntity,
          name: componentName.logo,
        },
      });
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
