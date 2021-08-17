import {
  Color3,
  AbstractMesh,
  Scene,
  StandardMaterial,
  Texture,
} from 'babylonjs';
import { Color } from '../ecs/type';
import { getTextureFromCache } from './textureCache';

type SetMeshTexture = (params: {
  mesh: AbstractMesh;
  texture: string;
  scene: Scene;
  color: Color;
}) => Texture;
export const setMeshTexture: SetMeshTexture = ({
  mesh,
  texture,
  scene,
  color,
}) => {
  (mesh.material as StandardMaterial).diffuseColor = new Color3(
    color[0],
    color[1],
    color[2]
  );
 
  const newTexture = getTextureFromCache({ textureUrl: texture, scene });

  (mesh.material as StandardMaterial).diffuseTexture = newTexture;

  return newTexture;
};
