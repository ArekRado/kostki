import 'babylonjs-gui';
import { gameEntity, GameEvent } from '../../systems/gameSystem';
import { emitEvent } from '../../ecs/emitEvent';
import { State, UIButton, Scene as GameScene, UIText } from '../../ecs/type';
import { Breakpoints } from './responsive';
import { componentName, setComponent } from '../../ecs/component';
import { generateId } from '../../utils/generateId';
import { attachEvent } from './attachEvent';

const playersBtnEntity = generateId().toString();
const difficultyBtnEntity = generateId().toString();
const quickStartBtnEntity = generateId().toString();
const colorBlindModeBtnEntity = generateId().toString();
const mapTypeBtnEntity = generateId().toString();
const nextMapBtnEntity = generateId().toString();
const prevMapBtnEntity = generateId().toString();
const startBtnEntity = generateId().toString();

type customLevelSettingsUIAttachEvents = (params: {
  advancedTexture: BABYLON.GUI.AdvancedDynamicTexture;
}) => void;
export const customLevelSettingsUIAttachEvents: customLevelSettingsUIAttachEvents =
  ({ advancedTexture }) => {
    attachEvent({
      advancedTexture,
      entity: playersBtnEntity,
      onPointerUpObservable: () => {
        emitEvent<GameEvent.StartCustomLevelEvent>({
          type: GameEvent.Type.startCustomLevel,
          entity: gameEntity,
          payload: {},
        });
      },
    });

    attachEvent({
      advancedTexture,
      entity: difficultyBtnEntity,
      onPointerUpObservable: () => {
        emitEvent<GameEvent.StartCustomLevelEvent>({
          type: GameEvent.Type.startCustomLevel,
          entity: gameEntity,
          payload: {},
        });
      },
    });

    attachEvent({
      advancedTexture,
      entity: quickStartBtnEntity,
      onPointerUpObservable: () => {
        emitEvent<GameEvent.StartCustomLevelEvent>({
          type: GameEvent.Type.startCustomLevel,
          entity: gameEntity,
          payload: {},
        });
      },
    });

    attachEvent({
      advancedTexture,
      entity: colorBlindModeBtnEntity,
      onPointerUpObservable: () => {
        emitEvent<GameEvent.StartCustomLevelEvent>({
          type: GameEvent.Type.startCustomLevel,
          entity: gameEntity,
          payload: {},
        });
      },
    });

    attachEvent({
      advancedTexture,
      entity: mapTypeBtnEntity,
      onPointerUpObservable: () => {
        emitEvent<GameEvent.StartCustomLevelEvent>({
          type: GameEvent.Type.startCustomLevel,
          entity: gameEntity,
          payload: {},
        });
      },
    });

    attachEvent({
      advancedTexture,
      entity: startBtnEntity,
      onPointerUpObservable: () => {
        emitEvent<GameEvent.StartCustomLevelEvent>({
          type: GameEvent.Type.startCustomLevel,
          entity: gameEntity,
          payload: {},
        });
      },
    });
  };

type CustomLevelSettingsUIBlueprint = (params: { state: State }) => State;
export const customLevelSettingsUIBlueprint: CustomLevelSettingsUIBlueprint = ({
  state,
}) => {
  const size: Breakpoints<[number, number]> = [
    [0.9, 0.1],
    [0.4, 0.1],
    [0.3, 0.1],
  ];

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
      entity: prevMapBtnEntity,
      name: componentName.uiButton,
      text: '<',
      size: [
        [0.1, 0.5],
        [0.1, 0.5],
        [0.1, 0.5],
      ],
      position: [
        [0.1, 0.25],
        [0.1, 0.25],
        [0.1, 0.25],
      ],
    },
  });

  state = setComponent<UIButton>({
    state,
    data: {
      entity: nextMapBtnEntity,
      name: componentName.uiButton,
      text: '>',
      size: [
        [0.1, 0.5],
        [0.1, 0.5],
        [0.1, 0.5],
      ],
      position: [
        [0.9, 0.25],
        [0.9, 0.25],
        [0.9, 0.25],
      ],
    },
  });

  state = setComponent<UIButton>({
    state,
    data: {
      entity: playersBtnEntity,
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
      entity: difficultyBtnEntity,
      name: componentName.uiButton,
      text: '[x] Difficulty',
      size,
      position: [
        [0.5, 0.75],
        [0.5, 0.75],
        [0.5, 0.75],
      ],
    },
  });

  state = setComponent<UIButton>({
    state,
    data: {
      entity: quickStartBtnEntity,
      name: componentName.uiButton,
      text: '[x] Quick Start',
      size,
      position: [
        [0.5, 0.85],
        [0.5, 0.85],
        [0.5, 0.85],
      ],
    },
  });

  state = setComponent<UIButton>({
    state,
    data: {
      entity: colorBlindModeBtnEntity,
      name: componentName.uiButton,
      text: '[x] Color blind mode',
      size,
      position: [
        [0.5, 0.95],
        [0.5, 0.95],
        [0.5, 0.95],
      ],
    },
  });

  return state;
};
