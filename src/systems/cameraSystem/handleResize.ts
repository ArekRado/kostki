import { EventHandler } from '@arekrado/canvas-engine';
import { CameraEvent } from '@arekrado/canvas-engine/dist/system/camera'
import { State } from '../../type';
import { setCamera } from '../../wrappers/setCamera';

export const handleResize: EventHandler<CameraEvent.ResizeEvent, State> = ({
  state,
}) => {
  state = setCamera({ state, data: {} });

  return state;
};
