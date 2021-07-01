import {
  Scene,
  MeshBuilder,
  Vector3,
  UniversalCamera,
  ActionManager,
  ExecuteCodeAction,
  TransformNode,
} from 'babylonjs';
import { componentName, setComponent } from '../ecs/component';
import { emitEvent } from '../ecs/emitEvent';
import { Box, State } from '../ecs/type';
import { boxEvents } from '../systems/boxSystem';
import { boxBlueprint } from './boxBlueprint';

type CreateGrid = (params: {
  x: number;
  y: number;
  scene: Scene;
  camera: UniversalCamera;
  state: State;
}) => State;

export const createGrid: CreateGrid = ({ x, y, scene, camera, state }) => {
  const gap = 1.3;
  const grid = new TransformNode('grid');

  const center = [((x - 1) * gap) / 2, ((y - 1) * gap) / 2];

  camera.position.x = center[0];
  camera.position.y = center[1];
  camera.position.z = -x * 3;
  camera.setTarget(new Vector3(center[0], center[1]));

  state = Array.from<number>({ length: x * y }).reduce((acc, _, i) => {
    // const box = MeshBuilder.CreateBox('box', {}, scene);
    const box = boxBlueprint({ scene, state });

    const xx = Math.floor(i / x);
    const yy = i % y;

    box.position.x = xx * gap;
    box.position.y = yy * gap;

    box.setParent(grid);

    return setComponent<Box>({
      state: acc,
      data: {
        name: componentName.box,
        entity: box.uniqueId.toString(),
        isAnimating: false,
      },
    });
  }, state);

  return state;
};
