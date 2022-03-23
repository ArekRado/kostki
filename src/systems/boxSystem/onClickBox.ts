import { AI, Box, name, State } from '../../type';
import { createRotationBoxAnimation } from './createRotationBoxAnimation';
import { getTextureSet } from './getTextureSet';
import { pushBoxToRotationQueue } from './pushBoxToRotationQueue';
import { updateComponent } from '@arekrado/canvas-engine';
import { getGame } from '../gameSystem';

export const getNextDots = (dots: number): number =>
  dots === 6 ? 1 : dots + 1;

type OnClickBox = (params: { state: State; ai: AI; box: Box }) => State;
export const onClickBox: OnClickBox = ({ state, ai, box }) => {
  const game = getGame({ state });
  const { entity } = box;

  let dots = box.dots;

  if (ai) {
    dots = getNextDots(box.dots);

    if (process.env.NODE_ENV !== 'test') {
      state = createRotationBoxAnimation({
        state,
        boxUniqueId: entity,
        texture: getTextureSet({ state, ai })[dots],
        color: ai.color,
        nextTurn: true,
      });
    }

    state = pushBoxToRotationQueue({ entity, state });
  }

  state = updateComponent<Box, State>({
    state,
    name: name.box,
    entity,
    update: () => ({
      isAnimating: true,
      player: ai?.entity || '',
      dots,
    }),
  });

  return state;
};
