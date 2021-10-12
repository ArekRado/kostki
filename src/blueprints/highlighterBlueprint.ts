import { Color3, Mesh, Scene, StandardMaterial } from 'babylonjs';
import { Entity } from '../ecs/type';

type HighlighterBlueprint = (params: { scene: Scene; entity: Entity }) => void;
export const highlighterBlueprint: HighlighterBlueprint = ({
  scene,
  entity,
}) => {
  const plane = Mesh.CreatePlane('highlighter', 1, scene, false);
  plane.material = new StandardMaterial('mat', scene);
  (plane.material as StandardMaterial).diffuseColor = new Color3(1, 1, 1);
  plane.material.alpha = 0.5;

  plane.uniqueId = parseFloat(entity);
};
