import { Scene } from 'babylonjs';
import 'babylonjs-gui';
import { emitEvent } from '../../ecs/emitEvent';
import { State, Scene as GameScene } from '../../ecs/type';
import { gameEntity, GameEvent } from '../../systems/gameSystem';
import { getAspectRatio } from '../../utils/getAspectRatio';
import { removeState } from '../../utils/localDb';
import { responsive } from './responsive';

type GameUIBlueprint = (params: {
  scene: Scene;
  state: State;
  advancedTexture: BABYLON.GUI.AdvancedDynamicTexture;
  grid: BABYLON.GUI.Grid;
}) => State;
export const gameUIBlueprint: GameUIBlueprint = ({
  state,
  scene,
  advancedTexture,
  grid,
}) => {
  // const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI(
  //   'mainUI',
  //   false,
  //   scene as any as BABYLON.Scene
  // );

  // const logo = new BABYLON.GUI.Image('logo', logoUrl);
  // logo.width = 0.7;
  // logo.height = (0.6 * 0.7) / ratio;
  // advancedTexture.addControl(logo);

  const xButton = BABYLON.GUI.Button.CreateSimpleButton('xButton', 'X');
  xButton.onPointerUpObservable.add(function () {
    removeState();
    emitEvent<GameEvent.CleanSceneEvent>({
      type: GameEvent.Type.cleanScene,
      entity: gameEntity,
      payload: { newScene: GameScene.mainMenu },
    });
    advancedTexture.dispose();
  });
  advancedTexture.addControl(xButton);

  xButton.color = 'white';
  xButton.cornerRadius = 20;
  xButton.background = 'green';
  xButton.fontSize = 30;
  xButton.isPointerBlocker = true;
  responsive({
    element: xButton,
    scene,
    sizes: [0.7, 0.7, 0.7],
    callback: (size) => {
      const ratio = getAspectRatio(scene);
      xButton.width = size;
      xButton.height = size / ratio;
    },
  });

  // const grid = new BABYLON.GUI.Grid();
  // grid.background = 'black';
  // advancedTexture.addControl(grid);

  grid.addColumnDefinition(0.9);
  grid.addColumnDefinition(0.1);
  grid.addRowDefinition(0.1);
  grid.addRowDefinition(0.9);

  grid.addControl(xButton, 0, 1);

  // rect = new BABYLON.GUI.Rectangle();
  // rect.thickness = 0;
  // grid.addControl(rect, 1, 0);

  return state;
};
