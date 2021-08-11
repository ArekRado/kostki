import 'babylonjs-gui';
import { Scene } from 'babylonjs';
import logoUrl from '../../assets/logo.png';
import { getAspectRatio } from '../../utils/getAspectRatio';
import { gameEntity, GameEvent } from '../../systems/gameSystem';
import { emitEvent } from '../../ecs/emitEvent';
import { State } from '../../ecs/type';
import { removeState } from '../../utils/localDb';
import { button } from './button';
import { Breakpoints, responsive } from './responsive';

type CustomLevelSettingsUIBlueprint = (params: {
  scene: Scene;
  state: State;
  advancedTexture: BABYLON.GUI.AdvancedDynamicTexture;
  grid: BABYLON.GUI.Grid;
}) => State;
export const customLevelSettingsUIBlueprint: CustomLevelSettingsUIBlueprint = ({
  state,
  scene,
  advancedTexture,
  grid,
}) => {
  // const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI(
  //   'customLevelSettings',
  //   false,
  //   scene as any as BABYLON.Scene
  // );

  const sizes: Breakpoints = [0.9, 0.6, 0.3];

  // playersButton
  const playersButton = button(
    BABYLON.GUI.Button.CreateSimpleButton('playersButton', 'Players')
  );
  playersButton.onPointerUpObservable.add(function () {
    emitEvent<GameEvent.StartCustomLevelEvent>({
      type: GameEvent.Type.startCustomLevel,
      entity: gameEntity,
      payload: {},
    });
    advancedTexture.dispose();
  });
  advancedTexture.addControl(playersButton);
  responsive({
    element: playersButton,
    scene,
    sizes,
    callback: (size) => {
      playersButton.width = size;
    },
  });

  // difficultyBtn
  const difficultyBtn = button(
    BABYLON.GUI.Button.CreateSimpleButton('difficultyBtn', 'Difficulty')
  );
  difficultyBtn.onPointerUpObservable.add(function () {
    removeState();
    emitEvent<GameEvent.StartCustomLevelEvent>({
      type: GameEvent.Type.startCustomLevel,
      entity: gameEntity,
      payload: {},
    });
    advancedTexture.dispose();
  });
  advancedTexture.addControl(difficultyBtn);
  responsive({
    element: difficultyBtn,
    scene,
    sizes,
    callback: (size) => {
      difficultyBtn.width = size;
    },
  });

  // levelSelectBtn
  const levelSelectBtn = button(
    BABYLON.GUI.Button.CreateSimpleButton('levelSelectBtn', 'Select level')
  );
  levelSelectBtn.onPointerUpObservable.add(function () {
    emitEvent<GameEvent.StartCustomLevelEvent>({
      type: GameEvent.Type.startCustomLevel,
      entity: gameEntity,
      payload: {},
    });
    advancedTexture.dispose();
  });
  advancedTexture.addControl(levelSelectBtn);
  responsive({
    element: levelSelectBtn,
    scene,
    sizes,
    callback: (size) => {
      levelSelectBtn.width = size;
    },
  });

  // quickStartBtn
  const quickStartBtn = button(
    BABYLON.GUI.Button.CreateSimpleButton('quickStartBtn', 'Quick Start')
  );
  quickStartBtn.onPointerUpObservable.add(function () {
    emitEvent<GameEvent.StartCustomLevelEvent>({
      type: GameEvent.Type.startCustomLevel,
      entity: gameEntity,
      payload: {},
    });
    advancedTexture.dispose();
  });
  advancedTexture.addControl(quickStartBtn);
  responsive({
    element: quickStartBtn,
    scene,
    sizes,
    callback: (size) => {
      quickStartBtn.width = size;
    },
  });

  // colorBlindModeBtn
  const colorBlindModeBtn = button(
    BABYLON.GUI.Button.CreateSimpleButton(
      'colorBlindModeBtn',
      'Color blind mode'
    )
  );
  colorBlindModeBtn.onPointerUpObservable.add(function () {
    emitEvent<GameEvent.StartCustomLevelEvent>({
      type: GameEvent.Type.startCustomLevel,
      entity: gameEntity,
      payload: {},
    });
    advancedTexture.dispose();
  });
  advancedTexture.addControl(colorBlindModeBtn);
  responsive({
    element: colorBlindModeBtn,
    scene,
    sizes,
    callback: (size) => {
      colorBlindModeBtn.width = size;
    },
  });

  // mapTypeBtn
  const mapTypeBtn = button(
    BABYLON.GUI.Button.CreateSimpleButton('mapTypeBtn', 'Map type')
  );
  mapTypeBtn.onPointerUpObservable.add(function () {
    emitEvent<GameEvent.StartCustomLevelEvent>({
      type: GameEvent.Type.startCustomLevel,
      entity: gameEntity,
      payload: {},
    });
    advancedTexture.dispose();
  });
  advancedTexture.addControl(mapTypeBtn);
  responsive({
    element: mapTypeBtn,
    scene,
    sizes,
    callback: (size) => {
      mapTypeBtn.width = size;
    },
  });

  // startBtn
  const startBtn = button(
    BABYLON.GUI.Button.CreateSimpleButton('startBtn', 'Start')
  );
  startBtn.onPointerUpObservable.add(function () {
    emitEvent<GameEvent.StartCustomLevelEvent>({
      type: GameEvent.Type.startCustomLevel,
      entity: gameEntity,
      payload: {},
    });
    advancedTexture.dispose();
  });
  advancedTexture.addControl(startBtn);
  responsive({
    element: startBtn,
    scene,
    sizes,
    callback: (size) => {
      startBtn.width = size;
    },
  });

  //
  //    Players: 2-8                              Start
  //    Difficulty: easy/medium/hard            Change map:
  //    Quick Start: yes/no                     Map preview
  //    Color Blind Mode: yes/no

  //
  // const grid = new BABYLON.GUI.Grid();
  // grid.background = 'black';
  // advancedTexture.addControl(grid);

  grid.addColumnDefinition(0.5);
  grid.addColumnDefinition(0.5);
  grid.addRowDefinition(0.1);
  grid.addRowDefinition(0.1);
  grid.addRowDefinition(0.1);
  grid.addRowDefinition(0.1);
  grid.addRowDefinition(0.1);
  grid.addRowDefinition(0.1);
  grid.addRowDefinition(0.1);

  grid.addControl(playersButton, 0, 0);
  grid.addControl(difficultyBtn, 1, 0);
  grid.addControl(quickStartBtn, 2, 0);
  grid.addControl(colorBlindModeBtn, 1, 0);

  grid.addControl(startBtn, 0, 1);
  grid.addControl(mapTypeBtn, 1, 1);
  // grid.addControl(mapPreview, 1, 1);

  // grid.addControl(muteBtn, 4, 0);
  // grid.addControl(authorText, 5, 0);

  // rect = new BABYLON.GUI.Rectangle();
  // rect.thickness = 0;
  // grid.addControl(rect, 1, 0);

  return state;
};
