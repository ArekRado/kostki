import { Scene } from 'babylonjs';
import 'babylonjs-gui';
import { componentName, setComponent } from '../../ecs/component';
import { emitEvent } from '../../ecs/emitEvent';
import { State, Scene as GameScene, UIButton, Breakpoints } from '../../ecs/type';
import { gameEntity, GameEvent } from '../../systems/gameSystem';
import { generateId } from '../../utils/generateId';
import { removeState } from '../../utils/localDb';
import { attachEvent } from '../../systems/uiSystem/attachEvent';
import blankSrc from '../../assets/0.png';

const closeBtnEntity = generateId().toString();

type GameUIAttachEvents = (params: {
  advancedTexture: BABYLON.GUI.AdvancedDynamicTexture;
}) => void;
export const gameUIAttachEvents: GameUIAttachEvents = ({ advancedTexture }) => {
  attachEvent({
    advancedTexture,
    entity: closeBtnEntity,
    onPointerUpObservable: () => {
      removeState();
      emitEvent<GameEvent.CleanSceneEvent>({
        type: GameEvent.Type.cleanScene,
        entity: gameEntity,
        payload: { newScene: GameScene.mainMenu },
      });
    },
  });
};

type GameUIBlueprint = (params: { state: State }) => State;
export const gameUIBlueprint: GameUIBlueprint = ({ state }) => {
  
  const src: Breakpoints<string> = [blankSrc, blankSrc, blankSrc];

  state = setComponent<UIButton>({
    state,
    data: {
      src,
      entity: closeBtnEntity,
      name: componentName.uiButton,
      text: 'X',
      size: [
        [0.1, 0.1],
        [0.1, 0.1],
        [0.1, 0.1],
      ],
      position: [
        [0.95, 0.05],
        [0.95, 0.05],
        [0.95, 0.05],
      ],
    },
  });

  return state;
};
