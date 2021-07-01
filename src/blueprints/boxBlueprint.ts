import { ActionManager, Color3, Color4, ExecuteCodeAction, Mesh, StandardMaterial, Vector3 } from 'babylonjs';
import { Scene } from 'babylonjs/scene';
import { emitEvent } from '../ecs/emitEvent';
import { State } from '../ecs/type';
import { boxEvents } from '../systems/boxSystem';

export const boxBlueprint = ({
  scene,
  state,
}: {
  scene: Scene;
  state: State;
}): Mesh => {
  const size = 1;
  const name = 'box';
  const box = Mesh.CreateBox(name, size, scene, true);
  // box.showBoundingBox = true;
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

  [
    [new Vector3(-size / 2, 0, 0), new Vector3(0, Math.PI / 2, 0)],
    [new Vector3(0, 0, size / 2), new Vector3(0, Math.PI, 0)],
    [new Vector3(size / 2, 0, 0), new Vector3(0, -Math.PI / 2, 0)],
    [new Vector3(0, size / 2, 0), new Vector3(Math.PI / 2, 0, 0)],
    [new Vector3(0, -size / 2, 0), new Vector3(-Math.PI / 2, 0, 0)],
    [new Vector3(0, 0, -size / 2), new Vector3(0, 0, 0)],
  ].forEach(([position, rotation], i) => {
    const plane = Mesh.CreatePlane(name + i, size, scene, true);
    plane.parent = box;

    plane.enableEdgesRendering();
    plane.edgesWidth = 10.0;
    plane.edgesColor = new Color4(0, 0, 0, 1);

    plane.material = new StandardMaterial('mat', scene);
    // plane.material.diffuseColor = Color3.Random();
    plane.material.alpha = 1;

    // plane.position = rotation ;
    // plane.rotation = position;
    plane.position = position;
    plane.rotation = rotation;

    plane.setParent(box);
  });

  return box;
};
