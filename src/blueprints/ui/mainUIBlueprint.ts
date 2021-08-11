import 'babylonjs-gui';
import { Scene } from 'babylonjs';
import logoUrl from '../../assets/logo.png';
import { getAspectRatio } from '../../utils/getAspectRatio';
import { gameEntity, GameEvent, getGame } from '../../systems/gameSystem';
import { emitEvent } from '../../ecs/emitEvent';
import { State, UIButton, UIImage } from '../../ecs/type';
import { button } from './button';
import { Scene as GameScene } from '../../ecs/type';
import { Breakpoints, responsive } from './responsive';
import { componentName, setComponent } from '../../ecs/component';
import { generateId } from '../../utils/generateId';

type MainUIBlueprint = (params: {
  scene: Scene;
  state: State;
  advancedTexture: BABYLON.GUI.AdvancedDynamicTexture;
  grid: BABYLON.GUI.Grid;
}) => State;
export const mainUIBlueprint: MainUIBlueprint = ({
  state,
  scene,
  advancedTexture,
  grid,
}) => {
  grid.addColumnDefinition(1);
  grid.addRowDefinition(0.3);
  grid.addRowDefinition(0.1);
  grid.addRowDefinition(0.1);
  grid.addRowDefinition(0.1);
  grid.addRowDefinition(0.3);

  // const logo = new BABYLON.GUI.Image('logo', logoUrl);
  // logo.width = 0.7;
  // logo.height = 0.4;
  // advancedTexture.addControl(logo);
  // responsive({
  //   element: logo,
  //   scene,
  //   sizes: [0.7, 0.7, 0.7],
  //   callback: (size) => {
  //     logo.width = size;
  //     const ratio = getAspectRatio(scene);
  //     logo.height = (0.6 * 0.7) / ratio;
  //   },
  // });

  state = setComponent<UIImage>({
    state,
    data: {
      entity: generateId().toString(),
      name: componentName.uiImage,
      url: logoUrl,
      width: [0.7, 0.7, 0.7],
      height: [0.6, 0.6, 0.6],
      gridPosition: [0, 0],
    },
  });

  const width: Breakpoints = [0.6, 0.4, 0.2];
  const height: Breakpoints = [0.6, 0.6, 0.6];

  state = setComponent<UIButton>({
    state,
    data: {
      entity: generateId().toString(),
      name: componentName.uiButton,
      text: 'Start',
      width,
      height,
      color: 'white',
      cornerRadius: 20,
      background: 'green',
      fontSize: 30,
      isPointerBlocker: true,
      gridPosition: [1, 0],
    },
  });

  state = setComponent<UIButton>({
    state,
    data: {
      entity: generateId().toString(),
      name: componentName.uiButton,
      text: 'Select level',
      width,
      height,
      color: 'white',
      cornerRadius: 20,
      background: 'green',
      fontSize: 30,
      isPointerBlocker: true,
      gridPosition: [2, 0],
    },
  });

  state = setComponent<UIButton>({
    state,
    data: {
      entity: generateId().toString(),
      name: componentName.uiButton,
      text: 'Mute',
      width,
      height,
      color: 'white',
      cornerRadius: 20,
      background: 'green',
      fontSize: 30,
      isPointerBlocker: true,
      gridPosition: [3, 0],
    },
  });

  // authorText
  const game = getGame({ state });
  const authorText = new BABYLON.GUI.TextBlock();
  authorText.text = `version ${game?.version} by Arek Rado`;
  authorText.color = '#444';
  authorText.fontSize = 24;
  advancedTexture.addControl(authorText);

  //
  //    Kostki logo
  //
  //    Start new
  //    Select level
  //    Mute/Unmute
  //
  //                Author

  // const grid = new BABYLON.GUI.Grid();
  // grid.background = 'black';
  // advancedTexture.addControl(grid);

  // grid.addControl(logo, 0, 0);
  // grid.addControl(startBtn, 1, 0);
  // grid.addControl(levelSelectBtn, 2, 0);
  // grid.addControl(muteBtn, 3, 0);
  // grid.addControl(authorText, 4, 0);

  return state;
};
