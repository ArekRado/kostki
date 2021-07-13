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
import { createPlayers } from './blueprints/createPlayers';
import { componentName } from './ecs/component';
import { emitEvent } from './ecs/emitEvent';
import { runOneFrame } from './ecs/runOneFrame';
import { AI, Entity, State } from './ecs/type';
import { gameEntity, GameEvent } from './systems/gameSystem';
import { getGameInitialState } from './utils/getGameInitialState';
import { setCameraDistance } from './utils/setCameraDistance';

import dot0 from './assets/0.png';
import dot1 from './assets/1.png';
import dot2 from './assets/2.png';
import dot3 from './assets/3.png';
import dot4 from './assets/4.png';
import dot5 from './assets/5.png';
import dot6 from './assets/6.png';

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

  const emptyGrid = Array.from({ length: 5 }).map(() =>
    Array.from({ length: 5 }).map(() => ({
      player: undefined,
      dots: 0,
    }))
  );

  const basicAI = (entity: Entity, color: AI['color']): AI => ({
    entity,
    name: componentName.ai,
    human: false,
    level: 1,
    color,
    textureSet: [dot0, dot1, dot2, dot3, dot4, dot5, dot6],
    active: true,
  });

  // Blueprints
  state = createGrid({ dataGrid: emptyGrid, scene, camera, state });
  state = createPlayers({
    state,
    ai: [
      basicAI('1', [1, 0, 0]),
      basicAI('2', [0, 1, 1]),
      // basicAI('3', [0, 0, 1]),
      // basicAI('4', [1, 0, 1]),
    ],
  });
  scene.registerBeforeRender(() => {
    state = runOneFrame({ state });
  });

  setTimeout(() => {
    emitEvent<GameEvent.StartLevelEvent>({
      type: GameEvent.Type.startLevel,
      entity: gameEntity,
      payload: {},
    });
  }, 500);
}
