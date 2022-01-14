import { Dictionary } from '@arekrado/canvas-engine';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import { Scene } from '@babylonjs/core/scene';

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
