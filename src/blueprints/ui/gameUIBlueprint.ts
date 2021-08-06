import { Scene } from 'babylonjs';
import 'babylonjs-gui';
import { emitEvent } from '../../ecs/emitEvent';
import { State } from '../../ecs/type';
import { gameEntity, GameEvent } from '../../systems/gameSystem';
import { getAspectRatio } from '../../utils/getAspectRatio';

type GameUIBlueprint = (params: { scene: Scene; state: State }) => State;
export const gameUIBlueprint: GameUIBlueprint = ({ state, scene }) => {
  const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI(
    'mainUI',
    false,
    scene as any as BABYLON.Scene
  );

  const ratio = getAspectRatio(scene);

  // const logo = new BABYLON.GUI.Image('logo', logoUrl);
  // logo.width = 0.7;
  // logo.height = (0.6 * 0.7) / ratio;
  // advancedTexture.addControl(logo);

  const xButton = BABYLON.GUI.Button.CreateSimpleButton('xButton', 'X');
  xButton.onPointerUpObservable.add(function () {
    // emitEvent<GameEvent.StartCustomLevelEvent>({
    //   type: GameEvent.Type.startCustomLevel,
    //   entity: gameEntity,
    //   payload: {},
    // });
    advancedTexture.dispose();
  });
  advancedTexture.addControl(xButton);

  xButton.width = 0.3;
  xButton.height = 0.6;
  xButton.color = 'white';
  xButton.cornerRadius = 20;
  xButton.background = 'green';
  xButton.fontSize = 30;
  xButton.isPointerBlocker = true;

  const grid = new BABYLON.GUI.Grid();
  // grid.background = 'black';
  advancedTexture.addControl(grid);

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
