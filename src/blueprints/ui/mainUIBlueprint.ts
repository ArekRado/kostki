import 'babylonjs-gui';
import { Scene } from 'babylonjs';
import logoUrl from '../../assets/logo.png';
import { getAspectRatio } from '../../utils/getAspectRatio';
import { gameEntity, GameEvent } from '../../systems/gameSystem';
import { emitEvent } from '../../ecs/emitEvent';

const button = (btn: BABYLON.GUI.Button) => {
  btn.width = 0.3;
  btn.height = 0.6;
  btn.color = 'white';
  btn.cornerRadius = 20;
  btn.background = 'green';
  btn.fontSize = 30;
  btn.isPointerBlocker = true;

  return btn;
};

export const mainUIBlueprint = ({ scene }: { scene: Scene }) => {
  const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI(
    'mainUI',
    false,
    scene as any as BABYLON.Scene
  );

  const ratio = getAspectRatio(scene);

  const logo = new BABYLON.GUI.Image('logo', logoUrl);
  logo.width = 0.7;
  logo.height = (0.6 * 0.7) / ratio;
  advancedTexture.addControl(logo);

  const continueBtn = button(
    BABYLON.GUI.Button.CreateSimpleButton('continueBtn', 'Continue')
  );
  continueBtn.onPointerUpObservable.add(function () {
    emitEvent<GameEvent.StartLevelEvent>({
      type: GameEvent.Type.startLevel,
      entity: gameEntity,
      payload: {},
    });
    advancedTexture.dispose();
  });
  advancedTexture.addControl(continueBtn);

  const startBtn = button(
    BABYLON.GUI.Button.CreateSimpleButton('startBtn', 'Start')
  );
  startBtn.onPointerUpObservable.add(function () {
    emitEvent<GameEvent.StartLevelEvent>({
      type: GameEvent.Type.startLevel,
      entity: gameEntity,
      payload: {},
    });
    advancedTexture.dispose();
  });
  advancedTexture.addControl(startBtn);

  const levelSelectBtn = button(
    BABYLON.GUI.Button.CreateSimpleButton('levelSelectBtn', 'Select level')
  );
  levelSelectBtn.onPointerUpObservable.add(function () {
    emitEvent<GameEvent.StartLevelEvent>({
      type: GameEvent.Type.startLevel,
      entity: gameEntity,
      payload: {},
    });
    advancedTexture.dispose();
  });
  advancedTexture.addControl(levelSelectBtn);

  const muteBtn = button(
    BABYLON.GUI.Button.CreateSimpleButton('muteBtn', 'Mute')
  );
  muteBtn.onPointerUpObservable.add(function () {
    emitEvent<GameEvent.StartLevelEvent>({
      type: GameEvent.Type.startLevel,
      entity: gameEntity,
      payload: {},
    });
    advancedTexture.dispose();
  });
  advancedTexture.addControl(muteBtn);

  const authorText = new BABYLON.GUI.TextBlock();
  authorText.text = 'by Arek Rado';
  authorText.color = 'white';
  authorText.fontSize = 24;
  advancedTexture.addControl(authorText);

  const grid = new BABYLON.GUI.Grid();
  grid.background = 'black';
  advancedTexture.addControl(grid);

  // grid.width = '400px';

  //
  //    Kostki logo
  //
  //    Continue
  //    Select level
  //    Start new
  //    Mute/Unmute
  //
  //                Author

  grid.addColumnDefinition(1);
  grid.addRowDefinition(0.3);
  grid.addRowDefinition(0.1);
  grid.addRowDefinition(0.1);
  grid.addRowDefinition(0.1);
  grid.addRowDefinition(0.1);
  grid.addRowDefinition(0.1);
  grid.addRowDefinition(0.1);

  grid.addControl(logo, 0, 0);
  grid.addControl(continueBtn, 1, 0);
  grid.addControl(levelSelectBtn, 2, 0);
  grid.addControl(startBtn, 3, 0);
  grid.addControl(muteBtn, 4, 0);
  grid.addControl(authorText, 5, 0);

  // rect = new BABYLON.GUI.Rectangle();
  // rect.thickness = 0;
  // grid.addControl(rect, 1, 0);
};
