import { createSystem } from '../ecs/createSystem';
import { componentName, createGetSetForUniqComponent } from '../ecs/component';
import { State, TurnIndicator } from '../ecs/type';
import { create } from './turnIndicatorSystem/create';
import { updateIndicatorPosition } from './turnIndicatorSystem/updateIndicatorPosition';

export const turnIndicatorEntity = '68127445920450266';

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
  state = updateIndicatorPosition({ state, component: data });

  return turnIndicatorGetSet.setComponent({ state, data });
};

export const turnIndicatorSystem = (state: State) =>
  createSystem<TurnIndicator, {}>({
    state,
    name: componentName.turnIndicator,
    create,
  });
