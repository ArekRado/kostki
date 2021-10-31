import 'babylonjs-gui';
import logoUrl from '../../assets/logo.png';
import { gameEntity, GameEvent, getGame } from '../../systems/gameSystem';
import { emitEvent } from '../../ecs/emitEvent';
import { Breakpoints, State, UIButton, UIImage, UIText } from '../../ecs/type';
import { Scene as GameScene } from '../../ecs/type';
import { componentName, setComponent } from '../../ecs/component';
import { generateId } from '../../utils/generateId';
import { attachEvent } from '../../systems/uiSystem/attachEvent';
import blankSrc from '../../assets/0.png';

const logoImgEntity = generateId().toString();

const startBtnEntity = generateId().toString();
const selectLevelBtnEntity = generateId().toString();
const muteBtnEntity = generateId().toString();

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
        entity: gameEntity,
        payload: { newScene: GameScene.customLevelSettings },
      });
    },
  });

  attachEvent({
    advancedTexture,
    entity: selectLevelBtnEntity,
    onPointerUpObservable: () => {
      emitEvent<GameEvent.CleanSceneEvent>({
        type: GameEvent.Type.cleanScene,
        entity: gameEntity,
        payload: { newScene: GameScene.customLevelSettings },
      });
    },
  });

  attachEvent({
    advancedTexture,
    entity: muteBtnEntity,
    onPointerUpObservable: () => {
      emitEvent<GameEvent.CleanSceneEvent>({
        type: GameEvent.Type.cleanScene,
        entity: gameEntity,
        payload: { newScene: GameScene.customLevelSettings },
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

  state = setComponent<UIImage>({
    state,
    data: {
      entity: logoImgEntity,
      name: componentName.uiImage,
      src: [logoUrl, logoUrl, logoUrl],
      size: [
        [0.5, 0.3],
        [0.5, 0.3],
        [0.5, 0.3],
      ],
      maxSize: [
        [0.5, 0.3],
        [0.5, 0.3],
        [0.5, 0.3],
      ],
      position: [
        [0.5, 0.15],
        [0.5, 0.15],
        [0.5, 0.15],
      ],
      aspectRatio,
    },
  });

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

  const src: Breakpoints<string> = [blankSrc, blankSrc, blankSrc];

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
        [0.5, 0.4],
        [0.5, 0.4],
        [0.5, 0.4],
      ],
    },
  });

  state = setComponent<UIButton>({
    state,
    data: {
      src,
      entity: selectLevelBtnEntity,
      name: componentName.uiButton,
      text: 'Select level',
      size,
      maxSize,
      minSize,
      aspectRatio,
      position: [
        [0.5, 0.6],
        [0.5, 0.6],
        [0.5, 0.6],
      ],
    },
  });

  state = setComponent<UIButton>({
    state,
    data: {
      src,
      entity: muteBtnEntity,
      name: componentName.uiButton,
      text: 'Mute',
      size,
      maxSize,
      minSize,
      aspectRatio,
      position: [
        [0.5, 0.8],
        [0.5, 0.8],
        [0.5, 0.8],
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
          entity: gameEntity,
          payload: {},
        });
      },
    });
  }

  return state;
};
