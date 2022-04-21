import { GameEvent } from '../systems/gameSystem'
import { setMeshTexture } from '../utils/setMeshTexture'
import { AI, Color, State } from '../type'
import { getTextureSet } from '../systems/boxSystem/getTextureSet'
import { Scene } from '@babylonjs/core/scene'
import { TransformNode } from '@babylonjs/core/Meshes/transformNode'
import { Vector3 } from '@babylonjs/core/Maths/math.vector'
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial'
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder'
import { ActionManager } from '@babylonjs/core/Actions/actionManager'
import { ExecuteCodeAction } from '@babylonjs/core/Actions/directActions'
import { emitEvent } from '@arekrado/canvas-engine'

// let planeCache: Mesh | undefined;
// const createPlane = ({ name, size }: { name: string; size: number }) => {
//   if (!planeCache) {
//     planeCache = MeshBuilder.CreatePlane(name, { size, updatable: true });
//     return planeCache;
//   } else {
//     // planeCache.scaling.x = size;
//     // planeCache.scaling.y = size;

//     const clonedPlane = planeCache.clone(name);

//     return clonedPlane;
//   }
// };

export const boxBlueprint = ({
  scene,
  name,
  uniqueId,
  // position,
  color,
  state,
  ai,
  dots,
  isClickable,
  scaleFactor = 1,
}: {
  scene: Scene
  name: string
  uniqueId: number
  // position: [number, number]
  color: Color
  state: State
  ai: AI | undefined
  dots: number
  isClickable: boolean
  scaleFactor?: number
}): TransformNode => {
  const size = 1 / scaleFactor
  const boxMeshTransformNode = new TransformNode(`box ${name}`, scene)
  boxMeshTransformNode.uniqueId = uniqueId
  ;[
    [new Vector3(0, 0, -size / 2), new Vector3(0, 0, 0)], // front
    [new Vector3(-size / 2, 0, 0), new Vector3(0, Math.PI / 2, 0)], //
    [new Vector3(0, 0, size / 2), new Vector3(0, Math.PI, 0)],
    [new Vector3(size / 2, 0, 0), new Vector3(0, -Math.PI / 2, 0)], //
    [new Vector3(0, size / 2, 0), new Vector3(Math.PI / 2, 0, 0)], //
    [new Vector3(0, -size / 2, 0), new Vector3(-Math.PI / 2, 0, 0)], //
  ].forEach(([position, rotation], i) => {
    const plane = MeshBuilder.CreatePlane('plane' + i.toString(), { size })

    plane.parent = boxMeshTransformNode
    plane.material = new StandardMaterial('mat', scene)

    setMeshTexture({
      mesh: plane,
      color,
      texture: getTextureSet({ state, ai })[dots],
      scene,
    })

    plane.material.alpha = 1

    plane.position = position
    plane.rotation = rotation

    if (isClickable) {
      // Click event
      plane.actionManager = new ActionManager(scene)
      plane.actionManager.registerAction(
        new ExecuteCodeAction(ActionManager.OnPickUpTrigger, () => {
          emitEvent<GameEvent.PlayerClickEvent>({
            type: GameEvent.Type.playerClick,
            payload: { boxEntity: uniqueId.toString() },
          })
        }),
      )
    }
  })

  return boxMeshTransformNode
}
