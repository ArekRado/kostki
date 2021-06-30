import {
  Scene,
  MeshBuilder,
  Mesh,
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

type CreateGrid = (params: {
  x: number;
  y: number;
  scene: Scene;
  camera: UniversalCamera;
  state: State;
}) => State;

export const createGrid: CreateGrid = ({ x, y, scene, camera, state }) => {
  const gap = 1.4;
  const grid = new TransformNode('grid');

  const center = [((x - 1) * gap) / 2, ((y - 1) * gap) / 2];

  camera.position.x = center[0];
  camera.position.y = center[1];
  camera.position.z = -x * 3;
  camera.setTarget(new Vector3(center[0], center[1]));
  // camera.setPosition(new Vector3(x, y));

  // const grid = MeshBuilder.CreateBox('grid', {}, scene);

  state = Array.from<number>({ length: x * y }).reduce((acc, _, i) => {
    // scene.getMeshById;
    const box = MeshBuilder.CreateBox('box', {}, scene);

    const xx = Math.floor(i / x);
    const yy = i % y;

    box.position.x = xx * gap;
    box.position.y = yy * gap;

    box.setParent(grid);
    box.isPickable = true;

    // Click event
    box.actionManager = new ActionManager(scene);
    box.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnPickUpTrigger, () => {
        emitEvent({
          entity: box.uniqueId.toString(),
          type: boxEvents.onClick,
          payload: {},
        });
      })
    );

    return setComponent<Box>(componentName.box, {
      state: acc,
      data: {
        name: componentName.box,
        entity: box.uniqueId.toString(),
        clicked: false,
      },
    });
  }, state);

  return state;
};
