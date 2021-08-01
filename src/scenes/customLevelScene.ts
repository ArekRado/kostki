import { Scene, UniversalCamera } from 'babylonjs';
import { humanPlayerEntity } from '..';
import { aiBlueprint } from '../blueprints/aiBlueprint';
import { getGridDimensions } from '../blueprints/gridBlueprint';
import { componentName, setComponent } from '../ecs/component';
import { AI, Box, Color, Entity, State } from '../ecs/type';
import { getDataGrid } from '../systems/aiSystem';
import { setCamera } from '../systems/cameraSystem';
import {
  darkBlue,
  green,
  orange,
  pink,
  purple,
  red,
  teal,
  yellow,
} from '../utils/colors';
import { generateId } from '../utils/generateId';
import {
  set1,
  set2,
  set3,
  set4,
  set5,
  set6,
  set7,
  set8,
} from '../utils/textureSets';

type CustomLevelScene = (params: {
  state: State;
  scene: Scene;
  camera: UniversalCamera;
}) => State;
export const customLevelScene: CustomLevelScene = ({
  state,
  scene,
  camera,
}) => {
  state = Array.from({ length: 8 }).reduce(
    (acc: State, _, x) =>
      Array.from({ length: 8 }).reduce(
        (acc2: State, _, y) =>
          setComponent<Box>({
            state: acc2,
            data: {
              name: componentName.box,
              entity: generateId().toString(),
              isAnimating: false,
              dots: 0,
              gridPosition: [y, x],
              player: undefined,
            },
          }),
        acc
      ),
    state
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

  // state = gridBlueprint({ dataGrid: emptyGrid, scene, camera, state });
  state = aiBlueprint({
    state,
    ai: [
      basicAI(humanPlayerEntity, teal, set1, true),
      basicAI('2', red, set2),
      basicAI('3', green, set3),
      basicAI('4', yellow, set4),
      basicAI('5', orange, set5),
      basicAI('6', pink, set6),
      // basicAI('7', darkBlue, set7),
      // basicAI('8', purple, set8),
    ],
  });

  const { center, cameraDistance } = getGridDimensions(getDataGrid({ state }));

  state = setCamera({
    state,
    data: {
      position: [center[0], center[1]],
      distance: cameraDistance,
    },
  });

  return state;
};
