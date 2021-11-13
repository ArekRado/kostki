import { scene } from '../..';
import { Scene, State, UI } from '../../ecs/type';
import { getUi, uiEntity } from '../uiSystem';
import { advancedTexture, setAdvancedTexture } from './advancedTexture';
import { removeAllControls } from './removeAllControls';
import { setBabylonUi } from './setBabylonUi';
import { uiResize } from './uiResize';
import { UIEvent } from '../uiSystem';
import { emitEvent } from '../../eventSystem';

export const create = ({ state }: { state: State; component: UI }) => {
  setAdvancedTexture(
    BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI(
      'ui',
      true,
      scene as any as BABYLON.Scene
    )
  );

  state = removeAllControls({ advancedTexture, state });
  state = setBabylonUi({
    state,
    advancedTexture,
    attachEvents: true,
    uiType: getUi({ state })?.type || Scene.mainMenu,
  });

  uiResize({ state, scene });

  // window.addEventListener('popstate', (e) => {
  //   emitEvent<UIEvent.All>({
  //     type: UIEvent.Type.changeUrl,
  //     payload: {
  //       uiType: window.location.hash.replace('#', '') as Scene,
  //     },
  //   });
  // });

  return state;
};
