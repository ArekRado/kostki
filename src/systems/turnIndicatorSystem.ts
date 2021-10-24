import { createSystem } from '../ecs/createSystem';
import { componentName, createGetSetForUniqComponent } from '../ecs/component';
import { State, TurnIndicator } from '../ecs/type';
import { create } from './turnIndicatorSystem/create';
import { updateIndicatorPosition } from './turnIndicatorSystem/updateIndicatorPosition';
import { doesIndicatorCollidesWithGrid } from './turnIndicatorSystem/doesIndicatorCollidesWithGrid';
import { toggleIndicator } from './turnIndicatorSystem/toggleIndicator';
import { scene } from '..';
import { remove } from './turnIndicatorSystem/remove';

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
  const prevTurnIndicator = getTurnIndicator({ state });
  let shouldHideIndicator = false;

  if (prevTurnIndicator) {
    shouldHideIndicator = doesIndicatorCollidesWithGrid({
      state,
      component: prevTurnIndicator,
    });

    if (
      (prevTurnIndicator.isVisible === true && shouldHideIndicator === true) ||
      (prevTurnIndicator.isVisible === false && shouldHideIndicator === false)
    ) {
      state = toggleIndicator({
        state,
        component: {
          ...prevTurnIndicator,
          isVisible: !shouldHideIndicator,
        },
      });
    }

    if (!shouldHideIndicator) {
      state = updateIndicatorPosition({
        state,
        component: { ...prevTurnIndicator, ...data },
        scene,
      });
    }
  }

  return turnIndicatorGetSet.setComponent({
    state,
    data: { ...data, isVisible: !shouldHideIndicator },
  });
};

export const turnIndicatorSystem = (state: State) =>
  createSystem<TurnIndicator, {}>({
    state,
    name: componentName.turnIndicator,
    create,
    remove,
  });
