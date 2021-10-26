import { Texture, Scene } from 'babylonjs';
import { Dictionary } from '../ecs/type';

export const textureCache: Dictionary<Texture> = {};

export const setTextureCache = ({
  textureUrl,
  scene,
}: {
  textureUrl: string;
  scene: Scene;
}): Texture => {
  const newTexture = new Texture(
    textureUrl,
    scene,
    undefined,
    undefined,
    Texture.NEAREST_NEAREST_MIPLINEAR
  );

  textureCache[textureUrl] = newTexture;

  return newTexture;
};

export const getTextureFromCache = ({
  textureUrl,
  scene,
}: {
  textureUrl: string;
  scene: Scene;
}): Texture => {
  if (textureCache[textureUrl]) {
    return textureCache[textureUrl];
  } else {
    return setTextureCache({
      textureUrl,
      scene,
    });
  }
};