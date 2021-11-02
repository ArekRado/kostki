import {
  Scene,
  Vector3,
  HemisphericLight,
  Engine,
  UniversalCamera,
  Camera,
  NullEngine,
} from 'babylonjs';
import { runOneFrame } from './ecs/runOneFrame';
import { State } from './ecs/type';
import { getGameInitialState } from './utils/getGameInitialState';
import { register } from './serviceWorkerRegistration';
import { gameEntity, GameEvent } from './systems/gameSystem';
import { emitEvent } from './ecs/emitEvent';
import { cameraEntity, CameraEvent } from './systems/cameraSystem';

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
  if ('serviceWorker' in navigator) {
    // Use the window load event to keep the page load performant
    register({
      onUpdate: () => {},
      onSuccess: () => {},
    });

    navigator.serviceWorker.addEventListener('message', async (event) => {
      // Optional: ensure the message came from workbox-broadcast-update
      if (event.data.meta === 'workbox-broadcast-update') {
        const { cacheName, updatedURL } = event.data.payload;

        // Do something with cacheName and updatedURL.
        // For example, get the cached content and update
        // the content on the page.
        const cache = await caches.open(cacheName);
        const updatedResponse = await cache.match(updatedURL);
        const updatedText = await updatedResponse?.text();

        emitEvent<GameEvent.ShowNewVersionEvent>({
          type: GameEvent.Type.showNewVersion,
          entity: gameEntity,
          payload: {},
        });
      }
    });
  }

  let state: State = getGameInitialState();

  const beforeRenderCallback = () => {
    state = runOneFrame({ state });
  };

  scene.registerBeforeRender(beforeRenderCallback);

  // Resize
  window.addEventListener('resize', () => {
    emitEvent<CameraEvent.ResizeEvent>({
      type: CameraEvent.Type.resize,
      entity: cameraEntity,
      payload: {},
    });

    engine.resize();
  });

  // todo
  // window.addEventListener('contextmenu', (e) => e.preventDefault(), false);
  // done- better gradient colors - rgb to hsv
  // done- hide highligter on resize and create
  // done- new logo
  // - new ui
  // - question modal when user clicks on X button
  // nope- responsive images
  // done- buttons with images
  // done- butons/controls with aspect ratio size
  // - custom leve settings - add different maps
  // - campaign 
  // - "new app versiomn" - button reloads page but it doesn't refresh cache
  // - update dependencies
  // - move ecs to new project package
  // - better eslint
  // - end - optimization
}