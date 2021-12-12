import { add, Vector2D, vectorZero } from '@arekrado/vector-2d';
import { State, Transform } from '../ecs/type';
import { createGlobalSystem, systemPriority } from '../ecs/createSystem';
import { componentName, getComponent, setComponent } from '../ecs/component';

const getParentPosition = (
  state: State,
  parentTransform: Transform
): Vector2D => {
  if (parentTransform.parentId) {
    const parentParentTransform = getComponent<Transform>({
      name: componentName.transform,
      entity: parentTransform.parentId,
      state,
    });

    if (parentParentTransform) {
      return add(
        getParentPosition(state, parentParentTransform),
        parentTransform.fromParentPosition
      );
    } else {
      return vectorZero();
    }
  } else {
    return parentTransform.position;
  }
};

export const transformSystem = (state: State) =>
  createGlobalSystem<Transform>({
    state,
    name: componentName.transform,
    priority: systemPriority.transform,
    tick: (params) => {
      return Object.values(params.state.component.transform).reduce(
        (state, transform) => {
          if (transform.parentId) {
            const parentEntity = getComponent<Transform>({
              state,
              entity: transform.parentId,
              name: componentName.transform,
            });

            if (parentEntity) {
              const newPosition = add(
                transform.fromParentPosition,
                getParentPosition(state, parentEntity)
              );

              return setComponent<Transform>({
                state,
                data: {
                  ...transform,
                  position: newPosition,
                },
              });
            }
          }

          return state;
        },
        params.state
      );
    },
  });
