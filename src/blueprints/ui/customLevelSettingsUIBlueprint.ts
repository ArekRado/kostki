import 'babylonjs-gui';
import { Scene } from 'babylonjs';
import { gameEntity, GameEvent } from '../../systems/gameSystem';
import { emitEvent } from '../../ecs/emitEvent';
import { State, UIButton, Scene as GameScene } from '../../ecs/type';
import { Breakpoints } from './responsive';
import { componentName, setComponent } from '../../ecs/component';
import { generateId } from '../../utils/generateId';
import { attachEvent } from './attachEvent';

type CustomLevelSettingsUIBlueprint = (params: {
  scene: Scene;
  state: State;
  advancedTexture: BABYLON.GUI.AdvancedDynamicTexture;
}) => State;
export const customLevelSettingsUIBlueprint: CustomLevelSettingsUIBlueprint = ({
  state,
  scene,
  advancedTexture,
}) => {
  // const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI(
  //   'customLevelSettings',
  //   false,
  //   scene as any as BABYLON.Scene
  // );

  //
  //    Players: 2-8                              Start
  //    Difficulty: easy/medium/hard            Change map:
  //    Quick Start: yes/no                     Map preview
  //    Color Blind Mode: yes/no

  //
  // const grid = new BABYLON.GUI.Grid();
  // grid.background = 'black';
  // advancedTexture.addControl(grid);

  // grid.addColumnDefinition(0.5);
  // grid.addColumnDefinition(0.5);
  // grid.addRowDefinition(0.1);
  // grid.addRowDefinition(0.1);
  // grid.addRowDefinition(0.1);
  // grid.addRowDefinition(0.1);
  // grid.addRowDefinition(0.1);
  // grid.addRowDefinition(0.1);
  // grid.addRowDefinition(0.1);

  // grid.addControl(playersButton, 0, 0);
  // grid.addControl(difficultyBtn, 1, 0);
  // grid.addControl(quickStartBtn, 2, 0);
  // grid.addControl(colorBlindModeBtn, 1, 0);

  // grid.addControl(startBtn, 0, 1);
  // grid.addControl(mapTypeBtn, 1, 1);
  // grid.addControl(mapPreview, 1, 1);

  // grid.addControl(muteBtn, 4, 0);
  // grid.addControl(authorText, 5, 0);

  // rect = new BABYLON.GUI.Rectangle();
  // rect.thickness = 0;
  // grid.addControl(rect, 1, 0);

  const size: Breakpoints<[number, number]> = [
    [0.4, 0.1],
    [0.4, 0.1],
    [0.3, 0.1],
  ];

  const playersBtnEntity = generateId().toString();
  const difficultyBtnEntity = generateId().toString();
  const quickStartBtnEntity = generateId().toString();
  const colorBlindModeBtnEntity = generateId().toString();
  const mapTypeBtnEntity = generateId().toString();
  const startBtnEntity = generateId().toString();

  state = setComponent<UIButton>({
    state,
    data: {
      entity: playersBtnEntity,
      name: componentName.uiButton,
      text: 'Start',
      size,
      position: [
        [0.25, 0.1],
        [0.25, 0.1],
        [0.25, 0.1],
      ],
    },
  });

  state = setComponent<UIButton>({
    state,
    data: {
      entity: difficultyBtnEntity,
      name: componentName.uiButton,
      text: 'Difficulty',
      size,
      position: [
        [0.25, 0.3],
        [0.25, 0.3],
        [0.25, 0.3],
      ],
    },
  });

  state = setComponent<UIButton>({
    state,
    data: {
      entity: quickStartBtnEntity,
      name: componentName.uiButton,
      text: 'Quick Start',
      size,
      position: [
        [0.25, 0.5],
        [0.25, 0.5],
        [0.25, 0.5],
      ],
    },
  });

  state = setComponent<UIButton>({
    state,
    data: {
      entity: colorBlindModeBtnEntity,
      name: componentName.uiButton,
      text: 'Color blind mode',
      size,
      position: [
        [0.25, 0.7],
        [0.25, 0.7],
        [0.25, 0.7],
      ],
    },
  });

  state = setComponent<UIButton>({
    state,
    data: {
      entity: startBtnEntity,
      name: componentName.uiButton,
      text: 'Start',
      size,
      position: [
        [0.75, 0.1],
        [0.75, 0.1],
        [0.75, 0.1],
      ],
    },
  });

  state = setComponent<UIButton>({
    state,
    data: {
      entity: mapTypeBtnEntity,
      name: componentName.uiButton,
      text: 'Map type',
      size,
      position: [
        [0.75, 0.3],
        [0.75, 0.3],
        [0.75, 0.3],
      ],
    },
  });

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

  return state;
};
