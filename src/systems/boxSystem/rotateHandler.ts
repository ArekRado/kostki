import { Box, EventHandler } from '../../ecs/type';
import {
  BoxEvent,
} from '../boxSystem';
import { createRotationBoxAnimation } from './createRotationBoxAnimation';
import { resetBoxRotation } from './resetBoxRotation';

export const rotateHandler: EventHandler<Box, BoxEvent.Rotate> = ({
  state,
  component,
  event,
}) => {
  if (process.env.NODE_ENV !== 'test') {
    createRotationBoxAnimation({
      boxUniqueId: component.entity,
      animationEndCallback: () => {
        resetBoxRotation({
          boxUniqueId: component.entity,
          texture: event.payload.texture,
          color: event.payload.color,
        });
      },
      texture: event.payload.texture,
      color: event.payload.color,
    });
  }

  return state;
};
