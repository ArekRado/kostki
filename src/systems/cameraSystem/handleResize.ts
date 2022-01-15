import { EventHandler } from '@arekrado/canvas-engine';
import { CameraEvent } from '@arekrado/canvas-engine/dist/system/cameraSystem';
import { State } from '../../type';
import { setBackground } from '../backgroundSystem';
import { setLogo } from '../logoSystem';

export const handleResize: EventHandler<CameraEvent.ResizeEvent, State> = ({
  state,
}) => {
  state = setLogo({ state, data: {} });
  state = setBackground({ state, data: {} });

  return state;
};
