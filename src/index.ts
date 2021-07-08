import {
  Scene,
  Vector3,
  HemisphericLight,
  Engine,
  UniversalCamera,
  Camera,
  NullEngine,
} from 'babylonjs';
import { createGrid } from './blueprints/createGrid';
import { runOneFrame } from './ecs/runOneFrame';
import { State } from './ecs/type';
import { getGameInitialState } from './utils/getGameInitialState';
import { setCameraDistance } from './utils/setCameraDistance';

const canvas = document.getElementById('game') as HTMLCanvasElement;

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
scene.debugLayer.show();
engine.runRenderLoop(() => {
  if (scene && scene.activeCamera) {
    scene.render();
  }
});

// Resize
window.addEventListener('resize', () => {
  engine.resize();
});

// Camera
export const camera = new UniversalCamera(
  'UniversalCamera',
  new Vector3(0, 0, -1),
  scene
);
camera.mode = Camera.ORTHOGRAPHIC_CAMERA;
const distance = 20;
setCameraDistance(distance, scene);
// camera.attachControl(canvas, true);

// Light
const light = new HemisphericLight('light', new Vector3(1, 1, -1), scene);
light.intensity = 1;

// Because mutations breaks everytging
if (process.env.NODE_ENV !== 'test') {
  let state: State = getGameInitialState();
  // Blueprints
  state = createGrid({ dataGrid: [[]], scene, camera, state });

  scene.registerBeforeRender(() => {
    state = runOneFrame({ state });
  });
}
