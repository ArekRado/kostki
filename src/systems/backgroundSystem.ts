import { State, Background, name } from '../type';
import { scene } from '..';
import {
  grayGradient,
  greenGradient,
  tealGradient,
  orangeGradient,
  yellowGradient,
  redGradient,
  pinkGradient,
  purpleGradient,
  getSimilarNumber,
} from '../utils/colors';
import { playersList } from './gameSystem/handleChangeSettings';
import { create } from './backgroundSystem/create';
import { resizeBackground } from './backgroundSystem/resizeBackground';
import { ShaderMaterial } from '@babylonjs/core/Materials/shaderMaterial';
import { Vector2 } from '@babylonjs/core/Maths/math.vector';
import {
  createGetSetForUniqComponent,
  createSystem,
} from '@arekrado/canvas-engine';

export const backgroundEntity = '17818552155683748';

const backgroundGetSet = createGetSetForUniqComponent<Background>({
  entity: backgroundEntity,
  name: name.background,
});

export const getBackground = backgroundGetSet.getComponent;
export const setBackground = ({
  state,
  data,
}: {
  state: State;
  data: Partial<Background>;
}) => {
  resizeBackground(state);

  return backgroundGetSet.setComponent({ state, data });
};

export const backgroundSystem = (state: State) =>
  createSystem<Background, State>({
    state,
    name: name.background,
    create,
    tick: ({ state, component }) => {
      const background = scene.getMeshByUniqueId(parseFloat(backgroundEntity));

      if (background && background.material) {
        (background.material as ShaderMaterial).setFloat(
          'iTime',
          performance.now() / 1000 + component.gradientTime
        );

        (background.material as ShaderMaterial).setVector2(
          'iResolution',
          new Vector2(window.innerWidth, window.innerHeight)
        );

        (background.material as ShaderMaterial).setFloats(
          'iColors',
          tealGradient.flat()
        );
      }

      return state;
    },
  });
