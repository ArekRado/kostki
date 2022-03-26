import highlighterUrl from '../assets/highlighter.png'
import { Scene } from '@babylonjs/core/scene'
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder'
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial'
import { Texture } from '@babylonjs/core/Materials/Textures/texture'
import { Entity } from '@arekrado/canvas-engine'

type HighlighterBlueprint = (params: { scene: Scene; entity: Entity }) => void
export const highlighterBlueprint: HighlighterBlueprint = ({
  scene,
  entity,
}) => {
  const plane = MeshBuilder.CreatePlane('highlighter', { size: 1 })

  const mat0 = new StandardMaterial('mat0', scene)
  mat0.opacityTexture = new Texture(highlighterUrl, scene)

  plane.material = mat0

  plane.uniqueId = parseFloat(entity)
}
