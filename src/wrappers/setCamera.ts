import { Camera } from '@arekrado/canvas-engine';
import {
  getCamera,
  setCamera as setCanvasEngineCamera,
} from '@arekrado/canvas-engine/system/camera';
import { setBackground } from '../systems/backgroundSystem';
import { setLogo } from '../systems/logoSystem';
import { State } from '../type';

export const setCamera = ({
  state,
  data,
}: {
  state: State;
  data: Partial<Camera>;
}) => {
  const camera = getCamera({ state });

  state = setCanvasEngineCamera({
    state,
    data: { ...camera, ...data },
  }) as State;
  state = setLogo({ state, data: {} });
  state = setBackground({ state, data: {} });

  return state;
};
