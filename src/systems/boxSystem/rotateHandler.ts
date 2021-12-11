import { Box, EventHandler } from '../../ecs/type';
import {
  BoxEvent,
} from '../boxSystem';
import { createRotationBoxAnimation } from './createRotationBoxAnimation';
import { resetBoxRotation } from './resetBoxRotation';

export const rotateHandler: EventHandler<Box, BoxEvent.Rotate> = ({
  state,
  event,
}) => {
  if (process.env.NODE_ENV !== 'test') {
    createRotationBoxAnimation({
      boxUniqueId: event.payload.boxEntity,
      animationEndCallback: () => {
        resetBoxRotation({
          boxUniqueId: event.payload.boxEntity,
          texture: event.payload.texture,
          color: event.payload.color,
        });
      },
      texture: event.payload.texture,
      color: event.payload.color,
      direction: event.payload.direction,
    });
  }

  return state;
};
