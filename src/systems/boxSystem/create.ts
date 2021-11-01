import { scene } from '../..';
import { boxBlueprint } from '../../blueprints/boxBlueprint';
import { boxWithGap } from '../../blueprints/gridBlueprint';
import { componentName, getComponent, setComponent } from '../../ecs/component';
import { AI, Box, Game, State } from '../../ecs/type';
import { getGame } from '../gameSystem';

export const create = ({
  state,
  component,
}: {
  state: State;
  component: Box;
}) => {
  const { gridPosition } = component;
  const ai = getComponent<AI>({
    state,
    name: componentName.ai,
    entity: component.player || '',
  });

  boxBlueprint({
    scene,
    name: `${gridPosition[0]}-${gridPosition[1]}`,
    position: [gridPosition[0] * boxWithGap, gridPosition[1] * boxWithGap],
    uniqueId: parseFloat(component.entity),
    // texture: ai?.textureSet[component.dots] || empty,
    color: ai?.color || [1, 1, 1],
    ai,
    dots: component.dots,
    state,
    isClickable: true,
  });

  const game = getGame({ state });

  if (!game) {
    return state;
  }

  state = setComponent<Game>({
    state,
    data: {
      ...game,
      grid: [...game.grid, component.entity],
    },
  });

  return state;
};
