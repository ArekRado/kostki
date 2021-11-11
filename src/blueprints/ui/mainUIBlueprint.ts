import 'babylonjs-gui';
import { GameEvent, getGame } from '../../systems/gameSystem';
import { Breakpoints, State, UIButton, UIText } from '../../ecs/type';
import { Scene as GameScene } from '../../ecs/type';
import { componentName, setComponent } from '../../ecs/component';
import { generateId } from '../../utils/generateId';
import { attachEvent } from '../../systems/uiSystem/attachEvent';

import buttonSmallSrc from '../../assets/ui/buttonSmall.png';
import buttonMediumSrc from '../../assets/ui/buttonMedium.png';
import buttonLargeSrc from '../../assets/ui/buttonLarge.png';
import { emitEvent } from '../../eventSystem';

const startBtnEntity = generateId().toString();
const selectLevelBtnEntity = generateId().toString();

const versionTextEntity = generateId().toString();
const newVersionBtnEntity = generateId().toString();

type MainUIAttachEvents = (params: {
  advancedTexture: BABYLON.GUI.AdvancedDynamicTexture;
}) => void;
export const mainUIAttachEvents: MainUIAttachEvents = ({ advancedTexture }) => {
  attachEvent({
    advancedTexture,
    entity: startBtnEntity,
    onPointerUpObservable: () => {
      emitEvent<GameEvent.CleanSceneEvent>({
        type: GameEvent.Type.cleanScene,
        payload: {
          newScene: GameScene.customLevelSettings,
        },
      });
    },
  });

  attachEvent({
    advancedTexture,
    entity: selectLevelBtnEntity,
    onPointerUpObservable: () => {
      emitEvent<GameEvent.CleanSceneEvent>({
        type: GameEvent.Type.cleanScene,
        payload: {
          newScene: GameScene.customLevelSettings,
        },
      });
    },
  });
};

type MainUIBlueprint = (params: {
  state: State;
  advancedTexture: BABYLON.GUI.AdvancedDynamicTexture;
}) => State;
export const mainUIBlueprint: MainUIBlueprint = ({
  state,
  advancedTexture,
}) => {
  const aspectRatio: Breakpoints<boolean> = [true, true, true];

  // state = setComponent<UIImage>({
  //   state,
  //   data: {
  //     entity: logoImgEntity,
  //     name: componentName.uiImage,
  //     src: [logoUrl, logoUrl, logoUrl],
  //     size: [
  //       [0.5, 0.3],
  //       [0.5, 0.3],
  //       [0.5, 0.3],
  //     ],
  //     maxSize: [
  //       [0.5, 0.3],
  //       [0.5, 0.3],
  //       [0.5, 0.3],
  //     ],
  //     position: [
  //       [0.5, 0.15],
  //       [0.5, 0.15],
  //       [0.5, 0.15],
  //     ],
  //     aspectRatio,
  //   },
  // });

  const size: Breakpoints<[number, number]> = [
    [0.6, 0.2],
    [0.4, 0.15],
    [0.2, 0.1],
  ];
  const maxSize: Breakpoints<[number, number]> = [
    [0.6, 0.2],
    [0.4, 0.15],
    [0.2, 0.1],
  ];
  const minSize: Breakpoints<[number, number]> = [
    [0.6, 0.1],
    [0.4, 0.1],
    [0.2, 0.1],
  ];

  const src: Breakpoints<string> = [
    buttonSmallSrc,
    buttonMediumSrc,
    buttonLargeSrc,
  ];

  state = setComponent<UIButton>({
    state,
    data: {
      src,
      entity: startBtnEntity,
      name: componentName.uiButton,
      text: 'Start',
      size,
      maxSize,
      minSize,
      aspectRatio,
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
      entity: selectLevelBtnEntity,
      name: componentName.uiButton,
      text: 'Custom level',
      size,
      maxSize,
      minSize,
      aspectRatio,
      position: [
        [0.5, 0.7],
        [0.5, 0.7],
        [0.5, 0.7],
      ],
    },
  });

  const game = getGame({ state });
  state = setComponent<UIText>({
    state,
    data: {
      entity: versionTextEntity,
      name: componentName.uiText,
      text: `version ${game?.version}`,
      size,
      color: '#444',
      fontSize: [24, 24, 24],
      position: [
        [0.9, 0.9],
        [0.9, 0.9],
        [0.9, 0.9],
      ],
    },
  });

  if (game?.newVersionAvailable) {
    state = setComponent<UIButton>({
      state,
      data: {
        src,
        entity: newVersionBtnEntity,
        name: componentName.uiButton,
        text: 'New version available. Click here to reload',
        size: [
          [0.2, 0.2],
          [0.2, 0.2],
          [0.2, 0.2],
        ],
        position: [
          [0.1, 0.1],
          [0.1, 0.1],
          [0.1, 0.1],
        ],
      },
    });

    attachEvent({
      advancedTexture,
      entity: newVersionBtnEntity,
      onPointerUpObservable: () => {
        emitEvent<GameEvent.ReloadEvent>({
          type: GameEvent.Type.reload,
          payload: {},
        });
      },
    });
  }

  return state;
};
