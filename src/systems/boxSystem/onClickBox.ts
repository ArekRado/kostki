import { setComponent } from '../../ecs/component';
import { emitEvent } from '../../ecs/emitEvent';
import { AI, Box, State } from '../../ecs/type';
import { BoxEvent } from '../boxSystem';
import { createRotationBoxAnimation } from './createRotationBoxAnimation';
import { getTextureSet } from './getTextureSet';
import { pushBoxToRotationQueue } from './pushBoxToRotationQueue';

export const getNextDots = (dots: number): number =>
  dots === 6 ? 1 : dots + 1;

type OnClickBox = (params: { state: State; ai: AI; box: Box }) => State;
export const onClickBox: OnClickBox = ({ state, ai, box }) => {
  const { entity } = box;

  let dots = box.dots;

  if (ai) {
    dots = getNextDots(box.dots);

    const animationEndCallback = () => {
      emitEvent<BoxEvent.RotationEndEvent>({
        type: BoxEvent.Type.rotationEnd,
        entity: entity,
        payload: { ai, shouldExplode: box.dots === 6 },
      });
    };

    if (process.env.NODE_ENV !== 'test') {
      createRotationBoxAnimation({
        boxUniqueId: entity,
        animationEndCallback,
        texture: getTextureSet({ state, ai })[dots],
        color: ai.color,
      });
    } else {
      animationEndCallback();
    }

    state = pushBoxToRotationQueue({ entity, state });
  }

  return setComponent<Box>({
    state,
    data: {
      ...box,
      isAnimating: true,
      player: ai?.entity || '',
      dots,
    },
  });
};
