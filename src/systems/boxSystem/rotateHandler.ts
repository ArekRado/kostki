import { EventHandler } from '@arekrado/canvas-engine';
import { State } from '../../type';
import { BoxEvent } from '../boxSystem';
import { createRotationBoxAnimation } from './createRotationBoxAnimation';
import { resetBoxRotation } from './resetBoxRotation';

export const rotateHandler: EventHandler<BoxEvent.Rotate, State> = ({
  state,
  event,
}) => {
  if (process.env.NODE_ENV !== 'test') {
    state = createRotationBoxAnimation({
      state,
      boxUniqueId: event.payload.boxEntity,
      animationEndCallback: () => {
        resetBoxRotation({
          boxUniqueId: event.payload.boxEntity,
          texture: event.payload.texture,
          color: event.payload.color,
        });

        // emitEvent<BoxEvent.RotationEndEvent>({
        //   type: BoxEvent.Type.rotationEnd,
        //   payload: {
        //     ai: undefined,
        //     shouldExplode: false,
        //     boxEntity: event.payload.boxEntity,
        //   },
        // });
      },
      texture: event.payload.texture,
      color: event.payload.color,
      direction: event.payload.direction,
    });
  }

  return state;
};
