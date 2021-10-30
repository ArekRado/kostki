import { createSystem } from '../ecs/createSystem';
import { componentName, createGetSetForUniqComponent } from '../ecs/component';
import { State, TurnIndicator } from '../ecs/type';
import { create } from './turnIndicatorSystem/create';
import { updateIndicatorPosition } from './turnIndicatorSystem/updateIndicatorPosition';
import { toggleIndicator } from './turnIndicatorSystem/toggleIndicator';
import { scene } from '..';
import { remove } from './turnIndicatorSystem/remove';

export const turnIndicatorEntity = '68127445920450266';
export const highlighterEntity = '6614618891614099';

const turnIndicatorGetSet = createGetSetForUniqComponent<TurnIndicator>({
  entity: turnIndicatorEntity,
  name: componentName.turnIndicator,
});

export const getTurnIndicator = turnIndicatorGetSet.getComponent;
export const setTurnIndicator = ({
  state,
  data,
}: {
  state: State;
  data: Partial<TurnIndicator>;
}) => {
  state = toggleIndicator({ state });
  state = updateIndicatorPosition({ state, scene });

  const newTurnIndicator = getTurnIndicator({ state });

  return turnIndicatorGetSet.setComponent({
    state,
    data: {
      ...data,
      ...newTurnIndicator || {},
    }
  });
};

export const turnIndicatorSystem = (state: State) =>
  createSystem<TurnIndicator, {}>({
    state,
    name: componentName.turnIndicator,
    create,
    remove,
  });
