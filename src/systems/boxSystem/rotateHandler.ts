import { EventHandler } from '../../ecs/type';
import { BoxEvent } from '../boxSystem';
import { createRotationBoxAnimation } from './createRotationBoxAnimation';
import { resetBoxRotation } from './resetBoxRotation';

export const rotateHandler: EventHandler<BoxEvent.Rotate> = ({
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
