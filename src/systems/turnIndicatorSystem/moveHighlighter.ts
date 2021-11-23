import { scene } from '../..';
import { AI, State } from '../../ecs/type';
import { getAspectRatio } from '../../utils/getAspectRatio';
import { getGame } from '../gameSystem';
import { highlighterEntity } from '../turnIndicatorSystem';
import { getCameraSizes } from '../cameraSystem/getCameraSizes';
import { indicatorWidth } from './toggleIndicator';
import { componentName, getComponent } from '../../ecs/component';

const getCurrentAiIndex = ({ state }: { state: State }): number => {
  const game = getGame({ state });

  if (!game) return -1;

  let index = 0;

  game.playersQueue.find((aiEntity) => {
    const ai = getComponent<AI>({
      state,
      entity: aiEntity,
      name: componentName.ai,
    });
    
    if (ai?.active) {
      index++;
    }

    return aiEntity === game.currentPlayer;
  });

  return index;
};

export const moveHighlighter = ({ state }: { state: State }): State => {
  const { leftEdge, topEdge, boxSize } = getCameraSizes({
    state,
    boxScaleFactor: 3,
  });
  const aspect = getAspectRatio(scene);

  const highlighter = scene.getMeshByUniqueId(parseFloat(highlighterEntity));

  if (highlighter) {
    const currentAiIndex = getCurrentAiIndex({ state });
    const halfIndicatorWidth = indicatorWidth / 2;

    highlighter.position.x = leftEdge + halfIndicatorWidth;
    highlighter.position.y = topEdge - currentAiIndex * boxSize;

    highlighter.scaling.x = aspect < 1 ? indicatorWidth : indicatorWidth * 2.5;
    highlighter.scaling.y = boxSize;
  }

  return state;
};
