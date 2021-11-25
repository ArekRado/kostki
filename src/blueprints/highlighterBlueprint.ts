import { MeshBuilder, Scene, StandardMaterial } from 'babylonjs';
import { Entity } from '../ecs/type';
import { setMeshTexture } from '../utils/setMeshTexture';
import highlighterUrl from '../assets/highlighter.png';
import { white } from '../utils/colors';

type HighlighterBlueprint = (params: { scene: Scene; entity: Entity }) => void;
export const highlighterBlueprint: HighlighterBlueprint = ({
  scene,
  entity,
}) => {
  const plane = MeshBuilder.CreatePlane('highlighter', { size: 1 });
  plane.material = new StandardMaterial('mat', scene);

  const texture = setMeshTexture({
    mesh: plane,
    color: white,
    texture: highlighterUrl,
    scene,
  });

  texture.hasAlpha = true;

  plane.uniqueId = parseFloat(entity);
};
