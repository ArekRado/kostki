import {
  ActionManager,
  Color3,
  Color4,
  ExecuteCodeAction,
  Mesh,
  StandardMaterial,
  TransformNode,
  Vector3,
  Texture,
} from 'babylonjs';
import { Scene } from 'babylonjs/scene';
import { emitEvent } from '../ecs/emitEvent';
import { State } from '../ecs/type';

import empty from '../assets/0.png';
import { BoxEvent } from '../systems/boxSystem';
// import dot1 from '../assets/1.png';
// import dot2 from '../assets/2.png';
// import dot3 from '../assets/3.png';
// import dot4 from '../assets/4.png';
// import dot5 from '../assets/5.png';
// import dot6 from '../assets/6.png';

export const boxBlueprint = ({
  scene,
  state,
}: {
  scene: Scene;
  state: State;
}): TransformNode => {
  const size = 1;
  const box = new TransformNode('box', scene);

  [
    [new Vector3(-size / 2, 0, 0), new Vector3(0, Math.PI / 2, 0)], //
    [new Vector3(0, 0, size / 2), new Vector3(0, Math.PI, 0)],
    [new Vector3(size / 2, 0, 0), new Vector3(0, -Math.PI / 2, 0)], //
    [new Vector3(0, size / 2, 0), new Vector3(Math.PI / 2, 0, 0)], //
    [new Vector3(0, -size / 2, 0), new Vector3(-Math.PI / 2, 0, 0)], //
    [new Vector3(0, 0, -size / 2), new Vector3(0, 0, 0)],
  ].forEach(([position, rotation], i) => {
    const plane = Mesh.CreatePlane('plane' + i, size, scene, true);
    plane.parent = box;

    plane.material = new StandardMaterial('mat', scene);
    (plane.material as StandardMaterial).diffuseColor = Color3.White();
    (plane.material as StandardMaterial).diffuseTexture = new Texture(
      empty,
      scene
    );
    plane.material.alpha = 1;

    plane.position = position;
    plane.rotation = rotation;

    plane.setParent(box);

    // Click event
    plane.actionManager = new ActionManager(scene);
    plane.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnPickUpTrigger, () => {
        emitEvent<BoxEvent.OnClickEvent>({
          entity: box.uniqueId.toString(),
          type: BoxEvent.Type.onClick,
          payload: {
            ai: undefined
          //   planeId: plane.uniqueId,
          },
        });
      })
    );

    // setInterval(() => {
    //   emitEvent({
    //     entity: box.uniqueId.toString(),
    //     type: boxEvents.onClick,
    //     payload: {
    //       planeId: plane.uniqueId,
    //     },
    //   });
    // }, Math.random() * 20000)
  });

  return box;
};
