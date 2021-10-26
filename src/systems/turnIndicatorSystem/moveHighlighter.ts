import { scene } from '../..';
import { State } from '../../ecs/type';
import { getAspectRatio } from '../../utils/getAspectRatio';
import { getGame } from '../gameSystem';
import { getTurnIndicator } from '../turnIndicatorSystem';
import { indicatorWidth } from './doesIndicatorCollidesWithGrid';
import { getIndicatorSizes } from './getIndicatorSizes';

export const moveHighlighter = ({ state }: { state: State }): State => {
  const component = getTurnIndicator({ state });
  const game = getGame({ state });
  const { leftEdge, topEdge, boxSize } = getIndicatorSizes({ state });
  const aspect = getAspectRatio(scene);

  const highlighter = scene.getMeshByUniqueId(
    parseFloat(component?.highlighter || '')
  );

  if (highlighter && game) {
    const index =
      game.playersQueue.findIndex((ai) => ai === game.currentPlayer) + 1;

    const halfIndicatorWidth = indicatorWidth / 2;

    highlighter.position.x = leftEdge + halfIndicatorWidth;
    highlighter.position.y = topEdge - index * boxSize;

    highlighter.scaling.x = aspect < 1 ? indicatorWidth : indicatorWidth * 2.5;
    highlighter.scaling.y = boxSize;
  }

  return state;
};
