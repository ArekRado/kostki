import {
  Scene,
  FreeCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  Engine,
  ArcRotateCamera,
  DebugLayer,
  TransformNode,
  Mesh,
  UniversalCamera,
  Camera,
} from 'babylonjs';
import { createGrid } from './blueprints/createGrid';
import { componentName, setComponent } from './ecs/component';
import { runOneFrame } from './ecs/runOneFrame';
import { initialState } from './ecs/state';
import { Box, State } from './ecs/type';
import { boxSystem } from './systems/boxSystem';
import { setCameraDistance } from './utils/setCameraDistance';

const canvas = document.getElementById('game') as HTMLCanvasElement;

const engine = new Engine(canvas, true, {
  preserveDrawingBuffer: true,
  stencil: true,
  disableWebGL2Support: false,
});

// This creates a basic Babylon Scene object (non-mesh)
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

export const camera = new UniversalCamera(
  'UniversalCamera',
  new Vector3(0, 0, -10),
  scene
);

camera.mode = Camera.ORTHOGRAPHIC_CAMERA;

const distance = 20;
setCameraDistance(distance, scene);

// This attaches the camera to the canvas
camera.attachControl(canvas, true);

// This creates a light, aiming 0,1,0 - to the sky (non-mesh)
const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);

// Default intensity is 1. Let's dim the light a small amount
light.intensity = 0.7;

let state: State = initialState;

state = boxSystem(state);

state = createGrid({ x: 5, y: 5, scene, camera, state });

scene.registerBeforeRender(() => {
  //Your code here

  state = runOneFrame({ state });
});

// dispatch(
//   createGrid({
//     x: 5,
//     y: 5,
//     scene,
//     camera,
//     state,
//   })
// );
