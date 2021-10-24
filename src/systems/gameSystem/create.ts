import { scene } from '../..';
import { Game, State } from '../../ecs/type';
import { setTextureCache } from '../../utils/textureCache';
import { set1 } from '../../utils/textureSets';

const preloadDefaultBoxTextures = () => {
  setTimeout(() => {
    set1.forEach((src) => {
      const image = new Image();
      image.src = src;

      image.onload = () => {
        setTextureCache({ textureUrl: src, scene });
      };
    });
  }, Math.random() * 2000 + 1000);
};

export const create = ({ state }: { component: Game; state: State }): State => {
  preloadDefaultBoxTextures();

  return state;
};
