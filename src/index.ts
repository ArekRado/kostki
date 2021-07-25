import {
  Scene,
  Vector3,
  HemisphericLight,
  Engine,
  UniversalCamera,
  Camera,
  NullEngine,
} from 'babylonjs';
import { gridBlueprint, getGridDimensions } from './blueprints/gridBlueprint';
import { aiBlueprint } from './blueprints/aiBlueprint';
import { componentName } from './ecs/component';
import { emitEvent } from './ecs/emitEvent';
import { runOneFrame } from './ecs/runOneFrame';
import { AI, Color, Entity, State } from './ecs/type';
import { gameEntity, GameEvent } from './systems/gameSystem';
import { getGameInitialState } from './utils/getGameInitialState';

import { getDataGrid } from './systems/aiSystem';
import { setCameraDistance } from './utils/setCameraDistance';
import { markerBlueprint } from './blueprints/markerBlueprint';
import {
  darkBlue,
  green,
  orange,
  pink,
  purple,
  red,
  teal,
  yellow,
} from './utils/colors';
import {
  set1,
  set2,
  set3,
  set4,
  set5,
  set6,
  set7,
  set8,
} from './utils/textureSets';
import { backgroundBlueprint } from './blueprints/backgroundBlueprint';

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

// Because mutations breaks everytging
if (process.env.NODE_ENV !== 'test') {
  let state: State = getGameInitialState({
    game: {
      quickStart: true,
    },
  });

  backgroundBlueprint({ scene });

  const emptyGrid = Array.from({ length: 10 }).map(() =>
    Array.from({ length: 10 }).map(() => ({
      player: undefined,
      dots: 0,
    }))
  );

  const basicAI = (
    entity: Entity,
    color: Color,
    textureSet: AI['textureSet'],
    human = false
  ): AI => ({
    entity,
    name: componentName.ai,
    human,
    level: 1,
    color,
    textureSet,
    active: true,
  });

  // Blueprints
  state = gridBlueprint({ dataGrid: emptyGrid, scene, camera, state });
  state = aiBlueprint({
    state,
    ai: [
      basicAI(humanPlayerEntity, teal, set1),
      basicAI('2', red, set2),
      basicAI('3', green, set3),
      basicAI('4', yellow, set4),
      basicAI('5', orange, set5),
      basicAI('6', pink, set6),
      basicAI('7', darkBlue, set7),
      basicAI('8', purple, set8),
    ],
  });

  state = markerBlueprint({ scene, state });

  scene.registerBeforeRender(() => {
    state = runOneFrame({ state });
  });

  // Resize
  window.addEventListener('resize', () => {
    setCameraDistance(
      getGridDimensions(getDataGrid({ state })).cameraDistance,
      scene
    );

    setTimeout(() => {
      engine.resize();
    }, 1000);
  });

  emitEvent<GameEvent.StartLevelEvent>({
    type: GameEvent.Type.startLevel,
    entity: gameEntity,
    payload: {},
  });

  // todo
  // window.addEventListener('contextmenu', (e) => e.preventDefault(), false);
}
