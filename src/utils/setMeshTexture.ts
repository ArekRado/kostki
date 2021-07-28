import {
  Color3,
  AbstractMesh,
  Scene,
  StandardMaterial,
  Texture,
} from 'babylonjs';
import { Color } from '../ecs/type';

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
  const newTexture = new Texture(
    texture,
    scene,
    undefined,
    undefined,
    Texture.NEAREST_NEAREST_MIPLINEAR
  );
  (mesh.material as StandardMaterial).diffuseTexture = newTexture;

  return newTexture;
};
