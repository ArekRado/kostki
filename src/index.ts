import {
  Scene,
  Vector3,
  HemisphericLight,
  Engine,
  UniversalCamera,
  Camera,
  NullEngine,
} from 'babylonjs';
import { getGridDimensions } from './blueprints/gridBlueprint';
import { runOneFrame } from './ecs/runOneFrame';
import { State, Scene as GameScene } from './ecs/type';
import { getGame } from './systems/gameSystem';
import { getGameInitialState } from './utils/getGameInitialState';
import { getDataGrid } from './systems/aiSystem';
import { setCameraDistance } from './utils/setCameraDistance';
import { mainMenuScene } from './scenes/mainMenuScene';
import { customLevelScene } from './scenes/customLevelScene';

const canvas = document.getElementById('game') as HTMLCanvasElement;
export const humanPlayerEntity = 'humanPlayer';

// Engine
const engine =
  process.env.NODE_ENV !== 'test'
    ? new Engine(canvas, true, {
        preserveDrawingBuffer: true,
        stencil: true,
        disableWebGL2Support: false,
      })
    : new NullEngine({
        renderWidth: 1,
        renderHeight: 1,
        textureSize: 1,
        deterministicLockstep: true,
        lockstepMaxSteps: 1,
      });

// Scene
export const scene = new Scene(engine);
// scene.debugLayer.show();
engine.runRenderLoop(() => {
  if (scene && scene.activeCamera) {
    scene.render();
  }
});

// Camera
export const camera = new UniversalCamera(
  'UniversalCamera',
  new Vector3(0, 0, -1),
  scene
);
camera.mode = Camera.ORTHOGRAPHIC_CAMERA;

// camera.attachControl(canvas, true);

// Light
export const light = new HemisphericLight('light', new Vector3(0, 0, 1), scene);
light.intensity = 1;

light.diffuse = new BABYLON.Color3(1, 1, 1);
light.specular = new BABYLON.Color3(1, 1, 1);
light.groundColor = new BABYLON.Color3(1, 1, 1);

// Because mutations breaks everything
if (process.env.NODE_ENV !== 'test') {
  let state: State = getGameInitialState();

  const beforeRenderCallback = () => {
    state = runOneFrame({ state });
  };

  scene.registerBeforeRender(beforeRenderCallback);

  // Resize
  window.addEventListener('resize', () => {
    setCameraDistance(
      getGridDimensions(getDataGrid({ state })).cameraDistance,
      scene
    );

    engine.resize();
  });

  // todo
  // window.addEventListener('contextmenu', (e) => e.preventDefault(), false);
}
