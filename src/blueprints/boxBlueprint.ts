import {
  ActionManager,
  ExecuteCodeAction,
  Mesh,
  StandardMaterial,
  TransformNode,
  Vector3,
} from 'babylonjs';
import { Scene } from 'babylonjs/scene';
import { emitEvent } from '../ecs/emitEvent';

import { gameEntity, GameEvent } from '../systems/gameSystem';
import { setMeshTexture } from '../utils/setMeshTexture';
import { AI, Box, Color, State } from '../ecs/type';
import { getTextureSet } from '../systems/boxSystem';

export const boxBlueprint = ({
  scene,
  name,
  uniqueId,
  position,
  color,
  texture,
  state,
  ai,
  box,
}: {
  scene: Scene;
  name: string;
  uniqueId: number;
  position: [number, number];
  color: Color;
  texture: string;
  state: State;
  ai: AI | undefined;
  box: Box;
}): TransformNode => {
  const size = 1;
  const boxMesh = new TransformNode(`box ${name}`, scene);
  boxMesh.uniqueId = uniqueId;
  boxMesh.position.x = position[0];
  boxMesh.position.y = position[1];

  [
    [new Vector3(-size / 2, 0, 0), new Vector3(0, Math.PI / 2, 0)], //
    [new Vector3(0, 0, size / 2), new Vector3(0, Math.PI, 0)],
    [new Vector3(size / 2, 0, 0), new Vector3(0, -Math.PI / 2, 0)], //
    [new Vector3(0, size / 2, 0), new Vector3(Math.PI / 2, 0, 0)], //
    [new Vector3(0, -size / 2, 0), new Vector3(-Math.PI / 2, 0, 0)], //
    [new Vector3(0, 0, -size / 2), new Vector3(0, 0, 0)],
  ].forEach(([position, rotation], i) => {
    const plane = Mesh.CreatePlane('plane' + i, size, scene, false);
    plane.parent = boxMesh;

    plane.material = new StandardMaterial('mat', scene);

    setMeshTexture({
      mesh: plane,
      color,
      texture: getTextureSet({ state, ai })[box.dots],
      scene,
    });

    plane.material.alpha = 1;

    plane.position = position;
    plane.rotation = rotation;

    plane.setParent(boxMesh);

    // Click event
    plane.actionManager = new ActionManager(scene);
    plane.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnPickUpTrigger, () => {
        emitEvent<GameEvent.PlayerClickEvent>({
          entity: gameEntity,
          type: GameEvent.Type.playerClick,
          payload: { boxEntity: uniqueId.toString() },
        });
      })
    );
  });

  return boxMesh;
};
