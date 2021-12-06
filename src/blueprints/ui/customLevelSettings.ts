import 'babylonjs-gui';
import { gameEntity, GameEvent, getGame } from '../../systems/gameSystem';
import {
  State,
  UIButton,
  Scene as GameScene,
  UIText,
  Breakpoints,
} from '../../ecs/type';
import { componentName, setComponent } from '../../ecs/component';
import { generateId } from '../../utils/generateId';
import { attachEvent } from '../../systems/uiSystem/attachEvent';
import { AIDifficulty } from '../../systems/aiSystem';
import blankSrc from '../../assets/0.png';
import { emitEvent } from '../../eventSystem';

const playersBtnEntity = generateId().toString();
const difficultyBtnEntity = generateId().toString();
const quickStartBtnEntity = generateId().toString();
const colorBlindModeBtnEntity = generateId().toString();
const mapTypeBtnEntity = generateId().toString();
const nextMapBtnEntity = generateId().toString();
const prevMapBtnEntity = generateId().toString();
const startBtnEntity = generateId().toString();

const mapDifficultyToText = (difficulty: AIDifficulty): string => {
  switch (difficulty) {
    case AIDifficulty.disabled:
      return 'Disabled';
    case AIDifficulty.random:
      return 'Random';

    case AIDifficulty.easy:
      return 'Easy';
    case AIDifficulty.medium:
      return 'Medium';
    case AIDifficulty.hard:
      return 'Hard';
  }
};

type customLevelSettingsUIAttachEvents = (params: {
  advancedTexture: BABYLON.GUI.AdvancedDynamicTexture;
}) => void;
export const customLevelSettingsUIAttachEvents: customLevelSettingsUIAttachEvents =
  ({ advancedTexture }) => {
  //   attachEvent({
  //     advancedTexture,
  //     entity: playersBtnEntity,
  //     onPointerUpObservable: () => {
  //       emitEvent<GameEvent.ChangePlayersEvent>({
  //         type: GameEvent.Type.changePlayers,
  //         payload: {},
  //       });
  //     },
  //   });

  //   attachEvent({
  //     advancedTexture,
  //     entity: difficultyBtnEntity,
  //     onPointerUpObservable: () => {
  //       emitEvent<GameEvent.ChangeDifficultyEvent>({
  //         type: GameEvent.Type.changeDifficulty,
  //         payload: {},
  //       });
  //     },
  //   });

  //   attachEvent({
  //     advancedTexture,
  //     entity: quickStartBtnEntity,
  //     onPointerUpObservable: () => {
  //       emitEvent<GameEvent.ChangeQuickStartEvent>({
  //         type: GameEvent.Type.changeQuickStart,
  //         payload: {},
  //       });
  //     },
  //   });

  //   attachEvent({
  //     advancedTexture,
  //     entity: colorBlindModeBtnEntity,
  //     onPointerUpObservable: () => {
  //       emitEvent<GameEvent.ChangeColorBlindModeEvent>({
  //         type: GameEvent.Type.changeColorBlindMode,
  //         payload: {},
  //       });
  //     },
  //   });

  //   attachEvent({
  //     advancedTexture,
  //     entity: mapTypeBtnEntity,
  //     onPointerUpObservable: () => {
  //       emitEvent<GameEvent.ChangeMapTypeEvent>({
  //         type: GameEvent.Type.changeMapType,
  //         payload: {},
  //       });
  //     },
  //   });

  //   attachEvent({
  //     advancedTexture,
  //     entity: nextMapBtnEntity,
  //     onPointerUpObservable: () => {
  //       emitEvent<GameEvent.ChangeNextMapEvent>({
  //         type: GameEvent.Type.changeNextMap,
  //         payload: {},
  //       });
  //     },
  //   });

  //   attachEvent({
  //     advancedTexture,
  //     entity: prevMapBtnEntity,
  //     onPointerUpObservable: () => {
  //       emitEvent<GameEvent.ChangePrevMapEvent>({
  //         type: GameEvent.Type.changePrevMap,
  //         payload: {},
  //       });
  //     },
  //   });

  //   attachEvent({
  //     advancedTexture,
  //     entity: startBtnEntity,
  //     onPointerUpObservable: () => {
  //       emitEvent<GameEvent.StartCustomLevelEvent>({
  //         type: GameEvent.Type.startCustomLevel,
  //         payload: {},
  //       });
  //     },
  //   });
  };

type CustomLevelSettingsUIBlueprint = (params: { state: State }) => State;
export const customLevelSettingsUIBlueprint: CustomLevelSettingsUIBlueprint = ({
  state,
}) => {
  const game = getGame({ state });

  const size: Breakpoints<[number, number]> = [
    [0.5, 0.1],
    [0.4, 0.1],
    [0.3, 0.1],
  ];

  const src: Breakpoints<string> = [blankSrc, blankSrc, blankSrc];

  state = setComponent<UIText>({
    state,
    data: {
      entity: mapTypeBtnEntity,
      name: componentName.uiText,
      text: 'Map',
      size: [
        [0.9, 0.1],
        [0.4, 0.1],
        [0.3, 0.1],
      ],
      position: [
        [0.5, 0.05],
        [0.5, 0.05],
        [0.5, 0.05],
      ],
    },
  });

  state = setComponent<UIButton>({
    state,
    data: {
      src,
      entity: prevMapBtnEntity,
      name: componentName.uiButton,
      text: '<',
      size: [
        [0.1, 0.5],
        [0.2, 0.5],
        [0.2, 0.5],
      ],
      position: [
        [0.1, 0.25],
        [0.2, 0.25],
        [0.2, 0.25],
      ],
    },
  });

  state = setComponent<UIButton>({
    state,
    data: {
      src,
      entity: nextMapBtnEntity,
      name: componentName.uiButton,
      text: '>',
      size: [
        [0.1, 0.5],
        [0.2, 0.5],
        [0.2, 0.5],
      ],
      position: [
        [0.9, 0.25],
        [0.8, 0.25],
        [0.8, 0.25],
      ],
    },
  });

  state = setComponent<UIButton>({
    state,
    data: {
      src,
      entity: startBtnEntity,
      name: componentName.uiButton,
      text: 'Start >',
      size,
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
      entity: difficultyBtnEntity,
      name: componentName.uiButton,
      text: `Difficulty: ${
        game?.customLevelSettings.difficulty
          ? mapDifficultyToText(game?.customLevelSettings.difficulty)
          : '-'
      }`,
      size,
      position: [
        [0.25, 0.75],
        [0.25, 0.75],
        [0.25, 0.75],
      ],
    },
  });

  state = setComponent<UIButton>({
    state,
    data: {
      src,
      entity: playersBtnEntity,
      name: componentName.uiButton,
      text: `Players: ${game?.customLevelSettings.players?.length}`,
      size,
      position: [
        [0.25, 0.85],
        [0.25, 0.85],
        [0.25, 0.85],
      ],
    },
  });

  state = setComponent<UIButton>({
    state,
    data: {
      src,
      entity: quickStartBtnEntity,
      name: componentName.uiButton,
      text: `[${game?.customLevelSettings.quickStart ? 'x' : ' '}] Quick Start`,
      size,
      position: [
        [0.75, 0.75],
        [0.75, 0.75],
        [0.75, 0.75],
      ],
    },
  });

  state = setComponent<UIButton>({
    state,
    data: {
      src,
      entity: colorBlindModeBtnEntity,
      name: componentName.uiButton,
      text: `[${game?.colorBlindMode ? 'x' : ' '}] Color blind mode`,
      size,
      position: [
        [0.75, 0.85],
        [0.75, 0.85],
        [0.75, 0.85],
      ],
    },
  });

  return state;
};
