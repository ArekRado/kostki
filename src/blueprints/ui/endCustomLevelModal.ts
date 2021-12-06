import 'babylonjs-gui';
import { componentName, setComponent } from '../../ecs/component';
import { State, Breakpoints, UIImage, UIText, UIButton } from '../../ecs/type';
import { generateId } from '../../utils/generateId';
import blankSrc from '../../assets/0.png';

const modalEntity = {
  text: generateId().toString(),
  background: generateId().toString(),
  yesButton: generateId().toString(),
  noButton: generateId().toString(),
};

// type GameUIAttachEvents = (params: {
//   advancedTexture: BABYLON.GUI.AdvancedDynamicTexture;
// }) => void;
// export const gameUIAttachEvents: GameUIAttachEvents = ({ advancedTexture }) => {
//   attachEvent({
//     advancedTexture,
//     entity: closeBtnEntity,
//     onPointerUpObservable: () => {
//       removeState();
//       emitEvent<GameEvent.CleanSceneEvent>({
//         type: GameEvent.Type.cleanScene,
//         payload: { newScene: GameScene.mainMenu },
//       });
//     },
//   });
// };

export const endCustomLevelModal = ({ state }: { state: State }): State => {
  const src: Breakpoints<string> = [blankSrc, blankSrc, blankSrc];

  state = setComponent<UIImage>({
    state,
    data: {
      src,
      entity: modalEntity.background,
      name: componentName.uiImage,
      size: [
        [0.8, 0.8],
        [0.8, 0.8],
        [0.8, 0.8],
      ],
      position: [
        [0.5, 0.5],
        [0.5, 0.5],
        [0.5, 0.5],
      ],
    },
  });

  state = setComponent<UIText>({
    state,
    data: {
      entity: modalEntity.text,
      name: componentName.uiText,
      text: 'Back to main menu?',
      size: [
        [0.35, 0.35],
        [0.35, 0.35],
        [0.35, 0.35],
      ],
      color: '#000',
      // maxSize,
      // minSize,
      fontSize: [48,48,48],
      position: [
        [0.5, 0.5],
        [0.5, 0.5],
        [0.5, 0.5],
      ],
    },
  });

  state = setComponent<UIButton>({
    state,
    data: {
      src,
      entity: modalEntity.noButton,
      name: componentName.uiButton,
      text: 'No',
      size: [
        [0.1, 0.1],
        [0.1, 0.1],
        [0.1, 0.1],
      ],
      position: [
        [0.3, 0.8],
        [0.3, 0.8],
        [0.3, 0.8],
      ],
    },
  });

  state = setComponent<UIButton>({
    state,
    data: {
      src,
      entity: modalEntity.yesButton,
      name: componentName.uiButton,
      text: 'Yes',
      size: [
        [0.1, 0.1],
        [0.1, 0.1],
        [0.1, 0.1],
      ],
      position: [
        [0.7, 0.8],
        [0.7, 0.8],
        [0.7, 0.8],
      ],
    },
  });

  return state;
};
