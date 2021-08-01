import { Scene } from 'babylonjs';
import { mainUIBlueprint } from '../blueprints/ui/mainUIBlueprint';
import { State, Scene as GameScene } from '../ecs/type';
import { setGame } from '../systems/gameSystem';

type MainMenuScene = (params: { state: State; scene: Scene }) => State;
export const mainMenuScene: MainMenuScene = ({ state, scene }) => {
  mainUIBlueprint({ state, scene });

  return setGame({ state, data: { currentScene: GameScene.customLevel } });
};
