import { AI, Box, State } from '../../type';
import { emitEvent } from '../../eventSystem';
import { BoxEvent } from '../boxSystem';
import { createRotationBoxAnimation } from './createRotationBoxAnimation';
import { getTextureSet } from './getTextureSet';
import { pushBoxToRotationQueue } from './pushBoxToRotationQueue';
import { setComponent } from '@arekrado/canvas-engine';

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
        payload: { ai, shouldExplode: box.dots === 6, boxEntity: entity },
      });
    };

    if (process.env.NODE_ENV !== 'test') {
      state = createRotationBoxAnimation({
        state,
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

  state = setComponent<Box, State>({
    state,
    data: {
      ...box,
      isAnimating: true,
      player: ai?.entity || '',
      dots,
    },
  });

  return state;
};
