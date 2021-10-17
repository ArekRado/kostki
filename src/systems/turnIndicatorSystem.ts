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
export const setTurnIndicator = turnIndicatorGetSet.setComponent;

export const turnIndicatorSystem = (state: State) =>
  createSystem<TurnIndicator, {}>({
    state,
    name: componentName.turnIndicator,
    create,
    update: ({ state, component }) => {
      state = updateIndicatorPosition({ state, component });
      return state;
    },
  });
