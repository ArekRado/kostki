import { Scene, UniversalCamera } from 'babylonjs';
import { StateCondition } from 'babylonjs/Actions/condition';
import { humanPlayerEntity } from '..';
import { aiBlueprint } from '../blueprints/aiBlueprint';
import { gridBlueprint } from '../blueprints/gridBlueprint';
import { markerBlueprint } from '../blueprints/markerBlueprint';
import { componentName } from '../ecs/component';
import { AI, Color, Entity, State } from '../ecs/type';
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
export const customLevelScene: CustomLevelScene = ({ state, scene, camera }) => {
  const emptyGrid = Array.from({ length: 8 }).map(() =>
    Array.from({ length: 8 }).map(() => ({
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

  state = gridBlueprint({ dataGrid: emptyGrid, scene, camera, state });
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

  state = markerBlueprint({ scene, state });

  return state;
};
