import {
  Color3,
  MeshBuilder,
  Scene,
  StandardMaterial,
  Texture,
} from 'babylonjs';
import { Entity } from '../ecs/type';
import highlighterUrl from '../assets/highlighter.png';

type HighlighterBlueprint = (params: { scene: Scene; entity: Entity }) => void;
export const highlighterBlueprint: HighlighterBlueprint = ({
  scene,
  entity,
}) => {
  const plane = MeshBuilder.CreatePlane('highlighter', { size: 1 });

  const mat0 = new StandardMaterial('mat0', scene);
  mat0.opacityTexture = new Texture(highlighterUrl, scene);

  plane.material = mat0;

  plane.uniqueId = parseFloat(entity);
};
