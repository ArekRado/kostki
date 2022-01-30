import { AI, Box, State } from '../../type';
import { emitEvent } from '../../eventSystem';
import { BoxEvent } from '../boxSystem';
import {
  createRotationBoxAnimation,
  rotationAnimationTime,
} from './createRotationBoxAnimation';
import { getTextureSet } from './getTextureSet';
import { pushBoxToRotationQueue } from './pushBoxToRotationQueue';
import { setComponent } from '@arekrado/canvas-engine';
import { GameEvent, getGame } from '../gameSystem';
import { boxExplosion } from './boxExplosion';
import { AIEvent } from '../aiSystem';

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
      });
    }

    setTimeout(() => {
      emitEvent({
        type: AIEvent.Type.boxRotationEnd,
        payload: {
          boxEntity: box.entity,
        },
      });
    }, rotationAnimationTime + 100);

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
