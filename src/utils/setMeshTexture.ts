import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh';
import { Scene } from '@babylonjs/core/scene';
import { Color } from '../type';
import { getTextureFromCache } from './textureCache';

type SetMeshTexture = (params: {
  mesh: AbstractMesh;
  texture: string;
  scene: Scene;
  color?: Color;
}) => Texture;
export const setMeshTexture: SetMeshTexture = ({
  mesh,
  texture,
  scene,
  color,
}) => {
  if (color) {
    (mesh.material as StandardMaterial).diffuseColor = new Color3(
      color[0],
      color[1],
      color[2]
    );
  }

  const newTexture = getTextureFromCache({ textureUrl: texture, scene });

  (mesh.material as StandardMaterial).diffuseTexture = newTexture;

  return newTexture;
};
